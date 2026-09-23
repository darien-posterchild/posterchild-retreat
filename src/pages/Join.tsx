import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const renderJoinChoiceIcon = (
  optionId: string | null | undefined,
  iconName: PosterChildIconName
) => {
  if (optionId === 'social') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.6665 10.0013C1.6665 14.6037 5.39746 18.3346 9.99984 18.3346C11.3805 18.3346 12.4998 17.2153 12.4998 15.8346V15.418C12.4998 15.031 12.4998 14.8374 12.5212 14.675C12.6689 13.5532 13.5517 12.6704 14.6735 12.5227C14.836 12.5013 15.0295 12.5013 15.4165 12.5013H15.8332C17.2139 12.5013 18.3332 11.382 18.3332 10.0013C18.3332 5.39893 14.6022 1.66797 9.99984 1.66797C5.39746 1.66797 1.6665 5.39893 1.6665 10.0013Z"
          stroke="#525252"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.83317 10.8346C6.29341 10.8346 6.6665 10.4615 6.6665 10.0013C6.6665 9.54106 6.29341 9.16797 5.83317 9.16797C5.37293 9.16797 4.99984 9.54106 4.99984 10.0013C4.99984 10.4615 5.37293 10.8346 5.83317 10.8346Z"
          stroke="#525252"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.3332 7.5013C13.7934 7.5013 14.1665 7.12821 14.1665 6.66797C14.1665 6.20773 13.7934 5.83464 13.3332 5.83464C12.8729 5.83464 12.4998 6.20773 12.4998 6.66797C12.4998 7.12821 12.8729 7.5013 13.3332 7.5013Z"
          stroke="#525252"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.33317 6.66797C8.79341 6.66797 9.1665 6.29487 9.1665 5.83464C9.1665 5.3744 8.79341 5.0013 8.33317 5.0013C7.87293 5.0013 7.49984 5.3744 7.49984 5.83464C7.49984 6.29487 7.87293 6.66797 8.33317 6.66797Z"
          stroke="#525252"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (optionId === 'ask-postie') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M5.4165 10.8346L6.07022 12.1421C6.29146 12.5845 6.40208 12.8058 6.54986 12.9975C6.681 13.1676 6.83351 13.3201 7.00363 13.4513C7.19535 13.5991 7.41659 13.7097 7.85907 13.9309L9.1665 14.5846L7.85907 15.2384C7.41659 15.4596 7.19535 15.5702 7.00363 15.718C6.83351 15.8491 6.681 16.0016 6.54986 16.1718C6.40208 16.3635 6.29146 16.5847 6.07022 17.0272L5.4165 18.3346L4.76279 17.0272C4.54155 16.5847 4.43093 16.3635 4.28314 16.1718C4.15201 16.0016 3.9995 15.8491 3.82938 15.718C3.63766 15.5702 3.41642 15.4596 2.97393 15.2384L1.6665 14.5846L2.97393 13.9309C3.41642 13.7097 3.63766 13.5991 3.82938 13.4513C3.9995 13.3201 4.15201 13.1676 4.28314 12.9975C4.43093 12.8058 4.54155 12.5845 4.76279 12.1421L5.4165 10.8346Z"
          stroke="#525252"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.4998 1.66797L13.482 4.22165C13.717 4.83268 13.8345 5.13819 14.0173 5.39517C14.1792 5.62293 14.3782 5.82192 14.606 5.98387C14.863 6.1666 15.1685 6.28411 15.7795 6.51912L18.3332 7.5013L15.7795 8.48349C15.1685 8.7185 14.863 8.836 14.606 9.01873C14.3782 9.18068 14.1792 9.37967 14.0173 9.60743C13.8345 9.86442 13.717 10.1699 13.482 10.781L12.4998 13.3346L11.5177 10.781C11.2826 10.1699 11.1651 9.86442 10.9824 9.60743C10.8205 9.37967 10.6215 9.18068 10.3937 9.01873C10.1367 8.836 9.83121 8.7185 9.22019 8.48349L6.6665 7.5013L9.22019 6.51912C9.83121 6.28411 10.1367 6.1666 10.3937 5.98387C10.6215 5.82192 10.8205 5.62293 10.9824 5.39517C11.1651 5.13819 11.2826 4.83268 11.5177 4.22165L12.4998 1.66797Z"
          stroke="#525252"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (optionId === 'article') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M11.6668 1.89258V5.3347C11.6668 5.80141 11.6668 6.03476 11.7577 6.21302C11.8376 6.36982 11.965 6.49731 12.1218 6.5772C12.3001 6.66803 12.5335 6.66803 13.0002 6.66803H16.4423M13.3335 10.8346H6.66683M13.3335 14.168H6.66683M8.3335 7.5013H6.66683M11.6668 1.66797H7.3335C5.93336 1.66797 5.2333 1.66797 4.69852 1.94045C4.22811 2.18014 3.84566 2.56259 3.60598 3.03299C3.3335 3.56777 3.3335 4.26784 3.3335 5.66797V14.3346C3.3335 15.7348 3.3335 16.4348 3.60598 16.9696C3.84566 17.44 4.22811 17.8225 4.69852 18.0622C5.2333 18.3346 5.93336 18.3346 7.3335 18.3346H12.6668C14.067 18.3346 14.767 18.3346 15.3018 18.0622C15.7722 17.8225 16.1547 17.44 16.3943 16.9696C16.6668 16.4348 16.6668 15.7348 16.6668 14.3346V6.66797L11.6668 1.66797Z"
          stroke="#525252"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <PosterChildIcon
      name={iconName}
      size={20}
      strokeWidth={1.67}
    />
  );
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
          renderJoinChoiceIcon(option.id, iconName)
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
  const chatContentRef = useRef<HTMLElement | null>(null);
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

  const decisionHistory = useMemo(() => {
    return (state.decisionHistory || []).map((item) => {
      const decision = getDecision(item.decisionId);

      const winningOption = decision.options.find(
        (option) => option.id === item.winningOptionId
      );

      return {
        ...item,
        question: decision.question,
        winningLabel:
          winningOption?.label ||
          item.winningOptionId ||
          'Choice locked in',
        winningIcon:
          (winningOption?.iconName as PosterChildIconName) ||
          OPTION_ICON_MAP[item.winningOptionId || ''] ||
          'stars-01',
      };
    });
  }, [state.decisionHistory]);

  useEffect(() => {
    const container = chatContentRef.current;
    if (!container) return;

    const scrollTimer = window.setTimeout(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }, 120);

    return () => window.clearTimeout(scrollTimer);
  }, [
    decisionHistory.length,
    state.activeDecisionId,
    state.decisionStatus,
    state.isVoteRevealed,
    isVotingActive,
    isVotedLocked,
    isResultState,
  ]);

  return (
    <main className="phone-app" aria-label="Postie Retreat Interface">
      {/* 1. Header with PosterChild / Postie branding & session badge */}
      <header className="phone-postie-header">
        <div className="phone-postie-header-left">
          <Logo size="sm" />
        </div>

        <div
          className="phone-postie-session-badge"
          title={`Session ${sessionId}`}
        >
          <span className="phone-postie-live-dot" />
          <span>Session {sessionId}</span>
        </div>
      </header>

      {/* 2. Scrollable conversation & voting stack */}
      <section
        ref={chatContentRef}
        className="phone-postie-content"
      >
        {decisionHistory.map((item, index) => (
          <div
            key={`${item.decisionId}-${item.resolvedAt ?? index}`}
            className="phone-postie-history-block"
          >
            <div className="phone-postie-question-message">
              <div className="phone-postie-question-meta">
                <div className="phone-postie-question-author">
                  <PostieAnimatedIcon
                    size={20}
                    speed="ambient"
                    interactive={false}
                  />
                  <span>Postie</span>
                </div>

                <span className="phone-postie-question-time">
                  {item.resolvedAt
                    ? new Date(item.resolvedAt).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                    })
                    : 'Earlier'}
                </span>
              </div>

              <div className="phone-postie-question-bubble">
                <p>{item.question}</p>
              </div>
            </div>

            <div className="pc-retreat-team-choice">
              <div className="pc-retreat-team-choice-header">
                <span>Team Choice</span>
                <span className="pc-retreat-team-choice-time">
                  {item.resolvedAt
                    ? new Date(item.resolvedAt).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                    })
                    : 'Earlier'}
                </span>
              </div>

              <div className="pc-retreat-team-choice-card">
                <div className="pc-retreat-team-choice-icon">
                  {renderJoinChoiceIcon(
                    item.winningOptionId,
                    item.winningIcon
                  )}
                </div>

                <div className="pc-retreat-team-choice-content">
                  <div className="pc-retreat-team-choice-title">
                    {item.winningLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isWaitingState && (
          <div className="phone-postie-waiting-screen">
            <div className="phone-postie-waiting-identity">
              <PostieAnimatedIcon size={30} speed="ambient" interactive={false} />
              <span className="phone-postie-waiting-name">Postie</span>

              <div className="pc-ref-postie-compact-beta">
                <span className="pc-ref-compact-dot" />
                <span className="pc-ref-compact-beta-text">BETA</span>
              </div>
            </div>

            <div className="phone-postie-connected-card">
              <div className="phone-postie-connected-icon">
                <PosterChildIcon
                  name="check-circle"
                  size={20}
                  strokeWidth={1.8}
                />
              </div>

              <div className="phone-postie-connected-copy">
                <h1>You’re connected.</h1>
                <p>
                  Waiting for the next question from the presenter.
                  When a decision begins, your choice will appear right here.
                </p>
              </div>
            </div>

            <div className="phone-postie-waiting-status">
              <div className="phone-postie-presence-tag">
                <span className="phone-postie-pulse-dot" />
                <span>Connected to retreat session {sessionId}</span>
              </div>

              <p className="phone-postie-screen-hint">
                Look at the big screen to follow along
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
            <div className="phone-postie-question-message">
              <div className="phone-postie-question-meta">
                <div className="phone-postie-question-author">
                  <PostieAnimatedIcon size={20} speed="ambient" interactive={false} />
                  <span>Postie</span>
                </div>

                <span className="phone-postie-question-time">
                  Just now
                </span>
              </div>

              <div className="phone-postie-question-bubble">
                <p>
                  {isTie ? 'Tie-breaker vote' : activeDecision.question}
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
            <div className="phone-postie-status-wrap">
              <div className="phone-postie-holding-note">
                <PosterChildIcon
                  name="stars-01"
                  size={15}
                  color="#D99A00"
                  strokeWidth={2}
                />
                <span>Presenter is advancing to this destination on screen ✨</span>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* 3. Bottom Postie Composer Area (Disabled, ambient status indicator) */}

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
    </main >
  );
}