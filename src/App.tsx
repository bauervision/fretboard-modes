// src/App.tsx

import { useState } from "react";
import { ScaleControls } from "./components/ScaleControls";
import Fretboard from "./components/Fretboard";
import Tuner from "./components/Tuner";
import { getScaleNotes } from "./utils/music";

export default function App() {
  // Mode toggle
  const [mode, setMode] = useState<"fretboard" | "tuner">("fretboard");

  // Fretboard state
  const [root, setRoot] = useState<string>("C");
  const [scale, setScale] = useState<string>("major");

  const [labelType, setLabelType] = useState<"note" | "interval">("note");
  const [playAudio, setPlayAudio] = useState<boolean>(false);
  const [theme] = useState<"dark" | "light">("dark");
  const [fretsCount, setFretsCount] = useState<number>(20);

  // 3NPS pattern state
  const [patternEnabled, setPatternEnabled] = useState<boolean>(true);
  const [patternOffset, setPatternOffset] = useState<number>(0);

  const isPentatonic = scale === "pentatonic" || scale === "minor_pentatonic";
  const boxCount = isPentatonic ? 5 : getScaleNotes(root, scale).length;
  const actualOffset = ((patternOffset % boxCount) + boxCount) % boxCount;
  const positionLabel = `Pos ${actualOffset + 1}`;
  return (
    <div className="min-h-screen bg-black text-white flex flex-col  ">
      {/* ── Top Mode Toggle ──────────────────────────────────────────── */}
      <div className="flex justify-center bg-gray-900 w-full">
        <button
          onClick={() => setMode("fretboard")}
          className={`px-4 py-2 m-2 rounded-t ${
            mode === "fretboard" ? "bg-blue-600 font-semibold" : "bg-gray-700"
          }`}
        >
          Fretboard
        </button>
        <button
          onClick={() => setMode("tuner")}
          className={`px-4 py-2 m-2 rounded-t ${
            mode === "tuner" ? "bg-blue-600 font-semibold" : "bg-gray-700"
          }`}
        >
          Tuner
        </button>
      </div>

      {/* ── Content Area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col w-full mx-auto p-6 border-2 border-amber-400">
        {mode === "fretboard" ? (
          <div className="flex flex-col items-center justify-center p-6  ">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Fretboard Mode Explorer
            </h1>

            {/* Scale selectors */}
            <div className="flex justify-center w-full">
              <ScaleControls
                root={root}
                scale={scale}
                onRootChange={(newRoot) => {
                  setRoot(newRoot);
                  setPatternOffset(0); // Reset position to first box
                }}
                onScaleChange={(newScale) => {
                  setScale(newScale);
                  setPatternOffset(0); // Reset position to first box
                }}
              />
            </div>

            {/* Feature toggles */}
            <div className="flex flex-wrap gap-4 mb-6 justify-center w-full">
              {/* Notes / intervals */}
              <label className="flex items-center">
                <input
                  type="radio"
                  name="labelType"
                  checked={labelType === "note"}
                  onChange={() => setLabelType("note")}
                  // disabled={!showLabels}
                  className="mr-1"
                />
                Notes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="labelType"
                  checked={labelType === "interval"}
                  onChange={() => setLabelType("interval")}
                  // disabled={!showLabels}
                  className="mr-1"
                />
                Intervals
              </label>

              {/* Audio on/off */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={playAudio}
                  onChange={(e) => setPlayAudio(e.target.checked)}
                  className="mr-1"
                />
                Audio
              </label>

              {/* Theme selector */}
              {/* <label className="flex items-center">
                <span className="mr-1">Theme</span>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as "dark" | "light")}
                  className="ml-1 bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </label> */}

              {/* Fret count */}
              <label className="flex items-center">
                <span className="mr-1">Frets</span>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={fretsCount}
                  onChange={(e) => setFretsCount(Number(e.target.value))}
                  className="ml-1 w-16 bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
                />
              </label>

              {/* 3NPS toggle */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={patternEnabled}
                  onChange={(e) => setPatternEnabled(e.target.checked)}
                  className="mr-1"
                />
                {isPentatonic ? "2NPS" : "3NPS"}{" "}
                {patternEnabled && (
                  <span className="ml-1">{positionLabel}</span>
                )}
              </label>

              {/* Raise / Lower */}
              <button
                onClick={() => setPatternOffset(patternOffset - 1)}
                disabled={!patternEnabled}
                className="px-3 py-1 bg-gray-700 disabled:opacity-50 rounded text-white"
              >
                Lower
              </button>
              <button
                onClick={() => setPatternOffset(patternOffset + 1)}
                disabled={!patternEnabled}
                className="px-3 py-1 bg-gray-700 disabled:opacity-50 rounded text-white"
              >
                Raise
              </button>
            </div>

            {/* Fretboard */}
            <div className="w-full flex justify-center">
              <div className="w-full ">
                {" "}
                {/* or h-96, or a custom class */}
                <Fretboard
                  root={root}
                  scale={scale}
                  frets={fretsCount}
                  labelType={labelType}
                  playAudio={playAudio}
                  theme={theme}
                  patternEnabled={patternEnabled}
                  patternOffset={patternOffset}
                  height={420}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center w-full h-full">
            <Tuner />
          </div>
        )}
      </div>
    </div>
  );
}
