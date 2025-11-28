// backend/ds/PriorityQueue.js

class PriorityQueue {
  constructor(compareFn) {
    // compareFn(a, b) < 0 means a has higher priority than b
    this.data = [];
    this.compare = compareFn || ((a, b) => a - b);
  }

  size() {
    return this.data.length;
  }

  isEmpty() {
    return this.data.length === 0;
  }

  peek() {
    return this.data[0];
  }

  push(item) {
    this.data.push(item);
    this._heapifyUp(this.data.length - 1);
  }

  pop() {
    if (this.isEmpty()) return null;
    const top = this.data[0];
    const last = this.data.pop();
    if (!this.isEmpty()) {
      this.data[0] = last;
      this._heapifyDown(0);
    }
    return top;
  }

  _heapifyUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.data[index], this.data[parent]) < 0) {
        [this.data[index], this.data[parent]] = [this.data[parent], this.data[index]];
        index = parent;
      } else break;
    }
  }

  _heapifyDown(index) {
    const n = this.data.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;

      if (left < n && this.compare(this.data[left], this.data[smallest]) < 0) {
        smallest = left;
      }
      if (right < n && this.compare(this.data[right], this.data[smallest]) < 0) {
        smallest = right;
      }
      if (smallest !== index) {
        [this.data[index], this.data[smallest]] = [this.data[smallest], this.data[index]];
        index = smallest;
      } else break;
    }
  }
}

module.exports = PriorityQueue;
