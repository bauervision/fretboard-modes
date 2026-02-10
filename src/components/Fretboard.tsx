// src/components/Fretboard.tsx

import { useMemo } from "react";
import { standardTuning, getScaleNotes, noteAtFret } from "../utils/music";
import { pitchClass, chroma } from "@tonaljs/note";
import {
  patternDegreesByString3NPS,
  majorPentatonicBoxes2Nps,
  minorPentatonicBoxes2Nps,
} from "./fretboard/patterns";

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

function normalizeScaleKey(scale: string): string {
  return scale.trim().toLowerCase().replace(/\s+/g, "_");
}

function clampBoxOffset(offset: number, boxCount: number): number {
  return ((offset % boxCount) + boxCount) % boxCount;
}

function degreeForSemitone(notesInScale: string[], sem: number): number | null {
  const idx = notesInScale.findIndex((n) => chroma(n) === sem);
  return idx >= 0 ? idx + 1 : null;
}

export default function Fretboard({
  root,
  scale,
  frets = 12,
  labelType,
  theme,
  patternEnabled,
  patternOffset,
  height = 320,
}: FretboardProps) {
  const scaleKey = useMemo(() => normalizeScaleKey(scale), [scale]);

  const notesInScale = getScaleNotes(root, scaleKey);

  // Use chroma for all “is this in the scale” checks (enharmonic-safe)
  const scaleSemitones = useMemo(
    () => notesInScale.map((n) => chroma(n)),
    [notesInScale],
  );

  const rootSemitone = chroma(root);

  const isPentatonic =
    scaleKey === "pentatonic" ||
    scaleKey === "major_pentatonic" ||
    scaleKey === "minor_pentatonic";

  const N = notesInScale.length;
  const boxCount = isPentatonic ? 5 : N;
  const actualOffset = clampBoxOffset(patternOffset, boxCount);

  const dark = theme === "dark";
  const fretMarkers = new Set([3, 5, 7, 9, 12, 15, 17, 19, 20]);

  const patternPositions = useMemo(() => {
    if (!patternEnabled) return [];

    // -------------------------
    // Pentatonic 2NPS patterns
    // -------------------------
    if (isPentatonic) {
      // find a usable root-on-low-E fret (0..11)
      let baseRootFret = -1;
      for (let f = 0; f <= 11; f++) {
        if (chroma(noteAtFret("E", f)) === rootSemitone) {
          baseRootFret = f;
          break;
        }
      }
      if (baseRootFret < 0) return [];

      const boxes =
        scaleKey === "minor_pentatonic"
          ? minorPentatonicBoxes2Nps
          : majorPentatonicBoxes2Nps;

      const box = boxes[actualOffset % 5];

      // Only shift octaves if THIS box would go negative,
      // and shift down if THIS box would run off the right edge.
      const allOffsets = box.flatMap(([a, b]) => [a, b]);
      const minOff = Math.min(...allOffsets);
      const maxOff = Math.max(...allOffsets);

      if (baseRootFret + minOff < 0) baseRootFret += 12;
      if (baseRootFret + maxOff > frets && baseRootFret - 12 >= 0)
        baseRootFret -= 12;

      // Render order is standardTuning.reverse(): [high e, B, G, D, A, low E]
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

          return Array.from(new Set(fretsExtended)).sort((x, y) => x - y);
        });
    }

    // -------------------------
    // Diatonic modes: 3NPS logic
    // -------------------------
    const patternDegrees = patternDegreesByString3NPS;

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
    notesInScale,
    N,
    rootSemitone,
    scaleKey,
  ]);

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
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px"
                style={{
                  background: dark
                    ? "rgba(159, 183, 193, 0.30)"
                    : "rgba(27, 42, 65, 0.22)",
                }}
              />
            </div>
          ))}
        </div>

        {/* Fret lines */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: frets + 1 }, (_, fret) => {
            if (fret === 0) return null;

            const isNut = fret === 1;
            const isOctave = fret === 12;

            const leftPct = (fret / (frets + 1)) * 100;

            const widthPx = isNut ? 4 : isOctave ? 2 : 1;

            const bg = isNut
              ? dark
                ? "rgba(244, 247, 248, 0.68)"
                : "rgba(27, 42, 65, 0.62)"
              : dark
                ? "rgba(159, 183, 193, 0.24)"
                : "rgba(27, 42, 65, 0.20)";

            return (
              <div
                key={fret}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${leftPct}%`,
                  width: `${widthPx}px`,
                  transform: "translateX(-0.5px)",
                  background: bg,
                }}
              />
            );
          })}
        </div>

        {/* Frets + dots */}
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${frets + 1}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(6, 1fr)`,
            columnGap: "0",
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
                    const deg = degreeForSemitone(notesInScale, sem);
                    label = deg ? String(deg) : "";
                  } else {
                    label = pc;
                  }
                }

                const cellClasses: string[] = [
                  "relative flex items-center justify-center select-none h-full",
                  "px-1",
                ];

                const showDot = isOpen ? true : isInScale;

                const dotClasses: string[] = [
                  "flex items-center justify-center rounded-full leading-none",
                  "relative z-10",
                  isOpen ? "w-10 h-10" : isInPattern ? "w-8 h-8" : "w-7 h-7",
                ];

                // Class-only decisions (border width)
                if (isOpen) {
                  dotClasses.push("text-white");
                } else if (patternEnabled) {
                  if (isRoot && isInPattern) {
                    dotClasses.push("text-white");
                  } else if (isRoot && !isInPattern) {
                    dotClasses.push("border-2");
                  } else if (isInPattern) {
                    dotClasses.push("text-white");
                  } else if (isInScale) {
                    // Out-of-position scale tones: thinner outline
                    dotClasses.push("border");
                  }
                } else {
                  if (isRoot) {
                    dotClasses.push("text-white");
                  } else if (isInScale) {
                    dotClasses.push("text-white");
                  }
                }

                const style: React.CSSProperties = {};

                if (isOpen) {
                  style.backgroundColor = "var(--brand-primary)";
                } else if (patternEnabled) {
                  if (isRoot && isInPattern) {
                    style.backgroundColor = "var(--accent-root)";
                  } else if (isRoot && !isInPattern) {
                    style.borderColor = dark
                      ? "rgba(31,164,169,0.70)"
                      : "rgba(31,164,169,0.82)";
                    style.color = dark
                      ? "rgba(31,164,169,0.85)"
                      : "rgba(15,76,92,0.90)";
                    style.backgroundColor = dark
                      ? "rgba(31,164,169,0.05)"
                      : "rgba(31,164,169,0.06)";
                  } else if (isInPattern) {
                    style.backgroundColor = "var(--brand-primary)";
                  } else if (isInScale) {
                    // Extremely muted “out of position” scale tones
                    style.borderColor = dark
                      ? "rgba(159,183,193,0.22)"
                      : "rgba(27,42,65,0.18)";
                    style.backgroundColor = dark
                      ? "rgba(255,255,255,0.015)"
                      : "rgba(0,0,0,0.02)";
                    style.color = dark
                      ? "rgba(244,247,248,0.42)"
                      : "rgba(27,42,65,0.55)";
                  }
                } else {
                  if (isRoot) {
                    style.backgroundColor = "var(--accent-root)";
                  } else if (isInScale) {
                    style.backgroundColor = "var(--brand-primary)";
                  }
                }

                const openLabel = pitchClass(stringNote);

                return (
                  <div
                    key={`${sIdx}-${fret}`}
                    className={cellClasses.join(" ")}
                  >
                    {sIdx === 5 && fretMarkers.has(fret) && (
                      <div
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                        style={{
                          background: "var(--brand-surface)",
                          opacity: 0.4,
                        }}
                      />
                    )}

                    {showDot ? (
                      <div
                        className={dotClasses.join(" ")}
                        style={style}
                        title={full}
                      >
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
}
