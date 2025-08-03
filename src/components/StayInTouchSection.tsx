'use client';
import React from 'react';
import './StayInTouchSection.css';

const StayInTouchSection: React.FC = () => {
  return (
    <section
      id="stay-in-touch"
      className="stay-in-touch-section"
      aria-label="Stay connected with Austin and Jordyn"
    >
      <div className="container">
        <header className="stay-in-touch-header">
          <h2 className="section-title">
            <span className="script-text">Stay in Touch</span>
          </h2>
          <p className="section-description">
            Follow our journey as newlyweds and stay connected with us!
          </p>
        </header>

        <div className="contact-grid">
          <div className="contact-card">
            <h3 className="contact-title">Follow Our Adventures</h3>
            <p className="contact-description">
              Keep up with our married life, travels, and new adventures on social media.
            </p>
            <div className="social-links">
              <a
                href="#instagram"
                className="social-link"
                aria-label="Follow Austin and Jordyn on Instagram"
              >
                📸 Instagram
              </a>
              <a
                href="#facebook"
                className="social-link"
                aria-label="Connect with Austin and Jordyn on Facebook"
              >
                📘 Facebook
              </a>
            </div>
          </div>

          <div className="contact-card">
            <h3 className="contact-title">Send Us Love</h3>
            <p className="contact-description">
              We&rsquo;d love to hear from you! Send us a note or share your favorite memory from
              our wedding.
            </p>
            <a
              href="mailto:hello@theporadas.com"
              className="contact-button"
              aria-label="Send email to Austin and Jordyn"
            >
              💌 Email Us
            </a>
          </div>

          <div className="contact-card">
            <h3 className="contact-title">Share Your Photos</h3>
            <p className="contact-description">
              Did you capture some special moments? We&rsquo;d love to see them! Share your photos
              with us.
            </p>
            <a
              href="#guestbook"
              className="contact-button"
              aria-label="Visit the guestbook to share photos"
            >
              📷 Share Photos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StayInTouchSection;
