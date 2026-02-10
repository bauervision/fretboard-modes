// src/components/HeaderBar.tsx

import { ScaleControls } from "./ScaleControls";
import type { KeyName } from "../utils/keys";
import type { ScaleKey } from "../utils/scales";

export type HeaderBarProps = {
  focusMode: boolean;

  root: KeyName;
  scale: ScaleKey;
  onRootChange: (k: KeyName) => void;
  onScaleChange: (s: ScaleKey) => void;

  modeLabel: string;

  patternEnabled: boolean;
  positionLabel: string;

  canShift: boolean;
  onLower: () => void;
  onRaise: () => void;

  onOpenSettings: () => void;

  onEnterFocus: () => void;
  onExitFocus: () => void;

  btUrl: string | null;
  onOpenBackingTrack: () => void;

  hasBtForKey?: (k: KeyName) => boolean;

  clsPanel: string;
  clsChip: string;
  clsBtn: string;
  clsBtnPrimary: string;
};

function iconBtnClass(base: string) {
  return `${base} px-2`;
}

export function HeaderBar({
  focusMode,
  root,
  scale,
  onRootChange,
  onScaleChange,
  modeLabel,
  patternEnabled,
  positionLabel,
  canShift,
  onLower,
  onRaise,
  onOpenSettings,
  onEnterFocus,
  onExitFocus,
  btUrl,
  onOpenBackingTrack,
  hasBtForKey,
  clsPanel,
  clsChip,
  clsBtn,
  clsBtnPrimary,
}: HeaderBarProps) {
  const btDisabled = !btUrl;
  const btTitle = btDisabled
    ? "BT unavailable at the moment"
    : "Open backing track";
  const posText = patternEnabled ? positionLabel : "Off";
  const clsIconBtn = iconBtnClass(clsBtn);

  if (!focusMode) {
    return (
      <div className={`${clsPanel} px-3 py-2`}>
        <div className="flex items-center gap-3 whitespace-nowrap">
          {/* LEFT: key/scale + BT */}
          <div className="flex items-end gap-2">
            <ScaleControls
              root={root}
              scale={scale}
              onRootChange={onRootChange}
              onScaleChange={onScaleChange}
              compact
              hasBtForKey={hasBtForKey}
            />

            <button
              onClick={onOpenBackingTrack}
              disabled={btDisabled}
              className={clsIconBtn}
              title={btTitle}
              aria-label="Open backing track"
            >
              ♪
            </button>
          </div>

          {/* CENTER: position + arrows */}
          <div className="flex-1 flex items-center justify-center gap-2">
            <button
              onClick={onLower}
              disabled={!canShift}
              className={clsIconBtn}
              title="Lower position"
              aria-label="Lower position"
            >
              ‹
            </button>

            <div className={clsChip}>
              <span className="text-white/90">{posText}</span>
            </div>

            <button
              onClick={onRaise}
              disabled={!canShift}
              className={clsIconBtn}
              title="Raise position"
              aria-label="Raise position"
            >
              ›
            </button>
          </div>

          {/* RIGHT: settings + focus */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className={clsIconBtn}
              title="Settings"
              aria-label="Settings"
            >
              ⚙
            </button>

            <button onClick={onEnterFocus} className={clsBtnPrimary}>
              Focus
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Focus mode
  return (
    <div className={`${clsPanel} px-2 py-1`}>
      <div className="flex items-center whitespace-nowrap">
        {/* LEFT: mode label + BT */}
        <div className="min-w-[260px] px-2 flex items-center gap-2">
          <div className="inline-flex items-center rounded-lg border border-blue-500/30 bg-blue-600/15 px-3 py-1">
            <span className="text-base font-semibold tracking-wide text-blue-200">
              {modeLabel}
            </span>
          </div>

          <button
            onClick={onOpenBackingTrack}
            disabled={btDisabled}
            className={clsIconBtn}
            title={btTitle}
            aria-label="Open backing track"
          >
            ♪
          </button>
        </div>

        {/* CENTER: arrows + position */}
        <div className="flex-1 flex items-center justify-center gap-2">
          <button
            onClick={onLower}
            disabled={!canShift}
            className={clsIconBtn}
            title="Lower position"
            aria-label="Lower position"
          >
            ‹
          </button>

          <div className={clsChip}>
            <span className="text-white/80">{posText}</span>
          </div>

          <button
            onClick={onRaise}
            disabled={!canShift}
            className={clsIconBtn}
            title="Raise position"
            aria-label="Raise position"
          >
            ›
          </button>
        </div>

        {/* RIGHT: exit */}
        <div className="min-w-[180px] flex justify-end px-2">
          <button onClick={onExitFocus} className={clsBtnPrimary}>
            Exit Focus
          </button>
        </div>
      </div>
    </div>
  );
}
