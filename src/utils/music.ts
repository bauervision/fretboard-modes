// src/utils/music.ts
import { get as getScale } from "@tonaljs/scale";
import { pitchClass } from "@tonaljs/note";

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

/** Get all scale notes for any root/scale (major, minor, modes, pentatonic, etc.) */
export function getScaleNotes(root: string, scale: string): string[] {
  const tonic = normalizeTonic(root);

  // Build a list of candidate scale names to try (first successful wins)
  const candidates: string[] = [];

  // Custom names
  if (scale === "pentatonic") {
    candidates.push("major pentatonic");
  } else if (scale === "minor_pentatonic") {
    candidates.push("minor pentatonic");
  } else if (scale === "minor") {
    // Tonal aliases vary across versions — try all common ones
    candidates.push("minor");
    candidates.push("natural minor");
    candidates.push("aeolian");
  } else if (scale === "major") {
    candidates.push("major");
    candidates.push("ionian");
  } else {
    // modes like dorian/phrygian/etc.
    candidates.push(scale);
  }

  for (const name of candidates) {
    const notes = getScale(`${tonic} ${name}`).notes;
    if (notes.length) return notes;
  }

  // Fallback: just tonic
  return [tonic];
}
