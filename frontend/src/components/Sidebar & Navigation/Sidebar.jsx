import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import ChatList from "./ChatList";
import SearchBar from "./SearchBar";
import CreateGroupModal from "./CreateGroupModal";
import "./Chat.css";

function Sidebar({ onSelectUser, onSelectGroup }) {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
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