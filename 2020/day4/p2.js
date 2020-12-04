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

const fieldValidations = {
  byr(val) {
    const n = Number(val);
    return val.length === 4 && !isNaN(n) && n >= 1920 && n <= 2002
  },
  iyr(val) {
    const n = Number(val);
    return val.length === 4 && !isNaN(n) && n >= 2010 && n <= 2020
  },
  eyr(val) {
    const n = Number(val);
    return val.length === 4 && !isNaN(n) && n >= 2020 && n <= 2030
  },
  hgt(val) {
    if (!/[0-9]{2,}(cm|in)\b/.test(val)) {
      return false;
    }

    const [, nVal, u] = val.match(/([0-9]*)(in|cm)/);

    const n = Number(nVal);
    const isNumber = !isNaN(n);
    const isCm = u === 'cm';
    const nIsValid = isCm ? (n >= 150 && n <= 193) : (n >= 59 && n <= 76);
    return isNumber && nIsValid;
  },
  hcl(val) {
    const hasHash = val[0] === '#';
    return hasHash && /[0-9a-f]{6}/.test(val.replace('#'));
  },
  ecl(val) {
    const v = { 'amb': true, 'blu': true, 'brn': true, 'gry': true, 'grn': true, 'hzl': true, 'oth': true, }
    return !!v[val]
  },
  pid(val) {
    const n = Number(val);
    const isNumber = !isNaN(n);
    return isNumber && val.length === 9;
  },
}

/**
 * 
 * @param {ReturnType<typeof parsePassport>} passport 
 */
function passportIsValid(passport) {
  return {
    isValid: requiredFields.every(field => !!passport[field] && fieldValidations[field](passport[field])),
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

console.log(sumTotal(passports));