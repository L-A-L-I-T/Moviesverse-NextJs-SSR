import { useMemo, useState } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  rowVideos: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flexStart",
    margin: "20px",
    overflowY: "hidden",
    overflowX: "scroll",
    "&::-webkit-scrollbar": { display: "none" },
  },
  rowVideo: { marginRight: "20px" },
  thumbBtn: {
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  thumb: {
    height: "250px",
    width: "470px",
    objectFit: "cover",
    borderRadius: "8px",
    backgroundColor: "#202020",
  },
  play: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  playIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "999px",
    background: "rgba(0,0,0,0.55)",
    border: "2px solid rgba(255,255,255,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "22px",
    lineHeight: 1,
  },
});

export default function Videos({
  videos,
}: {
  videos: any[];
}) {
  const classes = useStyles();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const opts = useMemo(
    () => ({
      height: "250",
      width: "470",
      // keep autoplay off; we control user intent via click
      playerVars: { autoplay: 0, rel: 0 },
    }),
    []
  );

  return (
    <div>
      <h3 className="ms-4 mt-3">Videos ({videos?.length || 0})</h3>
      <div className={classes.rowVideos}>
        {videos.map((video) => (
          <div className={classes.rowVideo} key={video.id} style={{ position: "relative" }}>
            {activeKey === video.key ? (
              <iframe
                width={opts.width}
                height={opts.height}
                src={`https://www.youtube-nocookie.com/embed/${video.key}?rel=0`}
                title={video.name || "YouTube video player"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ border: "none", borderRadius: "8px" }}
              />
            ) : (
              <button
                type="button"
                className={classes.thumbBtn}
                onClick={() => setActiveKey(video.key)}
                aria-label={`Play ${video.name || "video"}`}
              >
                <img
                  className={classes.thumb}
                  src={`https://i.ytimg.com/vi/${video.key}/hqdefault.jpg`}
                  alt={video.name || "video thumbnail"}
                  loading="lazy"
                />
                <div className={classes.play}>
                  <div className={classes.playIcon}>▶</div>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

