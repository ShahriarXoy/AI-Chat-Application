import React from "react";
import LoadingSkeleton from "./LoadingSkeleton";

const SummaryPanel = ({ summary, isSummarizing, onClose }) => {
  // If we have nothing to show, return nothing (invisible)
  if (!summary && !isSummarizing) return null;

  return (
    <div
      style={{
        background: "#f8f9fa",
        padding: "15px",
        borderRadius: "12px",
        marginBottom: "20px",
        border: "1px solid #e9ecef",
        position: "relative",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
      }}
    >
      {/* Close Button */}
      {summary && (
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: "#666",
          }}
        >
          &times;
        </button>
      )}

      <h4 style={{ margin: "0 0 10px 0", color: "#6f42c1" }}>📝 AI Summary</h4>

      {isSummarizing ? (
        <LoadingSkeleton />
      ) : (
        <div style={{ lineHeight: "1.6", color: "#333", whiteSpace: "pre-line" }}>
          {summary}
        </div>
      )}
    </div>
  );
};

export default SummaryPanel;
