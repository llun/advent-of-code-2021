const fs = require("fs");
const { FibonacciHeap } = require("@tyriar/fibonacci-heap");

const getInput = (fileName) => {
  return fs
    .readFileSync(fileName)
    .toString("utf-8")
    .trim()
    .split("\n")
    .map((line) => line.split("").map((item) => parseInt(item, 10)));
};

class Queue {
  constructor() {
    this.heap = new FibonacciHeap();
  }

  push(cost, node) {
    this.heap.insert(cost, node);
  }

  shift() {
    const head = this.heap.extractMinimum();
    const cost = parseInt(head.key);
    const node = head.value;
    return [cost, node];
  }

  get length() {
    return this.heap.size();
  }
}

const part1 = (input) => {
  const matrix = input;
  const start = [0, 0];
  const end = [matrix[0].length - 1, matrix.length - 1];

  const getNeighbourNodeWithCost = (matrix, visited, node) => {
    const [cost, position] = node;
    const [x, y] = position;

    const top = y - 1 < 0 ? null : [x, y - 1];
    const left = x - 1 < 0 ? null : [x - 1, y];
    const right = x + 1 >= matrix[0].length ? null : [x + 1, y];
    const bottom = y + 1 >= matrix.length ? null : [x, y + 1];
    return [top, left, right, bottom]
      .filter((item) => item)
      .filter((item) => !visited.has(item.join("")))
      .map((item) => {
        const [x, y] = item;
        return [matrix[y][x] + cost, item];
      });
  };

  const queue = new Queue();
  queue.push(0, start);
  const visited = new Set();

  while (queue.length > 0) {
    const node = queue.shift();
    const [cost, coordinate] = node;
    if (coordinate.join("") === end.join("")) {
      return cost;
    }
    visited.add(coordinate.join(""));
    const nodes = getNeighbourNodeWithCost(matrix, visited, node);
    for (const node of nodes) {
      queue.push(...node);
    }
  }
};

console.log("Part1");
console.log(part1(getInput("./sample.txt")));
console.log(part1(getInput("./input.txt")));
