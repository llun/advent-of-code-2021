const fs = require("fs");

const input = fs
  .readFileSync("./input.txt")
  .toString("utf-8")
  .trim()
  .split("\n")
  .map((item) => parseInt(item, 10));
const countIncrement = input.reduce(
  (acc, item, index) => (index > 0 && item > input[index - 1] ? acc + 1 : acc),
  0
);
console.log(countIncrement);
