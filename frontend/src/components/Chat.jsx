import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";
// ✅ FIX: AuthContext এর পাথ ঠিক করা হলো
import { AuthContext } from "./AuthIdentify/AuthContext";

// ✅ FIX: ChatInput এর পাথ ঠিক করা হলো
import ChatInput from "./Inputs & Rich Content/ChatInput";
// ✅ FIX: ChatWindow এর পাথ ঠিক করা হলো
import ChatWindow from "./Chat Display/ChatWindow";
// ✅ FIX: AISummaryButton এর পাথ ঠিক করা হলো
import AISummaryButton from "./AI Feature/AISummaryButton";
// ✅ FIX: SummaryPanel এর পাথ ঠিক করা হলো
import SummaryPanel from "./AI Feature/SummaryPanel";
// ✅ FIX: ChatList এর পাথ এবং ফোল্ডারের নাম ঠিক করা হলো
import ChatList from "./Sidebar & Navigation/ChatList";
// ✅ Add WelcomeTyper for animated welcome/cta
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

  // --- NEW: Fetch Chat History when room changes ---
  useEffect(() => {
    const fetchMessages = async () => {
      // Don't fetch for "general" or invalid rooms
      if (!room || room === "general") return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/messages/${room}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Load history into the chat window
        setMessageList(res.data);
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
    setMessageList([]); // Clear screen immediately while loading new chat
    setSummary("");     // Clear old summary
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

  // Socket: Send Message
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        sender: myUsername,
        senderId: myId,
        content: currentMessage,
        time: new Date(),
      };

      console.log("Sending messageData:", messageData);
      // Send to Socket (Real-time)
      await socket.emit("send_message", messageData);
      
      // Update UI immediately
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
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
      // Only show message if it belongs to the active room
      if (data.room === room) { 
        setMessageList((list) => [...list, data]);
      }
    };
    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [socket, room]);

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
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "#ffffff" }}>
      
      {/* LEFT SIDEBAR */}
      <div style={{ width: "300px", borderRight: "1px solid #e0e0e0", background: "#ffffff", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 15px", borderBottom: "1px solid #e0e0e0", background: "linear-gradient(135deg, #6f42c1 0%, #5a369e 100%)" }}>
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
              <h3 style={{ color: "white", margin: "0", fontSize: "18px", fontWeight: "700" }}>Chats</h3>
              <small style={{ color: "rgba(255, 255, 255, 0.8)", display: "block", fontSize: "12px" }}>
                👤 {myUsername}
              </small>
            </div>
          </div>
          <small style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "11px", display: "block" }}>
            ✨ Click avatar to add photo
          </small>
        </div>
        <ChatList onSelectUser={handleUserSelect} selectedUserId={selectedUser ? selectedUser._id : null} onlineUserIds={onlineUsers} />
      </div>

      {/* Profile Upload Modal */}
      {showProfileUpload && (
        <div style={{
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
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            maxWidth: "450px",
            width: "90%",
          }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#1a1a1a", fontSize: "20px", fontWeight: "700" }}>
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
            {/* Header */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "25px",
              paddingBottom: "15px",
              borderBottom: "2px solid #e0e0e0"
            }}>
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

            <ChatWindow
              messageList={messageList}
              username={myUsername}
              currentUserId={myId}
             />

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
              const el = document.querySelector('.chatlist-item');
              if (el) el.click();
              else window.alert('Please select a user from the left to start chatting.');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;