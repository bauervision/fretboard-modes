// src/utils/music.ts
import { get as getScale } from "@tonaljs/scale";
import { pitchClass } from "@tonaljs/note";
import { resolveScaleDef } from "./scales";

/** Standard tuning from low to high */
export const standardTuning = ["E", "A", "D", "G", "B", "E"];

/** Return the note at the given fret on a string with a given open note */
export function noteAtFret(openNote: string, fret: number): string {
  const chromatic = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  const enharmonic = pitchClass(openNote);
  const idx = chromatic.indexOf(enharmonic);
  if (idx === -1) throw new Error("Invalid open note: " + openNote);

  const newIdx = (idx + fret) % 12;
  return chromatic[newIdx];
}

function normalizeTonic(root: string): string {
  return (
    root.charAt(0).toUpperCase() +
    (root.charAt(1) === "#" || root.charAt(1) === "b" ? root.charAt(1) : "") +
    root.slice(2)
  );
}

/** Get all scale notes for any root/scale */
export function getScaleNotes(root: string, scale: string): string[] {
  const tonic = normalizeTonic(root);

  const def = resolveScaleDef(scale);

  const candidates = def?.tonalNames?.length
    ? [...def.tonalNames]
    : [
        // last-ditch fallback: try the raw value in a couple common forms
        scale,
        scale.replace(/_/g, " "),
      ];

  for (const name of candidates) {
    const notes = getScale(`${tonic} ${name}`).notes;
    if (notes.length) return notes;
  }

  // Fallback: just tonic
  return [tonic];
}
