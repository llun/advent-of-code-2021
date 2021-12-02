const fs = require("fs");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"))
  .toString("utf-8")
  .split("\n")
  .map((line) =>
    line.split(" ").map((v, i) => (i === 1 ? parseInt(v, 10) : v))
  );

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
