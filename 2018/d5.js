const fs = require("fs");

const allLetters = fs.readFileSync("./d5.txt", "utf8");

const lower = l => l.toLowerCase();
const upper = l => l.toUpperCase();

function findMatch(letters) {
  for (let i = 0; i < letters.length; i++) {
    const current = letters[i];
    const next = letters[i + 1];
    if (next && lower(current) === lower(next)) {
      // possible match
      if (current !== next) {
        // match
        letters = letters.replace(new RegExp(current + next, "g"), "");
        i = -1;
      }
    }
  }

  return letters;
}

const fullyReactedPolymerLength = findMatch(allLetters).length;
// pt 1 answer
console.log("part 1 answer");
console.log({ fullyReactedPolymerLength });

function findUniqueLetters(letters) {
  const unique = [];
  for (const l of letters) {
    if (!unique.includes(lower(l))) {
      unique.push(lower(l));
    }
  }
  return unique;
}

function removeUnit(l, letters) {
  return letters
    .replace(new RegExp(lower(l), "g"), "")
    .replace(new RegExp(upper(l), "g"), "");
}

const uniqueLetters = findUniqueLetters(allLetters);

const countsWithUnitRemoved = uniqueLetters.reduce((data, l) => {
  data[l] = findMatch(removeUnit(l, allLetters)).length;
  return data;
}, {});

const lowestCountPolymerAfterUnitRemoval = Math.min(
  ...Object.values(countsWithUnitRemoved)
);
console.log({ lowestCountPolymerAfterUnitRemoval });
