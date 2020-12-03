const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

function getTreesHit(slopes) {
  let x = 0;
  let y = 0;
  let treesHit = 0;
  const width = slopes[0].length;

  while (y < slopes.length) {
    y += 1;
    for (let i = 0; i < 3; i++) {
      if (x === width) {
        x = 0;
      }
      x++;
    }

    if (x === width) {
      x = 0;
    }

    if (y >= slopes.length) {
      break;
    }

    if (slopes[y][x] === '#') {
      treesHit++;
      slopes[y][x] = 'X'
    } else {
      slopes[y][x] = 'O'
    }
  }

  return treesHit;
}

const slopes = input.split('\n').map(row => row.split(''));

const treesHit = getTreesHit(slopes);

console.log({ treesHit });
