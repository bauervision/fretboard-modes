// src/App.tsx

import React, { useState } from "react";
import { ScaleControls } from "./components/ScaleControls";
import Fretboard from "./components/Fretboard";
import Tuner from "./components/Tuner";

export default function App() {
  // Mode toggle
  const [mode, setMode] = useState<"fretboard" | "tuner">("fretboard");

  // Fretboard state
  const [root, setRoot] = useState<string>("C");
  const [scale, setScale] = useState<string>("major");
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [labelType, setLabelType] = useState<"note" | "interval">("note");
  const [playAudio, setPlayAudio] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [fretsCount, setFretsCount] = useState<number>(20);

  // 3NPS pattern state
  const [patternEnabled, setPatternEnabled] = useState<boolean>(false);
  const [patternOffset, setPatternOffset] = useState<number>(0);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* ── Top Mode Toggle ──────────────────────────────────────────── */}
      <div className="flex justify-center bg-gray-900">
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
      <div className="flex-1 overflow-auto">
        {mode === "fretboard" ? (
          <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold mb-6">Fretboard Mode Explorer</h1>

            {/* Scale selectors */}
            <ScaleControls
              root={root}
              scale={scale}
              onRootChange={setRoot}
              onScaleChange={setScale}
            />

            {/* Feature toggles */}
            <div className="flex flex-wrap gap-4 mb-6">
              {/* Show / hide labels */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={e => setShowLabels(e.target.checked)}
                  className="mr-1"
                />
                Show Labels
              </label>

              {/* Notes / intervals */}
              <label className="flex items-center">
                <input
                  type="radio"
                  name="labelType"
                  checked={labelType === "note"}
                  onChange={() => setLabelType("note")}
                  disabled={!showLabels}
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
                  disabled={!showLabels}
                  className="mr-1"
                />
                Intervals
              </label>

              {/* Audio on/off */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={playAudio}
                  onChange={e => setPlayAudio(e.target.checked)}
                  className="mr-1"
                />
                Audio
              </label>

              {/* Theme selector */}
              <label className="flex items-center">
                <span className="mr-1">Theme</span>
                <select
                  value={theme}
                  onChange={e =>
                    setTheme(e.target.value as "dark" | "light")
                  }
                  className="ml-1 bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </label>

              {/* Fret count */}
              <label className="flex items-center">
                <span className="mr-1">Frets</span>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={fretsCount}
                  onChange={e => setFretsCount(Number(e.target.value))}
                  className="ml-1 w-16 bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
                />
              </label>

              {/* 3NPS toggle */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={patternEnabled}
                  onChange={e => setPatternEnabled(e.target.checked)}
                  className="mr-1"
                />
                3NPS Pos 1
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
            <div className="w-full max-w-screen-lg">
              <Fretboard
                root={root}
                scale={scale}
                frets={fretsCount}
                showLabels={showLabels}
                labelType={labelType}
                playAudio={playAudio}
                theme={theme}
                patternEnabled={patternEnabled}
                patternOffset={patternOffset}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-6">
            <Tuner />
          </div>
        )}
      </div>
    </div>
  );
}
