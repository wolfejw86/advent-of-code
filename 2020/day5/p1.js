const path = require('path');
const fs = require('fs');

const defaultRowRange = [];
for (let i = 0; i < 128; i++) {
  defaultRowRange.push(i);
}

const defaultSeatRange = [];
for (let i = 0; i < 8; i++) {
  defaultSeatRange.push(i);
}
/**
 * 
 * @param {string} boardingPass 
 * @param {number} range 
 */
function calcSeatId(boardingPass, range = [...defaultRowRange], result = {}) {
  if (boardingPass.length === 3) {
    result.row = range[0];
    range = [...defaultSeatRange];
  }

  if (boardingPass.length === 0) {
    result.seat = range[0];
    return result.row * 8 + result.seat;
  }

  const next = boardingPass[0];
  boardingPass = boardingPass.slice(1);
  const halfMax = Math.ceil(range.length / 2);

  if (next === 'F' || next === 'L') {
    range = range.slice(0, halfMax);
    return calcSeatId(boardingPass, range, result);
  } else {
    range = range.slice(halfMax);
    return calcSeatId(boardingPass, range, result);
  }
}

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

console.log(Math.max(...input.split('\n').map(boardingPass => calcSeatId(boardingPass))));
