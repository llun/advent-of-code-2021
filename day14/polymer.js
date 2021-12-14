const Buffer = require("buffer");
const fs = require("fs");

const getInput = (fileName) => {
  const [sequnce, map] = fs
    .readFileSync(fileName)
    .toString("utf-8")
    .split("\n\n");
  return [
    sequnce.trim(),
    map
      .trim()
      .split("\n")
      .map((line) => line.split(" -> "))
      .reduce((map, pair) => {
        map[pair[0]] = pair[1];
        return map;
      }, {}),
  ];
};

const getNextSequence = (sequence, map) => {
  return sequence
    .split("")
    .reduce((out, char, index, arr) => {
      if (index < 1) return out;
      return [...out, [arr[index - 1], arr[index]]];
    }, [])
    .map((item) => {
      const key = item.join("");
      const insertion = map[key];
      return [item[0], insertion, item[1]];
    })
    .reduce((out, item, index) => {
      if (index < 1) return [item.join("")];
      return [...out, [item[1], item[2]].join("")];
    }, [])
    .join("");
};

const groupByChar = (sequence) => {
  const group = sequence.split("").reduce((map, char) => {
    if (!map[char]) map[char] = 0;
    map[char]++;
    return map;
  }, {});
  return group;
};

const part1 = (input) => {
  const [sequence, map] = input;

  let value = sequence;
  for (let i = 0; i < 40; i++) {
    console.log(i);
    value = getNextSequence(value, map);
  }
  const group = groupByChar(value);
  const sortedGroup = Object.keys(group)
    .map((key) => [key, group[key]])
    .sort((a, b) => a[1] - b[1]);
  return sortedGroup[sortedGroup.length - 1][1] - sortedGroup[0][1];
};

// console.log("Part1");
// console.log(part1(getInput("./sample.txt")));
// console.log(part1(getInput("./input.txt")));

const part2 = (input) => {
  const [sequence, map] = input;
  const cache = [
    null,
    null,
    Object.keys(map)
      .map((pair) => {
        const [first, second] = pair.split("");
        return [pair, [first, map[pair], second].join("")];
      })
      .reduce((out, item) => {
        out[item[0]] = item[1];
        return out;
      }, {}),
  ];
  const getNextSequenceWithCache = (sequence, cache) => {
    const available = cache
      .map((item, index) => (item ? index : 0))
      .filter((i) => i);
    let slot = available.length - 1;
    let begin = 0;
    let result = "";
    const hit = {};
    while (true) {
      const length = available[slot];
      if (!cache[length]) {
        slot--;
        continue;
      }
      const word = sequence.substring(begin, begin + length);
      if (!cache[length][word]) {
        slot--;
        continue;
      }

      if (!hit[length]) hit[length] = 0;
      hit[length]++;
      const end = begin + length;
      begin = end - 1;
      const beforeConcat = Date.now();
      if (result.length === 0) result = cache[length][word];
      else {
        const appender = cache[length][word];
        for (let i = 1; i < appender.length; i++) {
          result += appender[i];
        }
      }
      if (end >= sequence.length) break;
      slot = available.length - 1;
    }
    if (!cache[sequence.length]) cache[sequence.length] = {};
    cache[sequence.length][sequence] = result;
    console.log(hit);
    return result;
  };

  let slot = 2;
  for (let i = 0; i < 26; i++) {
    const nextSlot = Object.values(cache[slot])[0].length;
    cache[nextSlot] = Object.values(cache[slot]).reduce((out, item) => {
      out[item] = getNextSequenceWithCache(item, cache);
      return out;
    }, {});
    slot = nextSlot;
    console.log(i);
  }

  let val = sequence;
  for (let i = 0; i < 40; i++) {
    console.log(i);
    val = getNextSequenceWithCache(val, cache);
  }
  return val;
};
console.log("Part2");
console.log(part2(getInput("./sample.txt")));
// console.log(part2(getInput("./input.txt")));
