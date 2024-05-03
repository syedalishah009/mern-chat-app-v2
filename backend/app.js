
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const cookieParser = require("cookie-parser");
const connectDatabase = require('./config/database');

// import routes 
const authRoute = require('./routes/userRoute')
const messagesRoute = require('./routes/messageRoutes');
const { app, server } = require('./socket/socket');

dotenv.config();
connectDatabase();

app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));


// routes
app.use("/api/auth", authRoute)
app.use("/api/messages", messagesRoute)

server.listen(5000, () => {
    console.log("Backend server is running at port 5000");
});
