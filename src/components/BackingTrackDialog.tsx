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
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Close backing tracks"
      />

      <div className="absolute left-1/2 top-1/2 w-[min(640px,94vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0b0f14] p-4 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold">{title}</div>
          <button onClick={onClose} className={clsBtn}>
            Close
          </button>
        </div>

        <div className="mt-3 text-sm text-white/60">
          Opens YouTube in a new tab/app.
        </div>

        <div className="mt-4 space-y-2">
          {tracks.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-white/70">
              BT unavailable at the moment.
            </div>
          ) : (
            tracks.map((t) => {
              const playable = !!t.url;

              if (!playable) {
                return (
                  <div
                    key={t.id}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 opacity-70"
                  >
                    <div className="font-semibold text-white/80">{t.title}</div>
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
                  className="w-full text-left rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2"
                >
                  <div className="font-semibold text-white/90">{t.title}</div>
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
  );
}
