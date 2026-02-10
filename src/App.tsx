// src/App.tsx

import { startTransition, useEffect, useMemo, useState } from "react";
import Fretboard from "./components/Fretboard";
import { SettingsDialog } from "./components/SettingsDialog";
import { HeaderBar } from "./components/HeaderBar";
import { BackingTrackDialog } from "./components/BackingTrackDialog";

import { getScaleNotes } from "./utils/music";
import type { ScaleKey } from "./utils/scales";
import { getScaleLabel, isPentatonicScaleKey } from "./utils/scales";
import type { KeyName } from "./utils/keys";

import {
  btnClass,
  btnPrimaryClass,
  chipClass,
  clampMod,
  panelClass,
} from "./utils/ui";

import type { BackingTrack } from "./utils/backingTracks";
import {
  getBackingTracks,
  hasBackingTracksCached,
  validateBackingTracks,
} from "./utils/backingTracks";

function applyValidationToTracks(
  tracks: BackingTrack[],
  playableByUrl: Record<string, boolean>,
): BackingTrack[] {
  // Keep placeholders so “Alternates coming soon” stays visible.
  // Keep any playable track that validates true.
  return tracks.filter((t) => {
    if (!t.url || t.kind === "placeholder") return true;
    return playableByUrl[t.url] === true;
  });
}

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
  const [root, setRoot] = useState<KeyName>("G");
  const [scale, setScale] = useState<ScaleKey>("major");
  const [labelType, setLabelType] = useState<"note" | "interval">(
    defaultLabelType,
  );
  const [theme] = useState<"dark" | "light">("dark");
  const [fretsCount, setFretsCount] = useState<number>(defaultFrets);

  // Pattern state
  const [patternEnabled, setPatternEnabled] = useState<boolean>(true);
  const [patternOffset, setPatternOffset] = useState<number>(0);

  // Settings + Focus
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<boolean>(false);

  // Backing tracks dialog
  const [btOpen, setBtOpen] = useState<boolean>(false);

  // Base tracks (unvalidated)
  const btTracks = useMemo(() => {
    return getBackingTracks(root, scale);
  }, [root, scale]);

  // Validated tracks state (what the dialog renders)
  const [btTracksValidated, setBtTracksValidated] = useState<BackingTrack[]>(
    () => btTracks,
  );

  useEffect(() => {
    if (!settingsOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSettingsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [settingsOpen]);

  const dark = theme === "dark";

  const isPentatonic = isPentatonicScaleKey(scale);
  const boxCount = isPentatonic ? 5 : getScaleNotes(root, scale).length;
  const actualOffset = clampMod(patternOffset, boxCount);
  const positionLabel = `Pos ${actualOffset + 1}`;

  const modeLabel = `${root} ${getScaleLabel(scale)}`;

  const canShift = patternEnabled;

  const clsPanel = panelClass(dark);
  const clsChip = chipClass(dark);
  const clsBtn = btnClass(dark);
  const clsBtnPrimary = btnPrimaryClass();

  // For header enable/disable styling: use first playable url if present
  const btUrl = useMemo(() => {
    const firstPlayable = btTracksValidated.find((t) => !!t.url);
    return firstPlayable?.url ?? null;
  }, [btTracksValidated]);

  // Keep validated list in sync when root/scale changes (optimistic, unvalidated)
  useEffect(() => {
    startTransition(() => {
      setBtTracksValidated(btTracks);
    });
  }, [btTracks]);

  // Validate when dialog opens (or when root/scale changes while open)
  useEffect(() => {
    if (!btOpen) return;

    let alive = true;

    (async () => {
      const playableByUrl = await validateBackingTracks(btTracks);
      if (!alive) return;

      const filtered = applyValidationToTracks(btTracks, playableByUrl);

      startTransition(() => {
        setBtTracksValidated(filtered);
      });
    })();

    return () => {
      alive = false;
    };
  }, [btOpen, btTracks]);

  // Key dropdown “♪” indicator:
  // Use cache-only sync check; optimistic if unknown.
  const hasBtForKey = useMemo(() => {
    return (k: KeyName) => hasBackingTracksCached(k, scale);
  }, [scale]);

  function onOpenBackingTrack() {
    setBtOpen(true);
  }

  function onOpenTrackUrl(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

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
        <HeaderBar
          focusMode={focusMode}
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
          modeLabel={modeLabel}
          patternEnabled={patternEnabled}
          positionLabel={positionLabel}
          canShift={canShift}
          onLower={() => setPatternOffset((v) => v - 1)}
          onRaise={() => setPatternOffset((v) => v + 1)}
          onOpenSettings={() => setSettingsOpen(true)}
          onEnterFocus={() => setFocusMode(true)}
          onExitFocus={() => setFocusMode(false)}
          btUrl={btUrl}
          onOpenBackingTrack={onOpenBackingTrack}
          hasBtForKey={hasBtForKey}
          clsPanel={clsPanel}
          clsChip={clsChip}
          clsBtn={clsBtn}
          clsBtnPrimary={clsBtnPrimary}
        />

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

      <SettingsDialog
        open={settingsOpen}
        isPentatonic={isPentatonic}
        patternEnabled={patternEnabled}
        onPatternEnabledChange={setPatternEnabled}
        labelType={labelType}
        onLabelTypeChange={setLabelType}
        fretsCount={fretsCount}
        onFretsCountChange={setFretsCount}
        onResetDefaults={() => {
          setPatternEnabled(true);
          setLabelType(defaultLabelType);
          setFretsCount(defaultFrets);
          setPatternOffset(0);
        }}
        onClose={() => setSettingsOpen(false)}
        clsBtn={clsBtn}
        clsChip={clsChip}
      />

      <BackingTrackDialog
        open={btOpen}
        title={`${root} ${getScaleLabel(scale)} Backing Tracks`}
        tracks={btTracksValidated}
        onClose={() => setBtOpen(false)}
        onOpenTrack={onOpenTrackUrl}
        clsBtn={clsBtn}
      />
    </div>
  );
}
