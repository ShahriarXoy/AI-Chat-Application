import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";
import { AuthContext } from "./AuthIdentify/AuthContext";

import ChatInput from "./Inputs & Rich Content/ChatInput";
import ChatWindow from "./Chat Display/ChatWindow";
import AISummaryButton from "./AI Feature/AISummaryButton";
import SummaryPanel from "./AI Feature/SummaryPanel";
import ChatList from "./Sidebar & Navigation/ChatList";

// Connect to backend
const socket = io.connect("http://localhost:3001");

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

  // --- NEW: Fetch Chat History when room changes ---
  useEffect(() => {
    const fetchMessages = async () => {
      // Don't fetch for "general" or invalid rooms
      if (!room || room === "general") return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3001/api/messages/${room}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Load history into the chat window
        setMessageList(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchMessages();
  }, [room]); // <--- Runs whenever 'room' changes


  // Handle User Selection from Sidebar
  const handleUserSelect = (otherUser) => {
    setSelectedUser(otherUser);
    
    // Create consistent Room ID (Alphabetically sorted IDs)
    const newRoomId = [myId, otherUser._id].sort().join("_");
    
    setRoom(newRoomId);
    setMessageList([]); // Clear screen immediately while loading new chat
    setSummary("");     // Clear old summary
  };

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

      // Send to Socket (Real-time)
      await socket.emit("send_message", messageData);
      
      // Update UI immediately
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
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
      const res = await axios.post("http://localhost:3001/api/summary/generate", { roomId: room });
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      setSummary("Error generating summary. (Check backend logs)");
    }
    setIsSummarizing(false);
  };

  // --- RENDER ---
  return (
    <div style={{ display: "flex", height: "90vh", fontFamily: "Arial, sans-serif" }}>
      
      {/* LEFT SIDEBAR */}
      <div style={{ width: "300px", borderRight: "1px solid #ccc", background: "#fff" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>
          <h3 style={{ color: "black", margin: "0 0 5px 0" }}>Chats</h3>
          
          <small style={{ color: "#555" }}>Logged in as: {myUsername}</small>
        </div>
        <ChatList onSelectUser={handleUserSelect} />
      </div>

      {/* RIGHT CHAT AREA */}
      <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column" }}>
        {selectedUser ? (
          <>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2>Chat with {selectedUser.username}</h2>
              <AISummaryButton onClick={handleSummarize} isSummarizing={isSummarizing} />
            </div>

            <SummaryPanel summary={summary} isSummarizing={isSummarizing} onClose={() => setSummary("")} />

            <ChatWindow
              messageList={messageList}
              username={myUsername}
              currentUserId={myId}
             />

            <ChatInput 
              currentMessage={currentMessage} 
              setCurrentMessage={setCurrentMessage} 
              sendMessage={sendMessage} 
            />
          </>
        ) : (
          <div style={{ margin: "auto", textAlign: "center", color: "#888" }}>
            <h2>Welcome, {myUsername}! 👋</h2>
            <p>Select a user from the left to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;