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


let onlineUsers = []; // Array to store online users

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    // Check if the user is already in the onlineUsers array
    const userExists = onlineUsers.some(user => user.userId === userId);
    if (!userExists) {
        // If the user is not already in the array, add them
        onlineUsers = [...onlineUsers, { userId, socketId: socket.id }]
        // Send online users array to the frontend
        io.emit("getOnlineUsers", onlineUsers);
    }



    // Listen for sending messages
    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {

        const messageForRealTime = {
            message,
            _id: uuid(),
            senderId,
            receiverId,
            createdAt: new Date().toISOString(),
        };


        // Find the socket ID of the recipient and sender user
        const recipientSocket = onlineUsers.find(user => user.userId === receiverId);
        const senderSocketId = onlineUsers.find(user => user.userId === senderId);
        if (recipientSocket) {
            // If the recipient is online, send the message directly to their socket
            io.to(recipientSocket.socketId).emit("receiveMessage", messageForRealTime);
        } else {
            // Handle the case where the recipient is offline or not found
            console.log("user is offline")
        }

        // Emit the message to the sender as well to display it instantly on their end
        // Putting the emission of the message to the sender outside of the if...else block ensures that the sender always receives the message in real-time, regardless of whether the recipient is online or offline.
        io.to(senderSocketId.socketId).emit("receiveMessage", messageForRealTime);

        // saving in database
        try {
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



        } catch (error) {
            console.log("error while message saving")
        }
    });

    // socket.on() is used to listen to the events. can be used both on client and server side
    socket.on("disconnect", () => {
        // Remove the disconnected user from onlineUsers array
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        // Send updated online users array to the frontend
        io.emit("getOnlineUsers", onlineUsers);
    });
});

module.exports = { app, server }