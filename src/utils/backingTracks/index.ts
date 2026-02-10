// src/utils/backingTracks/index.ts

import type { KeyName } from "../keys";
import type { ScaleKey } from "../scales";
import type { BackingTrack } from "./types";

import { MAJOR_TRACKS_BY_KEY } from "./major";
import { DORIAN_TRACKS_BY_KEY } from "./dorian";
import { PHRYGIAN_TRACKS_BY_KEY } from "./phrygian";
import { LYDIAN_TRACKS_BY_KEY } from "./lydian";
import { MIXOLYDIAN_TRACKS_BY_KEY } from "./mixolydian";
import { AEOLIAN_TRACKS_BY_KEY } from "./aeolian";
import { LOCRIAN_TRACKS_BY_KEY } from "./locrian";

import { hasAnyPlayableCached, validateBackingTracks } from "./youtubeValidate";

type TracksByKey = Partial<Record<KeyName, BackingTrack[]>>;

function normalizeScaleKey(scale: ScaleKey): ScaleKey {
  return scale;
}

function getFromMap(map: TracksByKey, rootKey: KeyName): BackingTrack[] {
  return map[rootKey] ?? [];
}

export function getBackingTracks(rootKey: KeyName, scale: ScaleKey): BackingTrack[] {
  const s = normalizeScaleKey(scale);

  if (s === "major") return getFromMap(MAJOR_TRACKS_BY_KEY, rootKey);

  if (s === "dorian") return getFromMap(DORIAN_TRACKS_BY_KEY, rootKey);
  if (s === "phrygian") return getFromMap(PHRYGIAN_TRACKS_BY_KEY, rootKey);
  if (s === "lydian") return getFromMap(LYDIAN_TRACKS_BY_KEY, rootKey);
  if (s === "mixolydian") return getFromMap(MIXOLYDIAN_TRACKS_BY_KEY, rootKey);
  if (s === "aeolian") return getFromMap(AEOLIAN_TRACKS_BY_KEY, rootKey);
  if (s === "locrian") return getFromMap(LOCRIAN_TRACKS_BY_KEY, rootKey);

  // Expand later: minor, harmonic_minor, melodic_minor, blues, etc.
  return [];
}

export async function getBackingTracksValidated(
  rootKey: KeyName,
  scale: ScaleKey,
): Promise<BackingTrack[]> {
  const tracks = getBackingTracks(rootKey, scale);

  // Validate returns url -> playable
  const playableByUrl = await validateBackingTracks(tracks);

  // Keep placeholders (so “Alternates coming soon” stays visible),
  // and keep any track that validates true.
  return tracks.filter((t) => {
    if (!t.url || t.kind === "placeholder") return true;
    return playableByUrl[t.url] === true;
  });
}

export async function getBackingTracksPlayable(
  rootKey: KeyName,
  scale: ScaleKey,
): Promise<BackingTrack[]> {
  const tracks = getBackingTracks(rootKey, scale);
  const playableByUrl = await validateBackingTracks(tracks);

  // Strict: return only playable tracks (no placeholders)
  return tracks.filter((t) => !!t.url && t.kind !== "placeholder" && playableByUrl[t.url] === true);
}

export function hasBackingTracksCached(rootKey: KeyName, scale: ScaleKey): boolean {
  const tracks = getBackingTracks(rootKey, scale);
  return hasAnyPlayableCached(tracks);
}


export { validateBackingTracks } from "./youtubeValidate";
export type { BackingTrack } from "./types";
