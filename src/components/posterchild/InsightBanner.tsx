import React from 'react';
import { PosterChildIcon } from './Icon';
import noticedHills from '../../assets/screens/home/noticed-hills.png';
import posterchildMark from '../../assets/posterchild/brand/posterchild-mark.svg';

export interface InsightBannerProps {
  /** The headline text in Fraunces display serif */
  title: string;
  /** The supporting description copy in DM Sans */
  description: string;
  /** Optional CTA label, e.g. "See why this matters" or "Ask your community" */
  actionLabel?: string;
  /** Optional click handler for the action link */
  onAction?: () => void;
  /** Optional graphic override (defaults to canonical noticed-hills image) */
  graphic?: string;
  /** Optional additional CSS class */
  className?: string;
}

export const InsightBanner: React.FC<InsightBannerProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  graphic = noticedHills,
  className = '',
}) => {
  return (
    <div className={`pc-insight-banner ${className}`.trim()}>
      {/* Decorative hills art — absolute, right side, behind content, z-index 0 */}
      {graphic && (
        <img
          src={graphic}
          alt=""
          className="pc-insight-banner__graphic"
          aria-hidden="true"
        />
      )}

      {/* Main content row: PosterChild mark icon + text stack */}
      <div className="pc-insight-banner__content">
        {/* PosterChild brand mark — 24x24 inside 24x32 wrapper, rotated -45deg */}
        <div className="pc-insight-banner__mark" aria-hidden="true">
          <img
            src={posterchildMark}
            alt=""
            width={24}
            height={24}
            className="pc-insight-banner__mark-icon"
          />
        </div>

        {/* Text + action column */}
        <div className="pc-insight-banner__body">
          {/* Text block: title + supporting stacked with 4px gap */}
          <div className="pc-insight-banner__text">
            <h3 className="pc-insight-banner__title">{title}</h3>
            <p className="pc-insight-banner__description">{description}</p>
          </div>

          {/* Action link */}
          {actionLabel && (
            <button
              type="button"
              className="pc-insight-banner__action"
              onClick={onAction}
            >
              <span>{actionLabel}</span>
              <PosterChildIcon
                name="arrow-right"
                size={14}
                color="#8F6500"
                strokeWidth={2}
                className="pc-insight-banner__action-icon"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightBanner;
