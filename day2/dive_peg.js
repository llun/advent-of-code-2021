const pegjs = require("pegjs");
const fs = require("fs");

const input = fs.readFileSync("./input.txt").toString("utf-8");
const parser = pegjs.generate(
  fs.readFileSync("./dive.pegjs").toString("utf-8")
);
const [position, aim, depth] = parser.parse(input);
console.log(position * aim, position * depth);
