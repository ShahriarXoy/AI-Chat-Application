import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";
import { AuthContext } from "./AuthIdentify/AuthContext";

import ChatInput from "./Inputs & Rich Content/ChatInput";
import ChatWindow from "./Chat Display/ChatWindow";
import AISummaryButton from "./AI Feature/AISummaryButton";
import SummaryPanel from "./AI Feature/SummaryPanel";
import ChatList from "./Sidebar & Navigation/ChatList"; // <--- Import the list

const socket = io.connect("http://localhost:3001");

function Chat() {
  const { user } = useContext(AuthContext);
  const myUsername = user ? user.username : "Guest";
  const myId = user ? user._id : null;

  // State for 1-on-1
  const [selectedUser, setSelectedUser] = useState(null); // Who are we talking to?
  const [room, setRoom] = useState("general");          // Current Room ID
  
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Logic: When you click a user in the list
  const handleUserSelect = (otherUser) => {
    setSelectedUser(otherUser);
    
    // Create a unique room ID: "MyID_TheirID" (Sorted alphabetically so it's always the same for both people)
    // Example: "123_456" is the same as "456_123" if we sort them.
    const newRoomId = [myId, otherUser._id].sort().join("_");
    
    setRoom(newRoomId);
    setMessageList([]); // Clear screen for new chat
    setSummary("");     // Clear old summary
  };

  // Join the room whenever 'room' changes
  useEffect(() => {
    if (myUsername && room) {
        socket.emit("join_room", room);
        console.log(`Joined room: ${room}`);
    }
  }, [myUsername, room]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        sender: myUsername,
        senderId: myId,
        content: currentMessage,
        time: new Date(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const handleReceive = (data) => {
      // Only add message if it belongs to the current room!
      if (data.room === room) { 
        setMessageList((list) => [...list, data]);
      }
    };
    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [socket, room]); // Re-run this listener when room changes

  // ... (Keep handleSummarize logic the same) ...
  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary("");
    try {
      const res = await axios.post("http://localhost:3001/api/summary/generate", { roomId: room });
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      setSummary("Error generating summary.");
    }
    setIsSummarizing(false);
  };

  // --- RENDER ---
  return (
    <div style={{ display: "flex", height: "90vh", fontFamily: "Arial, sans-serif" }}>
      
      {/* LEFT SIDEBAR */}
      <div style={{ width: "300px", borderRight: "1px solid #ccc", background: "#fff" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>
          <h3>Chats</h3>
          <small>Logged in as: {myUsername}</small>
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

            <ChatWindow messageList={messageList} username={myUsername} />

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