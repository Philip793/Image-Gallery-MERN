import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="not-found-page">
      <p className="not-found-page__code">404</p>
      <h1>That page drifted out of orbit.</h1>
      <p>The page you requested could not be found.</p>

      <Link className="button-link" to="/">
        Return home
      </Link>
    </section>
  );
}
