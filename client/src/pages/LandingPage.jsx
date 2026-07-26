import { useEffect, useState } from "react";
import { getLandingImages } from "../api.js";
import CylinderGallery from "../components/CylinderGallery.jsx";
import Loading from "../components/Loading.jsx";

export default function LandingPage() {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadImages() {
      try {
        setStatus("loading");
        setError("");

        const result = await getLandingImages(controller.signal);

        setImages(result);
        setStatus("success");
      } catch (requestError) {
        if (requestError.name === "AbortError") {
          return;
        }

        setError(requestError.message);
        setStatus("error");
      }
    }

    loadImages();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className="landing-page">
      <div className="hero-copy">
        <p className="hero-copy__eyebrow">Curated photography</p>

        <h1>
          Explore collections
          <span> in motion.</span>
        </h1>

        <p className="hero-copy__description">
          Hover over the cylinder to pause it. Select an image to open
          its complete gallery.
        </p>
      </div>

      {status === "loading" && (
        <Loading label="Loading featured collections" />
      )}

      {status === "error" && (
        <div className="error-panel" role="alert">
          <h2>Unable to load the galleries</h2>
          <p>{error}</p>
        </div>
      )}

      {status === "success" && (
        <>
          <CylinderGallery items={images} />

          <p className="interaction-hint">
            Hover or focus to pause · Select an image to explore
          </p>
        </>
      )}
    </section>
  );
}
