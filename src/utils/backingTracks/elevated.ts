// src/utils/backingTracks/elevated.ts

import type { KeyName } from "../keys";
import type { ScaleKey } from "../scales";
import type { BackingTrack } from "./types";

function normalizeQueryKey(k: KeyName): string {
  // keep your UI names, but make searches more likely to hit results
  // YouTube search tends to like "C#"
  return k;
}

function prettyModeLabel(scaleKey: ScaleKey): string {
  // keep it readable in the dialog
  switch (scaleKey) {
    case "major":
      return "Major (Ionian)";
    case "aeolian":
      return "Aeolian";
    default:
      return scaleKey.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  }
}

export function elevatedSearchUrl(key: KeyName, scaleKey: ScaleKey): string {
  const qKey = normalizeQueryKey(key);
  const mode = prettyModeLabel(scaleKey);

  // Locked to Elevated’s channel search (single source)
  const query = encodeURIComponent(`${qKey} ${mode} backing track`);
  return `https://www.youtube.com/@ElevatedJamTracks/search?query=${query}`;
}

export function elevatedSearchTrack(
  key: KeyName,
  scaleKey: ScaleKey,
): BackingTrack {
  const mode = prettyModeLabel(scaleKey);
  return {
    id: `elevated-${scaleKey}-${key}`,
    title: `Elevated Jam Tracks — ${key} ${mode} (search)`,
    url: elevatedSearchUrl(key, scaleKey),
    kind: "elevated_search",
    style: "Elevated",
  };
}
