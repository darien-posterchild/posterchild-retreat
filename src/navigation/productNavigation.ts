import { PosterChildIconName } from '../components/posterchild/Icon';

export interface NavChildItemConfig {
  id: string;
  label: string;
  subPath: string; // Relative to session base e.g. "tell", "tell/stories"
  icon?: PosterChildIconName;
}

export interface NavItemConfig {
  id: string;
  label: string;
  subPath: string; // Relative to session base e.g. "", "tell", "raise", "manage"
  icon: PosterChildIconName;
  children?: NavChildItemConfig[];
}

export const PRODUCT_NAVIGATION: NavItemConfig[] = [
  {
    id: 'home',
    label: 'Home',
    subPath: '',
    icon: 'home-line',
  },
  {
    id: 'tell',
    label: 'Tell',
    subPath: 'tell',
    icon: 'announcement-02',
    children: [
      { id: 'tell-overview', label: 'Overview', subPath: 'tell', icon: 'bar-chart-square-02' },
      { id: 'tell-stories', label: 'Stories', subPath: 'tell/stories', icon: 'book-open-01' },
      { id: 'tell-connect', label: 'Connect', subPath: 'tell/connect', icon: 'users-02' },
      { id: 'tell-calendar', label: 'Calendar', subPath: 'tell/calendar', icon: 'calendar' },
    ],
  },
  {
    id: 'raise',
    label: 'Raise',
    subPath: 'raise',
    icon: 'coins-hand',
    children: [
      { id: 'raise-overview', label: 'Overview', subPath: 'raise', icon: 'bar-chart-square-02' },
    ],
  },
  {
    id: 'manage',
    label: 'Manage',
    subPath: 'manage',
    icon: 'folder',
    children: [
      { id: 'manage-overview', label: 'Overview', subPath: 'manage', icon: 'bar-chart-square-02' },
      { id: 'manage-assets', label: 'Assets', subPath: 'manage/assets', icon: 'file-06' },
    ],
  },
];

/**
 * Normalizes a pathname to remove leading/trailing slashes and session prefix.
 * Example: "/present/PC26/tell/connect" -> "tell/connect"
 */
export function normalizeProductPath(pathname: string): string {
  // Strip out leading /present or /present/:sessionId
  const match = pathname.match(/^\/present(?:\/[^/]+)?(?:\/(.*))?$/);
  if (!match) return '';
  const sub = match[1] || '';
  return sub.replace(/\/+$/, '');
}

/**
 * Returns the human-readable product location name for Postie context.
 */
export function getProductPageContext(pathname: string): string {
  const sub = normalizeProductPath(pathname);

  if (!sub) return 'Home';
  if (sub === 'tell') return 'Tell · Overview';
  if (sub === 'tell/stories') return 'Tell · Stories';
  if (sub === 'tell/connect') return 'Tell · Connect';
  if (sub === 'tell/calendar') return 'Tell · Calendar';
  if (sub === 'raise') return 'Raise';
  if (sub === 'manage') return 'Manage';
  if (sub === 'manage/assets') return 'Manage · Assets';

  // Fallback for custom or nested paths
  const parts = sub.split('/');
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' · ');
}

/**
 * Build a full destination URL preserving the current session context.
 */
export function buildProductUrl(sessionId: string, subPath: string): string {
  const cleanSub = subPath ? `/${subPath.replace(/^\/+/, '')}` : '';
  return `/present/${sessionId || 'PC26'}${cleanSub}`;
}
