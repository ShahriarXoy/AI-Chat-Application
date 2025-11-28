import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

// Connect to backend
const socket = io.connect("http://localhost:3001");

function Chat() {
  const [room, setRoom] = useState("general");
  const [username, setUsername] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [joined, setJoined] = useState(false);

  // Join Room
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setJoined(true);
    }
  };

  // Send Message
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        sender: username,
        content: currentMessage,
        time: new Date(),
      };

      await socket.emit("send_message", messageData);
      // Add our own message to the list immediately
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
  }, [socket]);

  // Generate AI Summary
  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const res = await axios.post(
        "http://localhost:3001/api/summary/generate",
        {
          roomId: room,
        }
      );
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      setSummary(
        "Error generating summary. Make sure you have enough messages!"
      );
    }
    setIsSummarizing(false);
  };

  // Basic Styles
  const containerStyle = {
    maxWidth: "600px",
    margin: "2rem auto",
    fontFamily: "Arial",
  };
  const chatBoxStyle = {
    border: "1px solid #ccc",
    height: "300px",
    overflowY: "scroll",
    padding: "10px",
    marginBottom: "10px",
  };

  if (!joined) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h3>Join A Chat</h3>
        <input
          type="text"
          placeholder="Username..."
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room ID..."
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Room: {room}</h2>
        <button onClick={handleSummarize} disabled={isSummarizing}>
          {isSummarizing ? "Thinking..." : "✨ AI Summary"}
        </button>
      </div>

      {summary && (
        <div
          style={{
            background: "#f0f8ff",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
            border: "1px solid #007bff",
          }}
        >
          <strong>AI Summary:</strong> {summary}
        </div>
      )}

      <div style={chatBoxStyle}>
        {messageList.map((msg, index) => (
          <div
            key={index}
            style={{ textAlign: username === msg.sender ? "right" : "left" }}
          >
            <div
              style={{
                background: username === msg.sender ? "#007bff" : "#e0e0e0",
                color: username === msg.sender ? "white" : "black",
                padding: "5px 10px",
                borderRadius: "10px",
                display: "inline-block",
                margin: "5px",
              }}
            >
              <small style={{ fontSize: "0.7em", display: "block" }}>
                {msg.sender}
              </small>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "10px" }}
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
