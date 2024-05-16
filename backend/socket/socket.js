const http = require("http")
const { Server } = require("socket.io");
const express = require("express");
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const { v4: uuid } = require('uuid')

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
    },
});

const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId];
};

const userSocketMap = {}; // formate =>  userId: socketId



io.on("connection", (socket) => {

    console.log("user connected", socket.id);
    const userId = socket.handshake.query.userId;

    if (userId != "undefined") userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("markMessagesAsSeen", async ({ conversationId, userToChat }) => {
        try {
            // find conversation having id, whose seen:false and set seen:true
            await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
            // await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
            io.to(userSocketMap[userToChat]).emit("messagesSeen", { conversationId });
        } catch (error) {
            console.log(error);
        }  
    }); 

    socket.on("markAsSeenSelfMessages", async ({ conversationId, userId }) => {
        try {
            // find conversation having id, and update it,  set seen:true
            await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
            // io.to(userSocketMap[userId]).emit("SelfMessagesSeen", { conversationId });
        } catch (error) {
            console.log(error);
        }  
    }); 


    // listen to markAsRead event
    socket.on("markAsSeen", async ({ conversationId, userId }) => {
        try {

            await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
            
            // Emit an event to notify frontend that messages are marked as read
            io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });

        } catch (error) {
            console.log("error while mark message as read", error)
        }

    })

    // socket.on() is used to listen to the events. can be used both on client and server side
    socket.on("disconnect", () => {
        console.log("user disconnected");
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { app, server, io, getRecipientSocketId }