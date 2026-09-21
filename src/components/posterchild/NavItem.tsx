import React from 'react';
import { PosterChildIcon, PosterChildIconName } from './Icon';

export interface NavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: PosterChildIconName;
  active?: boolean;
  childActive?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  onToggleExpand?: (e: React.MouseEvent) => void;
  badge?: React.ReactNode;
}

export const NavItem: React.FC<NavItemProps> = ({
  label,
  icon,
  active = false,
  childActive = false,
  expandable = false,
  expanded = false,
  onToggleExpand,
  badge,
  className = '',
  style,
  onClick,
  ...props
}) => {
  // If expandable and expanded, row background remains neutral/transparent
  // so the active child receives the primary highlighted background
  const isPrimaryActive = active && (!expandable || !expanded);
  // Show brand/gold icon when item is active or when a child under it is active
  const isIconActive = active || childActive;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleExpand) {
      onToggleExpand(e);
    }
  };

  return (
    <div
      className="pc-ref-nav-row"
      style={{
        width: '100%',
        height: '38px',
        padding: '1px 0',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <button
        type="button"
        className={`pc-ref-nav-item ${isPrimaryActive ? 'is-active' : ''} ${className}`}
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          height: '36px',
          padding: '8px 12px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: isPrimaryActive ? '#FFF9E8' : 'transparent',
          color: isPrimaryActive ? '#8F6500' : '#404040',
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.15s ease, color 0.15s ease',
          textDecoration: 'none',
          gap: '8px',
          ...style,
        }}
        onClick={handleClick}
        {...props}
      >
        <span
          className="pc-ref-nav-item__icon-box"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            flexShrink: 0,
            color: isIconActive ? '#F4B400' : '#A3A3A3',
          }}
        >
          <PosterChildIcon
            name={icon}
            size={20}
            color={isIconActive ? '#F4B400' : '#A3A3A3'}
            strokeWidth={isIconActive ? 2.2 : 2}
          />
        </span>

        <span
          className="pc-ref-nav-item__text"
          style={{
            flex: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: isPrimaryActive ? '#8F6500' : '#404040',
          }}
        >
          {label}
        </span>

        {expandable && (
          <span
            role="button"
            tabIndex={0}
            aria-label={`${expanded ? 'Collapse' : 'Expand'} ${label}`}
            onClick={handleChevronClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                e.preventDefault();
                handleChevronClick(e as unknown as React.MouseEvent);
              }
            }}
            className="pc-ref-nav-item__chevron-btn"
            style={{
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              borderRadius: '6px',
              color: isPrimaryActive ? '#8F6500' : '#737373',
            }}
          >
            <PosterChildIcon
              name="chevron-down"
              size={16}
              strokeWidth={2}
              color="currentColor"
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s ease',
              }}
            />
          </span>
        )}

        {badge}
      </button>
    </div>
  );
};

export interface NavSubItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: PosterChildIconName;
  active?: boolean;
  badge?: React.ReactNode;
}

export const NavSubItem: React.FC<NavSubItemProps> = ({
  label,
  icon,
  active = false,
  badge,
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      className="pc-ref-nav-row"
      style={{
        width: '100%',
        height: '38px',
        padding: '1px 0',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <button
        type="button"
        className={`pc-ref-nav-sub-item ${active ? 'is-active' : ''} ${className}`}
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          height: '36px',
          padding: '8px 8px 8px 36px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: active ? '#FFF9E8' : 'transparent',
          color: active ? '#8F6500' : '#404040',
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.15s ease, color 0.15s ease',
          textDecoration: 'none',
          gap: '8px',
          ...style,
        }}
        {...props}
      >
        <span
          className="pc-ref-nav-sub-item__icon-box"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            flexShrink: 0,
            color: active ? '#F4B400' : '#A3A3A3',
          }}
        >
          <PosterChildIcon
            name={icon}
            size={20}
            color={active ? '#F4B400' : '#A3A3A3'}
            strokeWidth={active ? 2.2 : 2}
          />
        </span>
        <span
          className="pc-ref-nav-sub-item__text"
          style={{
            flex: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </span>
        {badge}
      </button>
    </div>
  );
};

export interface NavGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const NavGroup: React.FC<NavGroupProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`pc-ref-nav-group ${className}`}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
};

export default NavItem;
