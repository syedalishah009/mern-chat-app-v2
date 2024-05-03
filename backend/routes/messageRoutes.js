const express = require("express");
const { sendMessage, getMessages } = require("../controllers/messageController");
const { verifyToken } = require("../middlewares/authentication");

const router = express.Router();

router.post("/send-message/:id",verifyToken,sendMessage)
router.get("/all-messages/:id",verifyToken, getMessages)


module.exports = router;