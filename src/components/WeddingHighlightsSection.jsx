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
  <section id="highlights" className="highlights-section">
    <div className="highlights-content">
      <h2 className="highlights-title">Wedding Highlights</h2>
      <div className="highlights-gallery">
        {highlights.map((item, idx) => (
          <figure className="highlight-card" key={idx}>
            <img src={item.image} alt={item.alt} className="highlight-image" loading="lazy" />
            <figcaption className="highlight-caption">{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default WeddingHighlightsSection;
