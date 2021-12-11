// https://lodash.com/docs/4.17.15
const _ = require("lodash");

const TEST_INPUT = `
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`;

const parseInput = (input) => {
  return input
    .trim()
    .split("\n")
    .map((row) => row.split("").map((x) => parseInt(x)));
};

const foo = (x) => {
  return -1;
};

const hasUnresolvedFlashes = (state) => {
  return state.flat().findIndex((x) => x === "•") !== -1;
};

const getNeighbors = (row, col, rowLength) => {
  const neighbors = [
    [row - 1, col - 1],
    [row + 0, col - 1],
    [row + 1, col - 1],

    [row - 1, col],
    [row + 1, col],

    [row - 1, col + 1],
    [row + 0, col + 1],
    [row + 1, col + 1],
  ];

  const validNeighbors = neighbors.filter(
    (pair) => Math.max(...pair) < rowLength && Math.min(...pair) >= 0
  );

  return validNeighbors;
};

const incrementNumber = (x) => {
  if (x === "•" || x === "*") {
    return x;
  } else if (x < 9) {
    return x + 1;
  } else if (x === 9) {
    return "•";
  }
};

// All the logic for incrementing the state for one turn. (Increase values,
// flash octopuses & increment their neighbors, restore flashed octopuses to 0).
const iterateState = (state) => {
  let flashCount = 0;

  // First, we increase every octopus' level by one. (Greater than 9 will be
  // represented by a •, then a * once they have flashed.)
  state = state.map((row) => {
    return row.map(incrementNumber);
  });

  // Now we'll process all the unresolved flashes (• character)
  while (hasUnresolvedFlashes(state)) {
    // Get the first unresolved flash, and resolve it.
    const firstUnresolvedFlash = state.flat().findIndex((x) => x === "•");

    // Flash it!
    const rowLength = state[0].length;
    const row = Math.floor(firstUnresolvedFlash / rowLength);
    const col = firstUnresolvedFlash % rowLength;
    state[row][col] = "*";
    flashCount += 1;

    for (const [r, c] of getNeighbors(row, col, rowLength)) {
      state[r][c] = incrementNumber(state[r][c]);
    }
  }

  // Now set all flashed "*" to 0
  state = state.map((row) => {
    return row.map((x) => (x === "*" ? 0 : x));
  });

  return [state, flashCount];
};

const partOne = (input) => {
  let state = parseInput(input);
  let flashCount = 0;
  let stepCount = 0;
  while (stepCount < 100) {
    [state, newFlashes] = iterateState(state);
    flashCount += newFlashes;
    stepCount += 1;
  }

  return flashCount;
};

const partTwo = (input) => {
  let state = parseInput(input);
  let allFlashCount = null;
  let stepCount = 0;
  while (!allFlashCount) {
    state = iterateState(state)[0];
    stepCount += 1;

    // If all the numbers are zero, then we've flashed everyone at the same
    // time.
    if (state.flat().every((x) => x === 0)) {
      allFlashCount = stepCount;
    }
  }
  return allFlashCount;
};

console.log(`partOne testInput: ${partOne(TEST_INPUT, 100)}`);
console.log(`partTwo testInput: ${partTwo(TEST_INPUT)}`);

const INPUT = `
6744638455
3135745418
4754123271
4224257161
8167186546
2268577674
7177768175
2662255275
4655343376
7852526168
`;
console.log(`partOne: ${partOne(INPUT, 100)}`);
console.log(`partTwo: ${partTwo(INPUT)}`);
