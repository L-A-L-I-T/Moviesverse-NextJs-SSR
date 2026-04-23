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
  netflix: any[];
  genres: Genre[];
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  ctx.res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");

  const [genresRes, trendingRes, netflixRes] = await Promise.all([
    tmdbFetch<{ genres: Genre[] }>("/genre/tv/list", { language: "en-US" }),
    tmdbFetch<{ results: any[] }>("/trending/tv/week", { language: "en-US" }),
    tmdbFetch<{ results: any[] }>("/discover/tv", { with_networks: 213 }).catch(() => ({
      results: [],
    })),
  ]);

  const trending = trendingRes.results || [];
  const bannerItem = trending.length ? trending[Math.floor(Math.random() * trending.length)] : null;
  const genres = genresRes.genres || [];
  const netflix = netflixRes.results || [];

  return { props: { bannerItem, trending, netflix, genres } };
};

export default function TVPage({ bannerItem, trending, netflix, genres }: Props) {
  return (
    <div>
      <Navbar mediaType="tv" />
      <Banner mediaType="tv" item={bannerItem} />
      <Section title="Trending" mediaType="tv" titles={trending} />
      <Section title="Netflix Originals" mediaType="tv" titles={netflix} />
      {genres.map((g) => (
        <GenreSectionClient key={g.id} title={g.name} mediaType="tv" genreId={g.id} />
      ))}
    </div>
  );
}

