const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
// const input = `nop +0
// acc +1
// jmp +4
// acc +3
// jmp -3
// acc -99
// acc +1
// jmp -4
// acc +6`;

let accum = 0;
let idx = 0;
const inputarr = input.split('\n').map(i => i.split(' ')).map(([i, n]) => [i, Number(n)]);

const m = {
  acc(n) {
    accum += n;
    idx++;
  },
  nop(n) {
    idx++;
  },
  jmp(n) {
    idx += n;
  }
}

const p = {};

while (true) {
  const [i, n] = inputarr[idx];
  if (p[[i, n].join(' ') + idx]) {
    break;
  } else {
    p[[i, n].join(' ') + idx] = true;
  }
  m[i](n);
}

console.log(accum);