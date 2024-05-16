const express = require("express");
const { sendMessage, getMessages, getConversations } = require("../controllers/messageController");
const { verifyToken } = require("../middlewares/authentication");

const router = express.Router();

router.post("/send-message/:id", verifyToken, sendMessage)
router.get("/conversations", verifyToken, getConversations)
router.get("/all-messages/:id", verifyToken, getMessages)


module.exports = router;