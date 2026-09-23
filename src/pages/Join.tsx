import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostieAnimatedIcon } from '../components/posterchild/PostieAnimatedIcon';
import { PosterChildIcon, PosterChildIconName } from '../components/posterchild/Icon';
import { Badge } from '../components/posterchild/Badge';
import Logo from '../components/Logo';
import { useSession } from '../services/session/useSession';
import { activeSessionAdapter } from '../services/session';
import { getDecision, getDecisionTallies, type DecisionOption } from '../config/retreatDecisions';
import { getAvailableHomeOptions } from '../config/retreatFlow';

const OPTION_ICON_MAP: Record<string, PosterChildIconName> = {
  'ask-postie': 'stars-01',
  'needs-attention': 'alert-triangle',
  'suggested-story': 'folder',
  'review-requirements': 'file-06',
  'use-in-story': 'sparkles',
  social: 'message-square-quote',
  article: 'file-06'
};

interface JoinDecisionOptionProps {
  option: DecisionOption;
  isSelected: boolean;
  isWinner?: boolean;
  disabled: boolean;
  onVote: (optionId: string) => void;
  showWinnerTag?: boolean;
}

const JoinDecisionOption = React.memo(function JoinDecisionOption({
  option,
  isSelected,
  isWinner = false,
  disabled,
  onVote,
  showWinnerTag = false
}: JoinDecisionOptionProps) {
  const iconName = (option.iconName as PosterChildIconName) || OPTION_ICON_MAP[option.id] || 'stars-01';

  return (
    <button
      key={option.id}
      onClick={() => !disabled && onVote(option.id)}
      disabled={disabled}
      className={`phone-postie-option-card ${isSelected ? 'is-selected' : ''} ${isWinner ? 'is-winner' : ''} ${disabled && !isSelected && !isWinner ? 'is-disabled' : ''
        }`}
      type="button"
      aria-pressed={isSelected}
    >
      <span className="phone-postie-option-icon">
        {option.id === 'suggested-story' ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M10.0001 7.83333C10.0001 5.96649 10.0001 5.03307 10.3634 4.32003C10.683 3.69282 11.1929 3.18289 11.8201 2.86331C12.5332 2.5 13.4666 2.5 15.3334 2.5H15.6667C16.6002 2.5 17.0669 2.5 17.4234 2.68166C17.737 2.84144 17.992 3.09641 18.1518 3.41002C18.3334 3.76654 18.3334 4.23325 18.3334 5.16667V12.3333C18.3334 13.2668 18.3334 13.7335 18.1518 14.09C17.992 14.4036 17.737 14.6586 17.4234 14.8183C17.0669 15 16.6002 15 15.6667 15H14.5211C13.4775 15 12.9557 15 12.4821 15.1438C12.0628 15.2712 11.6727 15.4799 11.3342 15.7582C10.9518 16.0725 10.6623 16.5066 10.0835 17.3749L10.0001 17.5L9.9167 17.3749C9.33783 16.5066 9.0484 16.0725 8.666 15.7582C8.32746 15.4799 7.93739 15.2712 7.51809 15.1438C7.04446 15 6.52267 15 5.4791 15H4.33341C3.39999 15 2.93328 15 2.57676 14.8183C2.26316 14.6586 2.00819 14.4036 1.8484 14.09C1.66675 13.7335 1.66675 13.2668 1.66675 12.3333V5.16667C1.66675 4.23325 1.66675 3.76654 1.8484 3.41002C2.00819 3.09641 2.26316 2.84144 2.57676 2.68166C2.93328 2.5 3.39999 2.5 4.33341 2.5H4.66675C6.53359 2.5 7.46701 2.5 8.18005 2.86331C8.80726 3.18289 9.31719 3.69282 9.63677 4.32003C10.0001 5.03307 10.0001 5.96649 10.0001 7.83333ZM10.0001 17.5V7.83333"
              stroke="#525252"
              strokeWidth="1.67"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <PosterChildIcon name={iconName} size={18} strokeWidth={2} />
        )}
      </span>

      <div className="phone-postie-option-text">
        <div className="phone-postie-option-title-row">
          <span className="phone-postie-option-label">{option.label}</span>
          {showWinnerTag && isWinner && (
            <span className="phone-postie-winner-tag">
              <PosterChildIcon name="stars-01" size={11} strokeWidth={2} />
              Winner
            </span>
          )}
          {isSelected && !showWinnerTag && (
            <span className="phone-postie-selected-tag">
              <PosterChildIcon name="check" size={11} strokeWidth={2.5} />
              Your pick
            </span>
          )}
        </div>
        {option.description && (
          <span className="phone-postie-option-desc">{option.description}</span>
        )}
      </div>

      <span
        className={`phone-postie-option-check ${isSelected ? 'is-checked' : ''} ${isWinner ? 'is-winner' : ''
          }`}
      >
        {isSelected ? (
          <PosterChildIcon name="check" size={12} strokeWidth={3} />
        ) : isWinner ? (
          <PosterChildIcon name="stars-01" size={11} strokeWidth={2.5} />
        ) : null}
      </span>
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
  const [isChangingVote, setIsChangingVote] = useState(false);

  // Clear optimistic vote and edit mode when activeDecisionId changes
  useEffect(() => {
    setOptimisticVote(null);
    setIsChangingVote(false);
  }, [state.activeDecisionId]);

  const currentSelection = optimisticVote ?? clientVote ?? null;
  const hasVoted = Boolean(currentSelection);

  const activeDecision = useMemo(() => {
    const base = getDecision(state.activeDecisionId);
    if (state.activeDecisionId === 'home-focus') {
      return {
        ...base,
        options: getAvailableHomeOptions(state)
      };
    }
    return base;
  }, [state.activeDecisionId, state.completedMissionIds]);

  const tallies = useMemo(() => {
    return getDecisionTallies({ votes: state.votes, participantVotes: state.participantVotes }, activeDecision);
  }, [state.votes, state.participantVotes, activeDecision]);

  const totalVotes = tallies.totalVotes;
  const isVotingOpen = state.scene === 'voting' || state.decisionStatus === 'open';
  const isTie = state.decisionStatus === 'tie';
  const isVoteRevealed = state.isVoteRevealed ?? true;
  const isResult = (state.scene === 'result' || state.decisionStatus === 'result') && isVoteRevealed;
  const isIntro = state.scene === 'join';
  const isManageOrClosing = (state.completedMissionIds || []).length >= 2 && !isVotingOpen && !isResult;

  // Derive the 4 Core Mobile States:
  // 1) WAITING: No active vote open, or intro screen, or dashboard idle before asking room
  const isWaitingState = (isIntro || (!isVotingOpen && !isResult && !isManageOrClosing)) && !isTie;

  // 2) VOTING STATE: Voting is open, and user has not voted yet (or user clicked change vote)
  const isVotingActive = isVotingOpen && (!hasVoted || isChangingVote) && !isResult;

  // 3) VOTED STATE: User has submitted their vote, selection is locked, waiting for reveal
  const isVotedLocked = isVotingOpen && hasVoted && !isChangingVote && !isResult;

  // 4) RESULT REVEALED: Presenter revealed the room's consensus
  const isResultState = isResult;

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
    setIsChangingVote(false);
    vote(optionId);
  }, [isVotingOpen, vote]);

  const winningOption = state.winningOptionId
    ? displayOptions.find((o) => o.id === state.winningOptionId || (o.id === 'campaigns' && state.winningOptionId === 'campaign'))
    : null;
  const winningLabel = winningOption?.label || state.winningOptionId;
  const winningTally = winningOption ? tallies.options[winningOption.id] : null;
  const winningVoteCount = winningTally?.count ?? 0;
  const winningPercentage = winningTally?.percentage ?? (totalVotes > 0 ? Math.round((winningVoteCount / totalVotes) * 100) : 0);

  return (
    <main className="phone-app" aria-label="Postie Retreat Interface">
      {/* 1. Header with PosterChild / Postie branding & session badge */}
      <header className="phone-postie-header">
        <div className="phone-postie-header-left">
          <Logo compact size="sm" />
          <span className="phone-postie-divider">/</span>
          <div className="phone-postie-identity">
            <PostieAnimatedIcon size={22} speed="ambient" interactive={false} />
            <span className="phone-postie-title">Postie</span>
            <div className="pc-ref-postie-compact-beta">
              <span className="pc-ref-compact-dot" />
              <span className="pc-ref-compact-beta-text">BETA</span>
            </div>
          </div>
        </div>

        <div className="phone-postie-session-badge" title={`Session ${sessionId}`}>
          <span className="phone-postie-live-dot" />
          <span>Session {sessionId}</span>
        </div>
      </header>

      {/* 2. Scrollable conversation & voting stack */}
      <section className="phone-postie-content">
        {/* ============================================================
            STATE 1: WAITING STATE
            Calm mobile shell, waiting for presenter question
           ============================================================ */}
        {isWaitingState && (
          <div className="phone-postie-flow-block">
            <div className="phone-postie-message">
              <div className="phone-postie-msg-meta">
                <div className="phone-postie-meta-left">
                  <PostieAnimatedIcon size={20} speed="ambient" interactive={false} />
                  <span className="phone-postie-author-name">Postie</span>
                  <span className="phone-postie-role-badge">Assistant</span>
                </div>
                <span className="phone-postie-meta-time">Just now</span>
              </div>

              <div className="phone-postie-bubble is-waiting">
                <h1 className="phone-postie-bubble-title">You’re connected.</h1>
                <p className="phone-postie-bubble-desc">
                  Waiting for the next question from the presenter. When a decision begins, your choices will appear right here.
                </p>
              </div>
            </div>

            <div className="phone-postie-status-wrap">
              <div className="phone-postie-presence-tag">
                <span className="phone-postie-pulse-dot" />
                <span>Connected to retreat session {sessionId}</span>
              </div>
              <p className="phone-postie-screen-hint">
                Look at the big screen to follow along with the room <span aria-hidden="true">👀</span>
              </p>
            </div>
          </div>
        )}

        {/* ============================================================
            CLOSING / ARCHITECTURE STATE
            Two missions completed, Manage reveal active
           ============================================================ */}
        {isManageOrClosing && (
          <div className="phone-postie-flow-block">
            <div className="phone-postie-message">
              <div className="phone-postie-msg-meta">
                <div className="phone-postie-meta-left">
                  <PostieAnimatedIcon size={20} speed="ambient" interactive={false} />
                  <span className="phone-postie-author-name">Postie</span>
                </div>
                <span className="phone-postie-meta-time">Architecture</span>
              </div>

              <div className="phone-postie-bubble is-closing">
                <h1 className="phone-postie-bubble-title">PosterChild Architecture</h1>
                <p className="phone-postie-bubble-desc">
                  PosterChild is revealing how it understands your organization, connections, and content. Look at the big screen! <span aria-hidden="true">✨</span>
                </p>
              </div>
            </div>

            <div className="phone-postie-status-wrap">
              <div className="phone-postie-holding-note">
                <PosterChildIcon name="stars-01" size={15} color="#D99A00" strokeWidth={2} />
                <span>Session wrap-up in progress on main display</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            STATE 2 & 3: VOTING STATE (Active Choices) & VOTED STATE (Locked)
           ============================================================ */}
        {(isVotingActive || isVotedLocked) && (
          <div className="phone-postie-flow-block">
            {/* Postie Question / Prompt Bubble */}
            <div className="phone-postie-message">
              <div className="phone-postie-msg-meta">
                <div className="phone-postie-meta-left">
                  <PostieAnimatedIcon size={20} speed="ambient" interactive={false} />
                  <span className="phone-postie-author-name">Postie</span>
                  <span className="phone-postie-role-badge">Decision</span>
                </div>
                <span className="phone-postie-meta-time">
                  {isTie ? 'Tie-breaker' : 'Live question'}
                </span>
              </div>

              <div className="phone-postie-bubble is-question">
                <h1 className="phone-postie-bubble-title">
                  {isTie ? 'Tie-breaker vote' : activeDecision.question}
                </h1>
                <p className="phone-postie-bubble-desc">
                  {isTie
                    ? 'Votes were evenly split across top options. Choose one to break the tie.'
                    : (activeDecision.description || 'Tap an option below to submit your vote for the team.')}
                </p>
              </div>
            </div>

            {/* Vertically Stacked Chat-Style Selection Cards */}
            <div className="phone-postie-options-stack" role="group" aria-label="Voting options">
              {displayOptions.map((opt) => {
                const isSelected = currentSelection === opt.id || (opt.id === 'campaigns' && currentSelection === 'campaign');

                return (
                  <JoinDecisionOption
                    key={opt.id}
                    option={opt}
                    isSelected={isSelected}
                    disabled={isVotedLocked}
                    onVote={handleVote}
                    showWinnerTag={false}
                  />
                );
              })}
            </div>

            {/* STATE 3: Confirmed Voted Feedback & Lock Notice */}
            {isVotedLocked && (
              <div className="phone-postie-voted-card" role="status">
                <div className="phone-postie-voted-header">
                  <div className="phone-postie-voted-icon-wrap">
                    <PosterChildIcon name="check" size={16} strokeWidth={3} color="#15803D" />
                  </div>
                  <div className="phone-postie-voted-copy">
                    <strong className="phone-postie-voted-title">Your vote has been submitted.</strong>
                    <span className="phone-postie-voted-subtitle">
                      Waiting for the presenter to reveal the result.
                    </span>
                  </div>
                </div>

                {isVotingOpen && (
                  <button
                    type="button"
                    className="phone-postie-change-vote-btn"
                    onClick={() => setIsChangingVote(true)}
                  >
                    <span>Change your choice</span>
                    <PosterChildIcon name="edit-02" size={13} strokeWidth={2} />
                  </button>
                )}
              </div>
            )}

            {/* Voting Active Hint */}
            {isVotingActive && (
              <div className="phone-postie-status-wrap">
                <span className="phone-postie-screen-hint">
                  Tap one response above to cast your vote
                </span>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            STATE 4: RESULT REVEALED STATE
            Lightweight confirmation state with Team Choice
           ============================================================ */}
        {isResultState && (
          <div className="phone-postie-flow-block">
            {/* Postie Consensus Bubble */}
            <div className="phone-postie-message">
              <div className="phone-postie-msg-meta">
                <div className="phone-postie-meta-left">
                  <PostieAnimatedIcon size={20} speed="ambient" interactive={false} />
                  <span className="phone-postie-author-name">Postie</span>
                  <span className="phone-postie-role-badge">Consensus</span>
                </div>
                <span className="phone-postie-meta-time">Resolved</span>
              </div>

              <div className="phone-postie-bubble is-result">
                <h1 className="phone-postie-bubble-title">The room has decided.</h1>
                <p className="phone-postie-bubble-desc">
                  Here is the strategic direction chosen by the retreat group.
                </p>
              </div>
            </div>

            {/* Lightweight Confirmation Card */}
            <div className="phone-postie-reveal-card" role="status" aria-label="Team choice summary">
              <div className="phone-postie-reveal-top">
                <Badge variant="brand" iconLeading="check" size="md">
                  Team choice
                </Badge>
                {totalVotes > 0 && (
                  <span className="phone-postie-reveal-tally">
                    {winningPercentage}% of votes ({winningVoteCount} {winningVoteCount === 1 ? 'vote' : 'votes'})
                  </span>
                )}
              </div>
              <div className="phone-postie-reveal-winner">{winningLabel || 'Choice locked in'}</div>
            </div>

            {/* Result Options Stack: Winning option highlighted, all disabled */}
            <div className="phone-postie-options-stack" role="group" aria-label="Voting results">
              {displayOptions.map((opt) => {
                const isWinner = winningOption?.id === opt.id || (opt.id === 'campaigns' && state.winningOptionId === 'campaign');
                const isSelected = currentSelection === opt.id || (opt.id === 'campaigns' && currentSelection === 'campaign');

                return (
                  <JoinDecisionOption
                    key={opt.id}
                    option={opt}
                    isSelected={isSelected}
                    isWinner={Boolean(isWinner)}
                    disabled={true}
                    onVote={() => { }}
                    showWinnerTag={true}
                  />
                );
              })}
            </div>

            {/* Next Step Holding State */}
            <div className="phone-postie-status-wrap">
              <div className="phone-postie-holding-note">
                <PosterChildIcon name="stars-01" size={15} color="#D99A00" strokeWidth={2} />
                <span>Presenter is advancing to this destination on screen ✨</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Bottom Postie Composer Area (Disabled, ambient status indicator) */}
      <footer className="phone-postie-composer-wrap">
        <div className="phone-postie-composer-card" role="region" aria-label="Audience interaction status">
          <div className="phone-postie-composer-input">
            <PosterChildIcon name="message-chat-circle" size={15} color="#9CA3AF" />
            <span>
              {isVotingActive
                ? 'Select one option above to vote'
                : isVotedLocked
                  ? 'Vote submitted · Waiting for results'
                  : isResultState
                    ? 'Results revealed on the main screen'
                    : 'Voting only in this retreat session'}
            </span>
          </div>
          <div className="phone-postie-composer-badge">
            <span className="phone-postie-pulse-dot" />
            <span>Live</span>
          </div>
        </div>
      </footer>
    </main>
  );
}