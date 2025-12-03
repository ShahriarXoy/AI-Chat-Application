const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const userRoutes = require("./routes/userRoutes");
const Message = require("./models/Message");



const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

// connect to MongoDB
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// basic route
app.get("/", (req, res) => {
  res.json({ message: "Chat backend is running" });
});

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/summary", summaryRoutes);

// simple in memory online user tracking
// key: userId, value: number of active sockets
const onlineUsers = {};

// socket.io real time chat
// Socket.io Real-Time Chat Logic
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // 1. Join Room Event
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  // 2. Send Message Event
  socket.on("send_message", async (data) => {
    // data = { room, sender, senderId, content, time }
    
    // A. Send to the other person in the room (Real-time)
    socket.to(data.room).emit("receive_message", data);

    // B. Save to MongoDB (Persistent)
    try {
      // The room ID is format: "User1ID_User2ID"
      // We know the senderId. The "Receiver" is the other ID in the room string.
      const userIds = data.room.split("_");
      
      // Filter out the sender to find the receiver
      const receiverId = userIds.find(id => id !== data.senderId);

      if (receiverId) {
        const newMessage = new Message({
          sender: data.senderId,
          receiver: receiverId,
          content: data.content,
        });

        await newMessage.save();
        console.log("Message saved to Database!");
      }
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
