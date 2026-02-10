import type { KeyName } from "../keys";
import { KEYS } from "../keys";
import type { BackingTrack } from "./types";
import { elevatedSearchTrack } from "./elevated";

export const PHRYGIAN_TRACKS_BY_KEY: Record<KeyName, BackingTrack[]> =
  Object.fromEntries(
    KEYS.map((k) => [k, [elevatedSearchTrack(k, "phrygian")]]),
  ) as Record<KeyName, BackingTrack[]>;
