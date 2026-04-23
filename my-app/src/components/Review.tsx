import { createUseStyles } from "react-jss";

function truncate(str?: string, n = 500) {
  return str && str.length > n ? str.slice(0, n - 1) + "..." : str || "";
}

const useStyles = createUseStyles({
  slider: {
    minHeight: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewContent: {
    minHeight: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  "@media (max-width: 768px)": {
    slider: { minHeight: "350px" },
    reviewContent: { minHeight: "350px" },
  },
});

export default function Review({
  reviews,
}: {
  reviews: any[];
}) {
  const classes = useStyles();

  const activeID = reviews.length ? reviews[0].id : null;

  return (
    <div className="ms-4 mb-5">
      <h3>Reviews ({reviews?.length || 0})</h3>
      {reviews.length > 0 && (
        <div
          id="carouselExampleControls"
          className={`carousel slide ${classes.slider}`}
          data-bs-ride="carousel"
        >
          <div className="carousel-inner w-75">
            {reviews.map((review) => {
              const css = review.id === activeID ? "carousel-item active" : "carousel-item";
              return (
                <div key={review.id} className={css}>
                  <div className="d-flex justify-content-center align-items-center">
                    <p className={classes.reviewContent}>{truncate(review.content, 500)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      )}
    </div>
  );
}

