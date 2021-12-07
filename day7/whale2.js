const fs = require("fs");

const input = fs
  .readFileSync("./input.txt")
  .toString("utf8")
  .split(",")
  .map((item) => parseInt(item, 10));

const findMedian = (input) => {
  const sorted = input.slice(0).sort((a, b) => a - b);
  if (sorted.length % 2 === 1) {
    return sorted[Math.ceil(sorted.length / 2)];
  }

  const i = sorted.length / 2;
  return (sorted[i] + sorted[i - 1]) / 2;
};

const findMean = (input) => {
  return input.reduce((sum, v) => sum + v, 0) / input.length;
};

const median = findMedian(input);
console.log(input.reduce((sum, i) => sum + Math.abs(i - median), 0));

const mean = findMean(input);
console.log(
  Math.ceil(
    input.reduce(
      (sum, i) => sum + (Math.abs(i - mean) * (Math.abs(i - mean) + 1)) / 2,
      0
    )
  )
);
