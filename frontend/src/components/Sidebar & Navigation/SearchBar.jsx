import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <div style={{
      padding: "10px 15px",
      borderBottom: "1px solid #eee",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }}>
      <input
        type="text"
        placeholder="Search users or groups..."
        value={query}
        onChange={handleChange}
        style={{
          flex: 1,
          padding: "8px 12px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          fontSize: "14px",
          outline: "none",
          transition: "border-color 0.2s"
        }}
        onFocus={(e) => (e.target.style.borderColor = "#6f42c1")}
        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
      />
      {query && (
        <button
          onClick={handleClear}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            color: "#999",
            padding: 0
          }}
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
