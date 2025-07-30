import React, { memo } from 'react';
import Link from 'next/link';

type NavLinkProps = {
  onePage?: boolean;
  href: string;
  label: string;
  role?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const NavLink: React.FC<NavLinkProps & React.AriaAttributes> = memo(
  ({ onePage, href, label, role, onClick, ...ariaProps }) => {
    if (onePage) {
      return (
        <a
          className="nav-link"
          href={href}
          onClick={onClick}
          tabIndex={0}
          role={role}
          {...ariaProps}
        >
          {label}
        </a>
      );
    }
    return (
      <Link className="nav-link" href={href} tabIndex={0} role={role} {...ariaProps}>
        {label}
      </Link>
    );
  }
);

NavLink.displayName = 'NavLink';

export default NavLink;
