import type { KeyName } from "../keys";
import { KEYS } from "../keys";
import type { BackingTrack } from "./types";
import { elevatedSearchTrack } from "./elevated";

export const LYDIAN_TRACKS_BY_KEY: Record<KeyName, BackingTrack[]> = Object.fromEntries(
  KEYS.map((k) => [k, [elevatedSearchTrack(k, "lydian")]]),
) as Record<KeyName, BackingTrack[]>;
