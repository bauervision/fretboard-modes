// src/utils/scales.ts

export type ScaleKey =
  | "major"
  | "minor"
  | "dorian"
  | "phrygian"
  | "lydian"
  | "mixolydian"
  | "aeolian"
  | "locrian"
  | "pentatonic"
  | "minor_pentatonic"
  // easy to extend from here:
  | "harmonic_minor"
  | "melodic_minor"
  | "blues"
  | "whole_tone"
  | "diminished";

export type ScaleDef = {
  key: ScaleKey;
  label: string;

  /**
   * List of Tonal scale names to try, in order.
   * These are appended after the tonic: `${tonic} ${name}`
   *
   * Example: "major pentatonic", "ionian", etc.
   */
  tonalNames: readonly string[];

  /**
   * Optional tags you may want later for UI grouping / rendering strategy.
   */
  family?:
    | "diatonic"
    | "pentatonic"
    | "minor"
    | "major"
    | "symmetric"
    | "other";
};

export function normalizeScaleKey(v: string): string {
  return v.trim().toLowerCase().replace(/\s+/g, "_");
}

export const SCALES: Readonly<Record<ScaleKey, ScaleDef>> = {
  major: {
    key: "major",
    label: "Major (Ionian)",
    tonalNames: ["major", "ionian"],
    family: "major",
  },

  minor: {
    key: "minor",
    label: "Minor",
    tonalNames: ["minor", "natural minor", "aeolian"],
    family: "minor",
  },

  dorian: {
    key: "dorian",
    label: "Dorian",
    tonalNames: ["dorian"],
    family: "diatonic",
  },

  phrygian: {
    key: "phrygian",
    label: "Phrygian",
    tonalNames: ["phrygian"],
    family: "diatonic",
  },

  lydian: {
    key: "lydian",
    label: "Lydian",
    tonalNames: ["lydian"],
    family: "diatonic",
  },

  mixolydian: {
    key: "mixolydian",
    label: "Mixolydian",
    tonalNames: ["mixolydian"],
    family: "diatonic",
  },

  aeolian: {
    key: "aeolian",
    label: "Minor (Aeolian)",
    tonalNames: ["aeolian", "natural minor", "minor"],
    family: "diatonic",
  },

  locrian: {
    key: "locrian",
    label: "Locrian",
    tonalNames: ["locrian"],
    family: "diatonic",
  },

  pentatonic: {
    key: "pentatonic",
    label: "Pentatonic",
    tonalNames: ["major pentatonic"],
    family: "pentatonic",
  },

  minor_pentatonic: {
    key: "minor_pentatonic",
    label: "Minor Pentatonic",
    tonalNames: ["minor pentatonic"],
    family: "pentatonic",
  },

  // --- ready-to-enable extras (already in dropdown if you want later) ---
  harmonic_minor: {
    key: "harmonic_minor",
    label: "Harmonic Minor",
    tonalNames: ["harmonic minor"],
    family: "minor",
  },

  melodic_minor: {
    key: "melodic_minor",
    label: "Melodic Minor",
    tonalNames: ["melodic minor"],
    family: "minor",
  },

  blues: {
    key: "blues",
    label: "Blues",
    tonalNames: ["blues"],
    family: "other",
  },

  whole_tone: {
    key: "whole_tone",
    label: "Whole Tone",
    tonalNames: ["whole tone"],
    family: "symmetric",
  },

  diminished: {
    key: "diminished",
    label: "Diminished (Octatonic)",
    tonalNames: ["diminished", "octatonic"],
    family: "symmetric",
  },
} as const;

/**
 * Resolve whatever the UI passes into a ScaleDef if possible.
 * Accepts: "Pentatonic", "minor pentatonic", "minor_pentatonic", etc.
 */
export function resolveScaleDef(scale: string): ScaleDef | null {
  const key = normalizeScaleKey(scale) as ScaleKey;
  const direct = (SCALES as Record<string, ScaleDef | undefined>)[key];
  if (direct) return direct;

  // Also allow raw names like "minor pentatonic" => "minor_pentatonic"
  const key2 = normalizeScaleKey(scale).replace(/ /g, "_") as ScaleKey;
  const direct2 = (SCALES as Record<string, ScaleDef | undefined>)[key2];
  return direct2 ?? null;
}

/**
 * Handy for building dropdowns later without duplicating labels.
 */
export function listScaleDefs(keys?: readonly ScaleKey[]): ScaleDef[] {
  const useKeys = keys ?? (Object.keys(SCALES) as ScaleKey[]);
  return useKeys.map((k) => SCALES[k]);
}

export function getScaleLabel(scale: ScaleKey): string {
  return SCALES[scale]?.label ?? scale;
}

export function isPentatonicScaleKey(scale: ScaleKey): boolean {
  const fam = SCALES[scale]?.family;
  return fam === "pentatonic";
}