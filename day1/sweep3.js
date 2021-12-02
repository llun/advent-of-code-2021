const fs = require("fs");
const path = require("path");

console.log(
  fs
    .readFileSync(path.join(__dirname, "input.txt"))
    .toString("utf-8")
    .trim()
    .split("\n")
    .map((item) => parseInt(item, 10))
    .map((value, index, arr) => value - (arr[index - 1] || 0))
    .filter((item) => item > 0).length - 1
);

console.log(
  fs
    .readFileSync(path.join(__dirname, "input.txt"))
    .toString("utf-8")
    .trim()
    .split("\n")
    .map((item) => parseInt(item, 10))
    .map((item, index, arr) => arr.slice(index, index + 3))
    .filter((item) => item.length === 3)
    .map((items) => items.reduce((a, b) => a + b))
    .map((value, index, arr) => value - (arr[index - 1] || 0))
    .filter((item) => item > 0).length - 1
);

console.log(
  fs
    .readFileSync(path.join(__dirname, "input.txt"))
    .toString("utf-8")
    .trim()
    .split("\n")
    .map((item) => parseInt(item, 10))
    // B + C + D > A + B + C = D > A (both side have B + C)
    .map((_, index, arr) => arr[index + 3] - arr[index])
    .filter((item) => item > 0).length
);
