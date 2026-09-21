import React from 'react';
import { PosterChildIcon, PosterChildIconName } from './Icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  iconLeading?: PosterChildIconName;
  iconTrailing?: PosterChildIconName;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  iconLeading,
  iconTrailing,
  children,
  className = '',
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: variant === 'primary' ? '4px' : '8px',
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease',
    border: 'none',
    outline: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { height: '36px', padding: '8px 12px', fontSize: '13px', lineHeight: '18px', borderRadius: '8px' },
    md: { height: '40px', padding: '10px 14px', fontSize: '14px', lineHeight: '20px', borderRadius: '12px' },
    lg: { height: '44px', padding: '10px 18px', fontSize: '15px', lineHeight: '22px', borderRadius: '12px' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#F4B400',
      color: '#171717',
      borderRadius: '12px',
      boxShadow:
        '0px 1px 2px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 1px rgba(0, 0, 0, 0.18), inset 0px -2px 0px rgba(0, 0, 0, 0.05)',
    },
    secondary: {
      backgroundColor: '#FFFFFF',
      color: '#374151',
      border: '1px solid #D1D5DB',
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#4B5563',
    },
    destructive: {
      backgroundColor: '#DC2626',
      color: '#FFFFFF',
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    },
  };

  // Primary button icon from Figma has 18px / 20px size and 0.8 opacity or clean stroke
  const iconSize = size === 'sm' ? 16 : 18;

  return (
    <button
      className={`pc-button pc-button--${variant} pc-button--${size} ${className}`}
      style={{ ...baseStyle, ...sizeStyles[size], ...variantStyles[variant], ...style }}
      {...props}
    >
      {iconLeading && (
        <PosterChildIcon
          name={iconLeading}
          size={iconSize}
          strokeWidth={2.2}
          style={{ opacity: variant === 'primary' ? 0.75 : 1 }}
        />
      )}
      <span>{children}</span>
      {iconTrailing && (
        <PosterChildIcon
          name={iconTrailing}
          size={iconSize}
          strokeWidth={2.2}
        />
      )}
    </button>
  );
};

export default Button;
