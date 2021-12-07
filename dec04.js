const BOARD_SIZE = 5;
const MARKED = "•";

const TEST_INPUT = `
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`;

class Board {
  constructor(entries) {
    this.entries = entries;
  }

  // Helper functions for array <-> (row, col) representations.
  static getRowForIndex(i) {
    return Math.floor(i / BOARD_SIZE);
  }

  static getColumnForIndex(i) {
    return i % BOARD_SIZE;
  }

  static getIndex(row, column) {
    return row * BOARD_SIZE + column;
  }

  // Whether the board has a complete row anywhere.
  hasCompleteRow() {
    let hasCompleteRow = false;
    for (let i = 0; i < BOARD_SIZE; i++) {
      // If all entries in that row are •, then we've got bingo.
      const startIndex = i * BOARD_SIZE;
      let rowComplete = true;
      this.entries.slice(startIndex, startIndex + BOARD_SIZE).forEach((x) => {
        if (x !== MARKED) {
          rowComplete = false;
        }
      });
      if (rowComplete) {
        hasCompleteRow = true;
      }
    }
    return hasCompleteRow;
  }

  // Whether the board has a complete column anywhere.
  hasCompleteColumn() {
    let hasCompleteColumn = false;
    for (let i = 0; i < BOARD_SIZE; i++) {
      // If all entries in that column are •, then we've got bingo.
      let columnComplete = true;
      this.entries
        .filter((x, j) => {
          return Board.getColumnForIndex(j) === i;
        })
        .forEach((x) => {
          if (x !== MARKED) {
            columnComplete = false;
          }
        });
      if (columnComplete) {
        hasCompleteColumn = true;
      }
    }
    return hasCompleteColumn;
  }

  // Whether the board is complete.
  isComplete() {
    return this.hasCompleteColumn() || this.hasCompleteRow();
  }

  // If the board contains the given number, mark it with a •
  mark(newNumber) {
    const entries = this.entries;
    this.entries = entries.map((x) => {
      if (x === newNumber) {
        return MARKED;
      }
      return x;
    });
  }

  // Return a sum of all entries that aren't covered with a •
  remainingEntriesSum() {
    // Sum all the remaining numbers on the board.
    const remainingEntries = this.entries.filter((x) => x !== MARKED);
    const sum = remainingEntries.reduce((acc, x) => {
      return acc + parseInt(x);
    }, 0);
    return sum;
  }

  // Useful for debugging.
  prettyPrint() {
    let result = "";
    for (let i = 0; i < BOARD_SIZE; i++) {
      result += this.entries
        .slice(i * BOARD_SIZE, i * BOARD_SIZE + BOARD_SIZE)
        .map((x) => (x.length === 1 ? ` ${x}` : x))
        .join(" ");
      result += "\n";
    }
    console.log(result);
  }
}

const parseInput = (input) => {
  const [rawDrawings, ...rawBoards] = input.trim().split("\n\n");
  const drawings = rawDrawings.split(",");

  const boards = rawBoards.map((rawBoard) => {
    const cleanBoard = rawBoard
      .replace(/\n/g, " ") // Replace newlines
      .replace(/\s{2,}/g, " ") // Replace multispace with single space
      .trim() // Remove any leading/trailing spaces
      .split(" "); // We've now got numbers separated by single-spaces - so split on 'em.
    return new Board(cleanBoard);
  });
  return [drawings, boards];
};

const partOne = (input) => {
  const [drawings, boards] = parseInput(input);
  let winningScore = -1;
  for (const drawing of drawings) {
    for (const board of boards) {
      board.mark(drawing);
      if (board.isComplete() && winningScore === -1) {
        // If we have a complete board, and haven't-yet seen one...
        winningScore = board.remainingEntriesSum() * parseInt(drawing);
      }
    }
  }
  return winningScore;
};

const partTwo = (input) => {
  const [drawings, boards] = parseInput(input);
  let winningScore = -1;
  let completedBoards = new Set();
  for (const drawing of drawings) {
    for (const [boardIndex, board] of boards.entries()) {
      board.mark(drawing);
      // Once we've marked a winningScore for a board, we don't want to revisit
      // it. So let's ignore repeated wins.
      if (board.isComplete() && !completedBoards.has(boardIndex)) {
        winningScore = board.remainingEntriesSum() * parseInt(drawing);
        completedBoards.add(boardIndex);
      }
    }
  }
  return winningScore;
};

