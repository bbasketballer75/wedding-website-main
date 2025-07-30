import React, { useCallback, memo } from 'react';
import NavLink from './NavLink';
import Link from 'next/link';
import './Navbar.css';

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
        <nav
          className="collapse navbar-collapse"
          id="navbarNav"
          aria-label="Main navigation"
          role="navigation"
        >
          <ul className="navbar-nav ms-auto" role="menubar">
            <li className="nav-item" role="none">
              <NavLink
                onePage={onePage}
                href="#home"
                label="Home"
                onClick={(e) => handleNavClick(e, 'home')}
                aria-current="page"
                role="menuitem"
              />
            </li>
            <li className="nav-item" role="none">
              <NavLink
                onePage={onePage}
                href="#album"
                label="Album"
                onClick={(e) => handleNavClick(e, 'album')}
                role="menuitem"
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
                href="#map"
                label="Map"
                onClick={(e) => handleNavClick(e, 'map')}
              />
            </li>
            <li className="nav-item" role="none">
              <NavLink
                onePage={onePage}
                href="#family"
                label="Family Tree"
                onClick={(e) => handleNavClick(e, 'family')}
                role="menuitem"
              />
            </li>
            <li className="nav-item" role="none">
              <NavLink
                onePage={onePage}
                href="#party"
                label="Wedding Party"
                onClick={(e) => handleNavClick(e, 'party')}
                role="menuitem"
              />
            </li>
          </ul>
        </nav>
      </div>
    </nav>
  );

  Navbar.displayName = 'Navbar';
});

export default Navbar;
