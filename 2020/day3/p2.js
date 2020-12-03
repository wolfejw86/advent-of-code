const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

function getTreesHit(slopes, xIncrement, yIncrement) {
  let x = 0;
  let y = 0;
  let treesHit = 0;

  // width is +1 over the max possible width value so when x === width it's really 0
  const width = slopes[0].length;

  while (y < slopes.length) {
    y += yIncrement;

    if (y >= slopes.length) {
      break;
    }

    x += xIncrement;

    if (x >= width) {
      x = Math.abs(width - x);
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

const slopeConfigs = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2]
];

let treeHitTotals = 1;

slopeConfigs.forEach(([x, y]) => {
  const slopes = input.split('\n').map(row => row.split(''));
  const treesHit = getTreesHit(slopes, x, y);
  console.log({ treesHit, x, y });
  treeHitTotals *= treesHit;
});

console.log({ treeHitTotals })
