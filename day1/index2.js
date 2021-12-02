const fs = require("fs");
const path = require("path");

console.log(
  fs
    .readFileSync(path.join(__dirname, "input.txt"))
    .toString("utf8")
    .split("\n")
    .map((line) => parseInt(line, 10))
    .reduce(
      (acc, item, i, arr) => (i > 0 && [...acc, [arr[i - 1], item]]) || acc,
      []
    )
    .reduce((acc, pair) => (pair[1] > pair[0] ? acc + 1 : acc), 0)
);
