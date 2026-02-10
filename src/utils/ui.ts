// src/utils/ui.ts

export function clampMod(n: number, mod: number): number {
  if (!Number.isFinite(n) || !Number.isFinite(mod) || mod <= 0) return 0;
  return ((n % mod) + mod) % mod;
}

export function panelClass(dark: boolean): string {
  return [
    "w-full",
    "rounded-xl",
    "border",
    dark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5",
  ].join(" ");
}

export function chipClass(dark: boolean): string {
  return [
    "inline-flex items-center gap-2",
    "rounded-lg",
    "border",
    dark ? "border-white/10 bg-black/20" : "border-black/10 bg-white/60",
    "px-2 py-1",
  ].join(" ");
}

export function btnClass(dark: boolean): string {
  return [
    "px-3 py-1.5",
    "rounded-lg",
    "border",
    dark
      ? "border-white/10 bg-white/10 hover:bg-white/15"
      : "border-black/10 bg-black/5 hover:bg-black/10",
    "disabled:opacity-50",
    "text-white",
  ].join(" ");
}

export function btnPrimaryClass(): string {
  return [
    "px-3 py-1.5",
    "rounded-lg",
    "border",
    "border-blue-500/30",
    "bg-blue-600/30 hover:bg-blue-600/40",
    "text-white",
  ].join(" ");
}

export const miniInputClass =
  "w-16 rounded-md bg-gray-900/60 text-white border border-white/10 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40";
