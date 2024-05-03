const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
    try {
        // Extract user details from request body
        const { name, email, password } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            password
        });

        // Save the user to the database
        await newUser.save();

        // Respond with success message
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        // Handle errors
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// user login
const loginUser = async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email }).select("+password");

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Password is correct, generate JWT token
        //storing user id in token
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET
        );

        // Send the token as response
        // storing token in cookies
        res.cookie("accessToken", token, {
            httpOnly: true,
        })
            .status(200)
            .send({
                success: true,
                user
            });
    } catch (error) {
        // Handle errors
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// get all users
const getAllUsers = async (req, res) => {
    try {

        const loggedInUserId = req.user.id; // Adjust this according to your authentication setup
        // Find all users except the logged-in user
        const users = await User.find({ _id: { $ne: loggedInUserId } });

        // Check if users exist
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No other users found" });
        }


        res.status(200).json({ success: true, users });
    } catch (error) {
        // Handle errors
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const logout = async (req, res) => {
    res
        .clearCookie("accessToken", {
            sameSite: "none",
            secure: true,
        })
        .status(200)
        .send("User has been logged out.");
};
module.exports = { registerUser, loginUser, getAllUsers, logout };
