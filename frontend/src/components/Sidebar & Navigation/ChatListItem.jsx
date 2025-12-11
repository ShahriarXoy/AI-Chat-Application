import React from "react";
import PropTypes from "prop-types";

function ChatListItem({ user, onSelect, isActive }) {
  const username = (user && user.username) || "Unknown";
  const email = (user && user.email) || "";
  const initial = username[0] ? username[0].toUpperCase() : "?";
  const online = Boolean(user && user.isOnline);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect && onSelect(user);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={!!isActive}
      onClick={() => onSelect && onSelect(user)}
      onKeyDown={handleKeyDown}
      title={username}
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
      <div
        style={{
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
        }}
        aria-hidden
      >
        {initial}
      </div>

      {/* User Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: "600",
            fontSize: "14px",
            color: "#333",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {username}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#999",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {email}
        </div>
      </div>

      {/* Status Indicator */}
      {online && (
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#28a745",
            flexShrink: 0
          }}
          aria-hidden
        />
      )}
    </div>
  );
}

ChatListItem.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    isOnline: PropTypes.bool
  }),
  onSelect: PropTypes.func,
  isActive: PropTypes.bool
};

ChatListItem.defaultProps = {
  user: { username: "Unknown", email: "", isOnline: false },
  onSelect: null,
  isActive: false
};

export default ChatListItem;
