// src/App.tsx

import { useEffect, useMemo, useState } from "react";
import { ScaleControls } from "./components/ScaleControls";
import Fretboard from "./components/Fretboard";
import { getScaleNotes } from "./utils/music";

export default function App() {
  const [isLandscape, setIsLandscape] = useState<boolean>(true);

  useEffect(() => {
    const mq = window.matchMedia("(orientation: landscape)");
    const onChange = () => setIsLandscape(mq.matches);

    setIsLandscape(mq.matches);

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    } else {
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    }
  }, []);

  useEffect(() => {
    if (!isLandscape) return;

    const anyScreen = screen as unknown as {
      orientation?: { lock?: (v: "landscape") => Promise<void> };
    };

    anyScreen.orientation?.lock?.("landscape").catch(() => {});
  }, [isLandscape]);

  // Defaults
  const defaultLabelType = useMemo(() => "note" as const, []);
  const defaultFrets = useMemo(() => 20, []);

  // Fretboard state
  const [root, setRoot] = useState<string>("C");
  const [scale, setScale] = useState<string>("major");
  const [labelType, setLabelType] = useState<"note" | "interval">(
    defaultLabelType,
  );
  const [theme] = useState<"dark" | "light">("dark");
  const [fretsCount, setFretsCount] = useState<number>(defaultFrets);

  // Pattern state
  const [patternEnabled, setPatternEnabled] = useState<boolean>(true); // default ON
  const [patternOffset, setPatternOffset] = useState<number>(0);

  // Settings + Focus
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<boolean>(false);

  useEffect(() => {
    if (!settingsOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSettingsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [settingsOpen]);

  const isPentatonic = scale === "pentatonic" || scale === "minor_pentatonic";
  const boxCount = isPentatonic ? 5 : getScaleNotes(root, scale).length;
  const actualOffset = ((patternOffset % boxCount) + boxCount) % boxCount;
  const positionLabel = `Pos ${actualOffset + 1}`;

  function prettyScaleName(s: string): string {
    // common cases first
    if (s === "major") return "Major";
    if (s === "minor") return "Minor";
    if (s === "pentatonic") return "Pentatonic";
    if (s === "minor_pentatonic") return "Minor Pentatonic";

    // best-effort for things like "harmonic_minor" or "major_ionian"
    return s.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  }

  const modeLabel = `${root} ${prettyScaleName(scale)}`;

  const dark = theme === "dark";

  const panelClass = [
    "w-full",
    "rounded-xl",
    "border",
    dark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5",
  ].join(" ");

  const chipClass = [
    "inline-flex items-center gap-2",
    "rounded-lg",
    "border",
    dark ? "border-white/10 bg-black/20" : "border-black/10 bg-white/60",
    "px-2 py-1",
  ].join(" ");

  const btnClass = [
    "px-3 py-1.5",
    "rounded-lg",
    "border",
    dark
      ? "border-white/10 bg-white/10 hover:bg-white/15"
      : "border-black/10 bg-black/5 hover:bg-black/10",
    "disabled:opacity-50",
    "text-white",
  ].join(" ");

  const btnPrimaryClass = [
    "px-3 py-1.5",
    "rounded-lg",
    "border",
    "border-blue-500/30",
    "bg-blue-600/30 hover:bg-blue-600/40",
    "text-white",
  ].join(" ");

  const miniInputClass =
    "w-16 rounded-md bg-gray-900/60 text-white border border-white/10 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40";

  const canShift = patternEnabled;

  return (
    <div className="h-screen overflow-hidden bg-black text-white flex flex-col">
      {!isLandscape && (
        <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center p-6">
          <div className="max-w-sm text-center">
            <div className="text-2xl font-semibold mb-2">
              Rotate your device
            </div>
            <div className="text-white/70">
              Fretboard Modes runs in landscape only.
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col px-3 pt-3 pb-2">
        {/* Header */}
        {!focusMode ? (
          <div className={`${panelClass} px-3 py-2`}>
            <div className="flex items-center gap-3 whitespace-nowrap">
              {/* Left: Key/Scale */}
              <div className="flex items-center gap-3">
                <ScaleControls
                  root={root}
                  scale={scale}
                  onRootChange={(newRoot) => {
                    setRoot(newRoot);
                    setPatternOffset(0);
                  }}
                  onScaleChange={(newScale) => {
                    setScale(newScale);
                    setPatternOffset(0);
                  }}
                />
              </div>

              <div className="flex-1" />

              {/* Right: Position + actions */}
              <div className="flex items-center gap-2">
                <div className={chipClass}>
                  <span className="text-white/70">
                    {isPentatonic ? "2NPS" : "3NPS"}
                  </span>
                  <span className="text-white/90">
                    {patternEnabled ? positionLabel : "Off"}
                  </span>
                </div>

                <button
                  onClick={() => setPatternOffset((v) => v - 1)}
                  disabled={!canShift}
                  className={btnClass}
                >
                  Lower
                </button>
                <button
                  onClick={() => setPatternOffset((v) => v + 1)}
                  disabled={!canShift}
                  className={btnClass}
                >
                  Raise
                </button>

                <button
                  onClick={() => setSettingsOpen(true)}
                  className={btnClass}
                >
                  Settings
                </button>

                <button
                  onClick={() => setFocusMode(true)}
                  className={btnPrimaryClass}
                >
                  Focus
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Focus bar: minimal height, only what’s needed for practice
          <div className={`${panelClass} px-2 py-1`}>
            <div className="flex items-center whitespace-nowrap">
              {/* Left: Mode name */}
              <div className="min-w-[220px] px-2">
                <div className="inline-flex items-center rounded-lg border border-blue-500/30 bg-blue-600/15 px-3 py-1">
                  <span className="text-base font-semibold tracking-wide text-blue-200">
                    {modeLabel}
                  </span>
                </div>
              </div>

              {/* Center: Lower / Pos / Raise */}
              <div className="flex-1 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPatternOffset((v) => v - 1)}
                  disabled={!canShift}
                  className={btnClass}
                >
                  Lower
                </button>

                <div className={chipClass}>
                  <span className="text-white/80">
                    {patternEnabled ? positionLabel : "Pattern Off"}
                  </span>
                </div>

                <button
                  onClick={() => setPatternOffset((v) => v + 1)}
                  disabled={!canShift}
                  className={btnClass}
                >
                  Raise
                </button>
              </div>

              {/* Right: Exit */}
              <div className="min-w-[180px] flex justify-end px-2">
                <button
                  onClick={() => setFocusMode(false)}
                  className={btnPrimaryClass}
                >
                  Exit Focus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Board fills remaining height */}
        <div className="flex-1 min-h-0 mt-2">
          <Fretboard
            root={root}
            scale={scale}
            frets={fretsCount}
            labelType={labelType}
            theme={theme}
            patternEnabled={patternEnabled}
            patternOffset={patternOffset}
            height="100%"
          />
        </div>
      </div>

      {/* Settings Dialog (disabled while focus is on, but still safe if opened) */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Settings"
        >
          <button
            className="absolute inset-0 bg-black/60"
            onClick={() => setSettingsOpen(false)}
            aria-label="Close settings"
          />

          <div className="absolute left-1/2 top-1/2 w-[min(560px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0b0f14] p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Settings</div>
              <button
                onClick={() => setSettingsOpen(false)}
                className={btnClass}
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {/* 3NPS toggle */}
              <div className={chipClass}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={patternEnabled}
                    onChange={(e) => setPatternEnabled(e.target.checked)}
                  />
                  <span className="text-white/90">
                    {isPentatonic ? "2NPS mode" : "3NPS mode"}
                  </span>
                </label>
              </div>

              {/* Notes / intervals */}
              <div className={chipClass}>
                <span className="text-white/70">Labels</span>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="labelTypeDialog"
                    checked={labelType === "note"}
                    onChange={() => setLabelType("note")}
                  />
                  Notes
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="labelTypeDialog"
                    checked={labelType === "interval"}
                    onChange={() => setLabelType("interval")}
                  />
                  Intervals
                </label>
              </div>

              {/* Frets */}
              <div className={chipClass}>
                <span className="text-white/70">Frets</span>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={fretsCount}
                  onChange={(e) => setFretsCount(Number(e.target.value))}
                  className={miniInputClass}
                />
                <span className="text-white/50">1–24</span>
              </div>

              {/* Reset */}
              <div className={chipClass}>
                <button
                  className={btnClass}
                  onClick={() => {
                    setPatternEnabled(true);
                    setLabelType(defaultLabelType);
                    setFretsCount(defaultFrets);
                    setPatternOffset(0);
                  }}
                >
                  Reset defaults
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs text-white/50">
              Tip: press Esc to close.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
