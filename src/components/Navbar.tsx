import React, { useCallback, memo } from 'react';
import NavLink from './NavLink';
import Link from 'next/link';
import './Navbar.css';
import './Navbar-premium.css';

type NavbarProps = {
  onePage?: boolean;
};

const Navbar: React.FC<NavbarProps> = memo(({ onePage }) => {
  // Smooth scroll for anchor links
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id?: string) => {
      if (onePage && id) {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [onePage]
  );

  return (
    <nav
      id="navigation"
      className="navbar navbar-expand-lg navbar-light bg-light"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container">
        {onePage ? (
          <a
            className="navbar-brand"
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            tabIndex={0}
            aria-label="Home - Austin & Jordyn Wedding"
          >
            Austin & Jordyn
          </a>
        ) : (
          <Link
            className="navbar-brand"
            href="/"
            tabIndex={0}
            aria-label="Home - Austin & Jordyn Wedding"
          >
            Austin & Jordyn
          </Link>
        )}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation menu"
          aria-describedby="nav-help"
        >
          <span className="navbar-toggler-icon" aria-hidden="true"></span>
          <span className="sr-only">Toggle navigation</span>
        </button>
        <div id="nav-help" className="sr-only">
          Navigation menu with links to different sections of the wedding website
        </div>
        <div className="collapse navbar-collapse" id="navbarNav" aria-labelledby="nav-help">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                onePage={onePage}
                href="#home"
                label="Home"
                onClick={(e) => handleNavClick(e, 'home')}
                aria-current="page"
              />
            </li>
            <li className="nav-item">
              <NavLink
                onePage={onePage}
                href="#memorywall"
                label="Memory Wall"
                onClick={(e) => handleNavClick(e, 'memorywall')}
              />
            </li>
            <li className="nav-item">
              <NavLink
                onePage={onePage}
                href="#album"
                label="Engagement"
                onClick={(e) => handleNavClick(e, 'album')}
              />
            </li>
            <li className="nav-item">
              <NavLink
                onePage={onePage}
                href="#guestbook"
                label="Guestbook"
                onClick={(e) => handleNavClick(e, 'guestbook')}
              />
            </li>
            <li className="nav-item">
              <NavLink
                onePage={onePage}
                href="#family-party"
                label="Our People"
                onClick={(e) => handleNavClick(e, 'family-party')}
              />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
