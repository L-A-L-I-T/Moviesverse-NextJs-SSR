import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  footer: {
    minHeight: "140px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#181818",
  },
});

export default function Footer() {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <h5 className="mb-3">
        Made by <span className="text-warning">Lalit Rajput</span>
      </h5>
      <div>
        <a
          href="https://github.com/L-A-L-I-T"
          target="_blank"
          rel="noreferrer"
          className="me-4"
          style={{ fontSize: "2rem", color: "white" }}
        >
          <i className="bi bi-github" aria-label="GitHub" />
        </a>
        <a
          href="https://www.linkedin.com/in/lalit-rajput-9a1a37215/"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: "2rem", color: "white" }}
        >
          <i className="bi bi-linkedin" aria-label="LinkedIn" />
        </a>
      </div>
    </footer>
  );
}

