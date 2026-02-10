// src/utils/backingTracks/youtubeValidate.ts

import type { BackingTrack } from "./types";

type Cache = Record<string, boolean>;

const CACHE_KEY = "bt_youtube_valid_cache_v1";

function safeParseCache(raw: string | null): Cache {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== "object") return {};
    return v as Cache;
  } catch {
    return {};
  }
}

function readCache(): Cache {
  if (typeof window === "undefined") return {};
  return safeParseCache(window.localStorage.getItem(CACHE_KEY));
}

function writeCache(cache: Cache) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore quota / private mode
  }
}

function isYouTubeHost(h: string) {
  return (
    h === "youtube.com" ||
    h === "www.youtube.com" ||
    h === "m.youtube.com" ||
    h === "youtu.be"
  );
}

function validateElevatedSearchUrl(urlStr: string): boolean {
  try {
    const u = new URL(urlStr);
    if (!isYouTubeHost(u.hostname)) return false;
    if (u.hostname === "youtu.be") return false; // search won’t be youtu.be
    if (!u.pathname.startsWith("/@ElevatedJamTracks/search")) return false;
    const q = u.searchParams.get("query");
    return !!q && q.trim().length > 0;
  } catch {
    return false;
  }
}

function validateBasicYouTubeVideoUrl(urlStr: string): boolean {
  try {
    const u = new URL(urlStr);
    if (!isYouTubeHost(u.hostname)) return false;

    if (u.hostname === "youtu.be") {
      // youtu.be/<id>
      const id = u.pathname.replace("/", "").trim();
      return id.length > 0;
    }

    // youtube.com/watch?v=...
    if (u.pathname === "/watch") {
      const v = u.searchParams.get("v");
      return !!v && v.trim().length > 0;
    }

    // youtube.com/shorts/<id> or /embed/<id>
    if (u.pathname.startsWith("/shorts/") || u.pathname.startsWith("/embed/")) {
      const parts = u.pathname.split("/").filter(Boolean);
      return parts.length >= 2 && parts[1].trim().length > 0;
    }

    return false;
  } catch {
    return false;
  }
}

function isPlaceholder(t: BackingTrack): boolean {
  return !t.url || t.kind === "placeholder";
}

export function hasAnyPlayableCached(tracks: BackingTrack[]): boolean {
  const cache = readCache();
  return tracks.some((t) => !isPlaceholder(t) && cache[t.url] === true);
}

export async function validateBackingTracks(
  tracks: BackingTrack[],
): Promise<Record<string, boolean>> {
  // Returns map[url] -> playable
  const cache = readCache();
  const out: Record<string, boolean> = {};

  const toCheck: string[] = [];

  for (const t of tracks) {
    if (isPlaceholder(t)) continue;

    if (t.url in cache) {
      out[t.url] = cache[t.url];
      continue;
    }
    toCheck.push(t.url);
  }

  // Fast path for elevated search links (no network needed)
  for (const t of tracks) {
    if (isPlaceholder(t)) continue;

    if (t.kind === "elevated_search" && !(t.url in cache)) {
      const ok = validateElevatedSearchUrl(t.url);
      cache[t.url] = ok;
      out[t.url] = ok;
    }
  }

  // Anything left should be actual video links
  const remaining = toCheck.filter((url) => !(url in out));
  for (const url of remaining) {
    const ok = validateBasicYouTubeVideoUrl(url);
    cache[url] = ok;
    out[url] = ok;
  }

  writeCache(cache);
  return out;
}
