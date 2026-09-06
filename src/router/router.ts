import { useState, useEffect } from 'react';

export type RouteSection =
  | 'landing'
  | 'dashboard'
  | 'problems'
  | 'workspace'
  | 'saved-problems'
  | 'roadmaps'
  | 'patterns'
  | 'contests'
  | 'discuss'
  | 'profile'
  | 'leaderboard'
  | 'submissions'
  | 'settings'
  | 'admin'
  | 'signin'
  | 'signup'
  | 'not-found';

export interface RouteInfo {
  pathname: string;
  section: RouteSection;
  slug?: string;
  subType?: 'rules' | 'category' | 'thread';
  categorySlug?: string;
  adminSection?: 'dashboard' | 'users' | 'problems' | 'roadmaps' | 'study-plans' | 'discussions' | 'rules' | 'moderation' | 'reports' | 'contests' | 'achievements' | 'spark' | 'settings' | 'audit-logs' | 'analytics';
  adminEntityId?: string;
  queryParams: Record<string, string>;
  isNotFound?: boolean;
}

const ROUTE_CHANGE_EVENT = 'codespark:route_change';

/**
 * Parses any browser pathname into a structured RouteInfo object.
 */
export function parseRoute(rawPathname: string): RouteInfo {
  const [cleanPath, search] = rawPathname.split('?');
  const pathname = cleanPath === '' || cleanPath === '/' ? '/' : cleanPath.replace(/\/+$/, '');

  const queryParams: Record<string, string> = {};
  if (search) {
    const searchParams = new URLSearchParams(search);
    searchParams.forEach((val, key) => {
      queryParams[key] = val;
    });
  }

  // Root / Landing
  if (pathname === '/') {
    return { pathname, section: 'landing', queryParams };
  }

  // Dashboard
  if (pathname === '/dashboard') {
    return { pathname, section: 'dashboard', queryParams };
  }

  // Auth pages
  if (pathname === '/signin' || pathname === '/login') {
    return { pathname, section: 'signin', queryParams };
  }
  if (pathname === '/signup' || pathname === '/register') {
    return { pathname, section: 'signup', queryParams };
  }

  // Problems routing: /problems, /problems/saved, /problems/:slug, /saved
  if (pathname === '/saved' || pathname === '/problems/saved') {
    return { pathname, section: 'saved-problems', queryParams };
  }
  if (pathname === '/problems') {
    return { pathname, section: 'problems', queryParams };
  }
  if (pathname.startsWith('/problems/')) {
    const slug = decodeURIComponent(pathname.substring('/problems/'.length));
    if (slug === 'saved') {
      return { pathname, section: 'saved-problems', queryParams };
    }
    return { pathname, section: 'workspace', slug, queryParams };
  }

  // Roadmaps: /roadmap, /roadmaps, /roadmap/:slug
  if (pathname === '/roadmap' || pathname === '/roadmaps') {
    return { pathname, section: 'roadmaps', queryParams };
  }
  if (pathname.startsWith('/roadmap/') || pathname.startsWith('/roadmaps/')) {
    const prefix = pathname.startsWith('/roadmaps/') ? '/roadmaps/' : '/roadmap/';
    const slug = decodeURIComponent(pathname.substring(prefix.length));
    return { pathname, section: 'roadmaps', slug, queryParams };
  }

  // Patterns & Study Plans: /patterns, /study-plans, /patterns/:slug, /study-plans/:slug
  if (pathname === '/patterns' || pathname === '/study-plans') {
    return { pathname, section: 'patterns', queryParams };
  }
  if (pathname.startsWith('/patterns/') || pathname.startsWith('/study-plans/')) {
    const prefix = pathname.startsWith('/study-plans/') ? '/study-plans/' : '/patterns/';
    const slug = decodeURIComponent(pathname.substring(prefix.length));
    return { pathname, section: 'patterns', slug, queryParams };
  }

  // Contests: /contests, /contests/:slug
  if (pathname === '/contests') {
    return { pathname, section: 'contests', queryParams };
  }
  if (pathname.startsWith('/contests/')) {
    const slug = decodeURIComponent(pathname.substring('/contests/'.length));
    return { pathname, section: 'contests', slug, queryParams };
  }

  // Discussions routing:
  // /discussions
  // /discussions/rules
  // /discussions/category/:categorySlug
  // /discussions/:slug
  if (pathname === '/discussions') {
    return { pathname, section: 'discuss', queryParams };
  }
  if (pathname === '/discussions/rules' || pathname === '/discussions/discussion-rules') {
    return { pathname, section: 'discuss', subType: 'rules', slug: 'rules', queryParams };
  }
  if (pathname.startsWith('/discussions/category/')) {
    const categorySlug = decodeURIComponent(pathname.substring('/discussions/category/'.length));
    return { pathname, section: 'discuss', subType: 'category', categorySlug, queryParams };
  }
  if (pathname.startsWith('/discussions/')) {
    const slug = decodeURIComponent(pathname.substring('/discussions/'.length));
    return { pathname, section: 'discuss', subType: 'thread', slug, queryParams };
  }

  // User Profile: /profile, /profile/:username
  if (pathname === '/profile') {
    return { pathname, section: 'profile', queryParams };
  }
  if (pathname.startsWith('/profile/')) {
    const slug = decodeURIComponent(pathname.substring('/profile/'.length));
    return { pathname, section: 'profile', slug, queryParams };
  }

  // Other single views
  if (pathname === '/leaderboard') {
    return { pathname, section: 'leaderboard', queryParams };
  }
  if (pathname === '/submissions') {
    return { pathname, section: 'submissions', queryParams };
  }
  if (pathname === '/settings') {
    return { pathname, section: 'settings', queryParams };
  }
  // Admin routing: /admin, /admin/:subSection, /admin/:subSection/:id
  if (pathname === '/admin') {
    return { pathname, section: 'admin', adminSection: 'dashboard', queryParams };
  }
  if (pathname.startsWith('/admin/')) {
    const adminPath = pathname.substring('/admin/'.length);
    const [subSection, entityId] = adminPath.split('/');

    let adminSec: any = 'dashboard';
    if (subSection === 'users') adminSec = 'users';
    else if (subSection === 'problems') adminSec = 'problems';
    else if (subSection === 'roadmaps') adminSec = 'roadmaps';
    else if (subSection === 'study-plans') adminSec = 'study-plans';
    else if (subSection === 'discussions') {
      adminSec = entityId === 'rules' ? 'rules' : 'discussions';
    }
    else if (subSection === 'rules') adminSec = 'rules';
    else if (subSection === 'moderation') adminSec = 'moderation';
    else if (subSection === 'reports') adminSec = 'reports';
    else if (subSection === 'contests') adminSec = 'contests';
    else if (subSection === 'achievements') adminSec = 'achievements';
    else if (subSection === 'spark') adminSec = 'spark';
    else if (subSection === 'settings') adminSec = 'settings';
    else if (subSection === 'audit-logs' || subSection === 'audit') adminSec = 'audit-logs';
    else if (subSection === 'analytics') adminSec = 'analytics';

    return {
      pathname,
      section: 'admin',
      adminSection: adminSec,
      adminEntityId: entityId,
      queryParams
    };
  }

  // Unrecognized path -> Not Found
  return { pathname, section: 'not-found', isNotFound: true, queryParams };
}

