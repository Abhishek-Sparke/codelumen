import React from 'react';

// =============================================================================
// CODESPARK BRAND COMPONENTS
// =============================================================================
// Full logo: "code ⚡" — golden yellow text + electric blue lightning
// Compact mark: "⚡" — electric blue lightning only
// Favicon: SVG lightning bolt for browser tab
// =============================================================================

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
  onClick?: () => void;
}

const sizeMap = {
  xs: { text: 'text-sm', bolt: 'text-base' },
  sm: { text: 'text-lg', bolt: 'text-xl' },
  md: { text: 'text-2xl', bolt: 'text-3xl' },
  lg: { text: 'text-4xl', bolt: 'text-5xl' },
  xl: { text: 'text-6xl', bolt: 'text-7xl' },
};

/**
 * Full CodeSpark logo: "code ⚡"
 * - "code" in lowercase golden yellow
 * - "⚡" in electric blue/cyan with optional pulse glow
 */
export const CodeSparkLogo: React.FC<LogoProps> = ({
  size = 'sm',
  className = '',
  animate = true,
  onClick,
}) => {
  const s = sizeMap[size];

  return (
    <span
      className={`inline-flex items-baseline gap-0.5 select-none ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      <span
        className={`font-display font-extrabold lowercase tracking-tight text-amber-400 ${s.text}`}
        style={{ lineHeight: 1 }}
      >
        code
      </span>
      <span
        className={`${s.bolt} ${animate ? 'spark-bolt-glow' : ''}`}
        style={{
          color: '#22d3ee',
          lineHeight: 1,
          filter: animate ? undefined : 'none',
          textShadow: '0 0 12px rgba(34, 211, 238, 0.4), 0 0 24px rgba(34, 211, 238, 0.15)',
        }}
        aria-hidden="true"
      >
        ⚡
      </span>
    </span>
  );
};

/**
 * Compact CodeSpark mark: just the ⚡ lightning bolt
 */
export const CodeSparkMark: React.FC<LogoProps> = ({
  size = 'sm',
  className = '',
  animate = true,
  onClick,
}) => {
  const s = sizeMap[size];

  return (
    <span
      className={`inline-flex items-center justify-center select-none ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      <span
        className={`${s.bolt} ${animate ? 'spark-bolt-glow' : ''}`}
        style={{
          color: '#22d3ee',
          lineHeight: 1,
          textShadow: '0 0 12px rgba(34, 211, 238, 0.4), 0 0 24px rgba(34, 211, 238, 0.15)',
        }}
        aria-hidden="true"
      >
        ⚡
      </span>
    </span>
  );
};

/**
 * SVG Favicon for CodeSpark — lightning bolt on dark background
 * Returns a data URI string for use in <link rel="icon">
 */
export const CODESPARK_FAVICON_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='bolt' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2322d3ee'/%3E%3Cstop offset='100%25' stop-color='%230ea5e9'/%3E%3C/linearGradient%3E%3Cfilter id='glow'%3E%3CfeGaussianBlur stdDeviation='1' result='blur'/%3E%3CfeMerge%3E%3CfeMergeNode in='blur'/%3E%3CfeMergeNode in='SourceGraphic'/%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%3Crect width='32' height='32' rx='8' fill='%230a0a0d'/%3E%3Cpath d='M18 4L8 18h6l-2 10 10-14h-6l2-10z' fill='url(%23bolt)' filter='url(%23glow)'/%3E%3C/svg%3E`;

/**
 * CodeSpark Favicon component (renders nothing, just provides the SVG data)
 * Use CODESPARK_FAVICON_SVG constant directly in index.html
 */
export const CodeSparkFavicon: React.FC = () => null;
