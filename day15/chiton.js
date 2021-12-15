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
    return head.value;
  }

  get length() {
    return this.heap.size();
  }
}

const manhattan = (origin, target, cost) => {
  const [x1, y1] = origin;
  const [x2, y2] = target;
  return (Math.abs(x2 - x1) + Math.abs(y2 - y1)) * cost;
};

const part1 = (input) => {
  const matrix = input;
  const start = [0, 0];
  const end = [matrix[0].length - 1, matrix.length - 1];

  const getNeighbourNodeWithCost = (matrix, visited, target, node) => {
    const [cost, totalRisk, position] = node;
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
        const h = manhattan(position, target, matrix[y][x]);
        const f = matrix[y][x] + cost;
        const n = f + h;
        return [n, [n, totalRisk + matrix[y][x], item]];
      });
  };

  const queue = new Queue();
  queue.push(0, [0, 0, start]);
  const visited = new Set();

  while (queue.length > 0) {
    const head = queue.shift();
    const [cost, totalRisk, position] = head;
    if (position.join("") === end.join("")) {
      return totalRisk;
    }
    visited.add(position.join(""));
    const nodes = getNeighbourNodeWithCost(matrix, visited, end, head);
    for (const node of nodes) {
      queue.push(...node);
    }
  }
};

console.log("Part1");
// console.log(part1(getInput("./sample.txt")));
console.log(part1(getInput("./input.txt")));

const part2 = (input) => {
  const increaseInput = (input) =>
    input.map((row) => row.map((cell) => cell + 1));

  const joinMatrixLeft = (matrix1, matrix2) =>
    matrix1.map((row, i) => [...row, ...matrix2[i]]);

  const joinMatrixBottom = (matrix1, matrix2) => [...matrix1, ...matrix2];

  let row = input;
  let current = input;
  for (let j = 0; j < 4; j++) {
    current = increaseInput(current);
    row = joinMatrixLeft(row, current);
  }
  current = row;
  for (let i = 0; i < 4; i++) {
    current = increaseInput(current);
    row = joinMatrixBottom(row, current);
  }
  return part1(row);
};

console.log("Part2");
// console.log(part2(getInput("./sample.txt")));
// console.log(part2(getInput("./input.txt")));
