const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

function reduceDuplicates(s) {
  return s.split('').filter((l, i, arr) => arr.indexOf(l) === i).join('');
}

const groups = input.split('\n\n').map(g => g.replace(/\n/g, ''));

console.log(groups.map(reduceDuplicates).map(g => g.length).reduce((a, b) => a + b));