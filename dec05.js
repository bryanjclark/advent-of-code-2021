// dec05-3.js

const _ = require("lodash");

const TEST_INPUT = `
0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`;

class Line {
  constructor(rawRow) {
    const [firstCoord, secondCoord] = rawRow
      .split(" -> ")
      .map((x) => x.split(","));

    this.x1 = parseInt(firstCoord[0]);
    this.y1 = parseInt(firstCoord[1]);

    this.x2 = parseInt(secondCoord[0]);
    this.y2 = parseInt(secondCoord[1]);
  }

  points(includeDiagonals) {
    const sortedXs = [parseInt(this.x1), parseInt(this.x2)].sort(
      (a, b) => a - b
    );
    const sortedYs = [parseInt(this.y1), parseInt(this.y2)].sort(
      (a, b) => a - b
    );

    let result = [];
    if (this.isHorizontalOrVerticalLine()) {
      for (let x = sortedXs[0]; x <= sortedXs[1]; x++) {
        for (let y = sortedYs[0]; y <= sortedYs[1]; y++) {
          result.push({ x, y });
        }
      }
    } else if (includeDiagonals) {
      const sortedXs = [this.x1, this.x2].sort((a, b) => a - b);
      const sortedYs = [this.y1, this.y2].sort((a, b) => a - b);

      if (
        Math.abs(sortedXs[1] - sortedXs[0]) !==
        Math.abs(sortedYs[1] - sortedYs[0])
      ) {
        // (For testing) double check that all lines are diagonals.
        console.log("broken input! These are all supposed to be diagonals.");
      } else {
        const xIncreases = this.x1 < this.x2;
        const xDelta = xIncreases ? 1 : -1;
        const yIncreases = this.y1 < this.y2;
        const yDelta = yIncreases ? 1 : -1;

        let x = this.x1;
        let y = this.y1;
        let done = false;
        while (!done) {
          result.push({ x, y });
          done = x === this.x2 && y === this.y2;
          x += xDelta;
          y += yDelta;
        }
      }
    }
    return result;
  }

  isHorizontalOrVerticalLine() {
    return this.x1 === this.x2 || this.y1 === this.y2;
  }
}

const parseInput = (input) => {
  const cleanRows = input.trim().split("\n");
  const lines = cleanRows.map((row) => new Line(row));
  return lines;
};

const prettyPrintGrid = (grid) => {
  // Figure out the size of the grid
  const xs = Object.keys(grid)
    .map((key) => key.split("-")[0])
    .map((x) => parseInt(x));
  const ys = Object.keys(grid)
    .map((key) => key.split("-")[1])
    .map((x) => parseInt(x));

  if (xs.length === 0 && ys.length === 0) {
    console.log(`empty grid`);
    return;
  }

  let xMax = _.max(Object.values(xs));
  let yMax = _.max(Object.values(ys));

  let rows = new Array(yMax + 1).fill();
  for (let i = 0; i <= yMax; i++) {
    rows[i] = new Array(xMax + 1).fill(".");
  }

  for (const key of Object.keys(grid)) {
    const [x, y] = key.split("-");
    rows[y][x] = grid[key];
  }

  return rows;
};

// Gonna store the grid as a big ol' Object, keyed by strings e.g. `x,y`
const solution = (input, includeDiagonals) => {
  const grid = {};
  const lines = parseInput(input);

  lines.forEach((line) => {
    line.points(includeDiagonals).forEach((point) => {
      const key = `${point.x}-${point.y}`;
      grid[key] = (grid[key] || 0) + 1;
    });
  });

  const result = Object.values(grid).filter((x) => x > 1);

  return result.length;
};

