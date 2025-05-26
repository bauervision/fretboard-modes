// music.ts
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
  // Use pitchClass to normalize sharps/flats
  const enharmonic = pitchClass(openNote);
  const idx = chromatic.indexOf(enharmonic);
  if (idx === -1) throw new Error("Invalid open note: " + openNote);
  const newIdx = (idx + fret) % 12;
  return chromatic[newIdx];
}

/** Get all scale notes for any root/scale (major, minor, modes, pentatonic, etc.) */
export function getScaleNotes(root: string, scale: string): string[] {
  // Normalize root: uppercase letter, handle accidental
  const tonic =
    root.charAt(0).toUpperCase() +
    (root.charAt(1) === "#" || root.charAt(1) === "b" ? root.charAt(1) : "") +
    root.slice(2);

  // Map our custom names to Tonal.js's names
  let scaleName = scale;
  if (scale === "pentatonic") scaleName = "major pentatonic";
  if (scale === "minor_pentatonic") scaleName = "minor pentatonic";
  if (scale === "minor") scaleName = "natural minor";

  // Modes/dorian/phrygian/etc. are passed as-is
  const notes = getScale(`${tonic} ${scaleName}`).notes;

  // If for some reason Tonal fails, fallback to just the tonic
  return notes.length ? notes : [tonic];
}
