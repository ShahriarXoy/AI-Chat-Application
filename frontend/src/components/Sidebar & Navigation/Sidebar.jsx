import React, { useState } from "react";
import ChatList from "./ChatList";
import SearchBar from "./SearchBar";
import CreateGroupModal from "./CreateGroupModal";

function Sidebar({ onSelectUser, onSelectGroup }) {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  return (
    <div style={{
      width: "300px",
      height: "100vh",
      borderRight: "1px solid #ddd",
      display: "flex",
      flexDirection: "column",
      background: "#ffffff"
    }}>
      {/* Header */}
      <div style={{
        padding: "15px",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>Chats</h2>
        <button
          onClick={() => setIsGroupModalOpen(true)}
          style={{
            background: "#6f42c1",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold"
          }}
          title="Create new group"
        >
          + Group
        </button>
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Chat List */}
      <ChatList onSelectUser={onSelectUser} />

      {/* Create Group Modal */}
      {isGroupModalOpen && (
        <CreateGroupModal
          onClose={() => setIsGroupModalOpen(false)}
          onGroupCreated={onSelectGroup}
        />
      )}
    </div>
  );
}

export default Sidebar;
