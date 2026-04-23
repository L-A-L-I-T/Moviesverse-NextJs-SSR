import type { GetServerSideProps } from "next";
import { createUseStyles } from "react-jss";
import Navbar from "@/components/Navbar";
import { tmdbFetch, tmdbImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import MovieDetailsExtras from "@/components/MovieDetailsExtras";

const useStyles = createUseStyles({
  root: { minHeight: "100vh" },
  fadeLeft: {
    position: "absolute",
    background: "-webkit-linear-gradient(right,rgba(0,0,0,0) 80%,#111 100%)",
  },
  row: {},
  placeHolder: { height: "500px" },
  "@media (max-width: 1000px)": {
    row: { flexDirection: "column-reverse" },
  },
  "@media (min-width: 1024px)": {
    fadeLeft: { height: "455px" },
  },
  "@media (min-width: 1366px)": {
    fadeLeft: { height: "500px" },
  },
  "@media (min-width: 1920px)": {
    fadeLeft: { height: "650px" },
  },
  "@media (min-width: 2560px)": {
    fadeLeft: { height: "840px" },
  },
  "@media (min-width: 3440px)": {
    fadeLeft: { height: "1200px" },
  },
});

type Props = {
  movieId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  movieDetails: any | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const movieId = String(ctx.params?.movie_id || "");
  if (!movieId) return { notFound: true };

  // Cache SSR HTML at the CDN/proxy (when deployed).
  ctx.res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const movieDetails = await tmdbFetch<any>(`/movie/${movieId}`, {
    language: "en-US",
  }).catch(() => null);
  if (!movieDetails) return { notFound: true };

  return {
    props: { movieId, movieDetails },
  };
};

export default function MovieDetailsPage({
  movieId,
  movieDetails,
}: Props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Navbar mediaType="movie" />
      <div className="container-fluid">
        <div className={`${classes.row} row`}>
          <div className="col-lg-5 pt-5 ps-4">
            <h1>
              {movieDetails?.name ||
                movieDetails?.title ||
                movieDetails?.original_name ||
                movieDetails?.original_title}
            </h1>
            <p>{movieDetails?.overview}</p>
            {movieDetails?.genres && (
              <p>
                Genre :{" "}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {movieDetails.genres.map((genre: any) => (
                  <span key={genre.id} className="badge bg-warning text-dark ms-3">
                    {genre.name}
                  </span>
                ))}
              </p>
            )}
            {movieDetails?.runtime && <p>Runtime : {movieDetails.runtime} mins</p>}
            {movieDetails?.release_date && <p>Release Date : {movieDetails.release_date}</p>}
          </div>
          {movieDetails?.backdrop_path ? (
            <div className="col-lg-7">
              <div className={`${classes.fadeLeft} col-6`} />
              <Image
                width={1280}
                height={720}
                style={{ width: "100%", height: "auto" }}
                src={tmdbImageUrl(movieDetails.backdrop_path)}
                alt={movieDetails?.name}
              />
            </div>
          ) : (
            <div className="col-7 placeholder-glow">
              <div className={`placeholder col-12 bg-dark ${classes.placeHolder}`} />
            </div>
          )}
        </div>
      </div>

      <MovieDetailsExtras movieId={movieId} />
    </div>
  );
}

