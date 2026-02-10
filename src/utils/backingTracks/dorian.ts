// src/utils/backingTracks/dorian.ts
import type { KeyName } from "../keys";
import { KEYS } from "../keys";
import type { BackingTrack } from "./types";
import { elevatedSearchTrack } from "./elevated";

export const DORIAN_TRACKS_BY_KEY: Record<KeyName, BackingTrack[]> =
  Object.fromEntries(
    KEYS.map((k) => [k, [elevatedSearchTrack(k, "dorian")]]),
  ) as Record<KeyName, BackingTrack[]>;
