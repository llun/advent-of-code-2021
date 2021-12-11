const fs = require("fs");

const getInput = (fileName) => {
  return fs
    .readFileSync(fileName)
    .toString("utf-8")
    .trim()
    .split("\n")
    .map((line) => line.split("").map((val) => parseInt(val, 10)));
};

const increaseCellValue = (input, row, column, flashed = new Set()) => {
  if (row < 0 || row >= input.length) return;
  if (column < 0 || column >= input[0].length) return;
  if (flashed.has(`${row}${column}`)) return;

  const value = input[row][column];
  const newValue = value + 1;
  input[row][column] = newValue;
  if (newValue <= 9) {
    return;
  }

  flashed.add(`${row}${column}`);
  input[row][column] = 0;
  increaseCellValue(input, row - 1, column - 1, flashed);
  increaseCellValue(input, row - 1, column, flashed);
  increaseCellValue(input, row - 1, column + 1, flashed);
  increaseCellValue(input, row, column - 1, flashed);
  increaseCellValue(input, row, column + 1, flashed);
  increaseCellValue(input, row + 1, column - 1, flashed);
  increaseCellValue(input, row + 1, column, flashed);
  increaseCellValue(input, row + 1, column + 1, flashed);
};

const iterate = (input) => {
  const flashed = new Set();
  for (let r = 0; r < input.length; r++) {
    const row = input[r];
    for (let c = 0; c < row.length; c++) {
      increaseCellValue(input, r, c, flashed);
    }
  }
  return flashed.size;
};

const part1 = (input) => {
  let totalFlashed = 0;
  for (let i = 0; i < 100; i++) {
    totalFlashed += iterate(input);
  }
  return totalFlashed;
};

console.log("Part1");
console.log(part1(getInput("./sample.txt")));
console.log(part1(getInput("./input.txt")));

const part2 = (input) => {
  let step = 1;
  while (true) {
    const flashedCount = iterate(input);
    if (flashedCount === 100) {
      break;
    }
    step++;
  }
  return step;
};
console.log("Part2");
console.log(part2(getInput("./sample.txt")));
console.log(part2(getInput("./input.txt")));
