import Link from "next/link";
import { createUseStyles } from "react-jss";
import { tmdbImageUrl } from "@/lib/tmdb";

const useStyles = createUseStyles({
  rowImages: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flexStart",
    padding: "20px",
    overflowY: "hidden",
    overflowX: "scroll",
    "&::-webkit-scrollbar": { display: "none" },
  },
  posterImg: {
    height: "250px",
    marginRight: "20px",
    borderRadius: "5px",
    transition: "transform 470ms",
    "&:hover": { transform: "scale(1.1)" },
  },
});

export default function Credits({
  movieCredits,
  tvCredits,
}: {
  movieCredits: any[];
  tvCredits: any[];
}) {
  const classes = useStyles();

  return (
    <div>
      <h3 className="ms-4">Movies</h3>
      <div className={classes.rowImages}>
        {movieCredits.map((movie) => (
          <Link key={movie.id} href={`/movie/details/${movie.id}`}>
            {movie.poster_path ? (
              <img
                className={classes.posterImg}
                src={tmdbImageUrl(movie.poster_path)}
                alt={movie.original_title}
              />
            ) : null}
          </Link>
        ))}
      </div>
      <h3 className="ms-4">TV Shows</h3>
      <div className={classes.rowImages}>
        {tvCredits.map((tv) => (
          <Link key={tv.id} href={`/tv/details/${tv.id}`}>
            {tv.poster_path ? (
              <img className={classes.posterImg} src={tmdbImageUrl(tv.poster_path)} alt={tv.name} />
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}

