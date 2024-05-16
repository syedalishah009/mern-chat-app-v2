const Conversation = require("../models/conversationModel.js")
const Message = require("../models/messageModel.js");
const { getRecipientSocketId, io } = require("../socket/socket.js");

// send message
const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: recipientId } = req.params
        const senderId = req.user.id; //  we set this in verifyToken function in authentication.js file

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            });
            await conversation.save();
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
        });


        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId,
                    seen: false
                },
            }),
        ]);

        const recipientSocketId = getRecipientSocketId(recipientId);
        if (recipientSocketId) {
        	io.to(recipientSocketId).emit("newMessage", newMessage);
        }
 
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// get user all conversation list
const getConversations = async (req, res) => {
    const userId = req.user.id;
    try {
        const conversations = await Conversation.find({ participants: userId }).populate({
            path: "participants",
            select: "name profilePic",
        });
        // remove the current user from the participants array
        conversations.forEach((conversation) => {
            conversation.participants = conversation.participants.filter(
                (participant) => participant._id.toString() !== userId.toString()
            );
        });
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// get user messages with other single user
const getMessages = async (req, res) => {
    const { id: otherUserId } = req.params;
    const userId = req.user.id;
    try {
        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] },
        });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const messages = await Message.find({
            conversationId: conversation._id,
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { sendMessage, getMessages, getConversations };
