import type { GetServerSideProps } from "next";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import Section from "@/components/Section";
import { tmdbFetch } from "@/lib/tmdb";
import GenreSectionClient from "@/components/GenreSectionClient";

type Genre = { id: number; name: string };

type Props = {
  bannerItem: any | null;
  trending: any[];
  genres: Genre[];
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  ctx.res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");

  const [genresRes, trendingRes] = await Promise.all([
    tmdbFetch<{ genres: Genre[] }>("/genre/movie/list", { language: "en-US" }),
    tmdbFetch<{ results: any[] }>("/trending/movie/week", { language: "en-US" }),
  ]);

  const trending = trendingRes.results || [];
  const bannerItem = trending.length ? trending[Math.floor(Math.random() * trending.length)] : null;
  const genres = genresRes.genres || [];

  return { props: { bannerItem, trending, genres } };
};

export default function MoviesPage({ bannerItem, trending, genres }: Props) {
  return (
    <div>
      <Navbar mediaType="movie" />
      <Banner mediaType="movie" item={bannerItem} />
      <Section title="Trending" mediaType="movie" titles={trending} />
      {genres.map((g) => (
        <GenreSectionClient key={g.id} title={g.name} mediaType="movie" genreId={g.id} />
      ))}
    </div>
  );
}

