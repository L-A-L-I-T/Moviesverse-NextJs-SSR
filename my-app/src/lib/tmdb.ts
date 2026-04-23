const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getApiKey() {
  const key = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key) throw new Error("Missing TMDB_API_KEY env var");
  return key;
}

export function tmdbImageUrl(imgPath?: string | null) {
  if (!imgPath) return "";
  const normalized = imgPath.startsWith("/") ? imgPath.slice(1) : imgPath;
  return `https://image.tmdb.org/t/p/original/${normalized}`;
}

export async function tmdbFetch<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", getApiKey());
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TMDB ${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
}

