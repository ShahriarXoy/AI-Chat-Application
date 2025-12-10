import React from "react";

function ChatListItem({ user, onSelect, isActive }) {
  return (
    <div
      onClick={() => onSelect(user)}
      style={{
        padding: "12px 15px",
        borderBottom: "1px solid #f0f0f0",
        cursor: "pointer",
        background: isActive ? "#f0f0f0" : "transparent",
        transition: "background 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = "#f5f5f5";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
      }}
    >
      {/* Avatar */}
      <div style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "#6f42c1",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "14px",
        flexShrink: 0
      }}>
        {user.username ? user.username[0].toUpperCase() : "?"}
      </div>

      {/* User Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: "600",
          fontSize: "14px",
          color: "#333",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          {user.username}
        </div>
        <div style={{
          fontSize: "12px",
          color: "#999",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          {user.email}
        </div>
      </div>

      {/* Status Indicator */}
      {user.isOnline && (
        <div style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#28a745",
          flexShrink: 0
        }} />
      )}
    </div>
  );
}

export default ChatListItem;
