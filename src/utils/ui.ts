// src/utils/ui.ts

export function clampMod(n: number, mod: number): number {
  if (!Number.isFinite(n) || !Number.isFinite(mod) || mod <= 0) return 0;
  return ((n % mod) + mod) % mod;
}

/**
 * Brand tokens live in CSS variables (see src/index.css):
 * --bg-panel, --bg-app, --brand-primary, --brand-secondary, --brand-surface,
 * --text, --text-strong, --text-muted, --border
 */
export function panelClass(dark: boolean): string {
  return [
    "w-full",
    "rounded-xl",
    "border",
    dark
      ? "border-white/10 bg-[color:var(--bg-panel)]/5"
      : "border-[color:var(--border)] bg-[color:var(--bg-panel)]",
  ].join(" ");
}

export function chipClass(dark: boolean): string {
  return [
    "inline-flex items-center gap-2",
    "rounded-lg",
    "border",
    dark
      ? "border-white/10 bg-black/20 text-white"
      : "border-[color:var(--border)] bg-[color:var(--brand-surface)] text-[color:var(--brand-secondary)]",
    "px-2 py-1",
  ].join(" ");
}

export function btnClass(dark: boolean): string {
  return [
    "px-3 py-1.5",
    "rounded-lg",
    "border",
    dark
      ? "border-white/10 bg-white/10 hover:bg-white/15 text-white"
      : "border-[color:var(--border)] bg-[color:var(--bg-panel)] hover:bg-[color:var(--brand-surface)] text-[color:var(--text)]",
    "disabled:opacity-50",
  ].join(" ");
}

export function btnPrimaryClass(): string {
  return [
    "px-3 py-1.5",
    "rounded-lg",
    "border",
    "border-transparent",
    "bg-[color:var(--brand-primary)] hover:opacity-95",
    "text-white",
  ].join(" ");
}

export const miniInputClass = [
  "w-16 rounded-md",
  "border",
  "px-2 py-1",
  "text-sm",
  "focus:outline-none focus:ring-2",
  // Dark / light compatibility without changing signature:
  // This input is used in settings panels; keep it readable in both modes.
  "bg-[color:var(--bg-panel)]",
  "text-[color:var(--text)]",
  "border-[color:var(--border)]",
  "focus:ring-[color:var(--brand-primary)]/40",
].join(" ");
