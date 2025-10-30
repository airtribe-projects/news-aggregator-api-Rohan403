const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/User");
const generateToken = require("../utils/generateTokens");

// Register a new user

const registerUser = async (req, res) => {
  try {
    const { name, email, password, preferences } = req.body;

    if (!name|| !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // if (!validator.isEmail(email)) {
    //   return res.status(400).json({ message: "Invalid email format" });
    // }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    if (preferences && !Array.isArray(preferences)) {
      return res.status(400).json({ message: "Preferences must be an array" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      preferences: Array.isArray(preferences) ? preferences : []
    });

    res.status(200).json({
      message: "User registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        preferences: newUser.preferences,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Login user

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({ message: "Login successful", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
module.exports = { registerUser, loginUser };
