import React, { useEffect, useState } from 'react';
import { Badge } from '../posterchild/Badge';
import { PosterChildIcon } from '../posterchild/Icon';
import { DecisionOption } from '../../config/retreatDecisions';

export interface RetreatVoteRevealProps {
  winningOption?: DecisionOption | null;
  winnerTitle?: string;
  totalVotes: number;
  winnerVotes: number;
  percentage?: number;
  isTie?: boolean;
  tiedOptions?: DecisionOption[];
  isZeroVotes?: boolean;
  onDismiss?: () => void;
  autoDismissMs?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const RetreatVoteReveal: React.FC<RetreatVoteRevealProps> = ({
  winningOption,
  winnerTitle,
  totalVotes,
  winnerVotes,
  percentage,
  isTie = false,
  tiedOptions = [],
  isZeroVotes = false,
  onDismiss,
  autoDismissMs = 4000,
  className = '',
  style,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (autoDismissMs <= 0) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onDismiss?.();
      }, 300); // match transition duration
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs, onDismiss]);

  const handleManualClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss?.();
    }, 200);
  };

  const calculatedPercentage =
    percentage !== undefined
      ? percentage
      : totalVotes > 0
      ? Math.round((winnerVotes / totalVotes) * 100)
      : 0;

  const displayWinnerLabel = winningOption?.label || winnerTitle || 'Winner';
  const voteNoun = totalVotes === 1 ? 'vote' : 'votes';

  if (isTie) {
    const tiedLabels = tiedOptions.map((o) => o.label).join(' & ');
    return (
      <div
        className={`pc-retreat-vote-reveal is-tie ${isExiting ? 'is-exiting' : ''} ${className}`.trim()}
        role="status"
        aria-live="polite"
        style={style}
      >
        <div className="pc-retreat-vote-reveal__header">
          <Badge variant="amber" iconLeading="alert-triangle" size="sm">
            Tied
          </Badge>
          <button
            type="button"
            className="pc-retreat-vote-reveal__close"
            onClick={handleManualClose}
            aria-label="Dismiss vote reveal banner"
          >
            <PosterChildIcon name="x-close" size={16} strokeWidth={2} />
          </button>
        </div>
        <div className="pc-retreat-vote-reveal__body">
          <h2 className="pc-retreat-vote-reveal__winner">
            {tiedLabels || 'Tied Options'}
          </h2>
          <div className="pc-retreat-vote-reveal__summary">
            <span>
              <strong>{winnerVotes}</strong> {winnerVotes === 1 ? 'vote each' : 'votes each'}
            </span>
            <span className="pc-retreat-vote-reveal__sep">·</span>
            <span className="pc-retreat-vote-reveal__highlight">Tie-breaker ready</span>
          </div>
        </div>
      </div>
    );
  }

  if (isZeroVotes || (totalVotes === 0 && !winningOption)) {
    return (
      <div
        className={`pc-retreat-vote-reveal is-zero ${isExiting ? 'is-exiting' : ''} ${className}`.trim()}
        role="status"
        aria-live="polite"
        style={style}
      >
        <div className="pc-retreat-vote-reveal__header">
          <Badge variant="gray" iconLeading="alert-circle" size="sm">
            No votes
          </Badge>
          <button
            type="button"
            className="pc-retreat-vote-reveal__close"
            onClick={handleManualClose}
            aria-label="Dismiss vote reveal banner"
          >
            <PosterChildIcon name="x-close" size={16} strokeWidth={2} />
          </button>
        </div>
        <div className="pc-retreat-vote-reveal__body">
          <h2 className="pc-retreat-vote-reveal__winner">No votes cast yet</h2>
          <div className="pc-retreat-vote-reveal__summary">
            <span>Presenter can reopen voting</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`pc-retreat-vote-reveal ${isExiting ? 'is-exiting' : ''} ${className}`.trim()}
      role="status"
      aria-live="polite"
      style={style}
    >
      <div className="pc-retreat-vote-reveal__header">
        <Badge variant="brand" iconLeading="check" size="sm">
          Team choice
        </Badge>
        <button
          type="button"
          className="pc-retreat-vote-reveal__close"
          onClick={handleManualClose}
          aria-label="Dismiss vote reveal banner"
        >
          <PosterChildIcon name="x-close" size={16} strokeWidth={2} />
        </button>
      </div>
      <div className="pc-retreat-vote-reveal__body">
        <h2 className="pc-retreat-vote-reveal__winner">{displayWinnerLabel}</h2>
        <div className="pc-retreat-vote-reveal__summary">
          <span>
            <strong>{winnerVotes}</strong> of <strong>{totalVotes}</strong> {voteNoun}
          </span>
          <span className="pc-retreat-vote-reveal__sep">·</span>
          <span className="pc-retreat-vote-reveal__percentage">{calculatedPercentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default RetreatVoteReveal;
