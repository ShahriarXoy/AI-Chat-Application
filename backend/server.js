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
const groupRoutes = require("./routes/groupRoutes"); // ✅ NEW
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
// ✅ Increase payload limit for image uploads (default is 100kb, images are much larger)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// basic route
app.get("/", (req, res) => {
  res.json({ message: "Chat backend is running" });
});

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/groups", groupRoutes); // ✅ NEW

// simple in memory online user tracking
// key: userId, value: number of active sockets
const onlineUsers = {};
// map socket.id -> userId to clean up on disconnect
const socketToUser = {};

// socket.io real time chat
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // identify which user is online
  socket.on("user_online", (userId) => {
    if (!userId) return;

    socketToUser[socket.id] = userId;

    if (!onlineUsers[userId]) {
      onlineUsers[userId] = 0;
    }
    onlineUsers[userId] += 1;

    console.log("User online:", userId, "count:", onlineUsers[userId]);

    io.emit("online_users", Object.keys(onlineUsers));
  });

  // optional manual offline on logout
  socket.on("user_offline", () => {
    const userId = socketToUser[socket.id];
    if (!userId) return;

    if (onlineUsers[userId]) {
      onlineUsers[userId] -= 1;
      if (onlineUsers[userId] <= 0) {
        delete onlineUsers[userId];
      }
    }
    delete socketToUser[socket.id];

    console.log("User offline:", userId);
    io.emit("online_users", Object.keys(onlineUsers));
  });

  // ✅ GROUP CHAT: join a group room
  // data: groupId
  socket.on("join_group", (groupId) => {
    if (!groupId) return;
    const roomName = `group_${groupId}`;
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined group room: ${roomName}`);
  });

  // ✅ GROUP CHAT: send group message
  // data = { groupId, senderId, senderName?, content, time? }
  socket.on("send_group_message", async (data) => {
    if (!data?.groupId || !data?.senderId || !data?.content) return;

    const roomName = `group_${data.groupId}`;

    // A. Broadcast to everyone in group room
    io.to(roomName).emit("receive_group_message", data);

    // B. Save to DB as group message
    try {
      const newMessage = new Message({
        sender: data.senderId,
        content: data.content,
        group: data.groupId, // ✅ NEW field
      });

      await newMessage.save();
      console.log("Group message saved to Database!");
    } catch (err) {
      console.error("Error saving group message:", err);
    }
  });

  // 1-to-1 chat: Join Room Event (unchanged)
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  // 1-to-1 chat: Send Message Event (unchanged)
  socket.on("send_message", async (data) => {
    // data = { room, sender, senderId, content, time }

    // A. Send to the other person in the room (Real-time)
    socket.to(data.room).emit("receive_message", data);

    // B. Save to MongoDB (Persistent)
    try {
      // The room ID is format: "User1ID_User2ID"
      const userIds = data.room.split("_");
      const receiverId = userIds.find((id) => id !== data.senderId);

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

    const userId = socketToUser[socket.id];
    if (userId) {
      if (onlineUsers[userId]) {
        onlineUsers[userId] -= 1;
        if (onlineUsers[userId] <= 0) {
          delete onlineUsers[userId];
        }
      }
      delete socketToUser[socket.id];

      io.emit("online_users", Object.keys(onlineUsers));
    }
  });
});

// start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
