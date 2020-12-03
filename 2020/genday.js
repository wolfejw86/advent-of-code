let [, , day] = process.argv;

day = Number(day);

if (!day) {
  throw new Error('day must be a number');
}

const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, `day${day}`);

fs.mkdirSync(filepath);
fs.writeFileSync(filepath + '/input.txt', '');
fs.writeFileSync(filepath + '/p1.js', `const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

console.log(input);`);

fs.writeFileSync(filepath + '/p2.js', `const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

console.log(input);`);