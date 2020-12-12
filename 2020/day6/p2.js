const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

const groups = input.split('\n\n').map(g => g.split('\n'));

let sum = 0;

groups.forEach(g => {

  let combinedAnswers = '';
  g.forEach(answers => {
    for (const l of answers) {
      if (g.every(answerset => answerset.includes(l))) {
        combinedAnswers += l;
      }
    }
  });

  sum += combinedAnswers.split('').filter((l, i, arr) => arr.indexOf(l) === i).join('').length;
});

console.log(sum);