import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Logo from '../components/Logo';
import { PosterChildIcon, PosterChildIconName } from '../components/posterchild/Icon';
import { useSession } from '../services/session/useSession';
import { activeSessionAdapter } from '../services/session';
import { getDecision, type DecisionOption } from '../config/retreatDecisions';

const OPTION_ICON_MAP: Record<string, PosterChildIconName> = {
  stories: 'folder',
  campaigns: 'announcement-02',
  campaign: 'announcement-02',
  quotes: 'file-06',
  'mayas-journey': 'stars-01',
  'youth-voices': 'file-06',
  'community-gardens': 'coins-hand'
};

interface JoinDecisionOptionProps {
  option: DecisionOption;
  isSelected: boolean;
  isWinner?: boolean;
  disabled: boolean;
  onVote: (optionId: string) => void;
}

const JoinDecisionOption = React.memo(function JoinDecisionOption({
  option,
  isSelected,
  isWinner = false,
  disabled,
  onVote,
}: JoinDecisionOptionProps) {
  const iconName = (option.iconName as PosterChildIconName) || OPTION_ICON_MAP[option.id] || 'stars-01';

  return (
    <button
      key={option.id}
      onClick={() => onVote(option.id)}
      disabled={disabled}
      className={`vote-option ${isSelected ? 'is-selected' : ''} ${isWinner ? 'is-winner' : ''}`}
      type="button"
    >
      <span className="vote-option__icon">
        <PosterChildIcon name={iconName} size={20} strokeWidth={2} />
      </span>
      <div className="vote-option__text-group">
        <span className="vote-option__label">{option.label}</span>
        {option.description && (
          <span className="vote-option__desc">{option.description}</span>
        )}
      </div>
      {isSelected && (
        <span className="vote-option__check">
          <PosterChildIcon name="check" size={14} strokeWidth={3} />
        </span>
      )}
    </button>
  );
});

