import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthIdentify/AuthContext";

function ChatList({ onSelectUser }) {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUsers();
  }, [token]);

  if (loading) return <div style={{padding: "20px"}}>Loading users...</div>;

  return (
    <div style={{ overflowY: "auto", height: "100%" }}>
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => onSelectUser(user)}
          style={{
            padding: "15px",
            borderBottom: "1px solid #f0f0f0",
            cursor: "pointer",
            transition: "background 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9f9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
        >
          {/* Simple Avatar Circle */}
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%", 
            background: "#6f42c1", color: "white", display: "flex", 
            alignItems: "center", justifyContent: "center", fontWeight: "bold"
          }}>
            {user.username[0].toUpperCase()}
          </div>
          
          <div>
            <div style={{ fontWeight: "bold" }}>{user.username}</div>
            <div style={{ fontSize: "0.8em", color: "#888" }}>Tap to chat</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatList;