import React from "react";
import AISummaryButton from "../AI Feature/AISummaryButton";
import StatusIndicator from "./StatusIndicator";

function ChatHeader({ selectedUser, onlineUsers, handleSummarize, isSummarizing }) {
  if (!selectedUser) return null;

  // ✅ normalize onlineUsers into an array of string IDs
  const onlineIds = (onlineUsers || []).map((u) => {
    if (typeof u === "string" || typeof u === "number") return String(u);
    return String(u.userId || u._id || u.id || "");
  });

  // ✅ normalize selected user id
  const selectedId = String(selectedUser._id || selectedUser.userId || selectedUser.id || "");

  const isOnline = onlineIds.includes(selectedId);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        paddingBottom: "15px",
        borderBottom: "2px solid #e0e0e0",
      }}
    >
      <div>
        <h2 style={{ margin: "0 0 5px 0", color: "#1a1a1a", fontSize: "24px" }}>
          Chat with {selectedUser.username}
        </h2>

        <StatusIndicator isOnline={isOnline} />
      </div>

      <AISummaryButton onClick={handleSummarize} isSummarizing={isSummarizing} />
    </div>
  );
}

export default ChatHeader;
