import { Link, NavLink, Route, Routes } from "react-router-dom";
import GalleryPage from "./pages/GalleryPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function getNavigationClass({ isActive }) {
  return isActive
    ? "site-navigation__link site-navigation__link--active"
    : "site-navigation__link";
}

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="site-logo" to="/" aria-label="Orbit Gallery home">
          <span className="site-logo__mark" aria-hidden="true">
            O
          </span>
          <span>Orbit Gallery</span>
        </Link>

        <nav className="site-navigation" aria-label="Primary navigation">
          <NavLink className={getNavigationClass} to="/" end>
            Home
          </NavLink>
        </nav>
      </header>

      <main className="site-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gallery/:slug" element={<GalleryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <p>Explore the world one collection at a time.</p>
      </footer>
    </div>
  );
}
