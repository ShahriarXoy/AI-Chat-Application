import React, { useEffect, useRef } from "react";
import MessageList from "./MessageList";

function ChatWindow({ messageList, username, currentUserId }) {
  const chatBoxRef = useRef(null);

  useEffect(() => {
    // scroll to bottom when messageList changes
    const el = chatBoxRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messageList]);

  const chatBoxStyle = {
    border: "1px solid #e0e0e0",
    height: "400px",
    overflowY: "auto",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#f8f9fa",
    marginBottom: "15px",
    backgroundImage: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
    boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.05)",
  };

  return (
    <div style={chatBoxStyle} ref={chatBoxRef}>
      <MessageList
        messageList={messageList}
        username={username}
        currentUserId={currentUserId}
      />
    </div>
  );
}

export default ChatWindow;