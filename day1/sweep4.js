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

console.log(count(lines, 1), count(lines, 3));
