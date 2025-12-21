import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";
import { AuthContext } from "./AuthIdentify/AuthContext";

import ChatInput from "./Inputs & Rich Content/ChatInput";
import ChatWindow from "./Chat Display/ChatWindow";
import AISummaryButton from "./AI Feature/AISummaryButton";
import SummaryPanel from "./AI Feature/SummaryPanel";
import ChatList from "./Sidebar & Navigation/ChatList";
import WelcomeTyper from "./Chat Display/WelcomeTyper";
import ProfilePictureUpload from "./AuthIdentify/ProfilePictureUpload";

// Connect to backend
const socket = io.connect("http://localhost:5000");

function Chat() {
  const { user } = useContext(AuthContext);
  const myUsername = user ? user.username : "Guest";
  const myId = user ? user._id : null;

  // State
  const [selectedUser, setSelectedUser] = useState(null);
  const [room, setRoom] = useState("general");

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const [userProfile, setUserProfile] = useState(user);

  // --- Fetch Chat History when room changes ---
  useEffect(() => {
    const fetchMessages = async () => {
      if (!room || room === "general") return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/messages/${room}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const normalized = (res.data || []).map((m) => ({
          ...m,
          room: m.room || room,
          senderId: m.senderId || m.sender || m.sender?._id || m.sender,
          receiverId: m.receiverId || m.receiver || m.receiver?._id || m.receiver,
          time: m.time || m.createdAt || m.updatedAt || new Date().toISOString(),
          delivered: m.delivered ?? true,
          seen: m.seen ?? false,
          status: m.status || (m.seen ? "seen" : "delivered"),
        }));

        setMessageList(normalized);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchMessages();
  }, [room]);

  // Handle User Selection from Sidebar
  const handleUserSelect = (otherUser) => {
    console.log("handleUserSelect called with:", otherUser);
    setSelectedUser(otherUser);

    // Create consistent Room ID (Alphabetically sorted IDs)
    const newRoomId = [myId, otherUser._id].sort().join("_");

    setRoom(newRoomId);
    setMessageList([]);
    setSummary("");

    // ✅ Mark messages as seen when opening the chat
    if (myId) {
      socket.emit("messages_seen", { room: newRoomId, viewerId: myId });
    }
  };

  // Emit online presence when we have an ID
  useEffect(() => {
    if (myId) {
      try {
        socket.emit("user_online", myId);
        console.log("Emitted user_online for:", myId);
      } catch (err) {
        console.warn("Socket emit user_online failed", err);
      }
    }
  }, [myId]);

  // Socket listeners: connect status and online users list
  useEffect(() => {
    const handleConnect = () => console.log("Socket connected", socket.id);
    const handleConnectError = (err) => console.warn("Socket connect error", err);
    const handleOnlineUsers = (list) => {
      console.log("Received online_users:", list);
      setOnlineUsers(list || []);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("online_users", handleOnlineUsers);
    };
  }, []);

  // Socket: Join Room
  useEffect(() => {
    if (myUsername && room) {
      socket.emit("join_room", room);
    }
  }, [myUsername, room]);

  // Socket: Send Message (UPDATED with status + ACK)
  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    if (!room || room === "general") return;
    if (!myId || !selectedUser?._id) return;

    const tempId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;

    const messageData = {
      tempId,
      room: room,
      sender: myUsername,
      senderId: myId,
      receiverId: selectedUser._id,
      content: currentMessage,
      time: new Date().toISOString(),

      status: "sent",
      delivered: false,
      seen: false,
    };

    console.log("Sending messageData:", messageData);

    // 1) Update UI immediately
    setMessageList((list) => [...list, messageData]);
    setCurrentMessage("");

    // 2) Send to Socket with ACK
    socket.emit("send_message", messageData, (ack) => {
      if (!ack || !ack.ok) return;

      // 3) Mark as delivered in UI
      setMessageList((list) =>
        list.map((m) =>
          m.tempId === tempId
            ? {
                ...m,
                _id: ack.messageId || m._id,
                delivered: true,
                status: "delivered",
              }
            : m
        )
      );
    });
  };

  // Update userProfile when user context changes
  useEffect(() => {
    setUserProfile(user);
  }, [user]);

  // Focus input when a user is selected
  const inputRef = React.useRef(null);
  useEffect(() => {
    if (selectedUser && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedUser]);

  // Handle profile picture upload success
  const handleProfileUploadSuccess = (updatedUser) => {
    setUserProfile(updatedUser);
    setShowProfileUpload(false);
  };

  // Socket: Receive Message
  useEffect(() => {
    const handleReceive = (data) => {
      if (data.room === room) {
        const normalized = {
          ...data,
          delivered: data.delivered ?? true,
          seen: data.seen ?? false,
          status: data.status || (data.seen ? "seen" : "delivered"),
          time: data.time || new Date().toISOString(),
        };
        setMessageList((list) => [...list, normalized]);
      }
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [room]);

  // ✅ Socket: Seen update (sender side) FIXED
  useEffect(() => {
    const onSeenUpdate = ({ room: seenRoom, viewerId }) => {
      if (seenRoom !== room) return;

      setMessageList((list) =>
        list.map((m) => {
          const isMyMsg = String(m.senderId) === String(myId);
          const receiverOpenedChat = String(m.receiverId) === String(viewerId);

          if (isMyMsg && receiverOpenedChat) {
            return { ...m, seen: true, status: "seen" };
          }
          return m;
        })
      );
    };

    socket.on("messages_seen_update", onSeenUpdate);
    return () => socket.off("messages_seen_update", onSeenUpdate);
  }, [room, myId]);

  // AI Summary Logic
  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary("");
    try {
      const res = await axios.post("http://localhost:5000/api/summary/generate", { roomId: room });
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      setSummary("Error generating summary. (Check backend logs)");
    }
    setIsSummarizing(false);
  };

  // --- RENDER ---
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "#ffffff",
      }}
    >
      {/* LEFT SIDEBAR */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #e0e0e0",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "20px 15px",
            borderBottom: "1px solid #e0e0e0",
            background: "linear-gradient(135deg, #6f42c1 0%, #5a369e 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <div
              onClick={() => setShowProfileUpload(!showProfileUpload)}
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                background: userProfile?.profilePicture
                  ? `url(${userProfile.profilePicture}) center / cover`
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "18px",
                cursor: "pointer",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
                e.target.style.transform = "scale(1)";
              }}
              title="Click to add profile picture"
            >
              {!userProfile?.profilePicture && myUsername[0].toUpperCase()}
            </div>
            <div>
              <h3 style={{ color: "white", margin: "0", fontSize: "18px", fontWeight: "700" }}>
                Chats
              </h3>
              <small style={{ color: "rgba(255, 255, 255, 0.8)", display: "block", fontSize: "12px" }}>
                👤 {myUsername}
              </small>
            </div>
          </div>
          <small style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "11px", display: "block" }}>
            ✨ Click avatar to add photo
          </small>
        </div>

        <ChatList
          onSelectUser={handleUserSelect}
          selectedUserId={selectedUser ? selectedUser._id : null}
          onlineUserIds={onlineUsers}
        />
      </div>

      {/* Profile Upload Modal */}
      {showProfileUpload && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              maxWidth: "450px",
              width: "90%",
            }}
          >
            <h3
              style={{
                margin: "0 0 20px 0",
                color: "#1a1a1a",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              📸 Update Your Profile Picture
            </h3>

            <ProfilePictureUpload
              currentPicture={userProfile?.profilePicture}
              onSuccess={handleProfileUploadSuccess}
            />

            <button
              onClick={() => setShowProfileUpload(false)}
              style={{
                width: "100%",
                marginTop: "15px",
                padding: "12px",
                background: "#f0f0f0",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                color: "#666",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#e8e8e8";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#f0f0f0";
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* RIGHT CHAT AREA */}
      <div style={{ flex: 1, padding: "25px", display: "flex", flexDirection: "column", background: "#fafbfc" }}>
        {selectedUser ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
                paddingBottom: "15px",
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              <div>
                <h2 style={{ margin: "0 0 5px 0", color: "#1a1a1a", fontSize: "24px" }}>
                  Chat with {selectedUser.username}
                </h2>
                <small style={{ color: "#999" }}>
                  {onlineUsers.includes(selectedUser._id) ? "🟢 Online" : "⚪ Offline"}
                </small>
              </div>

              <AISummaryButton onClick={handleSummarize} isSummarizing={isSummarizing} />
            </div>

            <SummaryPanel summary={summary} isSummarizing={isSummarizing} onClose={() => setSummary("")} />

            <ChatWindow messageList={messageList} username={myUsername} currentUserId={myId} />

            <ChatInput
              ref={inputRef}
              currentMessage={currentMessage}
              setCurrentMessage={setCurrentMessage}
              sendMessage={sendMessage}
            />
          </>
        ) : (
          <WelcomeTyper
            messages={[`Welcome, ${myUsername}! 👋`, "Select a user from the left to start chatting."]}
            onStart={() => {
              const el = document.querySelector(".chatlist-item");
              if (el) el.click();
              else window.alert("Please select a user from the left to start chatting.");
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;


export default Chat;