export default function Join() {
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();
  const { state, clientVote, vote } = useSession(sessionId);
  const clientId = activeSessionAdapter.getClientId();

  // Register live presence for this Join participant
  useEffect(() => {
    const cleanup = activeSessionAdapter.registerPresence?.(sessionId, clientId);
    return () => {
      cleanup?.();
    };
  }, [sessionId, clientId]);

  // Optimistic vote state to provide instant feedback without flashing
  const [optimisticVote, setOptimisticVote] = useState<string | null>(null);

  // Clear optimistic vote when activeDecisionId changes
  useEffect(() => {
    setOptimisticVote(null);
  }, [state.activeDecisionId]);


  const currentSelection = optimisticVote ?? clientVote ?? null;

  const activeDecision = useMemo(() => {
    return getDecision(state.activeDecisionId);
  }, [state.activeDecisionId]);

  const isVotingOpen = state.scene === 'voting' || state.decisionStatus === 'open';
  const isTie = state.decisionStatus === 'tie';
  const isResult = state.scene === 'result' || state.decisionStatus === 'result';

  // Filter options if allowedOptionIds is present (e.g. tie-breaker re-vote)
  const allowedOptionIdsKey = state.allowedOptionIds?.join(',') || '';
  const displayOptions: DecisionOption[] = useMemo(() => {
    if (state.allowedOptionIds && state.allowedOptionIds.length > 0) {
      return activeDecision.options.filter((opt) => state.allowedOptionIds!.includes(opt.id));
    }
    return activeDecision.options;
  }, [activeDecision, allowedOptionIdsKey]);

  const handleVote = useCallback((optionId: string) => {
    if (!isVotingOpen) return;
    setOptimisticVote(optionId);
    vote(optionId);
  }, [isVotingOpen, vote]);

  const isIntro = state.scene === 'join';
  const isClosedZeroVotes = state.decisionStatus === 'closed' && !isResult && !isTie && !state.winningOptionId;

  const winningOption = state.winningOptionId
    ? displayOptions.find((o) => o.id === state.winningOptionId)
    : null;
  const winningLabel = winningOption?.label || state.winningOptionId;

  const isManageOrClosing = (state.completedMissionIds || []).length >= 2 && !isVotingOpen && !isResult;

  return (
    <main className="phone-app">
      <header className="phone-header">
        <Logo />
        <span className="phone-session">Session {sessionId}</span>
      </header>

      <section className="phone-content">
        {isIntro ? (
          /* Initial Pre-Session Join Screen */
          <div className="phone-intro-block">
            <div className="phone-success">
              <PosterChildIcon name="check" size={24} strokeWidth={2.4} />
            </div>
            <h1 className="phone-title">You’re connected.</h1>
            <p className="phone-subtitle">
              Look at the big screen to see the session begin <span aria-hidden="true">👀</span>
            </p>
          </div>
        ) : isManageOrClosing ? (
          /* Architectural Reveal & Closing Presentation-in-Progress State */
          <div className="phone-intro-block">
            <div className="phone-success">
              <PosterChildIcon name="stars-01" size={24} strokeWidth={2.4} />
            </div>
            <h1 className="phone-title">PosterChild Architecture</h1>
            <p className="phone-subtitle">
              PosterChild is showing how it understands your organization. Look at the big screen! <span aria-hidden="true">✨</span>
            </p>
          </div>
        ) : (
          /* Persistent Decision Shell (Top-Anchored, Constant Geometry) */
          <div className="phone-decision-block">
            <div className="phone-question-block">
              <h1 className="phone-title vote-title">
                {activeDecision.question}
              </h1>
              <p className="phone-subtitle vote-subtitle">
                {isTie
                  ? 'Tie-breaker! Choose between the top contenders.'
                  : isResult
                  ? 'The room has reached a consensus.'
                  : !isVotingOpen
                  ? 'Get ready to vote from your phone.'
                  : (activeDecision.description || 'Your choice will appear on the big screen.')}
              </p>
            </div>

            <div className="vote-options">
              {displayOptions.map((opt) => {
                const isSelected = currentSelection === opt.id || (opt.id === 'campaigns' && currentSelection === 'campaign');
                const isWinner = isResult && (state.winningOptionId === opt.id || (opt.id === 'campaigns' && state.winningOptionId === 'campaign'));

                return (
                  <JoinDecisionOption
                    key={opt.id}
                    option={opt}
                    isSelected={isSelected}
                    isWinner={Boolean(isWinner)}
                    disabled={!isVotingOpen}
                    onVote={handleVote}
                  />
                );
              })}
            </div>

            {/* Stable Status / Feedback Region (Fixed Min-Height: 56px, Zero Layout Shift) */}
            <div className="vote-status-region" role="status">
              {isResult ? (
                <div className="vote-status-wrap">
                  <div className="vote-confirmation vote-status--winner">
                    <PosterChildIcon name="check" size={14} strokeWidth={2.5} />
                    <span>Team choice: {winningLabel || 'Locked in'}</span>
                  </div>
                  <span className="vote-confirmation__sub">Look at the big screen!</span>
                </div>
              ) : isTie ? (
                <div className="vote-status-wrap">
                  <div className="vote-confirmation vote-status--tie">
                    <PosterChildIcon name="alert-triangle" size={14} strokeWidth={2.5} />
                    <span>It’s a tie — Get ready for tie-breaker</span>
                  </div>
                </div>
              ) : isClosedZeroVotes ? (
                <div className="vote-status-wrap">
                  <div className="vote-confirmation vote-status--paused">
                    <PosterChildIcon name="alert-triangle" size={14} strokeWidth={2.5} />
                    <span>Voting paused — Waiting for presenter</span>
                  </div>
                </div>
              ) : currentSelection ? (
                <div className="vote-status-wrap">
                  <div className="vote-confirmation">
                    <span className="vote-confirmation__dot" />
                    <span>Vote sent</span>
                  </div>
                  <span className="vote-confirmation__sub">Tap another option to change your vote</span>
                </div>
              ) : (
                <div className="vote-status-placeholder" aria-hidden="true" />
              )}
            </div>
          </div>
        )}
      </section>

      <footer className="phone-footer">
        <span>PosterChild Retreat 2026</span>
      </footer>
    </main>
  );
}