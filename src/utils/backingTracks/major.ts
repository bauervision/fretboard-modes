// src/utils/backingTracks/major.ts

import type { KeyName } from "../keys";
import type { BackingTrack } from "./types";

function altComingSoon(idSuffix: string): BackingTrack {
  return {
    id: `alt-coming-soon-${idSuffix}`,
    title: "Alternates coming soon",
    url: "",
    kind: "placeholder",
    style: "Info",
  };
}

function ejt(title: string, url: string, id: string): BackingTrack {
  return {
    id,
    title: `Elevated Jam Tracks — ${title}`,
    url,
    kind: "video",
    style: "Jam",
  };
}

/**
 * Major: MVP coverage is one stable primary per key + one placeholder alt row.
 * Placeholder rows use url="" and kind:"placeholder" (render as disabled).
 */
export const MAJOR_TRACKS_BY_KEY: Record<KeyName, BackingTrack[]> = {
  C: [
    ejt(
      "C Major — Backing Track",
      "https://www.youtube.com/watch?v=JttlFZzL814",
      "major-c-1",
    ),
    altComingSoon("major-c"),
  ],
  "C#": [
    ejt(
      "C# Major — Backing Track",
      "https://www.youtube.com/watch?v=z6CgJLPkC24",
      "major-cs-1",
    ),
    altComingSoon("major-cs"),
  ],
  D: [
    ejt(
      "D Major — Backing Track",
      "https://www.youtube.com/watch?v=HoR-wGfJU08",
      "major-d-1",
    ),
    altComingSoon("major-d"),
  ],
  "D#": [
    ejt(
      "Eb Major — Backing Track",
      "https://www.youtube.com/watch?v=J_NG93OKHuU",
      "major-ds-1",
    ),
    altComingSoon("major-ds"),
  ],
  E: [
    ejt(
      "E Major — Backing Track",
      "https://www.youtube.com/watch?v=a-u6Q4Vzhjg",
      "major-e-1",
    ),
    altComingSoon("major-e"),
  ],
  F: [
    ejt(
      "F Major — Backing Track",
      "https://www.youtube.com/watch?v=wKbg6iDSXJQ",
      "major-f-1",
    ),
    altComingSoon("major-f"),
  ],
  "F#": [
    ejt(
      "F# Major — Backing Track",
      "https://www.youtube.com/watch?v=VNNDH2FrPcg",
      "major-fs-1",
    ),
    altComingSoon("major-fs"),
  ],
  G: [
    ejt(
      "G Major — Backing Track",
      "https://www.youtube.com/watch?v=3stpZKNF_jQ",
      "major-g-1",
    ),
    altComingSoon("major-g"),
  ],
  "G#": [
    ejt(
      "Ab Major — Backing Track",
      "https://www.youtube.com/watch?v=gRGwoMBPhLU",
      "major-gs-1",
    ),
    altComingSoon("major-gs"),
  ],
  A: [
    ejt(
      "A Major — Backing Track",
      "https://www.youtube.com/watch?v=78-nA8U6Rj8",
      "major-a-1",
    ),
    altComingSoon("major-a"),
  ],
  "A#": [
    ejt(
      "Bb Major — Backing Track",
      "https://www.youtube.com/watch?v=i4vK-x69AJ8",
      "major-as-1",
    ),
    altComingSoon("major-as"),
  ],
  B: [
    ejt(
      "B Major — Backing Track",
      "https://www.youtube.com/watch?v=o86XsPtpY5I",
      "major-b-1",
    ),
    altComingSoon("major-b"),
  ],
};
