// src/components/Fretboard.tsx

import React, { useMemo } from "react";
import { standardTuning, getScaleNotes, noteAtFret } from "../utils/music";
import { pitchClass, chroma } from "@tonaljs/note";
import * as Tone from "tone";

interface FretboardProps {
  root: string;
  scale: string;
  frets?: number;
  showLabels: boolean;
  labelType: "note" | "interval";
  playAudio: boolean;
  theme: "dark" | "light";
  patternEnabled: boolean;
  patternOffset: number;
}

const Fretboard: React.FC<FretboardProps> = ({
  root,
  scale,
  frets = 12,
  showLabels,
  labelType,
  playAudio,
  theme,
  patternEnabled,
  patternOffset,
}) => {
  const notesInScale = getScaleNotes(root, scale);
  const scaleSemitones = notesInScale.map((n) => chroma(n));
  const rootSemitone = chroma(root);
  const N = notesInScale.length;
  const offsetMod = ((patternOffset % N) + N) % N;

  const patternDegreesByString = [
    [2, 3, 4],
    [6, 7, 1],
    [3, 4, 5],
    [7, 1, 2],
    [4, 5, 6],
    [1, 2, 3],
  ] as const;

  const patternPositions = useMemo(() => {
    if (!patternEnabled) return [];
    return standardTuning.slice().reverse().map((stringNote, sIdx) => {
      const base = patternDegreesByString[sIdx]
        .map((d) => {
          const shifted = ((d - 1 + offsetMod) % N + N) % N + 1;
          const targetPc = notesInScale[shifted - 1];
          for (let f = 0; f <= frets; f++) {
            if (pitchClass(noteAtFret(stringNote, f)) === targetPc) {
              return f;
            }
          }
          return -1;
        })
        .filter((f): f is number => f >= 0);
      const ext = Array.from(
        new Set(
          base.flatMap((f) => [f, f + 12]).filter((f) => f >= 0 && f <= frets)
        )
      ).sort((a, b) => a - b);
      return ext;
    });
  }, [notesInScale, frets, patternEnabled, offsetMod]);

  const synth = useMemo(() => new Tone.Synth().toDestination(), []);

  const dark = theme === "dark";
  const borderClass = dark ? "border-gray-600" : "border-gray-300";
  const defaultBg = dark ? "bg-gray-900" : "bg-gray-100";
  const defaultText = dark ? "text-gray-600" : "text-gray-500";
  const scaleBg = dark ? "bg-blue-600" : "bg-blue-400";
  const rootBg = dark ? "bg-red-600" : "bg-red-400";
  const dimBg = dark ? "bg-gray-800" : "bg-gray-200";
  const dimText = dark ? "text-gray-600" : "text-gray-400";

  const fretMarkers = new Set([3, 5, 7, 9, 12, 15, 17, 19, 20]);

  const handleClick = async (note: string) => {
    if (!playAudio) return;
    await Tone.start();
    synth.triggerAttackRelease(note, "8n");
  };

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <div
        className="grid w-full gap-1"
        style={{
          gridTemplateColumns: `repeat(${frets + 1}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(6, minmax(0, 1fr))`,
        }}
      >
        {standardTuning.slice().reverse().map((stringNote, sIdx) =>
          Array.from({ length: frets + 1 }, (_, fret) => {
            const full = noteAtFret(stringNote, fret);
            const pc = pitchClass(full);
            const sem = chroma(full);
            const isRoot = sem === rootSemitone;
            const isInScale = scaleSemitones.includes(sem);
            const isInPattern = patternEnabled && patternPositions[sIdx]?.includes(fret);
            const isOpen = fret === 0;

            // Build classes
            const classes: string[] = [
              "relative flex items-center justify-center select-none",
              "border",
              borderClass,
            ];

            if (isOpen) {
              classes.push("rounded-full");
              // apply fill only for pattern or root
              if (patternEnabled && isInPattern) {
                classes.push(scaleBg, "text-white");
              } else if (isRoot) {
                classes.push(rootBg, "text-white");
              } else {
                classes.push("bg-transparent", defaultText);
              }
            } else {
              // Non-open frets: priority highlights
              if (isRoot) {
                classes.push("rounded", rootBg, "text-white");
              } else if (patternEnabled && isInPattern) {
                classes.push("rounded", scaleBg, "text-white");
              } else if (patternEnabled && isInScale) {
                classes.push("rounded", dimBg, dimText);
              } else if (!patternEnabled && isInScale) {
                classes.push("rounded", scaleBg, "text-white");
              } else {
                classes.push("rounded", defaultBg, defaultText);
              }

              // nut and octave lines
              if (fret === 1) classes.push("border-l-4 border-l-gray-100");
              if (fret === 12) classes.push("border-l-2 border-l-gray-100");
            }

            // Determine label
            let label = "";
            if (showLabels && isInScale) {
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
                <span className={showLabels ? "" : "invisible"}>{label}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Fretboard;
