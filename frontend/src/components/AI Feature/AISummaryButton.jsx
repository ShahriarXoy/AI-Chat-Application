import React from "react";

const AISummaryButton = ({ onClick, isSummarizing }) => {
  return (
    <button
      onClick={onClick}
      disabled={isSummarizing}
      style={{
        padding: "8px 16px",
        background: isSummarizing ? "#ccc" : "linear-gradient(135deg, #6f42c1, #8e44ad)",
        color: "white",
        border: "none",
        borderRadius: "20px",
        cursor: isSummarizing ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        transition: "transform 0.2s",
        fontWeight: "bold",
        fontSize: "0.9rem"
      }}
      // Simple hover effect using JS events
      onMouseEnter={(e) => !isSummarizing && (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {isSummarizing ? (
        <span>Thinking...</span>
      ) : (
        <>
          <span>✨</span> Summarize Chat
        </>
      )}
    </button>
  );
};

export default AISummaryButton;
