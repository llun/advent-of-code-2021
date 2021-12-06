const fs = require("fs");
const _ = require("lodash");

const fish = fs
  .readFileSync("./input.txt")
  .toString("utf8")
  .split(",")
  .map((f) => parseInt(f, 10));

function countAfter(fish, days) {
  const data = new Map();
  const getNext = (pair) => {
    const key = pair.join(",");
    if (data.has(key)) return data.get(key);
    const [next, days] = pair;
    if (days - next - 1 < 0) return 0;
    const newDays = days - next - 1;
    const val = 1 + getNext([6, newDays]) + getNext([8, newDays]);
    data.set(key, val);
    return val;
  };
  const fishDays = fish.map((count) => [count, days]);
  return fishDays.reduce((sum, pair) => sum + getNext(pair), fishDays.length);
}

console.log(countAfter(fish, 80));
console.log(countAfter(fish, 256));
