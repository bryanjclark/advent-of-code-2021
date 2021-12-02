// Day One!
// https://adventofcode.com/2021/day/1

const TEST_INPUT = `
199
200
208
210
200
207
240
269
260
263
`;

// Count the entries that are larger than their predecessor
const partOne = (input) => {
  const parsedInput = input
    .split("\n")
    .map((entry) => parseInt(entry))
    .filter((x) => x);

  let counter = 0;
  let previousValue = parsedInput[0];
  for (const entry of parsedInput) {
    if (entry > previousValue) {
      counter += 1;
    }
    previousValue = entry;
  }

  return counter;
};

const answerOne = partOne(TEST_INPUT);
console.log(`first part: ${answerOne}`);

// Count the "sliding windows" (of size 3) that are larger than their
// predecessor
const partTwo = (input) => {
  const parsedInput = input
    .split("\n")
    .map((entry) => parseInt(entry))
    .filter((x) => x);

  let counter = 0;
  let previousSum = 0;
  for (let i = 0; i < parsedInput.length - 2; i++) {
    const windowEntries = parsedInput.slice(i, i + 3);
    const windowSum = windowEntries.reduce((acc, x) => acc + x, 0);
    if (previousSum && windowSum > previousSum) {
      counter += 1;
    }
    previousSum = windowSum;
  }

  return counter;
};

const answerTwo = partTwo(TEST_INPUT);
console.log(`second part: ${answerTwo}`);
