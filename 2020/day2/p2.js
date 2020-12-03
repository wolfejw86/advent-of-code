const path = require('path');
const fs = require('fs');

/**
 * 
 * @param {string} line 
 */
const formatPolicyAndPassword = line => {
  const [policy, password] = line.split(': ');
  const [range, letter] = policy.split(' ');
  const [min, max] = range.split('-').map(n => Number(n) - 1);

  return {
    policy,
    password,
    range: { min, max },
    letter,
  }
}

/**
 * 
 * @param {ReturnType<typeof formatPolicyAndPassword>} policy 
 */
const markPasswordValidity = policy => {
  const { range: { min, max } } = policy;
  const hasMin = policy.password[min] === policy.letter;
  const hasMax = policy.password[max] === policy.letter;

  return {
    ...policy,
    isValid: (hasMin && !hasMax) || (hasMax && !hasMin),
  }
}

const solve = () => {
  const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const validatedPolicies = input.split('\n').map(formatPolicyAndPassword).map(markPasswordValidity);
  console.log(validatedPolicies.filter(p => p.isValid).length);
}

solve();
