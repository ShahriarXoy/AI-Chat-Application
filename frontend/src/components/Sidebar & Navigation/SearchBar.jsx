
import React, { useState } from "react";
import "./Chat.css";

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
    <div className="searchbar-container"> {/* Inline style removed, class added */}
      <input
        type="text"
        placeholder="Search users or groups..."
        value={query}
        onChange={handleChange}
        className="search-input" // Inline style removed, class added
      />
      {query && (
        <button
          onClick={handleClear}
          className="search-clear-btn" // Inline style removed, class added
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;