import React from "react";
import StatusIndicator from "./StatusIndicator";

function MessageBubble({ message, isOwnMessage, senderProfilePicture }) {
  // Safety check
  if (!message) return null;

  const formatTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const getSenderInitial = (sender) => {
    return typeof sender === "string" ? sender[0].toUpperCase() : "?";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        marginBottom: "12px",
        gap: "8px",
        animation: "fadeIn 0.3s ease",
      }}
    >
      {/* Profile Picture - Only for other messages */}
      {!isOwnMessage && (
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: senderProfilePicture
              ? `url(${senderProfilePicture}) center / cover`
              : "linear-gradient(135deg, #6f42c1 0%, #5a369e 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "700",
            flexShrink: 0,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          {!senderProfilePicture && getSenderInitial(message.sender)}
        </div>
      )}

      <div
        style={{
          background: isOwnMessage
            ? "linear-gradient(135deg, #6f42c1 0%, #5a369e 100%)"
            : "#f0f0f0",
          color: isOwnMessage ? "white" : "#1a1a1a",
          padding: "10px 14px",
          borderRadius: isOwnMessage ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
          maxWidth: "65%",
          boxShadow: isOwnMessage
            ? "0 4px 12px rgba(111, 66, 193, 0.2)"
            : "0 2px 8px rgba(0, 0, 0, 0.1)",
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        <small
          style={{
            fontSize: "0.75em",
            display: "block",
            marginBottom: "4px",
            opacity: 0.9,
            fontWeight: "600",
            color: isOwnMessage ? "#e0d0ff" : "#666",
          }}
        >
          {message.sender}
        </small>

        <div style={{ fontSize: "0.95em", lineHeight: "1.4" }}>{message.content}</div>

        {/* Time + Status Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "6px",
            marginTop: "4px",
            opacity: 0.85,
          }}
        >
          <small
            style={{
              fontSize: "0.7em",
              color: isOwnMessage ? "#d0c4ff" : "#999",
              textAlign: "right",
            }}
          >
            {formatTime(message.time)}
          </small>

          {/* Status indicator only for your own messages */}
          {isOwnMessage && (
            <StatusIndicator
              status={message.status}
              delivered={message.delivered}
              seen={message.seen}
              read={message.read}
              size={13}
              tone="dark"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
