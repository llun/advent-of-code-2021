const fs = require("fs");
const path = require("path");

console.log(
  fs
    .readFileSync(path.join(__dirname, "input.txt"))
    .toString("utf-8")
    .trim()
    .split("\n")
    .map((item) => parseInt(item, 10))
    .reduce(
      (acc, item, index, arr) =>
        index > 0 && item > arr[index - 1] ? acc + 1 : acc,
      0
    )
);
