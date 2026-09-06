import React from 'react';
import { navigate, useCurrentRoute } from './router';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  activeClassName?: string;
  exact?: boolean;
  replace?: boolean;
  preserveScroll?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className = '',
  activeClassName = '',
  exact = false,
  replace = false,
  preserveScroll = false,
  onClick,
  ...rest
}) => {
  const currentRoute = useCurrentRoute();
  
  // Check if link matches current URL
  const isActive = exact
    ? currentRoute.pathname === href
    : href === '/'
      ? currentRoute.pathname === '/'
      : currentRoute.pathname === href || currentRoute.pathname.startsWith(href + '/');

  const combinedClassName = `${className} ${isActive && activeClassName ? activeClassName : ''}`.trim();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    // Allow default browser behavior for modifier keys or external links
    if (
      e.defaultPrevented ||
      e.button !== 0 || // middle click or right click
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey ||
      rest.target === '_blank' ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:')
    ) {
      return;
    }

    e.preventDefault();
    navigate(href, { replace, preserveScroll });
  };

  return (
    <a
      href={href}
      className={combinedClassName}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
};
