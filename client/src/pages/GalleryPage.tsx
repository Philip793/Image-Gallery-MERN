import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getGallery } from "../api";
import Loading from "../components/Loading";
import type { Gallery, LoadStatus } from "../types";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export default function GalleryPage() {
  const { slug } = useParams<{ slug: string }>();

  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("Gallery slug is missing.");
      setStatus("error");
      return;
    }

    const controller = new AbortController();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    async function loadGallery() {
      try {
        setStatus("loading");
        setError("");
        setGallery(null);

        const result = await getGallery(slug!, controller.signal);

        setGallery(result);
        setStatus("success");
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        setError(getErrorMessage(requestError));
        setStatus("error");
      }
    }

    void loadGallery();

    return () => {
      controller.abort();
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <section className="gallery-page gallery-page--centered">
        <Loading />
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="gallery-page gallery-page--centered">
        <div className="error-panel" role="alert">
          <h1>Gallery unavailable</h1>
          <p>{error}</p>
          <Link className="button-link" to="/">
            Return home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="gallery-page">
      <header className="gallery-header">
        <Link className="back-link" to="/">
          <span aria-hidden="true">←</span>
          Back to collections
        </Link>

        <p className="gallery-header__eyebrow">Photography collection</p>
        <h1>{gallery.title}</h1>
        <p>{gallery.description}</p>
      </header>

      <div className="gallery-grid">
        {gallery.images.map((image, index: number) => (
          <figure
            className="gallery-image"
            key={`${gallery.slug}-${index}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading={index === 0 ? "eager" : "lazy"}
            />

            {image.caption && (
              <figcaption>{image.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </article>
  );
}
