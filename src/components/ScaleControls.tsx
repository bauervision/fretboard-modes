// src/components/ScaleControls.tsx
import React, { useMemo } from "react";
import { listScaleDefs, type ScaleKey } from "../utils/scales";
import { KEYS, type KeyName } from "../utils/keys";

const SCALE_KEYS_IN_UI: readonly ScaleKey[] = [
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
  "harmonic_minor",
  "melodic_minor",
  "blues",
  "whole_tone",
  "diminished",
] as const;

type ScaleControlsProps = {
  root: KeyName;
  scale: ScaleKey;
  onRootChange: (newKey: KeyName) => void;
  onScaleChange: (newScale: ScaleKey) => void;
  compact?: boolean;

  hasBtForKey?: (k: KeyName) => boolean;
};

export const ScaleControls: React.FC<ScaleControlsProps> = ({
  root,
  scale,
  onRootChange,
  onScaleChange,
  compact = false,
  hasBtForKey,
}) => {
  const scaleDefs = useMemo(() => listScaleDefs(SCALE_KEYS_IN_UI), []);

  return (
    <div className={`flex flex-wrap gap-4 ${compact ? "mb-0" : "mb-6"}`}>
      <label className="flex flex-col">
        <span className="mb-1">Key</span>
        <select
          value={root}
          onChange={(e) => onRootChange(e.target.value as KeyName)}
          className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
        >
          {KEYS.map((k) => {
            const hasBt = hasBtForKey ? hasBtForKey(k) : false;
            return (
              <option key={k} value={k}>
                {k}
                {hasBt ? "  ♪" : ""}
              </option>
            );
          })}
        </select>
      </label>

      <label className="flex flex-col">
        <span className="mb-1">Scale</span>
        <select
          value={scale}
          onChange={(e) => onScaleChange(e.target.value as ScaleKey)}
          className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
        >
          {scaleDefs.map((def) => (
            <option key={def.key} value={def.key}>
              {def.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
