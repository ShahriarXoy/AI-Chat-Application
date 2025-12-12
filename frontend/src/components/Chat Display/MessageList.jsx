import React from "react";
import MessageBubble from "./MessageBubble";

function MessageList({ messageList, username, currentUserId }) {
  if (!messageList || messageList.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>
        No messages yet. Say hello!
      </p>
    );
  }

  return (
    <div>
      {messageList.map((msg, index) => {
        if (!msg) return null;

        // THE FIX: Check both ID (Database) and Name (Live)
        // 1. msg.sender === currentUserId (For database messages where sender is an ID)
        // 2. msg.senderId === currentUserId (For live messages which have a senderId field)
        // 3. msg.sender === username (Fallback for old logic)
        
        const isOwnMessage = 
          msg.sender === currentUserId || 
          msg.senderId === currentUserId || 
          msg.sender === username;

        return (
          <MessageBubble 
            key={index} 
            message={msg} 
            isOwnMessage={isOwnMessage} 
          />
        );
      })}
    </div>
  );
}

export default MessageList;