/**
 * Translates legacy (view, param) call to canonical URL path.
 */
export function getCanonicalPath(viewOrPath: string, param?: string): string {
  if (viewOrPath.startsWith('/')) {
    return viewOrPath;
  }

  switch (viewOrPath) {
    case 'workspace':
      return param ? `/problems/${param}` : '/problems';
    case 'problems':
      return param === 'saved' ? '/problems/saved' : '/problems';
    case 'saved':
    case 'saved-problems':
      return '/problems/saved';
    case 'roadmaps':
    case 'roadmap':
      return param ? `/roadmap/${param}` : '/roadmap';
    case 'patterns':
      return param ? `/patterns/${param}` : '/patterns';
    case 'study-plans':
      return param ? `/study-plans/${param}` : '/study-plans';
    case 'contests':
      return param ? `/contests/${param}` : '/contests';
    case 'discuss':
      if (!param) return '/discussions';
      if (param === 'rules' || param === 'discussion-rules') return '/discussions/rules';
      if (param.startsWith('category:')) return `/discussions/category/${param.replace('category:', '')}`;
      return `/discussions/${param}`;
    case 'profile':
      return param ? `/profile/${param}` : '/profile';
    case 'dashboard':
      return '/dashboard';
    case 'landing':
      return '/';
    case 'leaderboard':
      return '/leaderboard';
    case 'submissions':
      return '/submissions';
    case 'settings':
      return '/settings';
    case 'admin':
      return param ? `/admin/${param}` : '/admin';
    case 'signin':
      return '/signin';
    case 'signup':
      return '/signup';
    default:
      return `/${viewOrPath}`;
  }
}

/**
 * Triggers client-side navigation and dispatches route change notification.
 */
export function navigate(to: string, options?: { replace?: boolean; preserveScroll?: boolean }): void {
  if (typeof window === 'undefined') return;

  const currentPath = window.location.pathname + window.location.search;
  if (currentPath === to) {
    if (!options?.preserveScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  if (options?.replace) {
    window.history.replaceState(null, '', to);
  } else {
    window.history.pushState(null, '', to);
  }

  window.dispatchEvent(new CustomEvent(ROUTE_CHANGE_EVENT, { detail: { path: to } }));

  if (!options?.preserveScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * React hook to subscribe to path changes (both pushState/replaceState and popstate).
 */
export function useCurrentRoute(): RouteInfo {
  const [route, setRoute] = useState<RouteInfo>(() => {
    const current = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
    return parseRoute(current);
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const current = window.location.pathname + window.location.search;
      setRoute(parseRoute(current));
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener(ROUTE_CHANGE_EVENT, handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener(ROUTE_CHANGE_EVENT, handleLocationChange);
    };
  }, []);

  return route;
}
