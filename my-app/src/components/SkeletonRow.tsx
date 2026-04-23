export default function SkeletonRow({ count = 12 }: { count?: number }) {
  return (
    <div className="d-flex flex-row p-3" style={{ overflowX: "auto", gap: 12 }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          className="placeholder-wave bg-dark"
          style={{
            minWidth: 170,
            height: 250,
            borderRadius: 6,
          }}
        />
      ))}
    </div>
  );
}

