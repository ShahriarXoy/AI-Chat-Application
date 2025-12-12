const Message = require("../models/Message");

// @desc    Get messages between two users
// @route   GET /api/messages/:roomId
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

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

    // Find messages where:
    // (Sender is User1 AND Receiver is User2) OR (Sender is User2 AND Receiver is User1)
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    })
    .sort({ createdAt: 1 }); // 1 = Oldest to Newest (Chronological order)

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getMessages };