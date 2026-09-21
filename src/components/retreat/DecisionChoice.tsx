import React from 'react';
import { Badge } from '../posterchild/Badge';
import { DecisionStatus } from '../../services/session/types';

export interface DecisionChoiceProps {
  decisionId: string;
  optionId: string;
  status?: DecisionStatus;
  isWinner?: boolean;
  isTie?: boolean;
  voteCount?: number;
  votePercentage?: number;
  showFeedback?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable retreat voting decorator.
 * Wraps product components (such as MetricCard or list items) without modifying
 * their internal product data or markup.
 */
export const DecisionChoice: React.FC<DecisionChoiceProps> = ({
  optionId,
  status = 'idle',
  isWinner = false,
  isTie = false,
  voteCount = 0,
  votePercentage = 0,
  showFeedback = false,
  onClick,
  children,
  className = '',
  style,
}) => {
  const isVoting = status === 'open';
  const isResult = status === 'result';

  // Determine state modifiers
  let stateClass = 'pc-decision-choice--idle';
  if (isWinner) {
    stateClass = 'pc-decision-choice--winner';
  } else if (isTie) {
    stateClass = 'pc-decision-choice--tie';
  } else if (isVoting) {
    stateClass = 'pc-decision-choice--voting';
  } else if (isResult && !isWinner) {
    stateClass = 'pc-decision-choice--muted';
  }

  return (
    <div
      className={`pc-decision-choice ${stateClass} ${className}`.trim()}
      onClick={onClick}
      style={style}
      data-decision-option={optionId}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Target Product Component */}
      {children}

      {/* Floating Status Badges for Retreat Layer */}
      {isWinner && (
        <div className="pc-decision-choice__badge-slot" aria-label="Team choice winner">
          <Badge variant="brand" iconLeading="check">
            Team choice
          </Badge>
        </div>
      )}

      {isTie && (
        <div className="pc-decision-choice__badge-slot" aria-label="Tied option">
          <Badge variant="amber">
            Tied
          </Badge>
        </div>
      )}

      {/* Subtle Presenter Live Vote Feedback (only during open voting, never modifying the metric) */}
      {isVoting && showFeedback && voteCount > 0 && (
        <div className="pc-decision-choice__feedback-slot" aria-label={`${voteCount} votes`}>
          <span className="pc-decision-choice__vote-pill">
            <strong>{voteCount}</strong>
            <span className="pc-decision-choice__vote-pct">({votePercentage}%)</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default DecisionChoice;
