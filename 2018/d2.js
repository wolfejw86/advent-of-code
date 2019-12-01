const fs = require("fs");

const ids = fs.readFileSync("./d2.txt", "utf8").split("\n");

let exactlyTwoSum = 0;
let exactlyThreeSum = 0;

ids.forEach(id => {
  const letterMap = id.split("").reduce((a, c) => {
    if (!a[c]) {
      a[c] = 0;
    }
    a[c]++;
    return a;
  }, {});

  let has2 = false;
  let has3 = false;
  for (const n of Object.values(letterMap)) {
    if (n === 2 && !has2) {
      exactlyTwoSum++;
      has2 = true;
    }

    if (n === 3 && !has3) {
      exactlyThreeSum++;
      has3 = true;
    }

    if (has2 && has3) {
      break;
    }
  }
});

console.log(
  "multipled sum of exactly 2 and 3: ",
  exactlyTwoSum * exactlyThreeSum
);

let diffByOne = [];
for (const id of ids) {
  for (const innerId of ids) {
    const inner = innerId.split("");
    const compare = inner.filter((a, i) => a !== id[i]);
    if (compare.length === 1) {
      diffByOne.push(id);
      diffByOne.push(innerId);
      break;
    }
  }

  if (diffByOne.length) {
    break;
  }
}

console.log({ diffByOne });
