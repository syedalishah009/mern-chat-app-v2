const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Convert email to lowercase to ensure consistency
    trim: true
  },
  profilePic: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
    select: false // Prevent password from being returned by default in queries
  }

});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  try {
    // Check if the password has been modified
    if (!this.isModified("password")) {
      return next();
    }
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords during login authentication
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