const INPUT = `
593,10 -> 593,98
777,236 -> 964,236
650,575 -> 476,575
120,612 -> 715,17
508,707 -> 508,89
98,834 -> 751,834
623,554 -> 623,701
929,976 -> 62,109
368,893 -> 330,931
495,335 -> 40,335
44,704 -> 423,704
683,711 -> 683,487
26,940 -> 833,133
961,183 -> 454,183
301,306 -> 301,935
973,822 -> 398,822
639,911 -> 515,911
861,180 -> 184,857
31,97 -> 857,923
966,376 -> 966,114
881,485 -> 881,377
930,98 -> 110,918
841,889 -> 841,35
512,261 -> 880,261
48,533 -> 48,674
207,226 -> 52,226
823,952 -> 177,306
331,566 -> 423,566
422,418 -> 422,130
699,517 -> 699,567
757,784 -> 241,784
508,445 -> 560,393
866,275 -> 435,706
74,41 -> 74,258
386,369 -> 334,317
240,94 -> 240,969
851,197 -> 577,197
28,906 -> 741,193
286,227 -> 286,293
849,800 -> 849,665
736,307 -> 336,307
69,701 -> 494,276
421,823 -> 96,823
121,626 -> 121,393
318,351 -> 194,351
670,671 -> 439,671
603,914 -> 603,272
61,507 -> 61,889
266,39 -> 157,39
543,664 -> 869,664
382,709 -> 884,709
499,80 -> 548,80
489,79 -> 878,79
695,86 -> 644,86
987,585 -> 987,557
287,67 -> 551,67
975,983 -> 35,43
707,351 -> 232,351
529,175 -> 852,175
32,811 -> 604,811
106,153 -> 815,153
195,268 -> 509,582
50,922 -> 312,922
220,500 -> 872,500
473,33 -> 569,33
858,847 -> 162,151
937,947 -> 26,36
726,435 -> 402,435
686,601 -> 474,813
764,880 -> 84,200
850,950 -> 850,464
413,620 -> 413,285
893,560 -> 229,560
149,100 -> 149,901
358,613 -> 243,613
202,445 -> 202,411
127,153 -> 513,539
147,846 -> 53,940
139,920 -> 679,380
913,953 -> 913,735
339,466 -> 339,177
113,882 -> 647,882
18,880 -> 134,880
897,152 -> 897,428
473,511 -> 636,511
880,370 -> 358,370
400,244 -> 721,244
419,987 -> 120,688
872,224 -> 481,224
335,302 -> 730,302
961,324 -> 961,157
769,301 -> 959,301
829,124 -> 144,124
523,372 -> 985,372
520,33 -> 520,685
554,644 -> 808,898
82,676 -> 870,676
303,612 -> 303,705
338,40 -> 338,939
836,47 -> 72,811
371,751 -> 575,955
929,505 -> 929,324
273,181 -> 275,183
347,595 -> 347,463
95,629 -> 95,606
809,188 -> 126,871
857,924 -> 145,212
668,277 -> 668,63
700,904 -> 700,45
814,899 -> 22,899
205,98 -> 714,607
943,28 -> 40,931
282,620 -> 773,129
424,803 -> 285,803
688,329 -> 299,329
146,628 -> 34,628
573,417 -> 164,826
292,232 -> 412,112
412,508 -> 145,508
632,648 -> 632,92
885,904 -> 885,513
295,981 -> 132,818
134,681 -> 41,681
810,531 -> 959,531
188,590 -> 188,215
960,795 -> 189,24
729,211 -> 729,833
214,817 -> 845,817
196,609 -> 584,609
384,908 -> 384,101
770,907 -> 770,530
451,469 -> 451,812
571,261 -> 834,261
799,436 -> 799,983
248,105 -> 248,879
783,906 -> 783,903
955,670 -> 790,670
723,750 -> 723,429
572,427 -> 546,427
610,341 -> 527,341
925,426 -> 816,317
151,403 -> 151,684
408,969 -> 408,369
276,425 -> 276,75
186,86 -> 186,758
412,420 -> 412,531
361,60 -> 976,60
787,649 -> 667,769
45,866 -> 91,866
319,963 -> 51,963
112,866 -> 112,747
291,475 -> 504,475
175,116 -> 357,116
968,961 -> 968,213
13,12 -> 987,986
640,728 -> 767,728
981,505 -> 246,505
864,981 -> 128,981
91,66 -> 931,906
798,116 -> 91,823
552,74 -> 88,538
620,872 -> 232,872
45,229 -> 658,229
413,75 -> 413,436
815,257 -> 815,686
989,22 -> 36,975
178,904 -> 233,849
635,128 -> 635,96
640,820 -> 640,313
890,787 -> 167,64
221,22 -> 826,22
914,132 -> 60,986
848,31 -> 392,487
105,969 -> 858,969
903,868 -> 143,108
38,941 -> 621,358
171,340 -> 14,497
286,460 -> 81,255
726,688 -> 857,819
494,689 -> 510,689
517,913 -> 598,913
932,66 -> 932,431
977,982 -> 18,23
95,101 -> 95,278
574,467 -> 349,467
63,803 -> 63,882
838,874 -> 255,874
900,752 -> 181,33
102,897 -> 989,10
374,439 -> 374,277
513,504 -> 513,885
814,932 -> 814,407
824,656 -> 959,521
415,570 -> 616,570
577,880 -> 577,181
287,524 -> 986,524
955,665 -> 323,665
556,365 -> 263,658
154,226 -> 886,226
803,750 -> 866,750
558,725 -> 558,395
941,115 -> 941,150
180,410 -> 180,874
458,753 -> 112,753
199,253 -> 363,253
423,650 -> 22,650
892,851 -> 279,238
611,109 -> 611,198
983,344 -> 339,988
299,47 -> 299,934
435,652 -> 700,387
186,775 -> 677,284
136,576 -> 136,368
818,744 -> 305,744
767,171 -> 767,431
930,842 -> 259,171
342,831 -> 342,601
193,672 -> 46,525
925,164 -> 528,164
725,92 -> 617,200
67,729 -> 67,739
547,153 -> 547,245
763,434 -> 763,509
314,888 -> 357,888
72,645 -> 491,645
92,67 -> 240,67
827,936 -> 788,897
852,378 -> 77,378
448,337 -> 668,337
846,739 -> 499,739
465,691 -> 315,541
716,163 -> 18,861
78,965 -> 983,60
114,952 -> 820,246
950,351 -> 419,882
266,36 -> 266,482
773,841 -> 773,66
742,198 -> 742,46
417,512 -> 304,625
900,277 -> 900,338
983,431 -> 473,941
986,282 -> 734,30
742,19 -> 769,19
952,320 -> 948,324
92,590 -> 548,590
107,39 -> 107,696
603,749 -> 603,26
55,282 -> 888,282
670,848 -> 985,533
981,982 -> 92,93
147,428 -> 649,930
773,737 -> 821,785
791,576 -> 791,852
327,672 -> 530,469
847,122 -> 381,122
419,493 -> 498,572
879,842 -> 879,239
267,717 -> 267,869
142,449 -> 174,417
342,718 -> 342,397
603,207 -> 314,207
612,648 -> 735,771
37,10 -> 971,944
891,716 -> 891,86
252,217 -> 662,627
185,165 -> 941,921
854,717 -> 676,717
158,791 -> 336,791
762,226 -> 98,890
73,189 -> 92,189
649,511 -> 253,115
719,456 -> 514,251
605,286 -> 325,286
454,609 -> 454,489
374,541 -> 783,541
599,177 -> 94,682
600,384 -> 32,384
810,933 -> 39,162
780,871 -> 409,871
24,639 -> 24,316
454,80 -> 454,95
556,541 -> 907,541
627,295 -> 750,295
245,71 -> 214,102
725,445 -> 614,445
779,538 -> 779,390
746,667 -> 351,272
117,776 -> 117,660
498,495 -> 88,905
697,721 -> 697,919
580,314 -> 580,166
22,656 -> 641,37
413,433 -> 44,802
182,305 -> 805,928
739,277 -> 739,499
172,210 -> 172,259
894,576 -> 894,322
265,263 -> 265,437
430,228 -> 780,578
464,531 -> 798,531
713,63 -> 668,63
918,831 -> 256,169
414,375 -> 467,375
440,32 -> 391,32
439,806 -> 955,806
335,820 -> 335,279
727,458 -> 422,458
312,274 -> 619,581
136,724 -> 538,322
589,680 -> 589,850
335,648 -> 232,545
499,216 -> 405,216
942,710 -> 942,455
969,556 -> 721,556
756,552 -> 756,902
98,870 -> 445,870
476,833 -> 476,269
820,127 -> 407,127
337,519 -> 714,519
756,95 -> 11,840
317,339 -> 317,286
353,86 -> 43,86
93,950 -> 938,105
705,509 -> 705,319
244,879 -> 721,402
434,794 -> 711,517
272,381 -> 431,381
652,104 -> 652,587
850,866 -> 34,50
645,902 -> 79,336
701,39 -> 701,295
492,793 -> 95,396
352,554 -> 395,554
123,405 -> 322,206
941,745 -> 716,520
450,512 -> 569,631
42,25 -> 817,800
909,387 -> 909,863
919,934 -> 919,546
439,881 -> 569,881
167,866 -> 167,669
242,264 -> 242,694
981,786 -> 228,33
452,434 -> 452,660
22,26 -> 22,29
26,155 -> 677,806
801,627 -> 313,627
657,135 -> 657,270
872,875 -> 440,443
636,248 -> 636,338
776,51 -> 93,51
498,600 -> 894,600
263,984 -> 263,807
416,390 -> 899,873
269,137 -> 976,137
752,12 -> 752,617
55,925 -> 548,925
856,551 -> 771,551
653,93 -> 653,587
403,286 -> 403,417
895,706 -> 221,32
139,822 -> 139,928
696,194 -> 696,143
270,678 -> 710,678
879,353 -> 879,360
949,712 -> 752,712
665,661 -> 817,661
462,952 -> 980,434
692,766 -> 692,478
157,117 -> 144,117
438,701 -> 408,701
401,703 -> 401,724
876,831 -> 108,63
749,892 -> 832,892
455,124 -> 455,776
551,222 -> 551,372
533,80 -> 726,80
342,740 -> 56,740
793,370 -> 34,370
949,614 -> 949,623
610,287 -> 610,760
978,834 -> 85,834
644,894 -> 644,341
35,887 -> 176,887
168,958 -> 964,162
341,886 -> 341,470
417,845 -> 417,702
338,347 -> 304,313
651,10 -> 72,10
853,160 -> 853,85
381,568 -> 436,623
794,437 -> 250,437
861,72 -> 206,72
807,813 -> 807,827
820,502 -> 820,329
547,508 -> 547,773
160,129 -> 160,175
756,468 -> 756,80
442,661 -> 405,661
304,817 -> 304,765
99,42 -> 957,900
212,110 -> 854,752
44,620 -> 661,620
212,311 -> 784,883
329,671 -> 329,908
86,359 -> 553,826
257,799 -> 934,122
409,663 -> 409,367
528,623 -> 593,688
957,525 -> 544,938
846,766 -> 113,33
176,680 -> 176,102
167,287 -> 167,929
932,870 -> 834,968
86,774 -> 49,774
745,231 -> 70,906
435,760 -> 138,463
776,810 -> 625,810
928,930 -> 76,78
602,24 -> 602,688
394,424 -> 65,424
946,966 -> 93,113
494,39 -> 951,39
607,699 -> 832,699
13,403 -> 391,403
726,475 -> 726,29
828,625 -> 836,617
396,770 -> 167,770
28,546 -> 374,200
56,113 -> 837,894
290,589 -> 740,139
930,805 -> 296,171
646,895 -> 49,895
111,15 -> 111,497
11,274 -> 570,833
257,624 -> 603,624
63,844 -> 666,844
846,661 -> 846,464
431,72 -> 431,674
726,674 -> 726,40
286,660 -> 286,909
847,222 -> 847,861
325,896 -> 325,416
793,953 -> 365,953
987,956 -> 62,31
845,853 -> 363,371
79,782 -> 506,782
424,21 -> 424,369
938,162 -> 177,923
86,193 -> 799,906
320,164 -> 320,654
840,306 -> 840,711
852,736 -> 852,690
876,966 -> 143,233
787,926 -> 38,177
374,112 -> 340,112
132,541 -> 740,541
29,28 -> 968,967
916,212 -> 170,958
371,553 -> 521,403
88,796 -> 870,796
656,367 -> 71,367
785,166 -> 785,427
320,30 -> 320,549
909,527 -> 816,620
832,965 -> 302,965
672,259 -> 80,259
578,513 -> 578,243
975,561 -> 537,123
135,330 -> 188,330
501,695 -> 501,573
717,230 -> 878,230
854,501 -> 27,501
705,885 -> 950,885
704,338 -> 704,630
477,485 -> 864,485
901,42 -> 305,638
660,540 -> 660,546
555,79 -> 190,79
226,126 -> 800,700
575,908 -> 944,908
94,478 -> 94,746
461,425 -> 929,893
861,429 -> 451,19
832,825 -> 179,172
186,133 -> 298,133
684,270 -> 558,270
786,872 -> 125,872
649,178 -> 649,595
893,738 -> 412,257
760,854 -> 901,713
16,914 -> 866,64
935,928 -> 266,259
323,229 -> 32,229
608,828 -> 608,49
715,892 -> 74,251
787,187 -> 787,903
405,793 -> 405,183
232,704 -> 232,389
130,706 -> 130,657
`;
console.log(`part one: ${solution(INPUT, false)}`);
console.log(`part two: ${solution(INPUT, true)}`);