console.log(`partOne testInput: ${partOne(TEST_INPUT)}`);
console.log(`partTwo testInput: ${partTwo(TEST_INPUT)}`);

const INPUT = `
17,2,33,86,38,41,4,34,91,61,11,81,3,59,29,71,26,44,54,89,46,9,85,62,23,76,45,24,78,14,58,48,57,40,21,49,7,99,8,56,50,19,53,55,10,94,75,68,6,83,84,88,52,80,73,74,79,36,70,28,37,0,42,98,96,92,27,90,47,20,5,77,69,93,31,30,95,25,63,65,51,72,60,16,12,64,18,13,1,35,15,66,67,43,22,87,97,32,39,82

10 27 53 91 86
15 94 47 38 61
32 68  8 88  9
35 84  3  7 87
62 78 90 66 64

30 51 26 16 57
66 88 47 75 23
61 77 64  9 73
44 32 28 80 81
 3 99 67 49 78

68 92 82 74 83
12 99 80 72  3
56 96 36 28 43
 2  7 14 24  9
63 76 40 37 73

88 66 96 86  7
94 21 70 25 46
28 16 12 69  8
59 43 89 30 55
45 52  0 83 67

21 42 92 30 81
15 98 26 79 48
90 99  5 88 53
 2 67 74 55 33
54 20 69 39 75

53 12  4 86 46
62  7 98  6 23
17 68 39 63 20
29 25 84 87 24
54  5 42  8 45

14 63 36 84 27
72 96 95 99 40
28 68 78  8 46
41 45 33 15 82
65 66 64 49  7

22 35 72 75 47
53 59 17 95 55
25 91 57 10 96
39  3 18 90 64
34 26 71 52 69

72  8 67 92 83
87 89 25 39 78
86 53 55 22 43
21 63 40  9 74
29 56 44 30 80

33 87 52 80 83
70 91 74 63 36
48 49 29 42  6
54 47 96  4 19
53 35 30 43 61

82  7 38 86 79
53 87 21 45 44
10 18 46 30 36
12  1 50  2 59
94  3 39 62 32

68 74 24 97 99
45 75 41 62 34
 3 28 49  1 66
10 91 95 58 38
61 79 50 27 71

69 59 96  5 26
67 16  2 72 28
45 58 55 18 53
74 76 98 38 42
82 22 79 89 87

 3 33 73 66 52
69 29 78 75 34
 1 64 15 17 68
27 32 46 54 18
55 74 60 28 40

 9 54 84  1 42
15 91 77 74 10
55 64 60 22 86
18 58 73  0 23
11 61  2 68 43

75 62 34 89 53
39 10 84 56 21
86 98 87 90 83
17 79  1 19 15
42 67 55  6 77

36  3 60  1 70
63 40  7 88 61
65 96 18 73 30
42 35 44 45 81
77 95 39 24  5

81 24 39 53 89
99 11 27 22 86
 5  8 36 97 28
92 58 38 34 62
32  4  1 74 68

97 20 54 99 67
63 78 61 57 21
28 24  4 98 19
64 77 14 81 30
16 36 89 79 26

73 90  0 28  5
11 27 56 96  1
29 87 12 69  8
63 95 72 86 64
48 46 50 37 57

22  3  7 87 14
90 11 67 76 13
58 49 16 56 59
45 46 19 41 23
75 66 61 51 54

 4  6 84 59 86
18 16 40 79 85
38 98 95 89  5
82 21 76 36 13
71  0 17 47 29

73 41 26 87 95
62 99 58  9 20
45 10 71 28 39
89 17 29 46 81
49 35 24 74 32

62 22 95 86  0
 2 39  9 41 25
59 42 94 74 13
72 69 75 97 21
 6 71 90  4 19

62 75 92 98 10
80 12 57 82 25
 3 65 67 81 15
 1 69 43 14 45
93 53 36 66  4

72 12 47 40 78
68 43 24 28 99
 5 98 70 25 59
 8 10 58 46  7
36 56 37 84 32

37  2 68 52 23
66 80 18 98 84
97 77 96  3 26
12 14 40 42 99
29  9 30 11 44

24 82  7 51 16
96  0 10 92 43
34 80  5 59 57
30 18 72 37 38
31 28 81 87 94

40 93 85 27 69
70  6 41 14 17
58 95 79 24 65
62 48 11 78 43
30 21 19 16 97

90 14 51 98 39
45 56 69 24 38
73 29 88  9 62
72 84 27 18 81
22  7 23 91 68

55 19 29 40 18
63 51 26 93 12
11 50 60 88 65
 9 35 22 97 23
61 69 82 32 28

37 17 81 94  1
19  6  0 49  8
40 25 34 98 63
59 15 53 23 64
66 52 69 84 68

83 86 19 87 93
85 92 24 50 33
 1 41 40 96 26
99 59  9 98  3
45 75 60 52 90

41 40 36 70 57
64 63 72 16 99
50 84 69 89 43
12 55 54 67 53
59 13 42 78 91

98 19 96 21 39
28 48 83 50 97
57  7 12  6 63
38 32 52 66 10
 2 18 42 75 94

75 31 77 20 90
35 14 28 54 95
96 24 86 11 58
 7 50 97 76 63
27 51 34 21 83

60 89 11 38 88
57 36 77 55 18
42 27 67 32 94
12  9 24 10 14
69 35 79 97 50

46 82 60 45  6
84 88  0  7 51
37 52 64 25 74
31  8 75 53 72
11 47 34 40 50

70 96 35 20 26
73 62 54 72  4
29 27  8 46 48
31  0 90 81 16
82 44 88 22 32

73 95 77 66 37
30 68 12 85 11
34  5 57 15 38
22 89 78  7 40
71  1 54 90 39

13 80 22 73 30
49 36 98 75 33
32 95 74 54 56
21 55 68 34 61
60 50  3 38 11

21 80 17  8 46
 7 88 18 22 20
41 73 72  0 34
66 75 45 47 30
44 10 93 28 58

32 50 78 90 29
28 71 77  2 69
79 66 30 40 37
14 11 63 10 60
84 88 65  8 54

86 89 64 69 76
53 82 24 16 51
67 75  3 33 21
23 63 99 13 43
 4 39  7 73 87

 3 38 22 72 80
56 48  1 50 60
49 98 67 53 30
79 61 66  9 45
96 24 23 43 78

62 10 16 52 93
64 81 45 21 23
90 39 98 70 28
57 42 37 47 87
99 48 94 75  9

69 91 72 58 67
13 16 52 86 68
17 40 23 15 83
80 37 85 82 60
22 76  3 89 35

79 61  4  0 89
47  6 10 12 83
13 24 31 50 90
54 99 45 42 98
21 73 39 15 16

25 67 43 16 93
15 98  5 54 57
87 60 64 36  7
65 73 41 44  4
38 52 47 19 30

22 20  1 92 94
52 73 90 14 16
54 59 29  9 44
65 83 89 75 45
72 33 77 15 69

84 46 85 11 41
13 95 28 38  6
96 74 19 32 15
37 70 29 83 14
48 62 92  8 64

26 92 89 37 23
39 97  2 40 42
46 85 52 47 45
77 36 67 10 27
 8 28 24 53 86

52 21 54 91 72
96 53 17 89 51
23 58  5 18  2
13 68 32 47 75
50 97 30 84 86

91 21 13  3 74
33  1  4 95 31
29 52 62 14 10
23 11 56 51 35
47 93  8 70 58

 1 83 91 43  7
58 18 66 47 39
67 62 89 41 35
32 50 96 56 49
11 21 12 80 86

23  3 63 99 42
98 97 66 86 60
73 32 96 52 75
 8 31 59 84 19
93 48 35  0 92

 9 55 36 31 78
24 81  3 10 80
88 42 91 14 87
 6 59 44 30 12
71 68 58  1 57

85 36  3 58 11
16 44 69 60 39
51 31 65 95 87
82 63  8 14 49
67  7 64 91 59

52 65 60 39 22
 1 77 81 91 46
19 18 87 31 88
23 11 32 10 79
 4 50  8 59 68

54 60 99 68 42
40 20 88  5 69
14 27 73 80 30
47 62 33 86 35
72 74 12  8 15

37 32 15 90 21
14 61 52 82 76
44 27 58 51 55
49  2 10 17 79
29 48 71 86 30

36 63 48 89 92
38 71  1 46 41
 3 83 79 14 34
51 11 96 69 35
61 74 99 22 95

25  3  2 88 13
 7 98 22 89 40
30 47 42 43 31
55 65 75 99 24
23 64 29 90 10

57 85 31 17 98
70  3 81 51 34
43 90 23 50 37
13 75 89 25 88
12 99 46 62 36

97 48 96 15 53
45 87 35  0 77
46 72 89 55 54
98 81 69 92 42
95 47 19 33 63

65 58 47 51 17
61 60 43 10  9
 4  2 53  3 25
37 93 18 59 75
42 96 11 32 35

10 96 37 83 17
 2 87 64 18 99
81 73  1  0 66
78 80 42 72 56
59 97 53  9 12

59 97 49 11 58
 6 99 83 27 12
21 67 79 16 57
96  9 39 69 81
18 43 42 45 95

10 37 77 48 85
15 19 71 92 44
57 94 39 28  1
52 46 79 60 38
11 55 65 74 93

10 92 67 91  2
 8 28 47 80 98
48 33  1 21 37
41 15 44 73 17
31 96  5 68 65

87 55 85 48  7
10 53 42 80 84
81 91 68 54 27
32 45 67 76 34
30 62 31 72 12

15 13 94 65  7
42 83 84 55  8
56 78 38 54 87
97 37 67 10 29
 3 96  2 30 14

96 20 38  1 41
51 29 98 21 36
87 32 85 13 66
15 94 61  0 83
 5 43 73 10 39

74 19  4 13 53
31 92 66 40 39
42  3 21 33 95
14 34 23 45 60
16 82 89 44  7

64  7 12 85 32
78 23 26 39 34
42 97 41 54 59
83  4 86 57 98
87 72  0 55 96

32 65 88  4 57
15 79 17 58 70
 8 64 89 14 82
10 40 18 94 75
84 85 92 63 56

19 95 11 31 38
15  0 82 75 13
25 67 78 59 18
99 69 57 21 81
14 63 12 85 35

41 82 78 99 90
15 10  3 87 65
54  2  6 32 22
39 89  4 14  8
85 75 76 25 74

69 43 56 78 26
41 11 40  8 73
64 28 55 52 44
13 33 18 77 88
50 16 60 79 83

34 24 48 22 11
74 60 61 42 26
37 89 84 53  7
38 41 43 31 69
17 64 88 52 14

40 69 43 12 29
39 79 82  0 48
17 87 73 31 71
74 35 34 85  3
76 47 13 80 20

 6 21  8 58 86
10 84 38  5 74
19 62 88 49  1
48 44 59 56  4
60 63 61 16 73

40 99 77  5 11
63 30 68 94 39
36 66 13 47 89
70 22 18 53 96
24 56 87  4 93

 9 29 90 57 60
31 97 52 16 22
36 99 50 87 13
64 84 72  0 71
43 45 68  5  7

64 38 78  3 89
97 25 48 65 57
39 93 77 54  6
49 10 19 53 47
84 69 76 11 86

88 86 29 33 72
14 93 40 36 59
19 71 47 17 91
92 16 67 27 55
51 15  2  5 84

55  2 36 73 61
49 25 96 56 27
42  4 89 39 83
13 14  9 52 51
71 20 92  3  5

81 59 60 45 25
98 94 86 89  8
57 78 51 73 53
14 15 61 71 47
79  0 92  5 55

67 45 73 55 53
27 88 35 85 60
71 24  6 23 21
82 76  3  9 22
86 78  8 44 47

31 89 58 12 71
30 92 81 61 14
 4 39 60 44 94
62 85 65 98  3
88 25 40 56 47

75 85 40 89 19
45 86 81 74 92
62 33 78 37  1
80  2 39 76 68
91  5 79  0 54

56 45 33 86 47
63 73 96 15 95
69 85 22 80 20
51 43 64  0 58
 3  6 29 52 74

74 33 86 65 16
91 80 17 53 88
23 61 90 62 79
 2 95 82 26 49
15 47 77  9 46

27 49 21 51 53
 8 26 97 74 34
38 48 81 98 46
14 80 18 11  9
36 82 66 85 86

44  7 89  5 45
29 48 93 37 41
77 67 21 68 81
96 28 38 49 58
19 80  1  0 50

95 10 63 75 76
77 43 62 46 18
91 79 57 74 85
93 81 35 61 98
86 67 32 80 84

78 41 61 20 40
26 34 69  7 13
49 60 92 22 56
35 99 24 82 29
 0 85 53  1 75

19 18 55 70 84
28 68 71 20  6
27 90 86 52  2
44 43 15 48 39
14 37 63 83 75

73 61 41 96 68
89 40 53 12 91
29 37 59 10 19
69 98 88 82 24
65 72 25 42  4

62 50 34 16  8
75 88 84 33 29
 2 64 31 41 86
94 45 76 70  3
39 89 66  4 24
`;
console.log(`partOne: ${partOne(INPUT)}`);
console.log(`partTwo: ${partTwo(INPUT)}`);
