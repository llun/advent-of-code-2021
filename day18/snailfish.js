const util = require("util");
const fs = require("fs");
const pegjs = require("pegjs");

const parser = pegjs.generate(
  fs.readFileSync("./grammar.pegjs").toString("utf-8")
);

function maxLevel(array, level = 0) {
  return Math.max(
    ...array.map((item) => {
      if (Array.isArray(item)) return maxLevel(item, level + 1);
      return level;
    })
  );
}

function maxNumber(array) {
  return Math.max(...array.flat(10));
}

class Node {
  constructor(val, parent) {
    this.val = val;
    this.parent = parent;
  }
}

function primitiveToNode(array) {
  const parent = array.map((item) => {
    if (Array.isArray(item)) return primitiveToNode(item);
    return new Node(item);
  });
  for (let child of parent) {
    child.parent = parent;
  }
  return parent;
}

function nodeToPrimitive(array) {
  return array.map((item) => {
    if (Array.isArray(item)) return nodeToPrimitive(item);
    return item.val;
  });
}

function explode(array) {
  function explodeNode(nodes, level, root, parent = null) {
    if (level === 4) {
      const [left, right] = nodes;
      const flatten = root.flat(10);
      const leftIndex = flatten.indexOf(left);
      const rightIndex = flatten.indexOf(right);
      if (leftIndex > 0) {
        flatten[leftIndex - 1].val = flatten[leftIndex - 1].val + left.val;
      }
      if (rightIndex < flatten.length - 1) {
        flatten[rightIndex + 1].val = flatten[rightIndex + 1].val + right.val;
      }
      parent[parent.indexOf(nodes)] = new Node(0);
      return root;
    }

    for (let value of nodes) {
      if (Array.isArray(value)) {
        explodeNode(value, level + 1, root, nodes);
      }
    }
    return root;
  }

  const nodes = primitiveToNode(array);
  nodes.flat(10);
  root = nodes;

  return nodeToPrimitive(explodeNode(nodes, 0, root));
}

function split(array) {
  const tree = primitiveToNode(array);
  const flatten = tree.flat(10);
  const over = flatten.find((item) => item.val > 9);
  if (!over) return nodeToPrimitive(tree);
  const pair = [
    new Node(Math.floor(over.val / 2)),
    new Node(Math.ceil(over.val / 2)),
  ];
  const index = over.parent.indexOf(over);
  over.parent[index] = pair;
  return nodeToPrimitive(tree);
}

function add(n1, n2) {
  let result = [n1, n2];
  while (maxLevel(result) === 4 || maxNumber(result) > 9) {
    result = explode(result);
    result = split(result);
  }

  return result;
}

function magnitude(array) {
  const [left, right] = array;
  const leftValue = Array.isArray(left) ? magnitude(left) : left;
  const rightValue = Array.isArray(right) ? magnitude(right) : right;
  return 3 * leftValue + 2 * rightValue;
}

const getInput = (fileName) => {
  return fs
    .readFileSync(fileName)
    .toString("utf-8")
    .trim()
    .split("\n")
    .map((line) => parser.parse(line));
};

const part1 = (input) => {
  return magnitude(input.reduce((a, b) => add(a, b)));
};

console.log("Part1");
console.log(part1(getInput("./sample.txt")));
console.log(part1(getInput("./input.txt")));

const part2 = (input) => {
  const combinations = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      combinations.push([input[i], input[j]]);
    }
  }
  let largestMagnitude = Number.MIN_SAFE_INTEGER;
  for (let combination of combinations) {
    const v1 = magnitude(add(combination[0], combination[1]));
    const v2 = magnitude(add(combination[1], combination[0]));
    largestMagnitude = Math.max(v1, v2, largestMagnitude);
  }
  return largestMagnitude;
};

console.log("Part2");
console.log(part2(getInput("./sample.txt")));
console.log(part2(getInput("./input.txt")));
