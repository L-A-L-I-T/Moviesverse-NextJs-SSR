import type { GetServerSideProps } from "next";
import Link from "next/link";
import { createUseStyles } from "react-jss";
import Navbar from "@/components/Navbar";
import Images from "@/components/Images";
import Videos from "@/components/Videos";
import Review from "@/components/Review";
import Section from "@/components/Section";
import EpisodeCard from "@/components/EpisodeCard";
import Cast from "@/components/Cast";
import { tmdbFetch, tmdbImageUrl } from "@/lib/tmdb";

const useStyles = createUseStyles({
  root: { minHeight: "100vh" },
  row: {},
  loadingImg: { height: "455px" },
  parentImg: {},
  noImg: {
    width: "100%",
    height: "455px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#202020",
  },
  fadeLeft: {
    position: "absolute",
    background: "-webkit-linear-gradient(right,rgba(0,0,0,0) 80%,#111 100%)",
  },
  "@media (min-width: 100px)": {
    loadingImg: { height: "220px" },
    noImg: { height: "220px" },
  },
  "@media (max-width: 1000px)": {
    row: { flexDirection: "column-reverse" },
  },
  "@media (min-width: 1000px)": {
    fadeLeft: { height: "455px" },
    loadingImg: { height: "455px" },
  },
  "@media (min-width: 1024px)": {
    fadeLeft: { height: "420px" },
    loadingImg: { height: "350px" },
  },
  "@media (min-width: 1366px)": {
    fadeLeft: { height: "520px" },
    loadingImg: { height: "500px" },
  },
  "@media (min-width: 1920px)": {
    fadeLeft: { height: "650px" },
    loadingImg: { height: "640px" },
  },
  "@media (min-width: 2560px)": {
    fadeLeft: { height: "840px" },
    loadingImg: { height: "830px" },
  },
  "@media (min-width: 3440px)": {
    fadeLeft: { height: "1200px" },
    loadingImg: { height: "1180px" },
  },
});

function truncate(str?: string, n = 400) {
  return str && str.length > n ? str.slice(0, n - 1) + "..." : str || "";
}

type Props = {
  tvId: string;
  tvDetails: any | null;
  season: number;
  seasonDetails: any | null;
  seasonImages: any[];
  showImages: any[];
  videos: any[];
  reviews: any[];
  cast: any[];
  similar: any[];
  recommended: any[];
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const tvId = String(ctx.params?.tv_id || "");
  if (!tvId) return { notFound: true };

  const season = Math.max(1, Number(ctx.query.season || 1) || 1);

  ctx.res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");

  const [tvDetails, seasonDetails] = await Promise.all([
    tmdbFetch<any>(`/tv/${tvId}`, {
      language: "en-US",
      append_to_response: "images,videos,reviews,similar,recommendations",
    }).catch(() => null),
    tmdbFetch<any>(`/tv/${tvId}/season/${season}`, { language: "en-US" }).catch(() => null),
  ]);

  if (!tvDetails) return { notFound: true };

  const [seasonImagesRes, seasonVideosRes, creditsRes] = await Promise.all([
    tmdbFetch<any>(`/tv/${tvId}/season/${season}/images`).catch(() => ({})),
    tmdbFetch<any>(`/tv/${tvId}/season/${season}/videos`).catch(() => ({})),
    tmdbFetch<any>(`/tv/${tvId}/season/${season}/aggregate_credits`).catch(() => ({})),
  ]);

  const seasonImages = seasonImagesRes.posters || seasonImagesRes.backdrops || [];
  const showImages = tvDetails?.images?.backdrops || tvDetails?.images?.posters || [];

  const seasonVideos = seasonVideosRes.results || [];
  const fallbackVideos = tvDetails?.videos?.results || [];
  const videos = seasonVideos.length ? seasonVideos : fallbackVideos;

  const reviews = tvDetails?.reviews?.results || [];
  const similar = tvDetails?.similar?.results || [];
  const recommended = tvDetails?.recommendations?.results || [];

  const cast = creditsRes.cast || [];

  return {
    props: {
      tvId,
      tvDetails,
      season,
      seasonDetails,
      seasonImages,
      showImages,
      videos,
      reviews,
      cast,
      similar,
      recommended,
    },
  };
};

export default function TVDetailsPage({
  tvId,
  tvDetails,
  season,
  seasonDetails,
  seasonImages,
  showImages,
  videos,
  reviews,
  cast,
  similar,
  recommended,
}: Props) {
  const classes = useStyles();

  const imgPath =
    seasonDetails?.episodes?.length > 0
      ? seasonDetails.episodes[0]?.still_path || seasonDetails.poster_path
      : null;

  return (
    <div className={classes.root}>
      <Navbar mediaType="tv" />
      <div className="container-fluid">
        <div className={`${classes.row} row`}>
          <div className="col-lg-5 pt-5 ps-4">
            <h1>
              {tvDetails?.name ||
                tvDetails?.title ||
                tvDetails?.original_name ||
                tvDetails?.original_title}
            </h1>
            <p>
              <b>Total Seasons :</b>
              <span className="badge bg-warning text-dark ms-2 me-4">
                {tvDetails?.number_of_seasons}
              </span>
              <b>Total Episodes : </b>
              <span className="badge bg-warning text-dark ms-2">
                {tvDetails?.number_of_episodes}
              </span>
            </p>
            <div className="dropdown">
              <button
                className="btn btn-outline-warning dropdown-toggle"
                type="button"
                id="dropdownMenu2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Season {season}
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                {new Array(tvDetails?.number_of_seasons || 0)
                  .fill(null)
                  .map((_, index) => (
                    <li key={index}>
                      <Link
                        className="dropdown-item"
                        href={{
                          pathname: `/tv/details/${tvId}`,
                          query: { season: index + 1 },
                        }}
                      >
                        Season {index + 1}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            <p className="mt-4">{truncate(seasonDetails?.overview || tvDetails?.overview, 400)}</p>
          </div>
          <div className={`col-lg-7 ${classes.parentImg}`}>
            {imgPath ? (
              <>
                <div className={`${classes.fadeLeft} col-6`} />
                <img width="100%" src={tmdbImageUrl(imgPath)} alt={tvDetails?.name} />
              </>
            ) : (
              <div className={classes.noImg} aria-hidden="true">
                <h1>
                  {tvDetails?.name ||
                    tvDetails?.title ||
                    tvDetails?.original_name ||
                    tvDetails?.original_title}
                </h1>
              </div>
            )}
          </div>
        </div>
        <div className="container-fluid">
          <h4 className="my-3">Episodes ({seasonDetails?.episodes?.length || 0})</h4>
          {(seasonDetails?.episodes || []).map((episode: any) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      </div>

      <Cast credits={cast} />
      <Images title="Posters" images={seasonImages} />
      <Images title="Images" images={showImages} />
      <Videos videos={videos} />
      <Review reviews={reviews} />

      <Section title="Similar Shows" mediaType="tv" titles={similar} showTotal />
      <Section
        title="Recommended Shows"
        mediaType="tv"
        titles={recommended}
        showTotal
      />
    </div>
  );
}

