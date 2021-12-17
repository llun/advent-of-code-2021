const fs = require("fs");
const util = require("util");

const hexToBits = (input) => {
  console.log(input);
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

const part1 = (input) => {
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

  const walk = (node) => {
    if (!node.children) return node.version;
    return (
      node.version +
      node.children.map((child) => walk(child)).reduce((a, b) => a + b, 0)
    );
  };
  const root = decode(input);
  // console.log(util.inspect(root, false, null, true));
  return walk(root);
};

console.log(part1(hexToBits("D2FE28")));
console.log(part1(hexToBits("38006F45291200")));
console.log(part1(hexToBits("EE00D40C823060")));
console.log(part1(hexToBits("8A004A801A8002F478")));
console.log(part1(hexToBits("620080001611562C8802118E34")));
console.log(part1(hexToBits("C0015000016115A2E0802F182340")));
console.log(part1(hexToBits("A0016C880162017C3686B18A3D4780")));
console.log(part1(getInput("./input.txt")));
