import { useEffect, useState } from "react";
import { getLandingImages } from "../api";
import CylinderGallery from "../components/CylinderGallery";
import Loading from "../components/Loading";
import type { LandingImage, LoadStatus } from "../types";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export default function LandingPage() {
  const [images, setImages] = useState<LandingImage[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
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
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        setError(getErrorMessage(requestError));
        setStatus("error");
      }
    }

    void loadImages();

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
