// https://lodash.com/docs/4.17.15
const _ = require("lodash");

const TEST_INPUT = `
start-A
start-b
A-c
A-b
b-d
A-end
b-end
`;

const parseInput = (input) => {
  return input
    .trim()
    .split("\n")
    .map((x) => x.split("-"));
};

const canVisit = (path, input, candidateSegment, isPartTwo) => {
  // You can visit the candidate if (a) it's `end`, (b) it's uppercase (and
  // you're not just looping back and forth in an infinite loop), or (c) it's
  // lowercase (and you haven't visited it already).

  const currentNode = path[path.length - 1];
  if (currentNode === "end") {
    return false;
  }

  if (!candidateSegment.includes(currentNode)) {
    return false;
  }

  const otherNode = candidateSegment.filter(
    (x) => x !== path[path.length - 1]
  )[0];

  // Can't go back to the start.
  if (otherNode === "start") {
    return false;
  }

  if (otherNode === "end") {
    return true;
  }

  if (otherNode.toUpperCase() === otherNode) {
    // There aren't infinite loops in the input as far as I can tell - so YAGNI
    // for now.
    return true;
  }

  if (isPartTwo) {
    // We can only visit a single lowercase cave twice.
    // Have any small caves have been visited twice?
    const lowercaseCavesInPath = path.filter(
      (cave) =>
        cave.toUpperCase() !== cave && cave !== "start" && cave !== "end"
    );
    const uniques = _.uniq(lowercaseCavesInPath);
    if (uniques.length !== lowercaseCavesInPath.length) {
      // If we've already visited a cave twice, then we can only return true if
      // this is a new lowercase cave.
      return !lowercaseCavesInPath.includes(otherNode);
    } else {
      return true;
    }
  } else {
    const previousMatches = path.filter((x) => x === otherNode).length;
    return previousMatches === 0;
  }
};

const solve = (input, isPartTwo) => {
  const parsed = parseInput(input);

  let paths = [];
  const exploreNextPath = (path) => {
    // Get all paths that include the current node.
    const currentNode = path[path.length - 1];
    const options = parsed.filter((x) => canVisit(path, parsed, x, isPartTwo));

    // For each path, recursively get its path.
    for (const option of options) {
      const otherNode = option.filter((x) => x !== path[path.length - 1])[0];
      const nextIteration = [...path, otherNode];
      if (otherNode === "end") {
        paths.push(nextIteration);
      } else {
        exploreNextPath(nextIteration);
      }
    }
  };
  exploreNextPath(["start"]);

  paths = paths.sort();

  return paths.length;
};

// const partOne = (input) => {
//   return solve(input, false);
// };

const partTwo = (input) => {
  return solve(input, true);
};

console.log(`partOne testInput: ${partOne(TEST_INPUT)}`);
console.log(`partTwo testInput: ${partTwo(TEST_INPUT)}`);

const INPUT = `
xz-end
CJ-pt
pt-QW
hn-SP
pw-CJ
SP-end
hn-pt
GK-nj
fe-nj
CJ-nj
hn-ZZ
hn-start
hn-fe
ZZ-fe
SP-nj
SP-xz
ZZ-pt
nj-ZZ
start-ZZ
hn-GK
CJ-end
start-fe
CJ-xz
`;
console.log(`partOne: ${partOne(INPUT)}`);
console.log(`partTwo: ${partTwo(INPUT)}`);
