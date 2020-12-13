const path = require('path');
const fs = require('fs');

let input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
// input = `light red bags contain 1 bright white bag, 2 muted yellow bags.
// dark orange bags contain 3 bright white bags, 4 muted yellow bags.
// bright white bags contain 1 shiny gold bag.
// muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
// shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
// dark olive bags contain 3 faded blue bags, 4 dotted black bags.
// vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
// faded blue bags contain no other bags.
// dotted black bags contain no other bags.`;

const colorConfigs = input.replace(/bags/gm, 'bag').split('\n').map(config => {
  const [bag, canHold] = config.split(' contain ');
  return [bag, canHold.split(',').map(s => s.replace(/[0-9\.]*/g, '').trim())]
});

const aList = {
  'shiny gold bag': [],
}

function getDeps(key) {
  return colorConfigs.filter(([bag, canHold]) => {
    return canHold.includes(key);
  }).map(c => c[0]);
}

let foundMoreDependencies = false;
const alreadyCheckedForDependencies = [];
do {
  foundMoreDependencies = false;

  Object.keys(aList).filter(key => !alreadyCheckedForDependencies.includes(key)).forEach(key => {
    const deps = getDeps(key);
    alreadyCheckedForDependencies.push(key);
    if (deps.length) {
      if (aList[key]) {
        aList[key].push(...deps);
      } else {
        aList[key] = [];
      }
      foundMoreDependencies = true;
      deps.forEach(d => aList[d] = []);
    }


  })
} while (foundMoreDependencies);

/**
 * number of keys in adjacenyList represent a possible entrypoint to storing a nested "shiny gold bag"
 * for the "start" of the data structure it includes "shiny gold bag" as a key which should not be included
 * in the count of bags that can store the "shiny gold bag"
 */
console.log(Object.keys(aList).length - 1);