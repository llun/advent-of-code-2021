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

const data = new Map();
const getCost = (n) => {
  if (n === 0) return 0;
  if (n === 1) return 1;
  if (data.has(n)) return data.get(n);
  const val = n + getCost(n - 1);
  data.set(n, val);
  return val;
};

const findLeastCost2 = (input) => {
  const sortedInput = input.slice(0).sort((a, b) => a - b);
  const min = sortedInput[0];
  const max = sortedInput[sortedInput.length - 1];

  let leastCost = Number.MAX_SAFE_INTEGER;
  for (let i = min; i <= max; i++) {
    const cost = input.reduce(
      (sum, val) => sum + getCost(Math.abs(val - i)),
      0
    );
    leastCost = cost < leastCost ? cost : leastCost;
  }
  return leastCost;
};

console.log(findLeastCost2(input));
