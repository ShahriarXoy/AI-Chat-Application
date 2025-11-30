const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

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

// simple in memory online user tracking
// key: userId, value: number of active sockets
const onlineUsers = {};

// socket.io real time chat
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", ({ userId }) => {
    if (!userId) return;
    socket.userId = userId.toString();

    if (!onlineUsers[socket.userId]) {
      onlineUsers[socket.userId] = 0;
    }
    onlineUsers[socket.userId] += 1;

    console.log(`User ${socket.userId} joined. Online:`, onlineUsers);
    io.emit("online_users", Object.keys(onlineUsers));
  });

  socket.on("join_pair", ({ fromUserId, toUserId }) => {
    if (!fromUserId || !toUserId) return;
    const roomId = [fromUserId.toString(), toUserId.toString()]
      .sort()
      .join("_");
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    const userId = socket.userId;
    if (userId && onlineUsers[userId]) {
      onlineUsers[userId] -= 1;
      if (onlineUsers[userId] <= 0) {
        delete onlineUsers[userId];
      }
      io.emit("online_users", Object.keys(onlineUsers));
    }
  });
});

// start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
