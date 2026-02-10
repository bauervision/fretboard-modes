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
        className="absolute inset-0 bg-black/90"
        onClick={onClose}
        aria-label="Close settings"
      />

      <div
        className="absolute left-1/2 top-1/2 w-[min(560px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border shadow-xl backdrop-blur overflow-hidden"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "rgba(27,42,65,0.55)", // brand-secondary
        }}
      >
        <div className="flex">
          {/* Brand rail */}
          <div
            className="w-[96px] shrink-0 flex items-center justify-center border-r"
            style={{
              borderRightColor: "rgba(159,183,193,0.18)",
              backgroundColor: "rgba(15,76,92,0.22)", // brand-primary tint
            }}
          >
            <div
              className="rounded-2xl border grid place-items-center"
              style={{
                width: 72,
                height: 72,
                borderColor: "rgba(159,183,193,0.22)",
                backgroundColor: "rgba(255,255,255,0.06)",
                boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
              }}
            >
              <img
                src="/Icon.png"
                alt=""
                style={{ width: 56, height: 56 }}
                draggable={false}
              />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-[color:var(--brand-surface)]">
                Settings
              </div>

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

            <div className="mt-3 text-xs text-white/50">
              Tip: press Esc to close.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
