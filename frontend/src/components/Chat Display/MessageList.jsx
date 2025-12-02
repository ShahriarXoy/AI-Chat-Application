import React from "react";
import MessageBubble from "./MessageBubble";

function MessageList({ messageList, username }) {
  // Safety check: if the list is broken, show nothing
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
        // Safety check: Skip empty messages
        if (!msg) return null;

        const isOwnMessage = msg.sender === username;
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