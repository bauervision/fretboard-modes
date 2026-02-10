// src/components/Fretboard.tsx

import React, { useMemo } from "react";
import { standardTuning, getScaleNotes, noteAtFret } from "../utils/music";
import { pitchClass, chroma } from "@tonaljs/note";

interface FretboardProps {
  root: string;
  scale: string;
  frets?: number;
  labelType: "note" | "interval";
  theme: "dark" | "light";
  patternEnabled: boolean;
  patternOffset: number;
  height?: number | string;
}

const Fretboard: React.FC<FretboardProps> = ({
  root,
  scale,
  frets = 12,
  labelType,
  theme,
  patternEnabled,
  patternOffset,
  height = 320,
}) => {
  const notesInScale = getScaleNotes(root, scale);

  // Use chroma for all “is this in the scale” checks (enharmonic-safe)
  const scaleSemitones = useMemo(
    () => notesInScale.map((n) => chroma(n)),
    [notesInScale],
  );
  const rootSemitone = chroma(root);
  const N = notesInScale.length;

  const isPentatonic = scale === "pentatonic" || scale === "minor_pentatonic";

  // 3NPS base degrees (your existing scheme)
  const patternDegreesByString3NPS = [
    [2, 3, 4], // E string (6th)
    [6, 7, 1], // A
    [3, 4, 5], // D
    [7, 1, 2], // G
    [4, 5, 6], // B
    [1, 2, 3], // e string (1st)
  ] as const;

  // NOTE: pentatonicBoxes are known-bad in your report; we leave them as-is for now
  // and focus on fixing the enharmonic issue for diatonic modes first.
  const pentatonicBoxes = [
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
  ];

  const boxCount = isPentatonic ? 5 : N;
  const actualOffset = ((patternOffset % boxCount) + boxCount) % boxCount;

  const patternDegrees = isPentatonic
    ? pentatonicBoxes[actualOffset]
    : patternDegreesByString3NPS;

  const patternPositions = useMemo(() => {
    if (!patternEnabled) return [];

    // Pentatonic: generate 5 “boxes” by sliding a 4-fret window
    if (isPentatonic) {
      const lowE = "E";

      // find a usable root-on-low-E fret (avoid negative offsets for major box 1)
      let baseRootFret = -1;
      for (let f = 0; f <= 11; f++) {
        if (chroma(noteAtFret(lowE, f)) === rootSemitone) {
          baseRootFret = f;
          break;
        }
      }

      // if root is open-string (E), major box 1 needs R-1, so jump to the next octave
      if (baseRootFret === 0 && scale === "pentatonic") baseRootFret = 12;

      if (baseRootFret < 0) return [];

      // Render order is standardTuning.reverse(): [E, B, G, D, A, E]
      // Each entry is 5 boxes; each box is 6 strings; each string is 2 fret offsets relative to baseRootFret.
      const majorBoxes: ReadonlyArray<
        ReadonlyArray<readonly [number, number]>
      > = [
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
      ];

      const minorBoxes: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  // Pos 1 (classic “box 1”)
  // order: [high e, B, G, D, A, low E]
  [[0, 3], [0, 3], [0, 2], [0, 2], [0, 2], [0, 3]],

  // Pos 2
  [[3, 5], [3, 5], [2, 4], [2, 5], [2, 5], [3, 5]],

  // Pos 3
  [[5, 7], [5, 8], [4, 7], [5, 7], [5, 7], [5, 7]],

  // Pos 4
  [[7, 10], [8, 10], [7, 9], [7, 9], [7, 10], [7, 10]],

  // Pos 5
  [[10, 12], [10, 12], [9, 12], [9, 12], [10, 12], [10, 12]],
];


      const boxes = scale === "pentatonic" ? majorBoxes : minorBoxes;
      const box = boxes[actualOffset % 5];

      return standardTuning
        .slice()
        .reverse()
        .map((_stringNote, sIdx) => {
          const [a, b] = box[sIdx];
          const fretsRaw = [baseRootFret + a, baseRootFret + b];

          // extend up an octave so the pattern continues across the board
          const fretsExtended = fretsRaw
            .flatMap((f) => [f, f + 12])
            .filter((f) => f >= 0 && f <= frets);

          // dedupe just in case
          return Array.from(new Set(fretsExtended)).sort((x, y) => x - y);
        });
    }

    // Diatonic modes: your existing 3NPS logic (degree-based)
    return standardTuning
      .slice()
      .reverse()
      .map((stringNote, sIdx) => {
        const degrees = patternDegrees[sIdx];

        return degrees
          .map((d) => {
            const degreeIdx = (((d - 1 + actualOffset) % N) + N) % N;
            const targetSem = chroma(notesInScale[degreeIdx]);

            for (let f = 0; f <= frets; f++) {
              const semAtFret = chroma(noteAtFret(stringNote, f));
              if (semAtFret === targetSem) return f;
            }
            return -1;
          })
          .filter((f): f is number => f >= 0)
          .flatMap((f) => [f, f + 12])
          .filter((f) => f >= 0 && f <= frets);
      });
  }, [
    patternEnabled,
    isPentatonic,
    actualOffset,
    frets,
    scaleSemitones,
    notesInScale,
    N,
    patternDegrees,
  ]);

  const dark = theme === "dark";
  const fretMarkers = new Set([3, 5, 7, 9, 12, 15, 17, 19, 20]);

  // Enharmonic-safe degree lookup (for interval labels)
  function degreeForSemitone(sem: number): number | null {
    const idx = notesInScale.findIndex((n) => chroma(n) === sem);
    return idx >= 0 ? idx + 1 : null;
  }

  return (
    <div
      className="w-full h-full"
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <div className="relative w-full h-full">
        {/* String lines */}
        <div
          className="pointer-events-none absolute inset-0 grid"
          style={{ gridTemplateRows: `repeat(6, 1fr)` }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="relative">
              <div
                className={[
                  "absolute left-0 right-0 top-1/2 -translate-y-1/2",
                  "h-px",
                  dark ? "bg-gray-600/70" : "bg-gray-400/70",
                ].join(" ")}
              />
            </div>
          ))}
        </div>

        {/* Frets + dots */}
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${frets + 1}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(6, 1fr)`,
            columnGap: "0.25rem",
            rowGap: "0.25rem",
          }}
        >
          {standardTuning
            .slice()
            .reverse()
            .map((stringNote, sIdx) =>
              Array.from({ length: frets + 1 }, (_, fret) => {
                const full = noteAtFret(stringNote, fret);
                const pc = pitchClass(full);
                const sem = chroma(full);

                const isRoot = sem === rootSemitone;
                const isInScale = scaleSemitones.includes(sem);
                const isInPattern =
                  patternEnabled && patternPositions[sIdx]?.includes(fret);

                const isOpen = fret === 0;

                let label = "";
                if (isInScale) {
                  if (labelType === "interval") {
                    const deg = degreeForSemitone(sem);
                    label = deg ? String(deg) : "";
                  } else {
                    label = pc;
                  }
                }

                const cellClasses: string[] = [
                  "relative flex items-center justify-center select-none h-full",
                ];

                if (fret > 0) {
                  cellClasses.push(
                    "border-l",
                    dark ? "border-gray-700/50" : "border-gray-300/60",
                  );
                }

                if (fret === 1) {
                  cellClasses.push(
                    "border-l-4",
                    dark ? "border-l-gray-200/90" : "border-l-gray-800/90",
                  );
                }

                if (fret === 12) {
                  cellClasses.push(
                    "border-l-2",
                    dark ? "border-l-gray-200/70" : "border-l-gray-800/70",
                  );
                }

                const showDot = isOpen ? true : isInScale;

                const dotClasses: string[] = [
                  "flex items-center justify-center rounded-full leading-none",
                  "relative z-10",
                  isOpen ? "w-10 h-10" : isInPattern ? "w-8 h-8" : "w-7 h-7",
                ];

                if (isOpen) {
                  dotClasses.push(
                    dark ? "bg-blue-600 text-white" : "bg-blue-500 text-white",
                  );
                } else if (patternEnabled) {
                  if (isRoot && isInPattern) {
                    dotClasses.push(
                      dark ? "bg-red-600 text-white" : "bg-red-500 text-white",
                    );
                  } else if (isRoot && !isInPattern) {
                    dotClasses.push(
                      "border-2",
                      dark
                        ? "border-red-500 text-red-200"
                        : "border-red-500 text-red-700",
                    );
                  } else if (isInPattern) {
                    dotClasses.push(
                      dark
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white",
                    );
                  } else if (isInScale) {
                    dotClasses.push(
                      "border-2",
                      dark
                        ? "border-gray-500 text-gray-200"
                        : "border-gray-400 text-gray-700",
                    );
                  }
                } else {
                  if (isRoot) {
                    dotClasses.push(
                      dark ? "bg-red-600 text-white" : "bg-red-500 text-white",
                    );
                  } else if (isInScale) {
                    dotClasses.push(
                      dark
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white",
                    );
                  }
                }

                const openLabel = pitchClass(stringNote);

                return (
                  <div
                    key={`${sIdx}-${fret}`}
                    className={cellClasses.join(" ")}
                  >
                    {sIdx === 5 && fretMarkers.has(fret) && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full opacity-50" />
                    )}

                    {showDot ? (
                      <div className={dotClasses.join(" ")} title={full}>
                        <span className="text-xs font-semibold">
                          {isOpen ? openLabel : label}
                        </span>
                      </div>
                    ) : null}
                  </div>
                );
              }),
            )}
        </div>
      </div>
    </div>
  );
};

export default Fretboard;
