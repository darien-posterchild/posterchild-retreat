import React from 'react';

export interface TabItem<T extends string = string> {
  id: T;
  label: React.ReactNode;
  badge?: React.ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  items: Array<TabItem<T>>;
  activeId: T;
  onChange: (id: T) => void;
  ariaLabel?: string;
  className?: string;
}

export function Tabs<T extends string = string>({
  items,
  activeId,
  onChange,
  ariaLabel,
  className = '',
}: TabsProps<T>) {
  return (
    <div
      className={`pc-tabs ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={item.ariaLabel}
            disabled={item.disabled}
            className={`pc-tab-btn ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(item.id)}
          >
            <span>{item.label}</span>
            {item.badge}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
