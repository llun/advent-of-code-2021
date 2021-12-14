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
  const map = {};
  for (let i = 0; i < sequence.length; i++) {
    const char = sequence[i];
    if (!map[char]) map[char] = 0;
    map[char]++;
  }
  return map;
};

const part1 = (input) => {
  const [sequence, map] = input;

  let value = sequence;
  for (let i = 0; i < 10; i++) {
    value = getNextSequence(value, map);
  }
  const group = groupByChar(value);
  const sortedGroup = Object.keys(group)
    .map((key) => [key, group[key]])
    .sort((a, b) => a[1] - b[1]);
  return sortedGroup[sortedGroup.length - 1][1] - sortedGroup[0][1];
};

console.log("Part1");
console.log(part1(getInput("./sample.txt")));
console.log(part1(getInput("./input.txt")));

const part2 = (input) => {
  const [sequence, map] = input;
  const cache = new Map();
  cache.set(
    2,
    Object.keys(map)
      .map((pair) => {
        const [first, second] = pair.split("");
        return [pair, [first, map[pair], second].join("")];
      })
      .reduce((out, item) => {
        out.set(item[0], item[1]);
        return out;
      }, new Map())
  );
  const getNextSequenceWithCache = (sequence, cache) => {
    const available = Array.from(cache.keys()).sort((a, b) => a - b);
    let slot = available.length - 1;
    let begin = 0;
    let result = "";
    const hit = {};
    while (true) {
      const length = available[slot];
      if (!cache.has(length)) {
        slot--;
        continue;
      }
      const word = sequence.substring(begin, begin + length);
      if (!cache.get(length).has(word)) {
        slot--;
        continue;
      }

      if (!hit[length]) hit[length] = 0;
      hit[length]++;
      const end = begin + length;
      begin = end - 1;
      if (result.length === 0) result = cache.get(length).get(word);
      else {
        const appender = cache.get(length).get(word);
        result += appender.slice(1);
      }
      if (end >= sequence.length) break;
      slot = available.length - 1;
    }
    return result;
  };

  let slot = 2;
  for (let i = 0; i < 10; i++) {
    const current = cache.get(slot);
    const nextSlot = Array.from(current.values())[0].length;
    cache.set(
      nextSlot,
      Array.from(current.values()).reduce((out, item) => {
        out.set(item, getNextSequenceWithCache(item, cache));
        return out;
      }, new Map())
    );
    slot = nextSlot;
  }

  let val = sequence;
  for (let i = 0; i < 10; i++) {
    val = getNextSequenceWithCache(val, cache);
  }

  const group = groupByChar(val);
  const sortedGroup = Object.keys(group)
    .map((key) => [key, group[key]])
    .sort((a, b) => a[1] - b[1]);
  return sortedGroup[sortedGroup.length - 1][1] - sortedGroup[0][1];
};

const part2Map = (input) => {
  const [sequence, map] = input;

  let starter = sequence.slice(0, 2);
  const counter = sequence.split("").reduce((out, c, index, arr) => {
    if (index < 1) return out;
    const key = [arr[index - 1], arr[index]].join("");
    if (!out[key]) out[key] = 0;
    out[key]++;
    return out;
  }, {});
  const spread = Object.keys(map)
    .map((key) => {
      const insertion = map[key];
      return [
        key,
        [[key[0], insertion].join(""), [insertion, key[1]].join("")],
      ];
    })
    .reduce((hash, kv) => {
      hash[kv[0]] = kv[1];
      return hash;
    }, {});

  for (let i = 0; i < 40; i++) {
    starter = starter[0] + map[starter];
    const changes = Object.keys(counter)
      .map((key) => {
        const val = counter[key];
        return [[key, -val], ...spread[key].map((item) => [item, val])];
      })
      .flat();

    for (let change of changes) {
      const [key, val] = change;
      const previous = counter[key] || 0;
      counter[key] = previous + val;
    }
  }

  const charCount = starter.split("").reduce((out, item) => {
    out[item] = 1;
    return out;
  }, {});
  counter[starter] = counter[starter] - 1;
  for (let key of Object.keys(counter)) {
    const char = key.split("")[1];
    const previous = charCount[char] || 0;
    charCount[char] = previous + counter[key];
  }
  const sortedGroup = Object.keys(charCount)
    .map((key) => [key, charCount[key]])
    .sort((a, b) => a[1] - b[1]);
  return sortedGroup[sortedGroup.length - 1][1] - sortedGroup[0][1];
};

console.log("Part2");
// console.log(part2(getInput("./sample.txt")));
console.log(part2Map(getInput("./sample.txt")));
// console.log(part2(getInput("./input.txt")));
console.log(part2Map(getInput("./input.txt")));
