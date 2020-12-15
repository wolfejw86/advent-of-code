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

const clone = (o) => JSON.parse(JSON.stringify(o));
const baseInput = input.split('\n').map(i => i.split(' ')).map(([i, n]) => [i, Number(n)]);


const test = (idxToSetToNop) => {
  const inputarr = clone(baseInput);
  inputarr[idxToSetToNop][0] = 'nop';
  const m = {
    acc(n) {
      accum += n;
      idx++;
    },
    nop() {
      idx++;
    },
    jmp(n) {
      idx += n;
    }
  }
  const p = {};

  let accum = 0;
  let idx = 0;

  while (idx < inputarr.length) {
    const [i, n] = inputarr[idx];
    if (p[[i, n].join(' ') + idx]) {
      throw new Error('did not terminate properly');
    } else {
      p[[i, n].join(' ') + idx] = true;
    }
    m[i](n);
  }

  return { success: true, idxToSetToNop, accum }
}



for (let i = 0; i < baseInput.length; i++) {
  try {
    console.log(test(i));
    break;
  } catch (error) {
    console.log({ i })
  }
}