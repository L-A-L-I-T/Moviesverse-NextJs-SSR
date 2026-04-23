## Moviesverse Next.js (SSR)

### Setup

1. Create `.env.local` (do **not** commit it):

```bash
cp .env.local.example .env.local
```

2. Put your TMDB key into `.env.local`:

```bash
TMDB_API_KEY=...
```

3. Run:

```bash
npm run dev
```

### Routes migrated from the React SPA

- `/` → redirects to `/movies`
- `/movies`
- `/tv`
- `/movie/details/[movie_id]`
- `/tv/details/[tv_id]`
- `/search_results?query=...`
- `/person/[person_id]`

### Notes

- The TMDB API key is kept server-side. Client-side requests go through the proxy route `pages/api/tmdb/[...path].ts`.

