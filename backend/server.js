// backend/server.js

const express = require("express");
const cors = require("cors");
const Trie = require("./ds/Trie");
const sampleQueries = require("./data/sampleQueries");



const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// ---- Initialize Trie with sample data ----
const searchTrie = new Trie();

sampleQueries.forEach((item) => {
  searchTrie.insert(item.term, item.frequency);
});

console.log("Trie initialized with sample queries.");

// ---- Routes ----

// Health check
app.get("/", (req, res) => {
  res.send("Autocomplete Search Engine Backend is running 🚀");
});

// Main autocomplete API
// Example: GET /api/search?query=mic&limit=5
app.get("/api/search", (req, res) => {
  const query = (req.query.query || "").trim();
  const limit = parseInt(req.query.limit || "5", 10);

  if (!query) {
    return res.status(400).json({ error: "query parameter is required" });
  }

  const suggestions = searchTrie.getSuggestions(query, limit);
  return res.json({
    query,
    limit,
    count: suggestions.length,
    suggestions,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
