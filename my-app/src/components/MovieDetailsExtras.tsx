import Images from "@/components/Images";
import Videos from "@/components/Videos";
import Review from "@/components/Review";
import Cast from "@/components/Cast";
import Section from "@/components/Section";
import SkeletonRow from "@/components/SkeletonRow";
import { useMovieExtrasQuery } from "@/store/tmdbApi";

export default function MovieDetailsExtras({ movieId }: { movieId: string }) {
  const { data, isLoading, isError } = useMovieExtrasQuery({ movieId });

  if (isLoading) {
    return (
      <div>
        <h3 className="ms-4">Images</h3>
        <SkeletonRow />
        <h3 className="ms-4 mt-3">Videos</h3>
        <SkeletonRow count={3} />
        <h3 className="ms-4 mt-3">Cast</h3>
        <SkeletonRow />
      </div>
    );
  }

  if (isError || !data) return <div className="ms-4 mt-4">Failed to load sections.</div>;

  return (
    <>
      <Images title="Images" images={data.images} />
      <Videos videos={data.videos} />
      <Review reviews={data.reviews} />
      <Cast credits={data.cast} />
      <Section title="Similar Movies" mediaType="movie" titles={data.similar} showTotal />
      <Section title="Recommended Movies" mediaType="movie" titles={data.recommended} showTotal />
    </>
  );
}

