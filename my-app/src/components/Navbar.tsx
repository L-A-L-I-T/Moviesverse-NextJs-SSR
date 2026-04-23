import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function Navbar({ mediaType }: { mediaType?: "movie" | "tv" }) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    router.push({ pathname: "/search_results", query: { query: q } });
  };

  return (
    <nav
      className="navbar sticky-top navbar-expand-lg navbar-dark"
      style={{ background: "#181818" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" href="/movies">
          Moviesverse
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className="nav-link active"
                href="/movies"
                style={mediaType === "movie" ? { color: "#ffc107" } : {}}
              >
                Movies
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link active"
                href="/tv"
                style={mediaType === "tv" ? { color: "#ffc107" } : {}}
              >
                TV Shows
              </Link>
            </li>
          </ul>
          <form className="d-flex col-lg-4" onSubmit={onSubmit}>
            <input
              className="form-control me-3 my-2"
              type="search"
              placeholder="Search movies,tv shows,actor..."
              aria-label="Search"
              style={{ borderRadius: "5px" }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              className="btn btn-outline-warning my-2 me-4"
              type="submit"
              style={{ borderRadius: "5px" }}
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

