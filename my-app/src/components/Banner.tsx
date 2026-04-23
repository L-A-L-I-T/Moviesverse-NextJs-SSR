import Link from "next/link";
import { createUseStyles } from "react-jss";
import { tmdbImageUrl } from "@/lib/tmdb";

const useStyles = createUseStyles({
  banner: {
    color: "white",
    height: "600px",
    marginBottom: "20px",
  },
  bannerContent: {
    marginLeft: "30px",
    height: "200px",
    paddingTop: "100px",
  },
  bannerTitle: {
    fontSize: "3rem",
    fontWeight: 800,
    paddingBottom: "0.3rem",
  },
  bannerDescription: {
    lineHeight: 1.3,
    paddingTop: "1rem",
    fontSize: "1.2rem",
    maxWidth: "500px",
    height: "120px",
  },
  bannerFadeBottom: {
    height: "26rem",
    backgroundImage:
      "linear-gradient(180deg , transparent, rgba(37,37,37,0.61),#111)",
  },
  "@media (max-width: 600px)": {
    bannerDescription: {
      maxWidth: "450px",
      paddingRight: "1rem",
    },
  },
  "@media (min-width: 2000px)": {
    banner: { height: "700px" },
    bannerFadeBottom: { height: "700px" },
  },
});

function truncate(str?: string, n = 150) {
  return str && str.length > n ? str.slice(0, n - 1) + "..." : str || "";
}

export default function Banner({
  mediaType,
  item,
}: {
  mediaType: "movie" | "tv";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item?: any;
}) {
  const classes = useStyles();
  const title = item?.title || item?.name || item?.original_name || item?.original_title;

  return (
    <header
      className={classes.banner}
      style={{
        backgroundSize: "cover",
        backgroundImage: `url(${tmdbImageUrl(item?.backdrop_path)})`,
        backgroundPosition: "center top",
      }}
    >
      <div className={classes.bannerContent}>
        <h1 className={`${classes.bannerTitle} text-white`}>{title}</h1>
        <h2 className={classes.bannerDescription}>{truncate(item?.overview, 150)}</h2>
        {item?.id && (
          <Link href={`/${mediaType}/details/${item.id}`}>
            <button
              className="btn btn-warning text-dark rounded-pill px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2"
              type="button"
              aria-label="View details"
            >
              <span>Details</span>
              <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
            </button>
          </Link>
        )}
      </div>
      <div className={classes.bannerFadeBottom} />
    </header>
  );
}

