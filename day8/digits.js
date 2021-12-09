const fs = require("fs");

const getInput = (file) => {
  return fs
    .readFileSync(file)
    .toString("utf8")
    .split("\n")
    .map((line) =>
      line.split("|").map((item, index) =>
        item
          .trim()
          .split(" ")
          .map((word) => new Set(word.split("")))
      )
    );
};

const countLength = (input, length) =>
  input.filter((word) => word.size === length).length;

const part1 = (input) => {
  return [
    // digit 1
    input
      .map((line) => countLength(line[1], 2))
      .reduce((sum, count) => sum + count),
    // digit 4
    input
      .map((line) => countLength(line[1], 4))
      .reduce((sum, count) => sum + count),
    // digit 7
    input
      .map((line) => countLength(line[1], 3))
      .reduce((sum, count) => sum + count),
    // digit 8
    input
      .map((line) => countLength(line[1], 7))
      .reduce((sum, count) => sum + count),
  ].reduce((sum, count) => sum + count);
};
console.log(part1(getInput("./input.txt")));

const diff = (s1, s2) => {
  return Array.from(s2).filter((item) => !s1.has(item));
};

const decode = (s1, s2, knownPairs = new Map()) => {
  if (s1.size === 0 && s2.size === 6) {
    const left = diff(s1, s2).filter((item) => !knownPairs.has(item));
    if (knownPairs.size === 5) {
      if (left.length > 1) return [];
      return [left, "f", s1, s2].flat();
    }
    return [left, "c", s1, s2].flat();
  }
  if (s1.size === 2 && s2.size === 3) {
    return [diff(s1, s2), "a", s1, s2].flat();
  }
  if (s1.size === 2 && s2.size === 4) {
    const left = diff(s1, s2).filter((item) => !knownPairs.has(item));
    return [left, "b", s1, s2].flat();
  }
  if (s1.size === 2 && s2.size === 5) {
    const left = diff(s1, s2);
    if (left.length === 3 && knownPairs.size === 3) {
      const d = left.filter((item) => !knownPairs.has(item));
      return [d, "d", s1, s2].flat();
    }
    return [];
  }
  if (s1.size === 4 && s2.size === 6) {
    const left = diff(s1, s2).filter((item) => !knownPairs.has(item));
    if (left.length !== 1) return [];
    return [left, "g", s1, s2].flat();
  }
  if (s1.size === 6 && s2.size === 7) {
    const left = diff(s1, s2).filter((item) => !knownPairs.has(item));
    return [left, "e", s1, s2].flat();
  }
};

const getDigitMap = (guess) => {
  const words = guess.sort((a, b) => a.size - b.size);
  const knownPairs = new Map();
  const one = words.find((item) => item.size === 2);
  const seven = words.find((item) => item.size === 3);
  const [aCode, aPos] = decode(one, seven);
  knownPairs.set(aCode, aPos);
  const four = words.find((item) => item.size === 4);
  const probablyNine = words.filter((item) => item.size === 6);
  const [gCode, gPos, , nine] = probablyNine
    .map((p9) => decode(four, p9, knownPairs))
    .find((p) => p.length !== 0);
  knownPairs.set(gCode, gPos);
  const eight = words.find((item) => item.size === 7);
  const [eCode, ePos] = decode(nine, eight);
  knownPairs.set(eCode, ePos);
  const probablyThree = words.filter((item) => item.size === 5);
  const [dCode, dPos, , three] = probablyThree
    .map((p3) => decode(one, p3, knownPairs))
    .find((item) => item.length > 0);
  knownPairs.set(dCode, dPos);
  const [bCode, bPos] = decode(one, four, knownPairs);
  knownPairs.set(bCode, bPos);

  const probablySix = words
    .filter((item) => item.size === 6)
    .filter((item) => item !== nine);
  const [fCode, fPos, , six] = probablySix
    .map((p6) => decode(new Set(), p6, knownPairs))
    .find((p) => p.length !== 0);
  knownPairs.set(fCode, fPos);
  const [zero] = words.filter(
    (item) => item.size === 6 && item !== six && item !== nine
  );
  const [cCode, cPos] = decode(new Set(), zero, knownPairs);
  knownPairs.set(cCode, cPos);
  return knownPairs;
};

const getValue = (digits, map) => {
  const val = digits.reduce((out, i) => {
    if (i.size === 2) return [...out, 1];
    if (i.size === 3) return [...out, 7];
    if (i.size === 4) return [...out, 4];
    if (i.size === 7) return [...out, 8];

    const segments = Array.from(i.values())
      .map((v) => map.get(v))
      .sort()
      .join("");
    if (segments === "acdeg") return [...out, 2];
    if (segments === "acdfg") return [...out, 3];
    if (segments === "abdfg") return [...out, 5];
    if (segments === "abdefg") return [...out, 6];
    if (segments === "abcdfg") return [...out, 9];
    if (segments === "abcefg") return [...out, 0];
    return out;
  }, []);
  return parseInt(val.join(""), 10);
};

const part2 = (input) => {
  return input.reduce((sum, line) => {
    const [guess, digits] = line;
    const map = getDigitMap(guess.sort((a, b) => a - b));
    return sum + getValue(digits, map);
  }, 0);
};
console.log(part2(getInput("./input.txt")));
