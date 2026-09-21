import React from 'react';
import { PosterChildIcon, PosterChildIconName } from './Icon';

export type MetricCardTone = 'success' | 'blue' | 'warning';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Uppercase category heading / label */
  label: string;
  /** Primary numeric or text metric value */
  value: string | number;
  /** Icon name from the PosterChild Design System icon set */
  icon: PosterChildIconName;
  /** Tone variant controlling icon box and accent colors */
  tone?: MetricCardTone;
  /** Optional custom CSS class for the value */
  valueClassName?: string;
  /** Optional custom color for the value */
  valueColor?: string;
  /** Optional additional CSS class */
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  tone = 'success',
  valueClassName = '',
  valueColor,
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      className={`pc-metric-card ${className}`.trim()}
      style={style}
      {...props}
    >
      <span className="pc-metric-card-heading">{label}</span>
      <span
        className={`pc-metric-card-value ${valueClassName}`.trim()}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </span>
      <div
        className={`pc-metric-card-icon-box pc-metric-card-icon-box--${tone}`}
        aria-hidden="true"
      >
        <PosterChildIcon name={icon} size={16} strokeWidth={2} />
      </div>
    </div>
  );
};

export default MetricCard;
