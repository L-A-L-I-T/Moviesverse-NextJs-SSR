import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/tmdb",
  }),
  keepUnusedDataFor: 300, // 5 minutes client cache
  endpoints: (builder) => ({
    discoverByGenre: builder.query<any[], { mediaType: "movie" | "tv"; genreId: number }>({
      query: ({ mediaType, genreId }) => `/discover/${mediaType}?with_genres=${genreId}`,
      transformResponse: (r: any) => r?.results || [],
    }),

    movieExtras: builder.query<
      {
        images: any[];
        videos: any[];
        reviews: any[];
        cast: any[];
        similar: any[];
        recommended: any[];
      },
      { movieId: string }
    >({
      query: ({ movieId }) =>
        `/movie/${movieId}?language=en-US&append_to_response=images,videos,credits,reviews,similar,recommendations`,
      transformResponse: (r: any) => ({
        images: r?.images?.backdrops || r?.images?.posters || [],
        videos: r?.videos?.results || [],
        reviews: r?.reviews?.results || [],
        cast: r?.credits?.cast || [],
        similar: r?.similar?.results || [],
        recommended: r?.recommendations?.results || [],
      }),
    }),

    tvExtras: builder.query<
      {
        showImages: any[];
        videos: any[];
        reviews: any[];
        similar: any[];
        recommended: any[];
      },
      { tvId: string }
    >({
      query: ({ tvId }) =>
        `/tv/${tvId}?language=en-US&append_to_response=images,videos,reviews,similar,recommendations`,
      transformResponse: (r: any) => ({
        showImages: r?.images?.backdrops || r?.images?.posters || [],
        videos: r?.videos?.results || [],
        reviews: r?.reviews?.results || [],
        similar: r?.similar?.results || [],
        recommended: r?.recommendations?.results || [],
      }),
    }),

    tvSeasonExtras: builder.query<
      { seasonImages: any[]; cast: any[]; seasonVideos: any[] },
      { tvId: string; season: number }
    >({
      async queryFn(arg, _api, _extra, baseQuery) {
        const [imagesRes, creditsRes, videosRes] = await Promise.all([
          baseQuery(`/tv/${arg.tvId}/season/${arg.season}/images`),
          baseQuery(`/tv/${arg.tvId}/season/${arg.season}/aggregate_credits`),
          baseQuery(`/tv/${arg.tvId}/season/${arg.season}/videos`),
        ]);

        if (imagesRes.error) return { error: imagesRes.error as any };
        if (creditsRes.error) return { error: creditsRes.error as any };
        if (videosRes.error) return { error: videosRes.error as any };

        const i: any = imagesRes.data;
        const c: any = creditsRes.data;
        const v: any = videosRes.data;
        return {
          data: {
            seasonImages: i?.posters || i?.backdrops || [],
            cast: c?.cast || [],
            seasonVideos: v?.results || [],
          },
        };
      },
    }),

    personExtras: builder.query<
      { images: any[]; movieCredits: any[]; tvCredits: any[] },
      { personId: string }
    >({
      async queryFn(arg, _api, _extra, baseQuery) {
        const [imagesRes, movieRes, tvRes] = await Promise.all([
          baseQuery(`/person/${arg.personId}/images`),
          baseQuery(`/person/${arg.personId}/movie_credits?language=en-US`),
          baseQuery(`/person/${arg.personId}/tv_credits?language=en-US`),
        ]);

        if (imagesRes.error) return { error: imagesRes.error as any };
        if (movieRes.error) return { error: movieRes.error as any };
        if (tvRes.error) return { error: tvRes.error as any };

        const i: any = imagesRes.data;
        const m: any = movieRes.data;
        const t: any = tvRes.data;

        return {
          data: {
            images: i?.profiles || [],
            movieCredits: m?.cast || [],
            tvCredits: t?.cast || [],
          },
        };
      },
    }),
  }),
});

export const {
  useDiscoverByGenreQuery,
  useMovieExtrasQuery,
  useTvExtrasQuery,
  useTvSeasonExtrasQuery,
  usePersonExtrasQuery,
} = tmdbApi;

