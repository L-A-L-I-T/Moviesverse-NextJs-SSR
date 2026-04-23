import Link from "next/link";
import { createUseStyles } from "react-jss";
import { tmdbImageUrl } from "@/lib/tmdb";

const useStyles = createUseStyles({
  title: { margin: 0, paddingLeft: "20px", color: "white" },
  rowPosters: {
    display: "flex",
    flexDirection: "row",
    padding: "20px",
    overflowY: "hidden",
    overflowX: "scroll",
    "&::-webkit-scrollbar": { display: "none" },
  },
  poster: {
    borderRadius: "5px",
    marginRight: "15px",
    objectFit: "contain",
    height: "250px",
    transition: "transform 470ms",
    "&:hover": { transform: "scale(1.1)" },
  },
  loadingPoster: {
    minWidth: "170px",
    height: "250px",
    borderRadius: "5px",
    marginRight: "15px",
  },
});

type Props = {
  title: string;
  mediaType: "movie" | "tv";
  showTotal?: boolean;
  titles: any[];
};

export default function Section({
  title,
  mediaType,
  showTotal,
  titles,
}: Props) {
  const classes = useStyles();

  return (
    <div>
      <h2 className={classes.title}>
        {title}
        {showTotal && ` (${titles?.length || 0})`}
      </h2>
      <div className={classes.rowPosters}>
        {titles.length ? (
          titles.map((t) => (
            <Link key={t.id} href={`/${mediaType}/details/${t.id}`}>
              <img
                className={classes.poster}
                alt={t.name || t.title}
                src={tmdbImageUrl(t.poster_path)}
              />
            </Link>
          ))
        ) : (
          [...Array(15)].map((_, idx) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className={`${classes.loadingPoster} placeholder-wave bg-dark`}
            />
          ))
        )}
      </div>
    </div>
  );
}

