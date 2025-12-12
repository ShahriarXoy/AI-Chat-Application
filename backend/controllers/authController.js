const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with that email or username" });
    }

    const user = await User.create({ username, email, password });

    return res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    console.log("1. Login attempt for:", emailOrUsername); // <--- DEBUG LOG

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: "Please provide email/username and password" });
    }

    //find user
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      console.log("2. User not found in DB");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("3. User found. Verifying password..."); // <--- DEBUG LOG

    //check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log("4. Password did not match"); // <--- DEBUG LOG
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("5. Success! Sending token."); // <--- DEBUG LOG

    return res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Login CRASH error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  return res.json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
