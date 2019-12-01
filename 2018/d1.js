const fs = require("fs");

const shifts = fs
  .readFileSync("./d1.txt", "utf8")
  .split("\n")
  .map(n => parseInt(n.replace("+", "")));

const total = shifts.reduce((s, a) => s + a);

console.log({ total });

const duplicateMap = {};
let result,
  i = 0,
  shiftTotal = 0;

while (!result) {
  shiftTotal += shifts[i];
  if (duplicateMap[shiftTotal]) {
    result = shiftTotal;
  } else {
    duplicateMap[shiftTotal] = true;
  }
  i++;
  if (i === shifts.length) {
    i = 0;
  }
}

console.log({ result });
