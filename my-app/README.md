## Moviesverse (Next.js SSR + CSR Hybrid)

Moviesverse is a TMDB-powered movie/TV discovery app migrated from a React SPA into **Next.js (Pages Router)** with a **hybrid rendering strategy**:

- **SSR (server-side rendering)** for fast first content on each page (above-the-fold / critical UI)
- **CSR (client-side rendering)** for heavy sections using **RTK Query** (cached) + skeletons

This avoids the “freeze” that can happen when a route waits for many server API calls before it can render.

## Tech stack

- **Next.js**: Pages Router (SSR via `getServerSideProps`)
- **React**
- **Bootstrap 5** (CDN) + Bootstrap Icons (CDN)
- **react-jss** with SSR style collection
- **RTK Query** for client-side fetching + caching (`@reduxjs/toolkit/query`)

## Setup

### 1) Environment variables

Create `.env.local` in this folder (do **not** commit it):

```bash
cp .env.local.example .env.local
```

Set your TMDB API key:

```bash
TMDB_API_KEY=your_tmdb_api_key_here
```

### 2) Install & run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Routes

- `/` → redirects to `/movies`
- `/movies`
- `/tv`
- `/movie/details/[movie_id]`
- `/tv/details/[tv_id]` (supports SSR season switch via `?season=2`)
- `/search_results?query=...`
- `/person/[person_id]`

## Rendering strategy (how we avoid “freeze”)

### The problem

If a page does many network calls in `getServerSideProps` (for example: fetch all genre rows, similar, recommended, credits, reviews, images, videos, etc.), then **client-side navigation still has to wait for the server to finish** generating the JSON for that route. That feels like the UI is stuck/frozen.

### The solution we implemented (industry-standard hybrid)

We render the **top/critical UI** on the server, and load the heavy/secondary sections on the client:

- **SSR**: main layout + banner + trending (and other above-the-fold content)
- **CSR** (RTK Query): genre rows, extra sections (cast/images/reviews/similar/recommended), etc.
- **Skeletons**: show placeholders while CSR data loads
- **Client cache**: RTK Query caches results for quick back/forward and repeated tab switches

Where this is implemented:

- **SSR** pages:
  - `src/pages/movies.tsx` (SSR: banner + trending)
  - `src/pages/tv.tsx` (SSR: banner + trending + netflix originals)
  - `src/pages/movie/details/[movie_id].tsx` (SSR: hero/details only)
  - `src/pages/tv/details/[tv_id].tsx` (SSR currently; can be hybridized similarly if desired)
  - `src/pages/search_results.tsx` (SSR)
  - `src/pages/person/[person_id].tsx` (SSR currently; can be hybridized similarly if desired)

- **CSR + caching**:
  - `src/store/tmdbApi.ts` (RTK Query endpoints)
  - `src/store/store.ts` + `src/pages/_app.tsx` (Redux Provider)
  - `src/components/GenreSectionClient.tsx` (client fetched genre rows)
  - `src/components/MovieDetailsExtras.tsx` (client fetched details sections)
  - `src/components/SkeletonRow.tsx` (loading placeholders)

### Caching

We use two layers:

- **Server/API proxy caching**:
  - TMDB is called server-side via `tmdbFetch` in `src/lib/tmdb.ts`
  - Client calls are proxied via `src/pages/api/tmdb/[...path].ts` (keeps TMDB key server-side)
  - Some pages set `Cache-Control` headers in `getServerSideProps` (useful when deployed behind a CDN)

- **Client caching**:
  - RTK Query (`keepUnusedDataFor: 300`) caches fetched data in memory for 5 minutes
  - Dedupes in-flight requests (prevents repeated calls if the same section mounts twice)

## Notes

### YouTube network calls

Embedding YouTube can generate many background requests (ads/telemetry). To reduce this, the `Videos` component renders **thumbnails first** and only loads the iframe **on click**:

- `src/components/Videos.tsx`

## Build

```bash
npm run build
npm run start
```

