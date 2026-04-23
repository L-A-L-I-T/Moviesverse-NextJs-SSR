import { createUseStyles } from "react-jss";
import { tmdbImageUrl } from "@/lib/tmdb";

const useStyles = createUseStyles({
  posterImg: {
    height: "230px",
    marginRight: "20px",
    borderRadius: "5px",
    transition: "transform 470ms",
    "&:hover": { transform: "scale(0.95)" },
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
  "@media (max-width: 768px)": {
    posterImg: { height: "180px" },
  },
});

export default function Images({
  title,
  images,
}: {
  title: string;
  images: any[];
}) {
  const classes = useStyles();
  const count = images?.length || 0;

  return (
    <div>
      <h3 className="ms-4">
        {title} ({count})
      </h3>
      <div className={classes.rowImages}>
        {images.map((image) => (
          <img
            key={image.file_path}
            className={classes.posterImg}
            src={tmdbImageUrl(image.file_path)}
            alt="img"
          />
        ))}
      </div>
    </div>
  );
}

