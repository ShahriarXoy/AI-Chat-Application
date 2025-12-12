import React, { useState } from "react";
import ChatList from "./ChatList";
import SearchBar from "./SearchBar";
import CreateGroupModal from "./CreateGroupModal";
import "./Chat.css";

function Sidebar({ onSelectUser, onSelectGroup }) {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  return (
    <div className="sidebar-container"> {/* Inline style removed, class added */}
      {/* Header */}
      <div className="sidebar-header"> {/* Inline style removed, class added */}
        <h2 className="sidebar-title">Chats</h2> {/* Inline style removed, class added */}
        <button
          onClick={() => setIsGroupModalOpen(true)}
          className="create-group-btn" // Inline style removed, class added
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