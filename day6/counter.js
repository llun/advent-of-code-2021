const fs = require("fs");

const fish = fs
  .readFileSync("./input.txt")
  .toString("utf8")
  .split(",")
  .map((f) => parseInt(f, 10));

function countAfter(days) {
  const counters = fish.reduce((acc, fish) => {
    acc[fish]++;
    return acc;
  }, new Array(9).fill(0));

  let [t0, t1, t2, t3, t4, t5, t6, t7, t8] = counters;
  for (let i = 0; i < days; i++) {
    let count = t0;
    t0 = t1;
    t1 = t2;
    t2 = t3;
    t3 = t4;
    t4 = t5;
    t5 = t6;
    t6 = t7 + count;
    t7 = t8;
    t8 = count;
  }
  return t0 + t1 + t2 + t3 + t4 + t5 + t6 + t7 + t8;
}
console.log(countAfter(80));
console.log(countAfter(256));
