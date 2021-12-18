const pegjs = require("pegjs");
const fs = require("fs");
const parser = pegjs.generate(
  fs.readFileSync("./input.pegjs").toString("utf8")
);
const shoot = (range, beginX, beginY) => {
  const { x: xRange, y: yRange } = range;
  let [x, y] = [0, 0];
  let [powX, powY] = [beginX, beginY];
  let highestY = Number.MIN_SAFE_INTEGER;
  let i = 0;
  while (true) {
    i++;
    x += powX;
    y += powY;

    powX = powX > 0 ? powX - 1 : powX < 0 ? powX + 1 : 0;
    powY--;
    if (y > highestY) highestY = y;

    if (x >= xRange[0] && x <= xRange[1] && y <= yRange[1] && y >= yRange[0]) {
      return highestY;
    }
    if (x > xRange[1] || y < yRange[0]) {
      return null;
    }
  }
};

const part1 = (input) => {
  const list = [];
  for (let i = 1; i < 1000; i++) {
    for (let j = 1; j < 1000; j++) {
      const enter = shoot(input, i, j);
      if (enter) {
        list.push([[i, j], enter]);
      }
    }
  }
  return Math.max(...list.map((item) => item[1]));
};

console.log("Part1");
console.log(part1(parser.parse("target area: x=20..30, y=-10..-5")));
console.log(part1(parser.parse("target area: x=207..263, y=-115..-63")));

const part2 = (input) => {
  const list = [];
  for (let i = 1; i < 1000; i++) {
    for (let j = -1000; j < 1000; j++) {
      const enter = shoot(input, i, j);
      if (enter !== null) {
        list.push([i, j]);
      }
    }
  }
  return list.length;
};

console.log("Part2");
console.log(part2(parser.parse("target area: x=20..30, y=-10..-5")));
console.log(part2(parser.parse("target area: x=207..263, y=-115..-63")));
