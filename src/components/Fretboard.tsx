/* eslint-disable react-hooks/exhaustive-deps */
// src/components/Fretboard.tsx

import React, { useMemo } from "react";
import { standardTuning, getScaleNotes, noteAtFret } from "../utils/music";
import { pitchClass, chroma } from "@tonaljs/note";
import * as Tone from "tone";

interface FretboardProps {
  root: string;
  scale: string;
  frets?: number;
  labelType: "note" | "interval";
  playAudio: boolean;
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
  playAudio,
  theme,
  patternEnabled,
  patternOffset,
  height = 320,
}) => {
  const notesInScale = getScaleNotes(root, scale);
  const scaleSemitones = notesInScale.map((n) => chroma(n));
  const rootSemitone = chroma(root);
  const N = notesInScale.length;

  // Modes
  const isPentatonic = scale === "pentatonic" || scale === "minor_pentatonic";

  // 3NPS: 3 notes per string for diatonic scales/modes (Ionian, Dorian, etc.)
  const patternDegreesByString3NPS = [
    [2, 3, 4], // E string (6th)
    [6, 7, 1], // A
    [3, 4, 5], // D
    [7, 1, 2], // G
    [4, 5, 6], // B
    [1, 2, 3], // e string (1st)
  ] as const;

  // 2NPS: 2 notes per string for pentatonic, 5 boxes/positions, each rotates for "raise/lower"
  const pentatonicBoxes = [
    [
      [5, 6], // E (G, A)
      [1, 2], // A (C, D)
      [4, 5], // D (F, G)
      [1, 3], // G (C, E)
      [2, 4], // B (D, F)
      [5, 6], // e (G, A)
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

  // Pattern offset logic for both types:
  const boxCount = isPentatonic ? 5 : N;
  const actualOffset = ((patternOffset % boxCount) + boxCount) % boxCount;

  // For pentatonic: patternDegrees is one of the 5 CAGED boxes, rotated by offset
  // For 3NPS: patternDegrees is always the same, but degree shifting is applied in the pattern calculation
  const patternDegrees = isPentatonic
    ? pentatonicBoxes[actualOffset]
    : patternDegreesByString3NPS;

  // This is used in your useMemo for patternPositions:

  const patternPositions = useMemo(() => {
    if (!patternEnabled) return [];

    return standardTuning
      .slice()
      .reverse()
      .map((stringNote, sIdx) => {
        const degrees = patternDegrees[sIdx];

        return (
          degrees
            .map((d) => {
              const degreeIdx = isPentatonic
                ? (d - 1) % N
                : (((d - 1 + actualOffset) % N) + N) % N;
              const targetPc = notesInScale[degreeIdx];
              for (let f = 0; f <= frets; f++) {
                if (pitchClass(noteAtFret(stringNote, f)) === targetPc) {
                  return f;
                }
              }
              return -1;
            })
            .filter((f): f is number => f >= 0)
            // <-- add this part to extend the pattern one octave up:
            .flatMap((f) => [f, f + 12])
            .filter((f) => f >= 0 && f <= frets)
        );
      });
    // Note: dependencies
  }, [
    notesInScale,
    frets,
    patternEnabled,
    patternOffset,
    isPentatonic,
    patternDegrees,
  ]);

  const synth = useMemo(() => new Tone.Synth().toDestination(), []);

  const dark = theme === "dark";
  const borderClass = dark ? "border-gray-600" : "border-gray-300";
  const defaultBg = dark ? "bg-gray-900" : "bg-gray-100";
  const defaultText = dark ? "text-gray-600" : "text-gray-500";
  const scaleBg = dark ? "bg-blue-600" : "bg-blue-400";
  const rootBg = dark ? "bg-red-600" : "bg-red-400";
  const rootDimBg = dark ? "bg-red-900" : "bg-red-100";
  const rootDimText = dark ? "text-red-400" : "text-red-500";
  const dimBg = dark ? "bg-gray-800" : "bg-gray-200";
  const dimText = dark ? "text-gray-600" : "text-gray-400";

  const fretMarkers = new Set([3, 5, 7, 9, 12, 15, 17, 19, 20]);

  const handleClick = async (note: string) => {
    if (!playAudio) return;
    await Tone.start();
    synth.triggerAttackRelease(note, "8n");
  };

  return (
    <div
      className="w-full"
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <div
        className="grid w-full gap-1 h-full"
        style={{
          gridTemplateColumns: `repeat(${frets + 1}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(6, 1fr)`,
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

              // Build classes
              const classes: string[] = [
                "relative flex items-center justify-center select-none",
                "border",
                borderClass,
                "h-full",
              ];

              if (isOpen) {
                classes.push("rounded-full");
                if (patternEnabled) {
                  if (isRoot && isInPattern) {
                    classes.push(rootBg, "text-white");
                  } else if (isRoot && !isInPattern) {
                    classes.push(rootDimBg, rootDimText);
                  } else if (isInPattern) {
                    classes.push(scaleBg, "text-white");
                  } else {
                    classes.push("bg-transparent", defaultText);
                  }
                } else {
                  if (isRoot) {
                    classes.push(rootBg, "text-white");
                  } else {
                    classes.push("bg-transparent", defaultText);
                  }
                }
              } else {
                if (patternEnabled) {
                  if (isRoot && isInPattern) {
                    classes.push("rounded", rootBg, "text-white");
                  } else if (isRoot && !isInPattern) {
                    classes.push("rounded", rootDimBg, rootDimText);
                  } else if (isInPattern) {
                    classes.push("rounded", scaleBg, "text-white");
                  } else if (isInScale) {
                    classes.push("rounded", dimBg, dimText);
                  } else {
                    classes.push("rounded", defaultBg, defaultText);
                  }
                } else {
                  if (isRoot) {
                    classes.push("rounded", rootBg, "text-white");
                  } else if (isInScale) {
                    classes.push("rounded", scaleBg, "text-white");
                  } else {
                    classes.push("rounded", defaultBg, defaultText);
                  }
                }

                // nut and octave lines
                if (fret === 1) classes.push("border-l-4 border-l-gray-100");
                if (fret === 12) classes.push("border-l-2 border-l-gray-100");
              }

              // Determine label
              let label = "";
              if (isInScale) {
                if (labelType === "interval") {
                  const idx = notesInScale.indexOf(pc);
                  label = idx >= 0 ? `${idx + 1}` : "";
                } else {
                  label = pc;
                }
              }

              return (
                <div
                  key={`${sIdx}-${fret}`}
                  onClick={() => handleClick(full)}
                  className={classes.join(" ")}
                >
                  {sIdx === 5 && fretMarkers.has(fret) && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full opacity-50" />
                  )}
                  <span>{label}</span>
                </div>
              );
            })
          )}
      </div>
    </div>
  );
};

export default Fretboard;
