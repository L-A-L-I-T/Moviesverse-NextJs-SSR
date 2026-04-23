import type { NextApiRequest, NextApiResponse } from "next";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getApiKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("Missing TMDB_API_KEY env var");
  return key;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pathParts = req.query.path;
    const path = Array.isArray(pathParts) ? pathParts.join("/") : String(pathParts);

    const url = new URL(`${TMDB_BASE_URL}/${path}`);
    url.searchParams.set("api_key", getApiKey());

    for (const [k, v] of Object.entries(req.query)) {
      if (k === "path") continue;
      if (Array.isArray(v)) {
        v.forEach((vv) => url.searchParams.append(k, vv));
      } else if (v !== undefined) {
        url.searchParams.set(k, String(v));
      }
    }

    const tmdbRes = await fetch(url.toString(), {
      method: req.method,
      headers: { "Content-Type": "application/json" },
    });

    const bodyText = await tmdbRes.text();
    res.status(tmdbRes.status);
    res.setHeader("Content-Type", tmdbRes.headers.get("content-type") || "application/json");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=600");
    res.send(bodyText);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Proxy error" });
  }
}

