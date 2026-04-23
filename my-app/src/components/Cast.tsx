import Link from "next/link";
import { createUseStyles } from "react-jss";
import { tmdbImageUrl } from "@/lib/tmdb";

const useStyles = createUseStyles({
  posterImg: { width: "170px", borderRadius: "5px" },
  rowPosters: {
    transition: "450ms",
    "&:hover": { transform: "scale(1.1)" },
  },
  rowImages: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flexStart",
    padding: "20px",
    overflowY: "hidden",
    overflowX: "scroll",
    "&::-webkit-scrollbar": { display: "none" },
  },
  loadingImg: { width: "170px", height: "257px", borderRadius: "5px" },
});

export default function Cast({
  credits,
}: {
  credits: any[];
}) {
  const classes = useStyles();

  return (
    <div>
      <h4 className="ms-4">Cast</h4>
      <div className={classes.rowImages}>
        {credits.length > 0 ? (
          credits.map((credit) => (
            <Link
              key={credit.id}
              href={`/person/${credit.id}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              <div
                className={`d-flex flex-column justify-content-start align-items-center me-4 ${classes.rowPosters}`}
                style={{ textAlign: "center" }}
              >
                {credit.profile_path ? (
                  <img
                    className={classes.posterImg}
                    src={tmdbImageUrl(credit.profile_path)}
                    alt={credit.name}
                  />
                ) : (
                  <div
                    className={`placeholder-glow bg-dark d-flex justify-content-center align-items-center ${classes.loadingImg}`}
                    aria-hidden="true"
                  >
                    {credit.original_name}
                  </div>
                )}
                <h5 className="mt-3">{credit.original_name}</h5>
                <p className="mt-2 text-warning">
                  (
                  {credit.character ||
                  (credit.roles && credit.roles[0]?.character)
                    ? credit.character || (credit.roles && credit.roles[0]?.character)
                    : " - "}
                  )
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div>No Cast</div>
        )}
      </div>
    </div>
  );
}

