// https://lodash.com/docs/4.17.15
const _ = require("lodash");

const TEST_INPUT = `3,4,3,1,2`;

const parseInput = (input) => {
  let fishArray = input
    .trim()
    .split(",")
    .map((x) => parseInt(x));

  let result = new Array(9).fill(0);
  for (const fish of fishArray) {
    result[fish] += 1;
  }

  return result;
};

const solution = (input, numDays) => {
  // The state is an array of length 9 (so, 0 through 8)
  let state = parseInput(input);
  for (let i = 0; i < numDays; i++) {
    const birthing = state.shift();
    state.push(birthing);
    state[6] += birthing;
  }
  const totalCount = _.sum(state);
  return totalCount;
};

console.log(`partOne testInput: ${solution(TEST_INPUT, 80)}`);
console.log(`partTwo testInput: ${solution(TEST_INPUT, 256)}`);

const INPUT = `2,1,1,4,4,1,3,4,2,4,2,1,1,4,3,5,1,1,5,1,1,5,4,5,4,1,5,1,3,1,4,2,3,2,1,2,5,5,2,3,1,2,3,3,1,4,3,1,1,1,1,5,2,1,1,1,5,3,3,2,1,4,1,1,1,3,1,1,5,5,1,4,4,4,4,5,1,5,1,1,5,5,2,2,5,4,1,5,4,1,4,1,1,1,1,5,3,2,4,1,1,1,4,4,1,2,1,1,5,2,1,1,1,4,4,4,4,3,3,1,1,5,1,5,2,1,4,1,2,4,4,4,4,2,2,2,4,4,4,2,1,5,5,2,1,1,1,4,4,1,4,2,3,3,3,3,3,5,4,1,5,1,4,5,5,1,1,1,4,1,2,4,4,1,2,3,3,3,3,5,1,4,2,5,5,2,1,1,1,1,3,3,1,1,2,3,2,5,4,2,1,1,2,2,2,1,3,1,5,4,1,1,5,3,3,2,2,3,1,1,1,1,2,4,2,2,5,1,2,4,2,1,1,3,2,5,5,3,1,3,3,1,4,1,1,5,5,1,5,4,1,1,1,1,2,3,3,1,2,3,1,5,1,3,1,1,3,1,1,1,1,1,1,5,1,1,5,5,2,1,1,5,2,4,5,5,1,1,5,1,5,5,1,1,3,3,1,1,3,1`;
console.log(`partOne: ${solution(INPUT, 80)}`);
console.log(`partTwo: ${solution(INPUT, 256)}`);
