const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"))
  .toString("utf-8")
  .split("\n");

const columns = (input) => {
  return input.reduce(
    (acc, item) => {
      const chars = item.split("");
      const columns = acc;
      for (let i = 0; i < chars.length; i++) {
        columns[i].push(chars[i]);
      }
      return acc;
    },
    new Array(input[0].length).fill(0).map(() => new Array())
  );
};

const group = (list) =>
  list.reduce((acc, item) => {
    if (acc[item] === undefined) acc[item] = 0;
    else acc[item]++;
    return acc;
  }, {});

const digitSums = columns(input).map(group);

const gamma = (list) =>
  parseInt(list.map((item) => (item["0"] > item["1"] ? 0 : 1)).join(""), 2);
const epsilon = (list) =>
  parseInt(list.map((item) => (item["0"] < item["1"] ? 0 : 1)).join(""), 2);

// Part1
console.log(
  gamma(digitSums),
  epsilon(digitSums),
  gamma(digitSums) * epsilon(digitSums)
);

// Part2
const oxygen = (list) => {
  let numbers = list.slice(0);
  let index = 0;
  while (numbers.length > 1) {
    const val = columns(numbers).map(group);
    if (val[index]["0"] > val[index]["1"]) {
      numbers = numbers.filter((line) => line[index] === "0");
    } else {
      numbers = numbers.filter((line) => line[index] === "1");
    }
    index++;
  }
  return parseInt(numbers[0], 2);
};
const co2 = (list) => {
  let numbers = list.slice(0);
  let index = 0;
  while (numbers.length > 1) {
    const val = columns(numbers).map(group);
    if (val[index]["1"] < val[index]["0"]) {
      numbers = numbers.filter((line) => line[index] === "1");
    } else {
      numbers = numbers.filter((line) => line[index] === "0");
    }
    index++;
  }
  return parseInt(numbers[0], 2);
};
console.log(oxygen(input), co2(input), oxygen(input) * co2(input));
