// src/utils/music.ts

import { get as getScale } from "@tonaljs/scale";
import { transpose } from "@tonaljs/note";
import { fromSemitones } from "@tonaljs/interval";  // ← map semitone count to interval name

export const standardTuning = ["E2","A2","D3","G3","B3","E4"];

export function getScaleNotes(root: string, scaleName: string): string[] {
  return getScale(`${root} ${scaleName}`).notes;
}

export function noteAtFret(openString: string, fret: number): string {
  // 1) turn fret number into an interval name via semitone count
  const interval = fromSemitones(fret);
  // 2) transpose the open string by that interval
  return transpose(openString, interval);
}