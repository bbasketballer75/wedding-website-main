import React, { memo } from 'react';
import { Link } from 'react-router-dom';

type NavLinkProps = {
  onePage?: boolean;
  href: string;
  to: string;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const NavLink: React.FC<NavLinkProps> = memo(({ onePage, href, to, label, onClick }) => {
  if (onePage) {
    return (
      <a className="nav-link" href={href} onClick={onClick}>
        {label}
      </a>
    );
  }
  return (
    <Link className="nav-link" to={to}>
      {label}
    </Link>
  );
});

NavLink.displayName = 'NavLink';

export default NavLink;
