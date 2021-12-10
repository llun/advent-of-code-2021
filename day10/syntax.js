const fs = require("fs");

const getInput = (fileName) => {
  return fs.readFileSync(fileName).toString("utf8").split("\n");
};

const map = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};
const open = new Set(Object.values(map));
const part1 = (input) => {
  const score = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };
  const scores = input.map((line) => {
    const stack = [];
    for (let char of line) {
      if (map[char]) stack.push(char);
      else {
        const lastOpen = stack.pop();
        if (map[lastOpen] !== char) return score[char];
      }
    }
    return 0;
  });
  return scores.reduce((a, b) => a + b);
};

console.log("Part1");
console.log(part1(getInput("./sample.txt")));
console.log(part1(getInput("./input.txt")));

const part2 = (input) => {
  const scoreMap = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  };
  const scores = input
    .map((line) => {
      const stack = [];
      for (let char of line) {
        if (map[char]) stack.push(char);
        else {
          const lastOpen = stack.pop();
          if (map[lastOpen] !== char) return 0;
        }
      }

      let score = 0;
      while (stack.length) {
        const lastChar = stack.pop();
        score = score * 5 + scoreMap[map[lastChar]];
      }
      return score;
    })
    .filter((item) => item)
    .sort((a, b) => a - b);
  return scores[Math.floor(scores.length / 2)];
};

console.log("Part2");
console.log(part2(getInput("./sample.txt")));
console.log(part2(getInput("./input.txt")));
