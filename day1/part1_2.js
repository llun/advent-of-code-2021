const fs = require("fs");
const path = require("path");

function window(size) {
  return function (acc, item, i, arr) {
    if (i > arr.length - size) return acc;
    return [...acc, arr.slice(i, i + size)];
  };
}

console.log(
  fs
    .readFileSync(path.join(__dirname, "input.txt"))
    .toString("utf8")
    .split("\n")
    .map((line) => parseInt(line, 10))
    .reduce(window(2), [])
    .reduce((acc, pair) => (pair[1] > pair[0] ? acc + 1 : acc), 0)
);
