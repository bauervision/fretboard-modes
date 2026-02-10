// src/components/SettingsDialog.tsx

import { miniInputClass } from "../utils/ui";

export type SettingsDialogProps = {
  open: boolean;

  isPentatonic: boolean;

  patternEnabled: boolean;
  onPatternEnabledChange: (v: boolean) => void;

  labelType: "note" | "interval";
  onLabelTypeChange: (v: "note" | "interval") => void;

  fretsCount: number;
  onFretsCountChange: (v: number) => void;

  onResetDefaults: () => void;
  onClose: () => void;

  clsBtn: string;
  clsChip: string;
};

export function SettingsDialog({
  open,
  isPentatonic,
  patternEnabled,
  onPatternEnabledChange,
  labelType,
  onLabelTypeChange,
  fretsCount,
  onFretsCountChange,
  onResetDefaults,
  onClose,
  clsBtn,
  clsChip,
}: SettingsDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <button
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Close settings"
      />

      <div className="absolute left-1/2 top-1/2 w-[min(560px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0b0f14] p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Settings</div>
          <button onClick={onClose} className={clsBtn}>
            Close
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className={clsChip}>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={patternEnabled}
                onChange={(e) => onPatternEnabledChange(e.target.checked)}
              />
              <span className="text-white/90">
                {isPentatonic ? "2NPS mode" : "3NPS mode"}
              </span>
            </label>
          </div>

          <div className={clsChip}>
            <span className="text-white/70">Labels</span>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="labelTypeDialog"
                checked={labelType === "note"}
                onChange={() => onLabelTypeChange("note")}
              />
              Notes
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="labelTypeDialog"
                checked={labelType === "interval"}
                onChange={() => onLabelTypeChange("interval")}
              />
              Intervals
            </label>
          </div>

          <div className={clsChip}>
            <span className="text-white/70">Frets</span>
            <input
              type="number"
              min={1}
              max={24}
              value={fretsCount}
              onChange={(e) => onFretsCountChange(Number(e.target.value))}
              className={miniInputClass}
            />
            <span className="text-white/50">1–24</span>
          </div>

          <div className={clsChip}>
            <button className={clsBtn} onClick={onResetDefaults}>
              Reset defaults
            </button>
          </div>
        </div>

        <div className="mt-3 text-xs text-white/50">Tip: press Esc to close.</div>
      </div>
    </div>
  );
}
