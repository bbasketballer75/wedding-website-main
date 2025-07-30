import React from 'react';
import './WeddingHighlightsSection.css';

// Example highlights data (replace with your real images and captions)
const highlights = [
  {
    image: '/images/engagement/PoradaProposal-11.webp',
    alt: 'First Dance',
    caption: 'Our magical first dance as husband and wife.',
  },
  {
    image: '/images/engagement/PoradaProposal-28.webp',
    alt: 'Cake Cutting',
    caption: 'Cutting the cake and sharing a sweet moment.',
  },
  {
    image: '/images/engagement/PoradaProposal-36.webp',
    alt: 'Sunset Kiss',
    caption: 'A sunset kiss to remember.',
  },
];

const WeddingHighlightsSection = () => (
  <section
    id="highlights"
    className="highlights-section"
    aria-labelledby="highlights-title"
    role="region"
  >
    <div className="highlights-content">
      <h2 id="highlights-title" className="highlights-title">
        Wedding Highlights
      </h2>
      <div
        className="highlights-gallery"
        role="group"
        aria-label="Wedding highlight photos gallery"
      >
        {highlights.map((item, idx) => (
          <figure
            className="highlight-card"
            key={idx}
            role="img"
            aria-labelledby={`highlight-${idx}-caption`}
          >
            <img
              src={item.image}
              alt={item.alt}
              className="highlight-image"
              loading="lazy"
              aria-describedby={`highlight-${idx}-caption`}
            />
            <figcaption id={`highlight-${idx}-caption`} className="highlight-caption">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default WeddingHighlightsSection;
