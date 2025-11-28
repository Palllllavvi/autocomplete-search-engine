import React from "react";
import SearchBar from "./components/SearchBar";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Autocomplete Search Engine</h1>
        <p className="subtitle">
          Data-structures powered search using <span>Trie</span> + <span>Priority Queue</span>
        </p>
      </header>

      <main className="main">
        <SearchBar />
      </main>
    </div>
  );
}

export default App;
