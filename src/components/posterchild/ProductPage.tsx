import React from 'react';

export interface ProductPageProps {
  /** Main page title rendered in Fraunces display serif */
  title: string;
  /** Supporting subtitle/description rendered in DM Sans */
  description?: string;
  /** Primary action slot (usually a PosterChild Button) */
  primaryAction?: React.ReactNode;
  /** Secondary or header actions */
  secondaryAction?: React.ReactNode;
  /** Page content elements */
  children: React.ReactNode;
  /** Optional custom CSS class for the page wrapper */
  className?: string;
  /** Data attribute for figma node inspection */
  figmaNode?: string;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
  className = '',
  figmaNode,
}) => {
  return (
    <div
      data-figma-node={figmaNode}
      className={`pc-ref-main-column pc-product-page ${className}`.trim()}
    >
      {/* 1. Header Row (Fraunces 36px/44px + DM Sans 16px/24px + Action) */}
      <header className="pc-ref-header-row pc-product-page__header">
        <div className="pc-ref-header-text pc-product-page__header-text">
          <h1 className="pc-ref-page-title pc-product-page__title">{title}</h1>
          {description && (
            <p className="pc-ref-page-subtitle pc-product-page__subtitle">
              {description}
            </p>
          )}
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="pc-product-page__actions">
            {secondaryAction}
            {primaryAction}
          </div>
        )}
      </header>

      {/* 2. Main Page Content */}
      <div className="pc-product-page__body">
        {children}
      </div>
    </div>
  );
};

export default ProductPage;
