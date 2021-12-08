const fs = require("fs");

const getInput = (file) => {
  return fs
    .readFileSync(file)
    .toString("utf8")
    .split("\n")
    .map((line) => line.split("|").map((item) => item.trim().split(" ")));
};

const countLength = (input, length) =>
  input.filter((word) => word.length === length).length;

const part1 = (input) => {
  return [
    // digit 1
    input
      .map((line) => countLength(line[1], 2))
      .reduce((sum, count) => sum + count),
    // digit 4
    input
      .map((line) => countLength(line[1], 4))
      .reduce((sum, count) => sum + count),
    // digit 7
    input
      .map((line) => countLength(line[1], 3))
      .reduce((sum, count) => sum + count),
    // digit 8
    input
      .map((line) => countLength(line[1], 7))
      .reduce((sum, count) => sum + count),
  ].reduce((sum, count) => sum + count);
};
console.log(part1(getInput("./input.txt")));
