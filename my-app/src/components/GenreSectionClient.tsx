import Section from "@/components/Section";
import SkeletonRow from "@/components/SkeletonRow";
import { useDiscoverByGenreQuery } from "@/store/tmdbApi";

export default function GenreSectionClient({
  title,
  mediaType,
  genreId,
}: {
  title: string;
  mediaType: "movie" | "tv";
  genreId: number;
}) {
  const { data, isLoading, isError } = useDiscoverByGenreQuery({ mediaType, genreId });

  if (isLoading) {
    return (
      <div>
        <h2 style={{ margin: 0, paddingLeft: 20, color: "white" }}>{title}</h2>
        <SkeletonRow />
      </div>
    );
  }

  if (isError || !data) return null;

  return <Section title={title} mediaType={mediaType} titles={data} />;
}

