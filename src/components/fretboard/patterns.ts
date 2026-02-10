// src/components/fretboard/patterns.ts

export const patternDegreesByString3NPS = [
  [2, 3, 4], // low E (6th)
  [6, 7, 1], // A
  [3, 4, 5], // D
  [7, 1, 2], // G
  [4, 5, 6], // B
  [1, 2, 3], // high e (1st)
] as const;

// Degree-based pentatonic boxes (legacy / not currently used for the 2NPS rendering)
// Kept here because you referenced it and may want to revisit it later.
export const pentatonicBoxes = [
  [
    [5, 6],
    [1, 2],
    [4, 5],
    [1, 3],
    [2, 4],
    [5, 6],
  ],
  [
    [6, 1],
    [2, 3],
    [5, 6],
    [2, 4],
    [3, 5],
    [6, 1],
  ],
  [
    [1, 2],
    [3, 4],
    [6, 1],
    [3, 5],
    [4, 6],
    [1, 2],
  ],
  [
    [2, 3],
    [4, 5],
    [1, 2],
    [4, 6],
    [5, 1],
    [2, 3],
  ],
  [
    [3, 4],
    [5, 6],
    [2, 3],
    [5, 1],
    [6, 2],
    [3, 4],
  ],
] as const;

// NOTE ON ORDER:
// Fretboard renders strings as standardTuning.reverse():
// [high e, B, G, D, A, low E]
export type TwoFretSpan = readonly [number, number];
export type BoxByString = ReadonlyArray<TwoFretSpan>; // length 6
export type Boxes5 = ReadonlyArray<BoxByString>; // length 5

export const majorPentatonicBoxes2Nps: Boxes5 = [
  // Box 1
  [
    [0, 2],
    [0, 2],
    [-1, 1],
    [-1, 2],
    [-1, 2],
    [0, 2],
  ],
  // Box 2
  [
    [2, 4],
    [2, 5],
    [1, 4],
    [2, 4],
    [2, 4],
    [2, 4],
  ],
  // Box 3
  [
    [4, 7],
    [5, 7],
    [4, 6],
    [4, 6],
    [4, 7],
    [4, 7],
  ],
  // Box 4
  [
    [7, 9],
    [7, 9],
    [6, 9],
    [6, 9],
    [7, 9],
    [7, 9],
  ],
  // Box 5
  [
    [9, 12],
    [9, 12],
    [9, 11],
    [9, 11],
    [9, 12],
    [9, 12],
  ],
] as const;

export const minorPentatonicBoxes2Nps: Boxes5 = [
  // Pos 1 (classic “box 1”)
  [[0, 3], [0, 3], [0, 2], [0, 2], [0, 2], [0, 3]],

  // Pos 2
  [[3, 5], [3, 5], [2, 4], [2, 5], [2, 5], [3, 5]],

  // Pos 3
  [[5, 7], [5, 8], [4, 7], [5, 7], [5, 7], [5, 7]],

  // Pos 4
  [[7, 10], [8, 10], [7, 9], [7, 9], [7, 10], [7, 10]],

  // Pos 5
  [[10, 12], [10, 12], [9, 12], [9, 12], [10, 12], [10, 12]],
] as const;
