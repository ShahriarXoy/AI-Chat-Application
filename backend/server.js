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
const groupRoutes = require("./routes/groupRoutes");
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
app.use("/api/groups", groupRoutes);

// simple in memory online user tracking
const onlineUsers = {};
const socketToUser = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

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

  // GROUP CHAT: join a group room
  socket.on("join_group", (groupId) => {
    if (!groupId) return;
    const roomName = `group_${groupId}`;
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined group room: ${roomName}`);
  });

  // GROUP CHAT: send group message
  socket.on("send_group_message", async (data, ack) => {
    if (!data?.groupId || !data?.senderId || !data?.content) {
      if (typeof ack === "function") ack({ ok: false, error: "invalid_payload" });
      return;
    }

    const roomName = `group_${data.groupId}`;

    // Broadcast
    io.to(roomName).emit("receive_group_message", {
      ...data,
      delivered: true,
      status: "delivered",
      seen: false,
    });

    // Save
    try {
      const newMessage = new Message({
        sender: data.senderId,
        content: data.content,
        group: data.groupId,
        delivered: true,
        seen: false,
        status: "delivered",
      });

      const saved = await newMessage.save();
      console.log("Group message saved to Database!");

      if (typeof ack === "function") ack({ ok: true, messageId: saved?._id?.toString() });
    } catch (err) {
      console.error("Error saving group message:", err);
      if (typeof ack === "function") ack({ ok: false, error: "db_save_failed" });
    }
  });

  // 1-to-1 chat: Join Room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  // 1-to-1 chat: Send Message (UPDATED with ACK + delivered)
  socket.on("send_message", async (data, ack) => {
    if (!data?.room || !data?.senderId || !data?.content) {
      if (typeof ack === "function") ack({ ok: false, error: "invalid_payload" });
      return;
    }

    // Determine receiverId from room
    const userIds = data.room.split("_");
    const receiverId = userIds.find((id) => id !== String(data.senderId));

    // Payload to receiver
    const payloadToReceiver = {
      ...data,
      receiverId: receiverId || data.receiverId,
      delivered: true,
      status: "delivered",
      seen: false,
    };

    // A. Send to receiver
    socket.to(data.room).emit("receive_message", payloadToReceiver);

    // B. Save to DB
    try {
      let savedId = null;

      if (receiverId) {
        const newMessage = new Message({
          sender: data.senderId,
          receiver: receiverId,
          content: data.content,
          delivered: true,
          seen: false,
          status: "delivered",
          room: data.room,
          time: data.time,
        });

        const saved = await newMessage.save();
        savedId = saved?._id?.toString();
        console.log("Message saved to Database!");
      }

      // C. ACK back to sender
      if (typeof ack === "function") {
        ack({ ok: true, messageId: savedId });
      }
    } catch (err) {
      console.error("Error saving message:", err);
      if (typeof ack === "function") ack({ ok: false, error: "db_save_failed" });
    }
  });

  // Seen event (receiver opened the chat)
  socket.on("messages_seen", async ({ room, viewerId }) => {
    if (!room || !viewerId) return;

    const userIds = room.split("_");
    const otherId = userIds.find((id) => id !== String(viewerId));
    if (!otherId) return;

    try {
      // Update DB: messages from otherId -> viewerId set seen=true
      await Message.updateMany(
        { sender: otherId, receiver: viewerId, seen: { $ne: true } },
        { $set: { seen: true, status: "seen" } }
      );

      // Notify both clients in that room
      io.to(room).emit("messages_seen_update", { room, viewerId });
    } catch (err) {
      console.error("Error marking messages seen:", err);
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
