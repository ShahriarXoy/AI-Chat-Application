import React from "react";

function ChatInput({ currentMessage, setCurrentMessage, sendMessage }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
      <input
        type="text"
        value={currentMessage}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: "12px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
        onChange={(event) => setCurrentMessage(event.target.value)}
        onKeyPress={(e) => {
          e.key === "Enter" && sendMessage();
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          padding: "0 25px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}

// THIS IS THE LINE YOU WERE MISSING:
export default ChatInput;