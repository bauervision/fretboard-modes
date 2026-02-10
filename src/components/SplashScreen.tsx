// src/components/SplashScreen.tsx

import * as React from "react";
import { startTransition } from "react";

export type SplashScreenProps = {
  onDoneAction: () => void;
  durationMs?: number;
};

export function SplashScreen({
  onDoneAction,
  durationMs = 1600,
}: SplashScreenProps) {
  React.useEffect(() => {
    const t = window.setTimeout(() => {
      startTransition(() => onDoneAction());
    }, durationMs + 60);

    return () => window.clearTimeout(t);
  }, [durationMs, onDoneAction]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center"
      style={{ backgroundColor: "var(--bg-fretboard)" }}
      aria-label="Splash"
    >
      <div className="flex flex-col items-center gap-4">
        <img
          src="/Logo.png"
          alt="Fretboard Modes"
          className="fm-splash-logo w-[min(520px,30vw)] h-auto select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
