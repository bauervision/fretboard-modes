// src/components/BackingTrackDialog.tsx

import type { BackingTrack } from "../utils/backingTracks";

export type BackingTrackDialogProps = {
  open: boolean;
  title: string;
  tracks: BackingTrack[];
  onClose: () => void;
  onOpenTrack: (url: string) => void;
  clsBtn: string;
};

export function BackingTrackDialog({
  open,
  title,
  tracks,
  onClose,
  onOpenTrack,
  clsBtn,
}: BackingTrackDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Backing tracks"
    >
      <button
        className="absolute inset-0 bg-black/90"
        onClick={onClose}
        aria-label="Close backing tracks"
      />

      <div
        className="absolute left-1/2 top-1/2 w-[min(640px,94vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border shadow-xl backdrop-blur overflow-hidden"
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
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-semibold text-[color:var(--brand-surface)]">
                {title}
              </div>

              <button onClick={onClose} className={clsBtn}>
                Close
              </button>
            </div>

            <div className="mt-3 text-sm text-white/60">
              Opens YouTube in a new tab/app.
            </div>

            <div className="mt-4 space-y-2">
              {tracks.length === 0 ? (
                <div
                  className="rounded-lg border p-3"
                  style={{
                    borderColor: "rgba(159,183,193,0.20)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: "rgba(244,247,248,0.80)",
                  }}
                >
                  BT unavailable at the moment.
                </div>
              ) : (
                tracks.map((t) => {
                  const playable = !!t.url;

                  if (!playable) {
                    return (
                      <div
                        key={t.id}
                        className="w-full rounded-lg border px-3 py-2 opacity-70"
                        style={{
                          borderColor: "rgba(159,183,193,0.20)",
                          backgroundColor: "rgba(255,255,255,0.05)",
                        }}
                      >
                        <div className="font-semibold text-white/80">
                          {t.title}
                        </div>
                        <div className="mt-0.5 text-xs text-white/50">
                          {t.style ?? "Info"}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={t.id}
                      onClick={() => onOpenTrack(t.url)}
                      className="w-full text-left rounded-lg border px-3 py-2"
                      style={{
                        borderColor: "rgba(159,183,193,0.20)",
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.05)";
                      }}
                    >
                      <div className="font-semibold text-white/90">
                        {t.title}
                      </div>
                      <div className="mt-0.5 text-xs text-white/60">
                        {t.style ? <span className="mr-2">{t.style}</span> : null}
                        {typeof t.bpm === "number" ? (
                          <span>{t.bpm} BPM</span>
                        ) : null}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
