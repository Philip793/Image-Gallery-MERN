import { Link } from "react-router-dom";

export default function CylinderGallery({ items }) {
  if (!items.length) {
    return (
      <p className="empty-message">
        No featured galleries are available.
      </p>
    );
  }

  const angleStep = 360 / items.length;

  return (
    <div
      className="cylinder-scene"
      style={{
        "--item-count": items.length
      }}
    >
      <div className="cylinder">
        {items.map((item, index) => {
          const angle = `${index * angleStep}deg`;

          return (
            <div
              className="cylinder-item"
              key={item.id || item.slug}
              style={{
                "--item-angle": angle
              }}
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
                  draggable="false"
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
