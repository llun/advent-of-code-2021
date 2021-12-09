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

const part2 = (input) => {
  const findBasin = (input, x, y) => {
    if (x < 0) return 0;
    if (y < 0) return 0;
    if (x >= input[0].length) return 0;
    if (y >= input.length) return 0;
    if (input[y][x] === 9) return 0;

    input[y][x] = 9;
    return (
      1 +
      // Left
      findBasin(input, x - 1, y) +
      // Top
      findBasin(input, x, y - 1) +
      // Right
      findBasin(input, x + 1, y) +
      // Bottom
      findBasin(input, x, y + 1)
    );
  };
  const allBasins = input.reduce((all, row, y) => {
    const basins = row.reduce((all, cell, x) => {
      const size = findBasin(input, x, y);
      return [...all, size];
    }, []);
    return [...all, ...basins];
  }, []);
  const sorted = allBasins.sort((a, b) => b - a);
  return sorted.slice(0, 3).reduce((a, b) => a * b, 1);
};

console.log(part2(getInput("./sample.txt")));
console.log(part2(getInput("./input.txt")));
