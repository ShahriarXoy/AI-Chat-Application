import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthIdentify/AuthContext";
import "./Chat.css";

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
        "http://localhost:5000/api/groups",
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
    <div className="modal-overlay"> {/* Inline style removed, class added */}
      <div className="modal-content"> {/* Inline style removed, class added */}
        <h2 className="modal-title">
          Create a Group
        </h2>

        <form onSubmit={handleCreate}>
          {error && (
            <div className="modal-error">
              {error}
            </div>
          )}

          <div className="modal-form-group">
            <label className="modal-label">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="modal-input" // Inline style removed, class added
            />
          </div>

          <div className="modal-form-group">
            <label className="modal-label">
              Members (comma-separated usernames)
            </label>
            <textarea
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              placeholder="e.g., user1, user2, user3"
              rows="4"
              className="modal-textarea" // Inline style removed, class added
            />
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              disabled={loading}
              className="modal-submit-btn" // Inline style removed, class added
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="modal-cancel-btn" // Inline style removed, class added
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