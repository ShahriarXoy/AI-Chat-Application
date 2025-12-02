import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";

// 1. Import AuthContext
import { AuthContext } from "./AuthIdentify/AuthContext";

// 2. Import your PRO components
import ChatInput from "./Inputs & Rich Content/ChatInput";
import ChatWindow from "./Chat Display/ChatWindow";
import AISummaryButton from "./AI Feature/AISummaryButton";
import SummaryPanel from "./AI Feature/SummaryPanel";

// Connect to backend
const socket = io.connect("http://localhost:3001");

function Chat() {
  // Get User Data from Context
  const { user } = useContext(AuthContext);
  const username = user ? user.username : "Guest";
  const userId = user ? user._id : null; // <--- Critical for Database Saving!

  const [room, setRoom] = useState("general");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Auto-join room on load
  useEffect(() => {
    if (username && room) {
        socket.emit("join_room", room);
    }
  }, [username, room]);

  // Send Message (Updated to include senderId)
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        sender: username,   // For the UI
        senderId: userId,   // <--- For the Database (REQUIRED)
        content: currentMessage,
        time: new Date(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  // Receive Messages
  useEffect(() => {
    const handleReceive = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, []);

  // AI Summary Logic
  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary(""); // Clear previous summary so Skeleton shows
    try {
      const res = await axios.post(
        "http://localhost:3001/api/summary/generate",
        { roomId: room }
      );
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      setSummary("Error: Could not generate summary. (Check if backend saved messages)");
    }
    setIsSummarizing(false);
  };

  // --- RENDER (Using the New Components) ---
  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
         <h2 style={{ margin: 0 }}>Room: {room}</h2>
         <AISummaryButton 
            onClick={handleSummarize} 
            isSummarizing={isSummarizing} 
         />
      </div>

      {/* AI Panel (Shows Skeleton when loading) */}
      <SummaryPanel 
         summary={summary} 
         isSummarizing={isSummarizing}
         onClose={() => setSummary("")}
      />

      {/* Chat Window */}
      <ChatWindow
        messageList={messageList}
        username={username}
      />

      {/* Input Area */}
      <ChatInput
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default Chat;