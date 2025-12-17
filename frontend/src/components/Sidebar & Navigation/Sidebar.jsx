import React, { useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom"; 
=======
>>>>>>> e67230f1ad2502e3fceda8b967ed55cbb39fdaa4
import ChatList from "./ChatList";
import SearchBar from "./SearchBar";
import CreateGroupModal from "./CreateGroupModal";
import "./Chat.css";

function Sidebar({ onSelectUser, onSelectGroup }) {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
<<<<<<< HEAD
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem("userInfo"); 
    navigate("/"); 
  };

  return (
    <div className="sidebar-container">
      
      <div className="sidebar-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="sidebar-title">Chats</h2>
        
        {}
        <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="create-group-btn"
              title="Create new group"
            >
              + Group
            </button>
  
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#e74c3c", 
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold"
              }}
              title="Logout"
            >
              Logout
            </button>
        </div>
      </div>

      
      <SearchBar />

      
      <ChatList onSelectUser={onSelectUser} />

      
=======

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
>>>>>>> e67230f1ad2502e3fceda8b967ed55cbb39fdaa4
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