'use client';
import React from 'react';
import Image from 'next/image';

const WeddingHighlightsSection: React.FC = () => {
  const highlights = [
    {
      id: 'first-dance',
      title: 'First Dance',
      description: 'Our magical first dance as husband and wife.',
      image: '/images/first-time-acoustic-cover.webp',
      alt: 'Austin and Jordyn sharing their first dance',
    },
    {
      id: 'cake-cutting',
      title: 'Cake Cutting',
      description: 'Cutting the cake and sharing a sweet moment.',
      image: '/images/rings/PoradaProposal-255.webp',
      alt: 'Austin and Jordyn cutting their wedding cake together',
    },
    {
      id: 'sunset-kiss',
      title: 'Sunset Kiss',
      description: 'A sunset kiss to remember.',
      image: '/images/landing-bg.webp',
      alt: 'Austin and Jordyn kissing during golden hour',
    },
  ];

  return (
    <section
      id="highlights"
      className="highlights-section"
      aria-label="Wedding highlights and memorable moments"
    >
      <div className="container">
        <header className="highlights-header">
          <h2 className="section-title">
            <span className="script-text">Wedding Highlights</span>
          </h2>
        </header>

        <section className="highlights-gallery" aria-label="Wedding highlight photos gallery">
          {highlights.map((highlight) => (
            <figure
              key={highlight.id}
              className="highlight-card"
              aria-label={highlight.description}
            >
              <div className="highlight-image-wrapper">
                <Image
                  src={highlight.image}
                  alt={highlight.alt}
                  className="highlight-image"
                  width={400}
                  height={300}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={highlight.id === 'first-dance'}
                />
                <div className="highlight-overlay">
                  <h3 className="highlight-title">{highlight.title}</h3>
                </div>
              </div>
              <figcaption className="highlight-caption">{highlight.description}</figcaption>
            </figure>
          ))}
        </section>
      </div>
    </section>
  );
};

export default WeddingHighlightsSection;
