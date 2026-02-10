// src/utils/backingTracks/types.ts

import type { KeyName } from "../keys";
import type { ScaleKey } from "../scales";

export type BackingTrackKind = "video" | "elevated_search" | "placeholder";


export type BackingTrack = {
  id: string;
  title: string;
  url: string;
  kind: BackingTrackKind; // default "video"
  bpm?: number;
  style?: string;
};

export type BackingTrackLibrary = Partial<Record<ScaleKey, Partial<Record<KeyName, BackingTrack[]>>>>;
