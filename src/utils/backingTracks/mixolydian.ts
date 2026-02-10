import type { KeyName } from "../keys";
import { KEYS } from "../keys";
import type { BackingTrack } from "./types";
import { elevatedSearchTrack } from "./elevated";

export const MIXOLYDIAN_TRACKS_BY_KEY: Record<KeyName, BackingTrack[]> =
  Object.fromEntries(
    KEYS.map((k) => [k, [elevatedSearchTrack(k, "mixolydian")]]),
  ) as Record<KeyName, BackingTrack[]>;
