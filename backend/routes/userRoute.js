const express = require("express");
const { registerUser, loginUser, getAllUsers, logout } = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authentication");

const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/all-users", verifyToken, getAllUsers)
router.post("/logout", logout)


module.exports = router;