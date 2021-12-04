const fs = require("fs");

const input = fs.readFileSync("./input.txt").toString("utf-8");
const sequenceAndBoards = input.split("\n\n");

const sequence = sequenceAndBoards[0]
  .split(",")
  .map((item) => parseInt(item, 10));
const boards = sequenceAndBoards.slice(1).map((board) =>
  board.split("\n").map((line) =>
    line
      .split(" ")
      .filter((i) => i)
      .map((num) => parseInt(num, 10))
  )
);

const transpose = (matrix) => {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
};

const difference = (setA, setB) => {
  let diff = new Set(setA);
  for (let element of setB) {
    diff.delete(element);
  }
  return diff;
};

const isBoardWin = (numbers, board) => {
  const numberSet = new Set(numbers);
  const transposeBoard = transpose(board);
  const horizontal = board.reduce((result, line) => {
    const setB = new Set(line);
    return result || difference(setB, numberSet).size === 0;
  }, false);
  const vertical = transposeBoard.reduce((result, line) => {
    const setB = new Set(line);
    return result || difference(setB, numberSet).size === 0;
  }, false);
  return horizontal || vertical;
};

// Part 1
const getWinBoard = (numbers, boards) => {
  const iteration = [];
  for (let number of numbers) {
    iteration.push(number);
    const winBoard = boards.reduce((result, board) => {
      if (isBoardWin(iteration, board)) {
        return board;
      }
      return result;
    }, null);
    if (winBoard) return [iteration, winBoard];
  }
  return [null, null];
};

const [iteration, winBoard] = getWinBoard(sequence, boards);
if (!iteration || !winBoard) return;
console.log(
  Array.from(difference(winBoard.flat(), iteration).values()).reduce(
    (a, b) => a + b
  ) * iteration[iteration.length - 1]
);

// Part 2
const getLastWinBoard = (numbers, boards) => {
  const iteration = [];
  let boardSet = new Set(boards);
  let lastWinBoard = null;
  for (let number of numbers) {
    iteration.push(number);
    for (let board of boardSet) {
      if (isBoardWin(iteration, board)) {
        boardSet.delete(board);
        lastWinBoard = board;
      }
    }
    if (boardSet.size === 0) {
      return [iteration, lastWinBoard];
    }
  }
  return null;
};
const [lastBoardIteration, lastWinBoard] = getLastWinBoard(sequence, boards);
if (!lastBoardIteration || !lastWinBoard) return;
console.log(
  Array.from(
    difference(lastWinBoard.flat(), lastBoardIteration).values()
  ).reduce((a, b) => a + b, 0) *
    lastBoardIteration[lastBoardIteration.length - 1]
);
