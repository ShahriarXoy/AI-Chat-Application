import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthIdentify/AuthContext"
import "./Chat.css"; // FIX: ধরে নেওয়া হলো Chat.css ফাইলটি src ফোল্ডারে আছে

function ChatList({ onSelectUser, selectedUserId = null, onlineUserIds = [] }) {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("🔄 Fetching users with token:", token ? "✅" : "❌");
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Users fetched:", res.data);
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err.message, err.response?.data);
        setError(err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      console.warn("⚠️ No token available");
      setLoading(false);
    }
  }, [token]);

  if (loading) return <div className="chat-loading">Loading users...</div>;
  if (error) return <div className="chat-loading" style={{ color: "red" }}>❌ {error}</div>;
  if (!users || users.length === 0) return <div className="chat-loading">No users available</div>;

  return (
    <div className="chatlist-container">
      {users.map((user) => {
        const isOnline = onlineUserIds.includes(user._id);
        return (
        <div
          key={user._id}
          onClick={() => {
            console.log('ChatList click:', user);
            onSelectUser && onSelectUser(user);
          }}
          className={`chatlist-item ${selectedUserId === user._id ? 'active-chat' : ''}`} // mark active
        >
          {/* Avatar with Profile Picture */}
          <div className="chat-avatar" style={{
            background: user.profilePicture 
              ? `url(${user.profilePicture}) center / cover` 
              : "linear-gradient(135deg, #6f42c1 0%, #5a369e 100%)",
            color: "white",
          }}>
            {!user.profilePicture && user.username[0].toUpperCase()}
          </div>
          
          <div className="chatlist-info">
            <div className="chatlist-username">{user.username}</div>
            <div className="chatlist-status">{isOnline ? 'Online' : 'Tap to chat'}</div>
          </div>
          {isOnline && <div className="online-indicator" aria-hidden />}
        </div>
        );
      })}
    </div>
  );
}

export default ChatList;