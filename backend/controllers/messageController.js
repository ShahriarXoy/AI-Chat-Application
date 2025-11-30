const Chat = require("../models/Chat");
const User = require("../models/User");

// Helper to build room id for two users
const getRoomId = (userId1, userId2) => {
  const a = userId1.toString();
  const b = userId2.toString();
  return [a, b].sort().join("_");
};

// POST /api/messages
// body: { receiverId, content }
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res
        .status(400)
        .json({ message: "receiverId and content are required" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const chat = await Chat.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      status: "sent",
    });

    const io = req.app.get("io");
    if (io) {
      const roomId = getRoomId(req.user._id, receiverId);
      io.to(roomId).emit("new_message", {
        _id: chat._id,
        sender: chat.sender,
        receiver: chat.receiver,
        content: chat.content,
        status: chat.status,
        createdAt: chat.createdAt,
      });
    }

    return res.status(201).json(chat);
  } catch (err) {
    console.error("Send message error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/messages/:userId
// full conversation between logged in user and :userId
const getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Chat.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id },
      ],
    })
      .populate("sender", "username email")
      .populate("receiver", "username email")
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (err) {
    console.error("Get conversation error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/messages
// inbox: last message per conversation partner
const getInbox = async (req, res) => {
  try {
    const messages = await Chat.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "username email")
      .populate("receiver", "username email");

    const seen = new Set();
    const inbox = [];

    for (const msg of messages) {
      const other =
        msg.sender._id.toString() === req.user._id.toString()
          ? msg.receiver
          : msg.sender;

      if (!other) continue;

      const otherId = other._id.toString();
      if (!seen.has(otherId)) {
        seen.add(otherId);
        inbox.push({
          withUser: other,
          lastMessage: msg,
        });
      }
    }

    return res.json(inbox);
  } catch (err) {
    console.error("Get inbox error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getInbox,
};
