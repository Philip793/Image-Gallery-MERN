import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { LandingImage } from "../types";

interface CylinderGalleryProps {
  items: LandingImage[];
}

export default function CylinderGallery({ items }: CylinderGalleryProps) {
  if (!items.length) {
    return (
      <p className="empty-message">
        No featured galleries are available.
      </p>
    );
  }

  const angleStep = 360 / items.length;

  const sceneStyle = {
    "--item-count": items.length
  } as CSSProperties;

  return (
    <div className="cylinder-scene" style={sceneStyle}>
      <div className="cylinder">
        {items.map((item, index) => {
          const itemStyle = {
            "--item-angle": `${index * angleStep}deg`
          } as CSSProperties;

          return (
            <div
              className="cylinder-item"
              key={item.id || item.slug}
              style={itemStyle}
            >
              <Link
                className="cylinder-card"
                to={`/gallery/${item.slug}`}
                aria-label={`Open the ${item.title} gallery`}
              >
                <img
                  className="cylinder-card__image"
                  src={item.src}
                  alt={item.alt}
                  draggable={false}
                />

                <span className="cylinder-card__overlay">
                  <span className="cylinder-card__eyebrow">
                    View collection
                  </span>

                  <span className="cylinder-card__title">
                    {item.title}
                  </span>
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
