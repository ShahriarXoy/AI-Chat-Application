import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

// Connect to backend (ensure your server is running on port 3001)
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

    // Cleanup listener to prevent duplicates
    return () => socket.off("receive_message", handleReceive);
  }, []);

  // Generate AI Summary
  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      // Ensure this endpoint matches your backend route
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
        "Error generating summary. Ensure backend is running and has messages."
      );
    }
    setIsSummarizing(false);
  };

  // Basic Styles
  const containerStyle = {
    maxWidth: "600px",
    margin: "2rem auto",
    fontFamily: "Arial, sans-serif",
  };
  const chatBoxStyle = {
    border: "1px solid #ccc",
    height: "400px",
    overflowY: "scroll",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  };

  if (!joined) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}
      >
        <h3>Join A Chat Room</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "300px",
            margin: "0 auto",
          }}
        >
          <input
            type="text"
            placeholder="Username..."
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={joinRoom}
            style={{
              padding: "10px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Join Room
          </button>
        </div>
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
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ margin: 0 }}>Room: {room}</h2>
        <button
          onClick={handleSummarize}
          disabled={isSummarizing}
          style={{
            padding: "8px 15px",
            background: isSummarizing ? "#ccc" : "#6f42c1",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isSummarizing ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {isSummarizing ? "Thinking..." : "✨ AI Summary"}
        </button>
      </div>

      {summary && (
        <div
          style={{
            background: "#e2e3e5",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
            borderLeft: "5px solid #6f42c1",
            lineHeight: "1.5",
          }}
        >
          <strong
            style={{ display: "block", marginBottom: "5px", color: "#6f42c1" }}
          >
            AI Summary:
          </strong>
          {summary}
        </div>
      )}

      <div style={chatBoxStyle}>
        {messageList.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>
            No messages yet. Say hello!
          </p>
        ) : (
          messageList.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  username === msg.sender ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  background: username === msg.sender ? "#007bff" : "#e9ecef",
                  color: username === msg.sender ? "white" : "black",
                  padding: "8px 12px",
                  borderRadius: "15px",
                  maxWidth: "70%",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                <small
                  style={{
                    fontSize: "0.7em",
                    display: "block",
                    marginBottom: "2px",
                    opacity: 0.8,
                    fontWeight: "bold",
                    textAlign: username === msg.sender ? "right" : "left",
                  }}
                >
                  {msg.sender}
                </small>
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
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
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Chat />
    </div>
  );
}

export default App;
