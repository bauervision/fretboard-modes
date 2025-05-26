import React from "react";

const ALL_KEYS = [
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
] as const;

const ALL_SCALES = [
  "major",
  "dorian",
  "phrygian",
  "lydian",
  "mixolydian",
  "aeolian",
  "locrian",
  "minor",
  "pentatonic",
  "minor_pentatonic",
] as const;

const SCALE_LABELS: Record<string, string> = {
  major: "Major (Ionian)",
  dorian: "Dorian",
  phrygian: "Phrygian",
  lydian: "Lydian",
  mixolydian: "Mixolydian",
  aeolian: "Minor (Aeolian)",
  locrian: "Locrian",
  minor: "Minor",
  pentatonic: "Pentatonic",
  minor_pentatonic: "Minor Pentatonic",
};

interface ScaleControlsProps {
  root: string;
  scale: string;
  onRootChange: (newKey: string) => void;
  onScaleChange: (newScale: string) => void;
}

export const ScaleControls: React.FC<ScaleControlsProps> = ({
  root,
  scale,
  onRootChange,
  onScaleChange,
}) => (
  <div className="flex flex-wrap gap-4 mb-6">
    {/* Key selector */}
    <label className="flex flex-col">
      <span className="mb-1">Key</span>
      <select
        value={root}
        onChange={(e) => onRootChange(e.target.value)}
        className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
      >
        {ALL_KEYS.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
    </label>

    {/* Scale selector */}
    <label className="flex flex-col">
      <span className="mb-1">Scale</span>
      <select
        value={scale}
        onChange={(e) => onScaleChange(e.target.value)}
        className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
      >
        {ALL_SCALES.map((s) => (
          <option key={s} value={s}>
            {SCALE_LABELS[s] || s}
          </option>
        ))}
      </select>
    </label>
  </div>
);
