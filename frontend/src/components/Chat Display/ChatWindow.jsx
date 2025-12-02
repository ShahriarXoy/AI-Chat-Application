import React from "react";
import MessageList from "./MessageList";

function ChatWindow({ messageList, username }) {
  const chatBoxStyle = {
    border: "1px solid #ccc",
    height: "400px",
    overflowY: "scroll",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    marginBottom: "15px"
  };

  return (
    <div style={chatBoxStyle}>
      <MessageList messageList={messageList} username={username} />
    </div>
  );
}

export default ChatWindow;