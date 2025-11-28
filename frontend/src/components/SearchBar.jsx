import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000"; // backend

function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1); // for keyboard

  // Debounced API call whenever query changes
  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      setError("");
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchSuggestions(query);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  const fetchSuggestions = async (q) => {
    try {
      setIsLoading(true);
      setError("");

      const limit = 5;
      const res = await fetch(
        `${API_BASE_URL}/api/search?query=${encodeURIComponent(q)}&limit=${limit}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setActiveIndex(-1);
    } catch (err) {
      console.error(err);
      setError("Could not load suggestions. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (term) => {
    setQuery(term);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        const term = suggestions[activeIndex].term;
        handleSuggestionClick(term);
      }
    }
  };

  // highlight the part that matches the query
  const renderHighlighted = (term) => {
    const q = query.toLowerCase();
    const idx = term.toLowerCase().indexOf(q);
    if (idx === -1) return term;

    const before = term.slice(0, idx);
    const match = term.slice(idx, idx + q.length);
    const after = term.slice(idx + q.length);

    return (
      <>
        {before}
        <span className="highlight">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div className="search-container">
      <label className="search-label">Search anything…</label>

      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Start typing: machine, data structures, algorithms…"
          className="search-input"
        />
        {isLoading && <div className="loader" />}
      </div>

      {error && <p className="error">{error}</p>}

      {query && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((s, idx) => (
            <li
              key={s.term}
              className={
                "suggestion-item" +
                (idx === activeIndex ? " suggestion-item-active" : "")
              }
              onClick={() => handleSuggestionClick(s.term)}
            >
              <div className="suggestion-term">
                {renderHighlighted(s.term)}
              </div>
              <div className="suggestion-meta">
                Frequency: {s.frequency}
              </div>
            </li>
          ))}
        </ul>
      )}

      {query && !isLoading && suggestions.length === 0 && !error && (
        <p className="no-results">No suggestions found.</p>
      )}
    </div>
  );
}

export default SearchBar;
