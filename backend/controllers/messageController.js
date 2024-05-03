const Conversation = require("../models/conversationModel.js")
const Message = require("../models/messageModel.js")

// send message
const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id; //  we set this in verifyToken function in authentication.js file


        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }


        // await conversation.save();
        // await newMessage.save();

        // this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json({
            success: true,
            newMessage,
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};
// export const readAllMessage = async (req, res) => {
//   const messages = await Message.updateMany({ read: false, senderId: req.body.id }, { $set: { read: true } })

//   return res.json(messages)

// }

// get user all conversation list
const getConversations = async (req, res, next) => {
    try {
        const senderId = req.user.id; //  we set this in verifyToken function in authentication.js file

        const conversations = await Conversation.find({
            participants: { $elemMatch: { $eq: senderId } },
        }).populate({ path: "participants", select: "firstName email profilePic" });

        if (!conversations) {
            res.status(201).json("conversation not exist");
        }


        const participants = conversations.flatMap(conversation => {
            // Filter out the participant whose ID is not equal to senderId
            return conversation.participants.filter(participant => participant._id.toString() !== senderId);
        });


        res.status(201).json({
            success: true,
            participants,
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// get user messages with other single user
const getMessages = async (req, res) => {
    const { id: userToChatId } = req.params;
    const senderId = req.user.id; //  we set this in verifyToken function in authentication.js file

    try {
        const messages = await Conversation.find({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!messages || messages.length === 0) {
            return res.status(201).json({ success: false, message: "No messages found" });
        }


        res.status(201).json({
            success: true,
            ...messages,
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get messages with files
//  const getMessagesWithFile = async (req, res, next) => {
//     const { id: userToChatId } = req.params;
//     const senderId = req.user.id;

//     try {
//         const conversation = await Conversation.findOne({
//             participants: { $all: [senderId, userToChatId] }
//         }).populate("messages");

//         if (!conversation || !conversation.messages || conversation.messages.length === 0) {
//             return res.status(200).json({
//                 success: true,
//                 data: [],
//                 message: "No conversation found."
//             });
//         }

//         // Filter messages with the "file" field
//         const messagesWithFiles = conversation.messages.filter(message =>
//             message.file !== undefined
//         );
//         if (messagesWithFiles.length === 0) {
//             return res.status(200).json({
//                 success: true,
//                 data: [],
//                 message: "No files found in the conversation."
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: messagesWithFiles
//         });
//     } catch (err) {
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

module.exports = { sendMessage, getMessages, getConversations };
