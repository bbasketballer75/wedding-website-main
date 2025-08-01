'use client';
import React from 'react';

const ThankYouSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="hero-section"
      aria-label="Thank you message from Austin and Jordyn"
    >
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="script-text">Thank You</span>
          </h1>

          <div className="hero-message">
            <p className="lead-text">
              From the bottom of our hearts, thank you for being a part of our wedding celebration!
            </p>

            <p className="body-text">
              Your love, support, and presence made our day truly unforgettable. We are so grateful
              for every hug, every dance, every laugh, and every memory shared.
            </p>

            <p className="body-text">
              We hope you enjoy reliving the moments and sharing your own memories here.
            </p>

            <div className="signature">
              <span className="script-signature">With all our love,</span>
              <span className="names">Austin & Jordyn</span>
            </div>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="floral-accent" aria-hidden="true">
            ✨🌿✨
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThankYouSection;
