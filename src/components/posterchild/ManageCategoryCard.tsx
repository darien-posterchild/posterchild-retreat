import React from 'react';
import { FeaturedIcon, FeaturedIconVariant } from './FeaturedIcon';
import { PosterChildIcon, PosterChildIconName } from './Icon';

export interface ManageInventoryItem {
  label: string;
  value: string | number;
  status?: 'default' | 'connected' | 'healthy' | 'action';
}

export interface ManageCategoryCardProps {
  id: string;
  title: string;
  description: string;
  icon: PosterChildIconName;
  tone: FeaturedIconVariant;
  items: ManageInventoryItem[];
  actionLabel: string;
  onAction?: () => void;
  onClick?: () => void;
  className?: string;
}

export const ManageCategoryCard: React.FC<ManageCategoryCardProps> = ({
  id,
  title,
  description,
  icon,
  tone,
  items,
  actionLabel,
  onAction,
  onClick,
  className = '',
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else if (onAction) {
      onAction();
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAction) {
      onAction();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <article
      data-category={id}
      onClick={handleCardClick}
      className={`pc-manage-card ${className}`.trim()}
    >
      {/* Top Header Block */}
      <div className="pc-manage-card__top">
        <div className="pc-manage-card__head">
          <FeaturedIcon
            name={icon}
            variant={tone}
            size="xl"
            containerSize={56}
            iconSize={28}
            radius={12}
          />
          <div className="pc-manage-card__chevron-wrap">
            <PosterChildIcon
              name="chevron-right"
              size={24}
              strokeWidth={2}
              className="pc-manage-card__chevron"
            />
          </div>
        </div>

        <div className="pc-manage-card__text">
          <h2 className="pc-manage-card__title">{title}</h2>
          <p className="pc-manage-card__desc">{description}</p>
        </div>
      </div>

      {/* Internal Inventory List */}
      <div className="pc-manage-card__inventory">
        {items.map((item, index) => {
          const isConnected = item.value === 'Connected' || item.value === 'Healthy';
          const isAction = item.value === 'Manage' || item.value === 'View';

          return (
            <div key={`${item.label}-${index}`} className="pc-manage-card__inventory-row">
              <span className="pc-manage-card__inventory-label">{item.label}</span>
              <span
                className={`pc-manage-card__inventory-value ${
                  isConnected ? 'is-connected' : isAction ? 'is-action' : ''
                }`}
              >
                {item.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Card Footer Action */}
      <footer className="pc-manage-card__footer">
        <button
          type="button"
          onClick={handleActionClick}
          className="pc-manage-card__action-btn"
        >
          <span>{actionLabel}</span>
          <PosterChildIcon
            name="arrow-right"
            size={14}
            strokeWidth={2.5}
            className="pc-manage-card__action-icon"
          />
        </button>
      </footer>
    </article>
  );
};

export default ManageCategoryCard;
