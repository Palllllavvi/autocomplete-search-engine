// backend/ds/Trie.js

const PriorityQueue = require("./PriorityQueue");

class TrieNode {
  constructor() {
    this.children = {};       // char -> TrieNode
    this.isEndOfWord = false;
    this.frequency = 0;       // popularity of the word ending here
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(term, frequency = 1) {
    let node = this.root;
    for (const ch of term.toLowerCase()) {
      if (!node.children[ch]) {
        node.children[ch] = new TrieNode();
      }
      node = node.children[ch];
    }
    node.isEndOfWord = true;
    node.frequency += frequency; // if inserted again, increase popularity
  }

  /**
   * Helper: navigate to node representing the prefix.
   */
  _getNodeForPrefix(prefix) {
    let node = this.root;
    for (const ch of prefix.toLowerCase()) {
      if (!node.children[ch]) return null;
      node = node.children[ch];
    }
    return node;
  }

  /**
   * Get top `limit` suggestions for a given prefix using DFS + min-heap
   * Time:
   *   - O(L) to reach prefix node (L = prefix length)
   *   - O(M log k) to traverse M matching words and maintain top k
   */
  getSuggestions(prefix, limit = 5) {
    const node = this._getNodeForPrefix(prefix);
    if (!node) return [];

    // min-heap by frequency; we keep size <= limit
    const pq = new PriorityQueue((a, b) => a.frequency - b.frequency);

    const dfs = (currentNode, currentWord) => {
      if (currentNode.isEndOfWord) {
        const item = { term: currentWord, frequency: currentNode.frequency };

        if (pq.size() < limit) {
          pq.push(item);
        } else if (item.frequency > pq.peek().frequency) {
          pq.pop();
          pq.push(item);
        }
      }

      for (const ch in currentNode.children) {
        dfs(currentNode.children[ch], currentWord + ch);
      }
    };

    dfs(node, prefix.toLowerCase());

    // PriorityQueue currently has smallest frequency at top.
    const result = [];
    while (!pq.isEmpty()) {
      result.push(pq.pop());
    }
    // we want highest frequency first
    result.reverse();
    return result;
  }
}

module.exports = Trie;
