import React from "react";

function MessageBubble({ message, isOwnMessage }) {
  // Safety check
  if (!message) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          background: isOwnMessage ? "#007bff" : "#e9ecef",
          color: isOwnMessage ? "white" : "black",
          padding: "8px 12px",
          borderRadius: "15px",
          maxWidth: "70%",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          textAlign: "left",
        }}
      >
        <small
          style={{
            fontSize: "0.7em",
            display: "block",
            marginBottom: "2px",
            opacity: 0.8,
            fontWeight: "bold",
            textAlign: isOwnMessage ? "right" : "left",
            color: isOwnMessage ? "#e0e0e0" : "#555",
          }}
        >
          {message.sender}
        </small>
        {message.content}
      </div>
    </div>
  );
}

export default MessageBubble;