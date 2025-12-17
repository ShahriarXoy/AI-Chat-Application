import React from "react";
import PropTypes from "prop-types";
import "./Chat.css";

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
      className={`chatlist-item ${isActive ? 'active-chat' : ''}`} // Inline style removed, class added
      // onMouseEnter/onMouseLeave style handlers removed
    >
      {/* Avatar */}
      <div
        className="chat-avatar" // Inline style removed, class added
        aria-hidden
      >
        {initial}
      </div>

      {/* User Info */}
      <div className="chatlist-info flex-grow">
        <div className="chatlist-username">{username}</div>
        <div className="chatlist-email">{email}</div>
      </div>

      {/* Status Indicator */}
      {online && (
        <div className="online-indicator" aria-hidden /> /* Inline style removed, class added */
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