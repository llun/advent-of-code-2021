const fs = require("fs");

const getInput = (fileName) => {
  const lines = fs.readFileSync(fileName).toString("utf-8").split("\n");
  const dots = lines.filter(
    (line) => line.length > 0 && !line.startsWith("fold")
  );

  const instructions = lines
    .filter((line) => line.startsWith("fold"))
    .map((line) => line.substring("fold along ".length).split("="));
  return [dots, instructions];
};

const fold = (dots, axis, position) => {
  return dots.map((dot) => {
    const [x, y] = dot.split(",").map((v) => parseInt(v, 10));
    if (axis === "x" && x > position) {
      const diff = x - position;
      return [x - 2 * diff, y].join(",");
    }
    if (axis === "y" && y > position) {
      const diff = y - position;
      return [x, y - 2 * diff].join(",");
    }
    return [x, y].join(",");
  });
};

const part1 = (input) => {
  const [dots, instructions] = input;
  const [first] = instructions;
  const [axis, position] = first;
  return new Set(fold(dots, axis, position)).size;
};

console.log("Part1");
console.log(part1(getInput("./sample.txt")));
console.log(part1(getInput("./input.txt")));

const printMatrix = (matrix) => {
  for (const row of matrix) {
    console.log(row.join(""));
  }
};

const part2 = (input) => {
  const [dots, instructions] = input;
  let current = dots;
  for (const instruction of instructions) {
    const [axis, position] = instruction;
    current = fold(current, axis, position);
  }
  const result = new Set(current);
  const afterFold = Array.from(result).map((dot) =>
    dot.split(",").map((val) => parseInt(val))
  );
  const maxX = Math.max(...afterFold.map((dot) => dot[0]));
  const maxY = Math.max(...afterFold.map((dot) => dot[1]));
  const matrix = Array(maxY + 1)
    .fill(".")
    .map(() => Array(maxX + 1).fill(" "));
  for (const dot of afterFold) {
    const [x, y] = dot;
    matrix[y][x] = "█";
  }
  return matrix;
};

console.log("Part2");
printMatrix(part2(getInput("./sample.txt")));
printMatrix(part2(getInput("./input.txt")));
