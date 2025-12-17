import React, { forwardRef } from "react";

const ChatInput = forwardRef(function ChatInput(
  { currentMessage, setCurrentMessage, sendMessage },
  ref
) {
  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
      <input
        ref={ref}
        type="text"
        value={currentMessage}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: "12px 16px",
          borderRadius: "24px",
          border: "1px solid #e0e0e0",
          fontSize: "14px",
          outline: "none",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#6f42c1";
          e.target.style.boxShadow = "0 4px 12px rgba(111, 66, 193, 0.15)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e0e0e0";
          e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
        }}
        onChange={(event) => setCurrentMessage(event.target.value)}
        onKeyPress={(e) => {
          e.key === "Enter" && sendMessage();
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          padding: "12px 24px",
          background: "linear-gradient(135deg, #6f42c1 0%, #5a369e 100%)",
          color: "white",
          border: "none",
          borderRadius: "24px",
          fontWeight: "700",
          cursor: "pointer",
          fontSize: "14px",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(111, 66, 193, 0.3)",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 6px 16px rgba(111, 66, 193, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 12px rgba(111, 66, 193, 0.3)";
        }}
      >
        Send
      </button>
    </div>
  );
});

export default ChatInput;