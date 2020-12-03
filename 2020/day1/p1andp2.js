/**
 * 1. figure out which two entries sum to 2020
 * 2. use those 2 entries multiplied together as the answer
 */

const fs = require('fs');
const path = require('path');

const entries = fs.readFileSync(path.join(__dirname, './part1input.txt'), 'utf-8').split('\n').map(line => Number(line.trim()));

for (let i = 0; i < entries.length; i++) {
  const entry1 = entries[i];
  let sum, entry2, entry3;

  for (let j = 0; j < entries.length; j++) {

    entry2 = entries[j];
    for (let k = 0; k < entries.length; k++) {
      entry3 = entries[k];
      sum = entry1 + entry2 + entry3;

      if (sum === 2020) {
        break;
      }
    }

    if (sum === 2020) {
      break;
    }
  }

  if (sum === 2020) {
    console.log({ entry1, entry2, entry3, sum, answer: entry1 * entry2 * entry3 });
    break;
  }
}
