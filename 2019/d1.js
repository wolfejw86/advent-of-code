const fs = require('fs');
const path = require('path');

function calcFuelFuel(num, total = 0) {
  const fuel = Math.floor(num / 3) - 2;

  if (fuel <= 0) {
    return total;
  }

  total += fuel;

  return calcFuelFuel(fuel, total);
}

const totalFuel = fs.readFileSync(path.join(__dirname, './d1.txt'), 'utf8')
  .split('\n')
  .map(n => calcFuelFuel(n))
  .reduce((a, b) => a + b);

console.log(totalFuel)
