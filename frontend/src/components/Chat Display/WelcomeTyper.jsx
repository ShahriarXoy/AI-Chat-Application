import React, { useEffect, useState } from "react";

function WelcomeTyper({ messages = [], speed = 45, onStart }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const current = messages[msgIndex];
    const delay = isDeleting ? speed / 2 : speed;

    const id = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < current.length) {
          setDisplay(current.slice(0, charIndex + 1));
          setCharIndex((i) => i + 1);
        } else {
          // pause then start deleting
          setTimeout(() => setIsDeleting(true), 800);
        }
      } else {
        if (charIndex > 0) {
          setDisplay(current.slice(0, charIndex - 1));
          setCharIndex((i) => i - 1);
        } else {
          setIsDeleting(false);
          setMsgIndex((i) => (i + 1) % messages.length);
        }
      }
    }, delay);

    return () => clearTimeout(id);
  }, [charIndex, isDeleting, msgIndex, messages, speed]);

  return (
    <div style={{ margin: "auto", textAlign: "center", color: "#666", padding: "20px" }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(111, 66, 193, 0.1) 0%, rgba(90, 54, 158, 0.05) 100%)",
        padding: "40px 30px",
        borderRadius: "16px",
        maxWidth: "500px",
        margin: "0 auto",
      }}>
        <h2 style={{ 
          fontSize: "2.8rem", 
          color: "#6f42c1", 
          margin: "0 0 15px 0",
          fontWeight: "700",
          minHeight: "60px"
        }}>
          {display}
          <span style={{ 
            color: "#5a369e", 
            marginLeft: 8,
            animation: "blink 1s infinite"
          }}>|</span>
        </h2>
        <p style={{ 
          marginTop: 20,
          fontSize: "16px",
          color: "#999",
          marginBottom: 30
        }}>Start a conversation by clicking on a contact</p>
        <button
          onClick={onStart}
          style={{
            padding: "12px 28px",
            background: "linear-gradient(135deg, #6f42c1 0%, #5a369e 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "24px",
            cursor: "pointer",
            fontSize: 16,
            fontWeight: "700",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(111, 66, 193, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 6px 16px rgba(111, 66, 193, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 12px rgba(111, 66, 193, 0.3)";
          }}
        >
          ✨ Start Chatting
        </button>
      </div>

      <style>{`
        @keyframes blink {
          0%, 49%, 100% { opacity: 1; }
          50%, 99% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default WelcomeTyper;
