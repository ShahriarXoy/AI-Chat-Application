const Message = require("../models/Message");
const mongoose = require("mongoose");

// @desc    Get messages between two users
// @route   GET /api/messages/:roomId
// Supports optional pagination via query params:
//  - limit=<number>   (max 100)
//  - before=<messageId>  (ObjectId cursor; returns messages older than this id)
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit, before } = req.query;

    // If it's the general room, we might not have history logic yet, 
    // or we return empty array
    if (roomId === "general") {
      return res.json([]);
    }

    // Logic: The room ID is "User1_User2". We split it to find the participants.
    const userIds = roomId.split("_");
    
    // Safety check: Ensure it's a valid pair
    if (userIds.length !== 2) {
      return res.status(400).json({ message: "Invalid Room ID" });
    }

    const [user1, user2] = userIds;

    // Base query: messages between the two users
    const query = {
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    };

    // If either pagination parameter is provided, perform cursor pagination
    if (limit || before) {
      const limitNum = Math.min(parseInt(limit, 10) || 20, 100);

      if (before) {
        if (!mongoose.Types.ObjectId.isValid(before)) {
          return res.status(400).json({ message: "Invalid 'before' message id" });
        }
        // Only return messages older than the provided ObjectId cursor
        query._id = { $lt: mongoose.Types.ObjectId(before) };
      }

      // Fetch newest-first page then reverse to chronological order
      const page = await Message.find(query)
        .sort({ _id: -1 })
        .limit(limitNum);

      const messages = page.reverse();
      return res.json(messages);
    }

    // Default (backwards-compatible): return full history in chronological order
    const messages = await Message.find(query).sort({ createdAt: 1 }); // 1 = Oldest to Newest

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getMessages };