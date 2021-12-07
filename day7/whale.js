const fs = require("fs");

const input = fs
  .readFileSync("./input.txt")
  .toString("utf8")
  .split(",")
  .map((item) => parseInt(item, 10));

const findLeastCost = (input) => {
  const sortedInput = input.slice(0).sort((a, b) => a - b);
  const min = sortedInput[0];
  const max = sortedInput[sortedInput.length - 1];

  let leastCost = Number.MAX_SAFE_INTEGER;
  for (let i = min; i <= max; i++) {
    const cost = input.reduce((sum, val) => sum + Math.abs(val - i), 0);
    leastCost = cost < leastCost ? cost : leastCost;
  }
  return leastCost;
};
console.log(findLeastCost(input));
