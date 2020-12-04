const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

const PARSE_FIELDS_RE = /([a-z]{3}):([a-z0-9#]*)/g;

/**
 * 
 * @param {string} dataRow 
 */
function parsePassport(dataRow) {
  return dataRow.match(PARSE_FIELDS_RE).reduce((passport, fieldPlusValue) => {
    const [field, value] = fieldPlusValue.split(':');
    passport[field] = value;

    return passport;
  }, {});
}

const requiredFields = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid',
];

/**
 * 
 * @param {ReturnType<typeof parsePassport>} passport 
 */
function passportIsValid(passport) {
  return {
    isValid: requiredFields.every(field => !!passport[field]),
    ...passport,
  }
}

/**
 * 
 * @param {ReturnType<typeof parsePassport>[]} passports
 */
function sumTotal(passports) {
  return passports.reduce((a, b) => a + b.isValid, 0);
}

const passports = input.split('\n\n').map(parsePassport).map(passportIsValid);

console.log(passports, sumTotal(passports));