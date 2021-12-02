const fs = require("fs");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"))
  .toString("utf-8")
  .split("\n")
  .map((line) =>
    line.split(" ").map((v, i) => (i === 1 ? parseInt(v, 10) : v))
  );

const forward = input
  .filter((item) => item[0] === "forward")
  .reduce((acc, item) => acc + item[1], 0);
const up = input
  .filter((item) => item[0] === "up")
  .reduce((acc, item) => acc + item[1], 0);
const down = input
  .filter((item) => item[0] === "down")
  .reduce((acc, item) => acc + item[1], 0);

console.log(forward, down - up, forward * (down - up));
