const path = require('path');
const fs = require('fs');

/**
 * 
 * @param {string} line 
 */
const formatPolicyAndPassword = line => {
  const [policy, password] = line.split(': ');
  const [range, letter] = policy.split(' ');
  const [min, max] = range.split('-').map(Number);

  return {
    policy,
    password,
    range: { min, max },
    letter,
  }
}

/**
 * @param {string} s
 * @returns {Record<string, number>}
 */
const countLetters = s => {
  const letterHash = {};

  for (const l of s.split('')) {
    if (!letterHash[l]) {
      letterHash[l] = 0;
    }

    letterHash[l]++;
  }

  return letterHash;
}

/**
 * 
 * @param {ReturnType<typeof formatPolicyAndPassword>} policy 
 */
const addValidationToPolicy = policy => {
  const lettersCount = countLetters(policy.password);

  const { letter, range: { min, max } } = policy;
  return {
    ...policy,
    lettersCount,
    isValid: lettersCount[letter] >= min && lettersCount[letter] <= max
  }
}

const solve = () => {
  const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const validatedPasswords = input.split('\n').map(formatPolicyAndPassword).map(addValidationToPolicy);
  const validPasswords = validatedPasswords.filter(policy => policy.isValid);
  const validPasswordCount = validPasswords.length;

  console.log(validPasswordCount);
};

console.log(solve())