import React, { memo } from 'react';
import Link from 'next/link';

type NavLinkProps = {
  onePage?: boolean;
  href: string;
  to: string;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const NavLink: React.FC<NavLinkProps & React.AriaAttributes> = memo(
  ({ onePage, href, to, label, onClick, ...ariaProps }) => {
    if (onePage) {
      return (
        <a className="nav-link" href={href} onClick={onClick} tabIndex={0} {...ariaProps}>
          {label}
        </a>
      );
    }
    return (
      <Link className="nav-link" href={to} tabIndex={0} {...ariaProps}>
        {label}
      </Link>
    );
  }
);

NavLink.displayName = 'NavLink';

export default NavLink;
