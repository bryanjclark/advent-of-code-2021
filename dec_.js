// https://lodash.com/docs/4.17.15
const _ = require("lodash");

const TEST_INPUT = `
a
b
c
d
`;

const parseInput = (input) => {
  return input.trim().split("\n");
};

const foo = (x) => {
  return -1;
};

const partOne = (input) => {
  const parsed = parseInput(input);
  return _.join(parsed);
};

const partTwo = (input) => {
  const parsed = parseInput(input);
  return -1;
};

console.log(`partOne testInput: ${partOne(TEST_INPUT)}`);
console.log(`partTwo testInput: ${partTwo(TEST_INPUT)}`);

const INPUT = ``;
console.log(`partOne: ${partOne(INPUT)}`);
console.log(`partTwo: ${partTwo(INPUT)}`);
