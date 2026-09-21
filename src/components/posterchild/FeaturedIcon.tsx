import React from 'react';
import { PosterChildIcon, PosterChildIconName } from './Icon';

export type FeaturedIconVariant =
  | 'brand'
  | 'success'
  | 'info'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'warning'
  | 'error'
  | 'admin'
  | 'gray';

export interface FeaturedIconProps extends React.HTMLAttributes<HTMLDivElement> {
  name: PosterChildIconName;
  variant?: FeaturedIconVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'rounded' | 'circle';
  containerSize?: number;
  iconSize?: number;
  radius?: number;
}

const VARIANT_CONFIG: Record<string, { bg: string; border: string; iconColor: string }> = {
  brand: { bg: '#FFF9E8', border: '#FFF2C7', iconColor: '#8F6500' },
  success: { bg: '#F0FDF4', border: '#BBF7D0', iconColor: '#16A34A' },
  info: { bg: '#EFF6FF', border: '#BFDBFE', iconColor: '#2563EB' },
  blue: { bg: '#EFF6FF', border: '#BFDBFE', iconColor: '#2563EB' },
  purple: { bg: '#FAF5FF', border: '#E9D5FF', iconColor: '#9333EA' },
  pink: { bg: '#FDF2F8', border: '#FBCFE8', iconColor: '#DB2777' },
  warning: { bg: '#FFF7ED', border: '#FED7AA', iconColor: '#EA580C' },
  error: { bg: '#FEF2F2', border: '#FECACA', iconColor: '#DC2626' },
  admin: { bg: '#FEF2F2', border: '#FECACA', iconColor: '#DC2626' },
  gray: { bg: '#F9FAFB', border: '#E5E7EB', iconColor: '#4B5563' },
};

const SIZE_CONFIG: Record<string, { containerSize: number; iconSize: number; radius: number }> = {
  sm: { containerSize: 32, iconSize: 16, radius: 8 },
  md: { containerSize: 40, iconSize: 20, radius: 10 },
  lg: { containerSize: 48, iconSize: 24, radius: 12 },
  xl: { containerSize: 56, iconSize: 28, radius: 12 },
};

export const FeaturedIcon: React.FC<FeaturedIconProps> = ({
  name,
  variant = 'brand',
  size = 'md',
  shape = 'rounded',
  containerSize: customContainerSize,
  iconSize: customIconSize,
  radius: customRadius,
  className = '',
  style,
  ...props
}) => {
  const currentVariant = VARIANT_CONFIG[variant] || VARIANT_CONFIG.brand;
  const currentSize = SIZE_CONFIG[size] || SIZE_CONFIG.md;

  const finalContainerSize = customContainerSize ?? currentSize.containerSize;
  const finalIconSize = customIconSize ?? currentSize.iconSize;
  const finalRadius = customRadius ?? currentSize.radius;

  const baseStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    width: `${finalContainerSize}px`,
    height: `${finalContainerSize}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: currentVariant.bg,
    border: `1px solid ${currentVariant.border}`,
    borderRadius: shape === 'circle' ? '50%' : `${finalRadius}px`,
    color: currentVariant.iconColor,
  };

  return (
    <div
      className={`pc-featured-icon pc-featured-icon--${variant} pc-featured-icon--${size} ${className}`}
      style={{ ...baseStyle, ...style }}
      {...props}
    >
      <PosterChildIcon
        name={name}
        size={finalIconSize}
        strokeWidth={1.67}
        color={currentVariant.iconColor}
      />
    </div>
  );
};

export default FeaturedIcon;
