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
      return res
        .status(400)
        .json({ message: "User already exists with that email or username" });
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
      return res
        .status(400)
        .json({ message: "Please provide email/username and password" });
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

// NEW: Handle Google Login
const googleLogin = async (req, res) => {
  const { email, name, profilePicture, googleId } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });

    // 2. If not, create them
    if (!user) {
      // Create a username from the email (e.g., "joy" from "joy@gmail.com")
      const baseUsername = email.split("@")[0];
      const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Unique suffix

      user = await User.create({
        username: `${baseUsername}${randomSuffix}`,
        email,
        password: googleId, // Use Google ID as a dummy password (or leave empty if schema allows)
        profilePicture,
        isGoogleUser: true, // Optional flag
      });
    }

    // 3. Generate Token (Reuse your existing generateToken function)
    const token = generateToken(user._id);

    // 4. Send back the same response structure as your normal login
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Google Login Failed" });
  }
};

module.exports = {
  registerUser,
  authUser: loginUser, // <--- MAP loginUser TO authUser
  googleLogin,
};
