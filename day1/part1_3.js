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
