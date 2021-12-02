const fs = require("fs");
const path = require("path");

const lines = fs
  .readFileSync(path.join(__dirname, "input.txt"))
  .toString("utf-8")
  .trim()
  .split("\n")
  .map((item) => parseInt(item, 10));

// Common
function count(lines, diff) {
  return lines
    .map((_, index, arr) => arr[index + diff] - arr[index])
    .filter((item) => item > 0).length;
}

// Part 1
console.log(
  lines
    .map((value, index, arr) => value - (arr[index - 1] || 0))
    .filter((item) => item > 0).length - 1
);

console.log(
  lines
    .map((_, index, arr) => arr[index + 1] - arr[index])
    .filter((item) => item > 0).length
);

console.log(count(lines, 1));

// Part 2
console.log(
  lines
    .map((_, index, arr) => arr.slice(index, index + 3))
    .filter((item) => item.length === 3)
    .map((items) => items.reduce((a, b) => a + b))
    .map((value, index, arr) => value - (arr[index - 1] || 0))
    .filter((item) => item > 0).length - 1
);

// Part 2 another solution
console.log(
  lines
    // B + C + D > A + B + C = D > A (both side have B + C)
    .map((_, index, arr) => arr[index + 3] - arr[index])
    .filter((item) => item > 0).length
);

console.log(count(lines, 3));
