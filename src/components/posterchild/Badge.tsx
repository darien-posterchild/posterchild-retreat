import React from 'react';
import { PosterChildIcon, PosterChildIconName } from './Icon';

export type BadgeVariant =
  | 'immediate'
  | 'upcoming'
  | 'ready'
  | 'brand'
  | 'neutral'
  | 'gray'
  | 'blue'
  | 'success'
  | 'amber'
  | 'warning';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  showDot?: boolean;
  iconLeading?: PosterChildIconName;
  iconTrailing?: PosterChildIconName;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<
  string,
  { bg: string; border: string; text: string; dot: string }
> = {
  immediate: {
    bg: '#FEF2F2',
    border: '#FECACA',
    text: '#B91C1C',
    dot: '#EF4444',
  },
  upcoming: {
    bg: '#FEFCE8',
    border: '#FEF08A',
    text: '#A16207',
    dot: '#EAB308',
  },
  ready: {
    bg: '#F0FDF4',
    border: '#BBF7D0',
    text: '#15803D',
    dot: '#22C55E',
  },
  brand: {
    bg: '#FFF9E8',
    border: '#FDE68A',
    text: '#8F6500',
    dot: '#F4B400',
  },
  amber: {
    bg: '#FFF9E8',
    border: '#FDE68A',
    text: '#8F6500',
    dot: '#F4B400',
  },
  warning: {
    bg: '#FFF7ED',
    border: '#FED7AA',
    text: '#C2410C',
    dot: '#F97316',
  },
  neutral: {
    bg: '#F9FAFB',
    border: '#E5E7EB',
    text: '#374151',
    dot: '#9CA3AF',
  },
  gray: {
    bg: '#F9FAFB',
    border: '#E5E7EB',
    text: '#374151',
    dot: '#9CA3AF',
  },
  blue: {
    bg: '#EFF8FF',
    border: '#B2DDFF',
    text: '#175CD3',
    dot: '#2E90FA',
  },
  success: {
    bg: '#ECFDF3',
    border: '#A6F4C5',
    text: '#027A48',
    dot: '#12B76A',
  },
};

const SIZE_STYLES: Record<BadgeSize, { height: string; padding: string; fontSize: string; lineHeight: string }> = {
  sm: { height: '20px', padding: '1px 6px', fontSize: '11px', lineHeight: '14px' },
  md: { height: '22px', padding: '2px 6px', fontSize: '12px', lineHeight: '18px' },
  lg: { height: '24px', padding: '2px 8px', fontSize: '13px', lineHeight: '18px' },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'brand',
  size = 'md',
  showDot = false,
  iconLeading,
  iconTrailing,
  children,
  className = '',
  style,
  ...props
}) => {
  const current = VARIANT_STYLES[variant] || VARIANT_STYLES.brand;
  const currentSize = SIZE_STYLES[size] || SIZE_STYLES.md;

  const baseStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: currentSize.height,
    padding: currentSize.padding,
    gap: '4px',
    borderRadius: '6px',
    backgroundColor: current.bg,
    border: `1px solid ${current.border}`,
    color: current.text,
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: currentSize.fontSize,
    lineHeight: currentSize.lineHeight,
    whiteSpace: 'nowrap',
  };

  return (
    <span
      className={`pc-badge pc-badge--${variant} ${className}`}
      style={{ ...baseStyle, ...style }}
      {...props}
    >
      {showDot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: current.dot,
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      )}
      {iconLeading && (
        <PosterChildIcon
          name={iconLeading}
          size={12}
          strokeWidth={2.4}
          color={current.text}
          style={{ flexShrink: 0 }}
        />
      )}
      <span>{children}</span>
      {iconTrailing && (
        <PosterChildIcon
          name={iconTrailing}
          size={12}
          strokeWidth={2.4}
          color={current.text}
          style={{ flexShrink: 0 }}
        />
      )}
    </span>
  );
};

export default Badge;
