const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
// const input = `shiny gold bags contain 2 dark red bags.
// dark red bags contain 2 dark orange bags.
// dark orange bags contain 2 dark yellow bags.
// dark yellow bags contain 2 dark green bags.
// dark green bags contain 2 dark blue bags.
// dark blue bags contain 2 dark violet bags.
// dark violet bags contain no other bags.`


const colorConfigs = input.replace(/bags/gm, 'bag').replace(/\./gm, '').split('\n').filter(s => s.includes('contain')).map(config => {
  const [bag, canHold] = config.split(' contain ');
  return [bag, canHold.split(',').map(s => s.trim()).map(b => {
    const count = Number(b.match(/([0-9]*)/)[0]);
    return { bag: b.replace(/[0-9]* /, ''), count };
  })]
});

/**
 * @param {string} bagToFind
 * @returns {{bag: string;count: number;}[] | undefined} bagToFind 
 */
function getNextBags(bagToFind) {
  return colorConfigs.find(b => b[0] === bagToFind);
}

function totalBagNestedBags(bagToFind, count = 1, total = 0) {
  const nextBags = getNextBags(bagToFind);

  if (!nextBags) {
    return 0;
  }

  total += nextBags[1].filter(b => !b.bag.includes('shiny gold')).map(b => b.count * count).reduce((a, b) => a + b);

  for (const b of nextBags[1]) {
    total += totalBagNestedBags(b.bag, b.count);
  }

  return total
}


const bags = totalBagNestedBags('shiny gold bag');
console.log(bags);