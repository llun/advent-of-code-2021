const fs = require("fs");

const getInput = (fileName) => {
  const matrix = fs
    .readFileSync(fileName)
    .toString()
    .trim()
    .split("\n")
    .map((line) => line.split("").map((val) => parseInt(val, 10)));
  return matrix;
};

const part1 = (input) => {
  const isLowPoint = (input, x, y) => {
    const point = input[y][x];
    const top = y - 1 < 0 ? Number.MAX_SAFE_INTEGER : input[y - 1][x];
    const left = x - 1 < 0 ? Number.MAX_SAFE_INTEGER : input[y][x - 1];
    const bottom =
      y + 1 >= input.length ? Number.MAX_SAFE_INTEGER : input[y + 1][x];
    const right =
      x + 1 >= input[0].length ? Number.MAX_SAFE_INTEGER : input[y][x + 1];
    return [
      [top, left, right, bottom].reduce(
        (isLowPoint, adjacent) => isLowPoint && point < adjacent,
        true
      ),
      point,
      1 + point,
    ];
  };
  const riskSum = input.reduce((sum, row, y) => {
    const rowRisk = row.reduce((sum, cell, x) => {
      const [lowPoint, point, risk] = isLowPoint(input, x, y);
      if (lowPoint) return sum + risk;
      return sum;
    }, 0);
    return sum + rowRisk;
  }, 0);
  return riskSum;
};

console.log("Part1");
console.log(part1(getInput("./sample.txt")));
console.log(part1(getInput("./input.txt")));
