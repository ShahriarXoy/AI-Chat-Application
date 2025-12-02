const { GoogleGenerativeAI } = require("@google/generative-ai");
const Message = require("../models/Message");
const User = require("../models/User");

//gemini api
const genAI = new GoogleGenerativeAI(process.env.AIzaSyCQWzltRTcAn59x3ugDrh3SivVFeo4tpVU);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateSummary = async (req ,res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ error: "Room ID is required" });
    }

    const userIds = roomId.split("_");

    if (userIds.length !== 2) {
      return res.json({
        summary: "AI Summary currently only works for 1-on-1 chats"
      });
    }

    const [user1, user2] = userIds;

    //fetching message between two users
    const message = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("sender", "username");

    if (!message || message.length === 0) {
      return res.json({ summary: "No message found to summarize." });
    }

    //formatting text for ai
    //reversing so that ai reads conversation from oldest to newest
    const conversationText = message
      .reverse()
      .map((msg) => {
        const senderName = msg.sender && msg.sender.username ? msg.sender.username : "User";
        return `${senderName}: ${msg.content}`;
      })
      .join("\n");
    
      //sending to gemini
      const prompt = `Summarize this chat conversation in 3 short bullet points:\n\n${conversationText}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summaryText = response.text();

      res.json({ summaryText });

  } catch (error) {
    console.error("Summary Controller Error:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
  
};

module.exports = { generateSummary };