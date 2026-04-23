import type { GetServerSideProps } from "next";
import { createUseStyles } from "react-jss";
import Navbar from "@/components/Navbar";
import Images from "@/components/Images";
import Credits from "@/components/Credits";
import { tmdbFetch, tmdbImageUrl } from "@/lib/tmdb";

const useStyles = createUseStyles({
  root: { minHeight: "100vh" },
  profilePhoto: {
    height: "500px",
    borderRadius: "10px",
    objectFit: "cover",
  },
  cont: { flexDirection: "row" },
  "@media (max-width: 1000px)": {
    cont: { flexDirection: "column-reverse" },
  },
});

type Props = {
  personId: string;
  person: any | null;
  images: any[];
  movieCredits: any[];
  tvCredits: any[];
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const personId = String(ctx.params?.person_id || "");
  if (!personId) return { notFound: true };
  const [person, imagesRes, movieRes, tvRes] = await Promise.all([
    tmdbFetch<any>(`/person/${personId}`).catch(() => null),
    tmdbFetch<any>(`/person/${personId}/images`).catch(() => ({})),
    tmdbFetch<any>(`/person/${personId}/movie_credits`, { language: "en-US" }).catch(() => ({})),
    tmdbFetch<any>(`/person/${personId}/tv_credits`, { language: "en-US" }).catch(() => ({})),
  ]);
  if (!person) return { notFound: true };
  const images = imagesRes.profiles || [];
  const movieCredits = movieRes.cast || [];
  const tvCredits = tvRes.cast || [];
  return { props: { personId, person, images, movieCredits, tvCredits } };
};

export default function PersonPage({ person, images, movieCredits, tvCredits }: Props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Navbar />
      <div className="container">
        <div className={`row mt-3 ${classes.cont}`}>
          <div className="col-lg-7 px-4">
            <h3>{person?.name}</h3>
            <p>{person?.biography}</p>
            <p>Date of Birth : {person?.birthday}</p>
            <p>Place of Birth : {person?.place_of_birth}</p>
          </div>
          <div className="col-lg-5 mb-5 d-flex justify-content-center align-items-start">
            {person?.profile_path ? (
              <img
                className={classes.profilePhoto}
                src={tmdbImageUrl(person.profile_path)}
                alt={person?.name}
              />
            ) : null}
          </div>
        </div>
      </div>
      <Images title="Images" images={images} />
      <Credits movieCredits={movieCredits} tvCredits={tvCredits} />
    </div>
  );
}

