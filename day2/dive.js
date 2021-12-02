const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"))
  .toString("utf-8")
  .split("\n")
  .map((line) =>
    line.split(" ").map((v, i) => (i === 1 ? parseInt(v, 10) : v))
  );

// Part 1
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

// Part 2
const { aim, position, depth } = input.reduce(
  (acc, item) => {
    const [command, value] = item;
    const { aim, position, depth } = acc;
    switch (command) {
      case "forward":
        return { aim, position: position + value, depth: depth + value * aim };
      case "down":
        return { aim: aim + value, position, depth };
      case "up":
        return { aim: aim - value, position, depth };
    }
    return acc;
  },
  {
    aim: 0,
    position: 0,
    depth: 0,
  }
);
console.log(aim, position, depth, position * depth);
