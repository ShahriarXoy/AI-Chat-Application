import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthIdentify/AuthContext";

function CreateGroupModal({ onClose, onGroupCreated }) {
  const { token } = useContext(AuthContext);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const memberArray = members
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m);

      const response = await axios.post(
        "http://localhost:3001/api/groups",
        {
          name: groupName,
          members: memberArray
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (onGroupCreated) onGroupCreated(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        borderRadius: "8px",
        padding: "25px",
        width: "90%",
        maxWidth: "400px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)"
      }}>
        <h2 style={{ marginTop: 0, marginBottom: "20px", fontSize: "20px" }}>
          Create a Group
        </h2>

        <form onSubmit={handleCreate}>
          {error && (
            <div style={{
              background: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Members (comma-separated usernames)
            </label>
            <textarea
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              placeholder="e.g., user1, user2, user3"
              rows="4"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
                fontFamily: "monospace"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px",
                background: "#6f42c1",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                fontWeight: "600"
              }}
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px",
                background: "#e9ecef",
                color: "#333",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600"
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupModal;
