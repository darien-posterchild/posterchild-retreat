import type { ReactNode } from 'react';
import { PosterChildIcon } from './posterchild/Icon';

export type ArtifactPreview = {
  tag: string;
  headline: string;
  meta: string;
  sublist?: string[];
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  icon: ReactNode;
  artifactPreview: ArtifactPreview;
  voteCount?: number;
  totalVotes?: number;
  voting?: boolean;
  winner?: boolean;
  isFaded?: boolean;
};

export default function ActionCard({
  eyebrow,
  title,
  description,
  actionLabel,
  icon,
  artifactPreview,
  voteCount = 0,
  totalVotes = 0,
  voting = false,
  winner = false,
  isFaded = false
}: Props) {
  const hasVotes = voteCount > 0;
  const votePercent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

  return (
    <article
      className={`pc-card ${winner ? 'is-winner' : ''} ${isFaded ? 'is-faded' : ''} ${voting ? 'is-voting' : ''}`}
      aria-selected={winner}
    >
      {/* Card Header */}
      <div className="pc-card__header">
        <div className="pc-card__header-main">
          <div className="pc-card__featured-icon" aria-hidden="true">
            {icon}
          </div>

          <div className="pc-card__meta">
            <span className="pc-card__eyebrow">{eyebrow}</span>
            <h3 className="pc-card__title">{title}</h3>
          </div>
        </div>

        {/* Status / Collaborative Layer */}
        <div className="pc-card__status-slot">
          {voting && hasVotes && (
            <div className="pc-vote-badge" title={`${voteCount} votes from participants`}>
              <span className="pc-vote-badge__dot" />
              <span className="pc-vote-badge__count">{voteCount}</span>
              <span className="pc-vote-badge__unit">{voteCount === 1 ? 'vote' : 'votes'}</span>
            </div>
          )}

          {winner && (
            <div className="pc-winner-badge" role="status">
              <PosterChildIcon name="check" size={11} strokeWidth={3} className="pc-winner-badge__icon" />
              <span>Team choice</span>
            </div>
          )}

          {isFaded && hasVotes && (
            <div className="pc-vote-badge pc-vote-badge--muted">
              <span>{voteCount} {voteCount === 1 ? 'vote' : 'votes'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="pc-card__description">{description}</p>

      {/* Artifact Preview */}
      <div className="pc-card__preview">
        <div className="pc-preview-header">
          <span className="pc-preview-tag">{artifactPreview.tag}</span>
        </div>

        <div className="pc-preview-body">
          <p className="pc-preview-headline">{artifactPreview.headline}</p>

          {artifactPreview.sublist && (
            <ul className="pc-preview-sublist">
              {artifactPreview.sublist.map((item, idx) => (
                <li key={idx}>
                  <span className="pc-preview-bullet" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="pc-preview-footer">
          <span className="pc-preview-meta">{artifactPreview.meta}</span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pc-card__footer">
        <button
          className={`pc-button ${winner ? 'pc-button--brand' : 'pc-button--secondary'}`}
          type="button"
        >
          <span>{actionLabel}</span>
          <PosterChildIcon name="arrow-right" size={13} strokeWidth={2} className="pc-button__arrow" />
        </button>

        {/* Live Vote Share Bar (only visible when voting is active) */}
        {voting && (
          <div className="pc-card__vote-bar" aria-hidden="true">
            <div
              className="pc-card__vote-fill"
              style={{ width: `${votePercent}%` }}
            />
          </div>
        )}
      </div>
    </article>
  );
}