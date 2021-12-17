const fs = require("fs");
const util = require("util");

const hexToBits = (input) => {
  return input
    .split("")
    .map((char) => {
      return parseInt(char, 16).toString(2).padStart(4, "0");
    })
    .join("");
};

const getInput = (fileName) => {
  return hexToBits(fs.readFileSync(fileName).toString("ascii").trim());
};

const decode = (packet) => {
  const version = parseInt(packet.slice(0, 3), 2);
  const type = parseInt(packet.slice(3, 6), 2);
  switch (type) {
    case 4: {
      let current = 6;
      let data = "";
      while (current < packet.length) {
        const local = packet.slice(current, current + 5);
        current = current + 5;
        const isLastGroup = parseInt(local[0], 2) === 0;
        data += local.slice(1);
        if (isLastGroup) break;
      }

      const end = parseInt(packet.slice(current), 2) === 0;
      const next = end ? null : packet.slice(current);
      return {
        version,
        type,
        data,
        next,
      };
    }
    default: {
      const lengthTypeID = packet.slice(6, 7);
      switch (lengthTypeID) {
        case "0": {
          const children = [];
          const totalSubPacketsLength = parseInt(packet.slice(7, 22), 2);
          const subPackets = packet.slice(22, 22 + totalSubPacketsLength);
          let next = subPackets;
          while (next) {
            const subPacketValue = decode(next);
            const { next: after } = subPacketValue;
            next = after;
            children.push(subPacketValue);
          }
          const rest = packet.slice(22 + totalSubPacketsLength);
          const end = parseInt(rest, 2) === 0;
          return {
            version,
            type,
            children,
            next: end ? null : rest,
          };
        }
        default: {
          const children = [];
          const numberOfSubPackets = parseInt(packet.slice(7, 18), 2);
          let current = 18;
          let next = null;
          for (let i = 0; i < numberOfSubPackets; i++) {
            const subPacket = next ?? packet.slice(current);
            const child = decode(subPacket);
            const { next: after } = child;
            next = after;
            children.push(child);
          }
          return {
            version,
            type,
            children,
            next,
          };
        }
      }
    }
  }
};

const part1 = (input) => {
  const walk = (node) => {
    if (!node.children) return node.version;
    return (
      node.version +
      node.children.map((child) => walk(child)).reduce((a, b) => a + b, 0)
    );
  };
  const root = decode(input);
  return walk(root);
};

console.log("Part1");
console.log(part1(hexToBits("D2FE28")));
console.log(part1(hexToBits("38006F45291200")));
console.log(part1(hexToBits("EE00D40C823060")));
console.log(part1(hexToBits("8A004A801A8002F478")));
console.log(part1(hexToBits("620080001611562C8802118E34")));
console.log(part1(hexToBits("C0015000016115A2E0802F182340")));
console.log(part1(hexToBits("A0016C880162017C3686B18A3D4780")));
console.log(part1(getInput("./input.txt")));

const part2 = (input) => {
  const root = decode(input);
  const walk = (node) => {
    switch (node.type) {
      case 4:
        return parseInt(node.data, 2);
      case 0:
        return node.children
          .map((child) => walk(child))
          .reduce((a, b) => a + b, 0);
      case 1:
        return node.children
          .map((child) => walk(child))
          .reduce((a, b) => a * b, 1);
      case 2:
        return Math.min(...node.children.map((child) => walk(child)));
      case 3:
        return Math.max(...node.children.map((child) => walk(child)));
      case 5: {
        const [first, second] = node.children.map((child) => walk(child));
        return first > second ? 1 : 0;
      }
      case 6: {
        const [first, second] = node.children.map((child) => walk(child));
        return first < second ? 1 : 0;
      }
      case 7: {
        const [first, second] = node.children.map((child) => walk(child));
        return first === second ? 1 : 0;
      }
      default:
        return 0;
    }
  };
  return walk(root);
};

console.log("Part2");
console.log(part2(hexToBits("C200B40A82")));
console.log(part2(hexToBits("04005AC33890")));
console.log(part2(hexToBits("880086C3E88112")));
console.log(part2(hexToBits("CE00C43D881120")));
console.log(part2(hexToBits("D8005AC2A8F0")));
console.log(part2(hexToBits("F600BC2D8F")));
console.log(part2(hexToBits("9C005AC2F8F0")));
console.log(part2(hexToBits("9C0141080250320F1802104A08")));
console.log(part2(getInput("./input.txt")));
