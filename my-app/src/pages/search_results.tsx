import type { GetServerSideProps } from "next";
import Link from "next/link";
import { createUseStyles } from "react-jss";
import Navbar from "@/components/Navbar";
import { tmdbFetch, tmdbImageUrl } from "@/lib/tmdb";

const useStyles = createUseStyles({
  root: { minHeight: "100vh" },
  result: {
    transition: "450ms",
    "&:hover": { transform: "scale(1.1)" },
  },
  poster: { height: "300px" },
  caption: { textAlign: "center", color: "white" },
  loadingImg: { height: "250px", width: "170px" },
});

type Props = {
  query: string;
  results: any[];
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const query = String(ctx.query.query || "").trim();
  if (!query) return { props: { query: "", results: [] } };

  const data = await tmdbFetch<{ results: any[] }>("/search/multi", {
    language: "en-US",
    query,
  }).catch(() => ({ results: [] }));

  return { props: { query, results: data.results || [] } };
};

export default function SearchResultsPage({ query, results }: Props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Navbar />
      <div>
        <h2 className="my-5 ms-4">
          Search Results for &quot; {query} &quot;
        </h2>
        <div className="container">
          <div className="row">
            {results.map((result) => {
              const href =
                result.media_type === "person"
                  ? `/person/${result.id}`
                  : result.media_type === "movie"
                    ? `/movie/details/${result.id}`
                    : `/tv/details/${result.id}`;

              const img = result.poster_path || result.profile_path;
              const label =
                (result.media_type === "movie" && "Movie") ||
                (result.media_type === "tv" && "TV Show") ||
                (result.media_type === "person" && "Person");

              return (
                <div key={`${result.media_type}-${result.id}`} className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3">
                  <Link href={href} style={{ textDecoration: "none" }}>
                    <div
                      className={`d-flex flex-column justify-content-center align-items-center ${classes.result}`}
                    >
                      {img ? (
                        <img className={classes.poster} alt={result.name} src={tmdbImageUrl(img)} />
                      ) : (
                        <div
                          className={`placeholder-glow bg-dark ${classes.loadingImg}`}
                          aria-hidden="true"
                        />
                      )}
                      <h4 className={`${classes.caption} mt-2`}>
                        {result?.name ||
                          result?.original_title ||
                          result?.original_name ||
                          result?.original_title}
                      </h4>
                      <p className={classes.caption}>({label})</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

