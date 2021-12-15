// https://lodash.com/docs/4.17.15
const _ = require("lodash");

const TEST_INPUT = `
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`;

const getStateDictFromString = (string) => {
  const state = [];
  for (let i = 0; i < string.length - 1; i++) {
    const key = string.slice(i, i + 2);
    if (state[key]) {
      state[key] += 1;
    } else {
      state[key] = 1;
    }
  }
  const stateLast = string.slice(-1);
  return { state, stateLast };
};

const parseInput = (input) => {
  const [stateRaw, instructionsRaw] = input
    .trim()
    .split("\n\n")
    .map((x) => x.trim());

  const instructions = instructionsRaw
    .split("\n")
    .map((line) => line.split(" -> "));

  const { state, stateLast } = getStateDictFromString(stateRaw);
  return { state, instructions, stateLast };
};

const advanceState = (state, instructions) => {
  // If a string matches an instruction, evolve it, otherwise just keep it.
  const knownPairs = Object.keys(state);

  const unaffectedSubstate = {};
  const affectedSubstate = {};
  for (const k of knownPairs) {
    const applicableInstructions = instructions.filter((i) => i[0] === k);
    if (applicableInstructions.length === 0) {
      unaffectedSubstate[k] = state[k];
    } else {
      affectedSubstate[k] = state[k];
    }
  }

  // Unaffected pairs just stick around.
  const newState = { ...unaffectedSubstate };

  // For each affected pair, we replace it with the results of the split.
  for (const k of Object.keys(affectedSubstate)) {
    const applicableInstruction = instructions.filter((i) => i[0] === k);
    if (applicableInstruction.length !== 1) {
      console.log("hmm... this should not happen?");
    } else {
      // Get the new keys
      const i = applicableInstruction[0];
      const newKeyA = `${i[0][0]}${i[1]}`;
      const newKeyB = `${i[1]}${i[0][1]}`;

      // Insert them in the new state.
      const newCount = affectedSubstate[k];
      for (const spawn of [newKeyA, newKeyB]) {
        if (newState[spawn]) {
          newState[spawn] = newState[spawn] + newCount;
        } else {
          newState[spawn] = newCount;
        }
      }
    }
  }

  return newState;
};

const getCharacterCounts = (string) => {
  const stringArray = string.split("");
  let counts = {};
  for (const char of stringArray) {
    counts[char] = 0;
  }
  for (const char of stringArray) {
    counts[char] += 1;
  }
  return counts;
};

const getCharacterCountsFromState = (state, stateLast) => {
  let result = {};
  const firstCharacters = Object.keys(state).map((k) => {
    // Just keep the first character in each key - repeated times the number of entries
    const char = k[0];
    const count = state[k];
    if (result[char]) {
      result[char] += count;
    } else {
      result[char] = count;
    }
  });
  if (result[stateLast]) {
    result[stateLast] += 1;
  } else {
    result[stateLast] = 1;
  }

  // Not sure where the `undefined` is coming from, but let's get rid of it.
  result = _.omit(result, undefined);
  return result;
};

const evolve = (state, instructions, numSteps, stateLast) => {
  let newState = { ...state };
  for (let i = 0; i < numSteps; i++) {
    newState = advanceState(newState, instructions);
  }
  return getCharacterCountsFromState(newState, stateLast);
};

const runTests = () => {
  const expected = [
    "NNCB",
    "NCNBCHB",
    "NBCCNBBBCBHCB",
    "NBBBCNCCNBBNBNBBCHBHHBCHB",
    "NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB",
  ].map(getCharacterCounts);

  for (let i = 0; i < expected.length; i++) {
    const { state, instructions, stateLast } = parseInput(TEST_INPUT);
    const result = evolve(state, instructions, i, stateLast);
    const e = expected[i];
    let match = true;
    for (const eKey of Object.keys(e)) {
      if (result[eKey] !== e[eKey]) {
        match = false;
      }
    }
    for (const rKey of Object.keys(result)) {
      if (result[rKey] !== e[rKey]) {
        match = false;
      }
    }
    console.log(`step ${i}: ${match}`);
    if (!match) {
      console.log("welp");
    }
  }
};

// runTests();

const testInputCounter = () => {
  const strings = [
    "NNCB",
    "NCNBCHB",
    "NBCCNBBBCBHCB",
    "NBBBCNCCNBBNBNBBCHBHHBCHB",
    "NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB",
  ];

  strings.forEach((s) => {
    const { state, stateLast } = getStateDictFromString(s);
    const expected = getCharacterCounts(s);
    const actual = getCharacterCountsFromState(state, stateLast);
    let match = true;
    for (const eKey of Object.keys(expected)) {
      if (actual[eKey] !== expected[eKey]) {
        match = false;
      }
    }
    for (const aKey of Object.keys(actual)) {
      if (actual[aKey] !== expected[aKey]) {
        match = false;
      }
    }
    if (!match) {
      console.log("uh oh");
    }
  });

  console.log("test input counter done");
};
// testInputCounter();

const partOne = (input) => {
  let { state, instructions, stateLast } = parseInput(input);
  const result = evolve(state, instructions, 10);

  // Now count the characters
  const counts = getCharacterCountsFromState(result, stateLast);

  // Get the most common and least common character.
  const minNumber = Math.min(...Object.values(counts));
  const maxNumber = Math.max(...Object.values(counts));

  return maxNumber - minNumber;
};

const partTwo = (input) => {
  let { state, instructions, stateLast } = parseInput(input);
  const result = evolve(state, instructions, 40);

  // Now count the characters
  const counts = getCharacterCountsFromState(result, stateLast);

  // Get the most common and least common character.
  const minNumber = Math.min(...Object.values(counts));
  const maxNumber = Math.max(...Object.values(counts));

  return maxNumber - minNumber;
};

console.log(`partOne testInput: ${partOne(TEST_INPUT)}`);
console.log(`partTwo testInput: ${partTwo(TEST_INPUT)}`);

const INPUT = `
PFVKOBSHPSPOOOCOOHBP

FV -> C
CP -> K
FS -> K
VF -> N
HN -> F
FF -> N
SS -> K
VS -> V
BV -> F
HC -> K
BP -> F
OV -> N
BF -> V
VH -> V
PF -> N
FC -> S
CS -> B
FK -> N
VK -> H
FN -> P
SH -> V
CV -> K
HP -> K
HO -> C
NO -> V
CK -> C
VB -> S
OC -> N
NS -> C
NF -> H
SF -> N
NK -> S
NP -> P
OO -> S
NH -> C
BC -> H
KS -> H
PV -> O
KO -> K
OK -> H
OH -> H
BH -> F
NB -> B
FH -> N
HV -> F
BN -> S
ON -> V
CB -> V
CF -> H
FB -> S
KF -> S
PS -> P
OB -> C
NN -> K
KV -> C
BK -> H
SN -> S
NC -> H
PK -> B
PC -> H
KN -> S
VO -> V
FO -> K
CH -> B
PH -> N
SO -> C
KH -> S
HB -> V
HH -> B
BB -> H
SC -> V
HS -> K
SP -> V
KB -> N
VN -> H
HK -> H
KP -> K
OP -> F
CO -> B
VP -> H
OS -> N
OF -> H
KK -> N
CC -> K
BS -> C
VV -> O
CN -> H
PB -> P
BO -> N
SB -> H
FP -> F
SK -> F
PO -> S
KC -> H
VC -> H
NV -> N
HF -> B
PN -> F
SV -> K
PP -> K
`;
console.log(`partOne: ${partOne(INPUT)}`);
console.log(`partTwo: ${partTwo(INPUT)}`);
