import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HomeWorkspace from '../components/HomeWorkspace';
import PostiePanel from '../components/PostiePanel';
import Logo from '../components/Logo';
import QRPlaceholder from '../components/QRPlaceholder';
import { useDemoState } from '../useDemoState';
import { PosterChildIcon } from '../components/posterchild/Icon';
import { SidebarProvider } from '../context/SidebarContext';
import { PostieProvider } from '../context/PostieContext';
import { getDecision, buildDestinationUrl } from '../config/retreatDecisions';
import { getMissionByOption, canRevealManage, RETREAT_MAX_MISSIONS, RETREAT_CONFIG } from '../config/retreatFlow';

const WINNER_TITLES: Record<string, string> = {
  stories: '3 stories ready for review',
  campaign: 'A campaign is ready to launch',
  campaigns: 'A campaign is ready to launch',
  quotes: '5 strong quotes found in your content',
  'mayas-journey': 'Maya’s Journey',
  'youth-voices': 'Youth Voices Initiative',
  'community-gardens': 'Community Gardens Impact',
  launch: 'Launch campaign',
  refine: 'Refine first',
  'ask-postie': 'Ask Postie',
  'needs-attention': 'See what needs attention',
  'create-story': 'Create a new story',
  'new-testimonials': 'Explore new testimonials',
  'suggested-story': 'View the suggested story',
  'review-opportunity': 'Review opportunity',
  'review-requirements': 'Review requirements',
  'strengthen-application': 'Strengthen application',
  'review-theme': 'Review the theme',
  'use-in-story': 'Use responses in a story',
  social: 'Social media',
  article: 'Article'
};

export default function Present() {
  const { state, dispatch, sessionId } = useDemoState();
  const navigate = useNavigate();
  const location = useLocation();
  const totalJoined = state.joinedParticipants;
  const totalVotes = Object.values(state.votes || {}).reduce((a, b) => a + b, 0);

  const lastPathRef = useRef(location.pathname);

  // Sync active decision ONLY when the presenter genuinely navigates to a new route
  useEffect(() => {
    if (lastPathRef.current === location.pathname) {
      return;
    }
    lastPathRef.current = location.pathname;

    const path = location.pathname;
    if (path.includes('/raise/opportunities/kresge')) {
      dispatch({ type: 'SET_DECISION', decisionId: 'kresge-next-action' });
    } else if (path.includes('/tell/connect')) {
      dispatch({ type: 'SET_DECISION', decisionId: 'connect-next-action' });
    } else if (path.includes('/tell/stories/review')) {
      dispatch({ type: 'SET_DECISION', decisionId: 'story-output' });
    } else if (path.includes('/tell/stories') && !path.includes('/review') && !path.includes('/create')) {
      dispatch({ type: 'SET_DECISION', decisionId: 'stories-next' });
    } else if (path.includes('/tell/quotes') && !path.includes('/action')) {
      dispatch({ type: 'SET_DECISION', decisionId: 'quotes-next' });
    } else if (path.includes('/raise') && !path.includes('/launch')) {
      dispatch({ type: 'SET_DECISION', decisionId: 'campaigns-next' });
    }
  }, [location.pathname, dispatch]);

  const isHome = location.pathname === `/present/${sessionId}` || location.pathname === `/present/${sessionId}/` || location.pathname === '/present' || location.pathname === '/present/';
  const isManage = location.pathname.includes('/manage');
  const isNextSteps = location.pathname.includes('/next-steps');
  const isMissionActive = !isHome && !isManage && !isNextSteps;
  const completedMissions = state.completedMissionIds || [];
  const hasCompletedTwoMissions = canRevealManage(state);

  const activeDecision = getDecision(state.activeDecisionId);
  const winningOption = state.winningOptionId
    ? activeDecision.options.find((o) => o.id === state.winningOptionId)
    : (state.winner ? activeDecision.options.find((o) => o.id === state.winner || (o.id === 'campaigns' && state.winner === 'campaign')) : null);

  const winnerDestination = winningOption ? buildDestinationUrl(winningOption.destination, sessionId) : null;

  const advanceToWinner = () => {
    if (winnerDestination) {
      const mission = getMissionByOption(winningOption?.id);
      if (mission) {
        dispatch({ type: 'START_MISSION', missionId: mission.id });
      }
      if (activeDecision.nextDecisionId) {
        dispatch({ type: 'SET_DECISION', decisionId: activeDecision.nextDecisionId });
      }
      navigate(winnerDestination);
    }
  };

  const returnToHome = () => {
    let missionIdToComplete = state.currentMissionId;
    if (!missionIdToComplete) {
      if (location.pathname.includes('/raise/opportunities/kresge')) {
        missionIdToComplete = 'kresge-funding';
      } else if (location.pathname.includes('/tell/connect')) {
        missionIdToComplete = 'new-testimonials-connect';
      } else if (location.pathname.includes('/tell/stories/review')) {
        missionIdToComplete = 'youth-career-story';
      } else if (location.pathname.includes('/tell/stories/create')) {
        missionIdToComplete = 'create-story-flow';
      }
    }
    if (missionIdToComplete) {
      dispatch({ type: 'COMPLETE_MISSION', missionId: missionIdToComplete });
    }
    dispatch({ type: 'RETURN_HOME' });
    navigate(`/present/${sessionId}`);
  };

  const completeMission = () => {
    const activeMissionId = state.currentMissionId || (winningOption ? getMissionByOption(winningOption.id)?.id : undefined) || 'kresge-funding';
    dispatch({ type: 'COMPLETE_MISSION', missionId: activeMissionId });
  };

  const revealManage = () => {
    dispatch({ type: 'REVEAL_MANAGE' });
    navigate(`/present/${sessionId}/manage`);
  };

  const goToNextSteps = () => {
    navigate(`/present/${sessionId}/next-steps`);
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://posterchild-retreat.web.app';
  const host = typeof window !== 'undefined' ? window.location.host : 'posterchild-retreat.web.app';
  const joinUrl = `${origin}/join/${sessionId}`;
  const displayUrl = `${host}/join/${sessionId}`;

  const goDashboard = () => dispatch({ type: 'SET_SCENE', scene: 'dashboard' });
  const startVoting = () => dispatch({ type: 'SET_SCENE', scene: 'voting' });
  const endVoting = () => dispatch({ type: 'END_VOTING' });
  const reset = () => dispatch({ type: 'RESET' });

  // Safe reset state with 3-second confirmation window to prevent accidental live resets
  const [resetConfirming, setResetConfirming] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const triggerReset = () => {
    if (resetConfirming) {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      setResetConfirming(false);
      reset();
      navigate(`/present/${sessionId}`);
    } else {
      setResetConfirming(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        setResetConfirming(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  // Keyboard navigation for seamless presenter flow without cursor distraction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'BUTTON'].includes(target?.tagName) || target?.closest('button')) return;

      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (resetConfirming) setResetConfirming(false);
        if (state.scene === 'join') goDashboard();
        else if (isHome && hasCompletedTwoMissions && (state.scene === 'dashboard' || state.decisionStatus === 'idle')) {
          if (RETREAT_CONFIG.manageRevealEnabled) {
            revealManage();
          } else {
            goToNextSteps();
          }
        } else if (isManage) {
          goToNextSteps();
        } else if (isNextSteps) {
          // Stay on next steps, do not accidentally restart
          return;
        } else if (state.scene === 'dashboard' || state.decisionStatus === 'idle') {
          startVoting();
        } else if (state.scene === 'voting' || state.decisionStatus === 'open') {
          if (state.decisionStatus === 'tie') dispatch({ type: 'REVOTE_TIE' });
          else endVoting();
        } else if (state.decisionStatus === 'closed' && !state.winningOptionId) {
          dispatch({ type: 'REOPEN_VOTING' });
        } else if (state.scene === 'result' || state.decisionStatus === 'result') {
          if (winnerDestination) advanceToWinner();
          else startVoting();
        }
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        triggerReset();
      } else if (e.key.toLowerCase() === 'h') {
        if (isMissionActive) {
          e.preventDefault();
          returnToHome();
        }
      } else if (e.key === 'Escape') {
        if (resetConfirming) {
          e.preventDefault();
          setResetConfirming(false);
          if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (resetConfirming) setResetConfirming(false);
        if (state.scene === 'result' || state.decisionStatus === 'result') startVoting();
        else if (state.scene === 'voting' || state.decisionStatus === 'open') goDashboard();
        else if (state.scene === 'dashboard' || state.decisionStatus === 'idle') dispatch({ type: 'SET_SCENE', scene: 'join' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.scene, state.decisionStatus, winnerDestination, resetConfirming, isHome, isManage, isNextSteps, isMissionActive, hasCompletedTwoMissions]);

  // Discreet presenter dock with low-emphasis auto-dim and room session tag
  const renderPresenterDock = (isInside = false) => (
    <div
      className={`presenter-dock ${isInside ? 'presenter-dock--inside' : ''} ${resetConfirming ? 'is-confirming' : ''}`}
      role="toolbar"
      aria-label="Presenter Controls"
    >
      {/* Presenter session & scene badge */}
      <div className="presenter-dock__session-tag" title="Active retreat session and current scene">
        <span className="session-tag__id">{sessionId}</span>
        <span className="session-tag__sep">/</span>
        <span className="session-tag__scene">{state.scene}</span>
        {state.decisionStatus !== 'idle' && (
          <>
            <span className="session-tag__sep">•</span>
            <span className="session-tag__scene" style={{ textTransform: 'capitalize' }}>{state.decisionStatus}</span>
          </>
        )}
        {completedMissions.length > 0 && (
          <>
            <span className="session-tag__sep">•</span>
            <span className="session-tag__scene" style={{ color: '#027A48' }}>
              {completedMissions.length}/{RETREAT_MAX_MISSIONS} Missions
            </span>
          </>
        )}
        <span className="session-tag__sep">•</span>
        <span className="session-tag__count">{totalJoined} {totalJoined === 1 ? 'joined' : 'joined'}</span>
      </div>

      <div className="presenter-dock__actions">
        <button
          className={`dock-button ${resetConfirming ? 'dock-button--confirm' : 'dock-button--ghost'}`}
          onClick={triggerReset}
          type="button"
          title={resetConfirming ? 'Click or press R again to confirm reset' : 'Safe Reset [R]'}
        >
          {resetConfirming ? (
            <>
              <PosterChildIcon name="alert-triangle" size={13} className="confirm-icon" />
              <span>Confirm?</span>
              <kbd className="dock-kbd dock-kbd--alert">R</kbd>
            </>
          ) : (
            <>
              <RotateCcw size={13} />
              <span>Reset</span>
              <kbd className="dock-kbd">R</kbd>
            </>
          )}
        </button>

        {state.scene === 'join' && (
          <button className="dock-button dock-button--primary" onClick={goDashboard} type="button">
            <span>Enter product</span>
            <PosterChildIcon name="arrow-right" size={13} />
            <kbd className="dock-kbd">Space</kbd>
          </button>
        )}

        {/* Home Controls */}
        {isHome && state.scene !== 'join' && (
          <>
            {hasCompletedTwoMissions && (state.scene === 'dashboard' || state.decisionStatus === 'idle') ? (
              <button className="dock-button dock-button--primary" onClick={revealManage} type="button">
                <span>Reveal how PosterChild knows all of this</span>
                <PosterChildIcon name="arrow-right" size={13} />
                <kbd className="dock-kbd">Space</kbd>
              </button>
            ) : (
              <>
                {(state.scene === 'dashboard' || state.decisionStatus === 'idle') && (
                  <button className="dock-button dock-button--primary" onClick={startVoting} type="button">
                    <span>Ask the room</span>
                    <PosterChildIcon name="arrow-right" size={13} />
                    <kbd className="dock-kbd">Space</kbd>
                  </button>
                )}

                {(state.scene === 'voting' || state.decisionStatus === 'open') && state.decisionStatus !== 'tie' && (
                  <button className="dock-button dock-button--primary" onClick={endVoting} type="button">
                    <span>Reveal team choice</span>
                    <PosterChildIcon name="arrow-right" size={13} />
                    <kbd className="dock-kbd">Space</kbd>
                  </button>
                )}

                {state.decisionStatus === 'tie' && (
                  <button className="dock-button dock-button--primary" onClick={() => dispatch({ type: 'REVOTE_TIE' })} type="button" style={{ background: '#B54708', borderColor: '#B54708' }}>
                    <RotateCcw size={13} />
                    <span>Re-vote Tied Options</span>
                    <kbd className="dock-kbd">Space</kbd>
                  </button>
                )}

                {state.decisionStatus === 'closed' && !state.winningOptionId && (
                  <button className="dock-button dock-button--primary" onClick={() => dispatch({ type: 'REOPEN_VOTING' })} type="button">
                    <RotateCcw size={13} />
                    <span>Reopen voting</span>
                    <kbd className="dock-kbd">Space</kbd>
                  </button>
                )}

                {(state.scene === 'result' || state.decisionStatus === 'result') && (
                  <>
                    {winnerDestination && (
                      <button className="dock-button dock-button--primary" onClick={advanceToWinner} type="button">
                        <span>Advance to {winningOption?.label || 'Winner'}</span>
                        <PosterChildIcon name="arrow-right" size={13} />
                        <kbd className="dock-kbd">Space</kbd>
                      </button>
                    )}
                    <button className="dock-button dock-button--ghost" onClick={startVoting} type="button">
                      <span>Vote again</span>
                    </button>
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Mission Active Controls */}
        {isMissionActive && (
          <>
            {(state.scene === 'dashboard' || state.decisionStatus === 'idle') && (
              <>
                {completedMissions.includes('kresge-funding') ? (
                  <button className="dock-button dock-button--primary" onClick={returnToHome} type="button">
                    <PosterChildIcon name="arrow-left" size={13} />
                    <span>Return to Home</span>
                    <kbd className="dock-kbd">H</kbd>
                  </button>
                ) : (
                  <>
                    <button className="dock-button dock-button--primary" onClick={startVoting} type="button">
                      <span>Ask the room</span>
                      <PosterChildIcon name="arrow-right" size={13} />
                      <kbd className="dock-kbd">Space</kbd>
                    </button>
                    <button className="dock-button dock-button--ghost" onClick={returnToHome} type="button">
                      <PosterChildIcon name="arrow-left" size={13} />
                      <span>Return to Home</span>
                      <kbd className="dock-kbd">H</kbd>
                    </button>
                  </>
                )}
              </>
            )}

            {(state.scene === 'voting' || state.decisionStatus === 'open') && state.decisionStatus !== 'tie' && (
              <>
                <button className="dock-button dock-button--primary" onClick={endVoting} type="button">
                  <span>Reveal team choice</span>
                  <PosterChildIcon name="arrow-right" size={13} />
                  <kbd className="dock-kbd">Space</kbd>
                </button>
                <button className="dock-button dock-button--ghost" onClick={returnToHome} type="button">
                  <PosterChildIcon name="arrow-left" size={13} />
                  <span>Return to Home</span>
                  <kbd className="dock-kbd">H</kbd>
                </button>
              </>
            )}

            {state.decisionStatus === 'tie' && (
              <>
                <button className="dock-button dock-button--primary" onClick={() => dispatch({ type: 'REVOTE_TIE' })} type="button" style={{ background: '#B54708', borderColor: '#B54708' }}>
                  <RotateCcw size={13} />
                  <span>Re-vote Tied Options</span>
                  <kbd className="dock-kbd">Space</kbd>
                </button>
                <button className="dock-button dock-button--ghost" onClick={returnToHome} type="button">
                  <PosterChildIcon name="arrow-left" size={13} />
                  <span>Return to Home</span>
                  <kbd className="dock-kbd">H</kbd>
                </button>
              </>
            )}

            {(state.scene === 'result' || state.decisionStatus === 'result') && (
              <>
                <button className="dock-button dock-button--primary" onClick={completeMission} type="button">
                  <span>Complete Mission</span>
                  <PosterChildIcon name="check" size={13} />
                  <kbd className="dock-kbd">Space</kbd>
                </button>
                <button className="dock-button dock-button--ghost" onClick={startVoting} type="button">
                  <span>Vote again</span>
                </button>
                <button className="dock-button dock-button--ghost" onClick={returnToHome} type="button">
                  <PosterChildIcon name="arrow-left" size={13} />
                  <span>Return to Home</span>
                  <kbd className="dock-kbd">H</kbd>
                </button>
              </>
            )}
          </>
        )}

        {/* Manage Reveal Controls */}
        {isManage && (
          <>
            <button className="dock-button dock-button--primary" onClick={goToNextSteps} type="button">
              <span>Continue to Next Steps</span>
              <PosterChildIcon name="arrow-right" size={13} />
              <kbd className="dock-kbd">Space</kbd>
            </button>
            <button className="dock-button dock-button--ghost" onClick={returnToHome} type="button">
              <span>Return to Home</span>
            </button>
          </>
        )}

        {/* Closing / Next Steps Controls */}
        {isNextSteps && (
          <>
            <button className="dock-button dock-button--ghost" onClick={returnToHome} type="button">
              <span>Return to Home</span>
            </button>
            <button
              className={`dock-button ${resetConfirming ? 'dock-button--confirm' : 'dock-button--ghost'}`}
              onClick={triggerReset}
              type="button"
              title={resetConfirming ? 'Click or press R again to confirm restart' : 'Restart experience [R]'}
            >
              {resetConfirming ? (
                <>
                  <PosterChildIcon name="alert-triangle" size={13} className="confirm-icon" />
                  <span>Confirm Restart?</span>
                  <kbd className="dock-kbd dock-kbd--alert">R</kbd>
                </>
              ) : (
                <>
                  <RotateCcw size={13} />
                  <span>Restart experience</span>
                  <kbd className="dock-kbd">R</kbd>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );

  // 1. Join Scene
  if (state.scene === 'join') {
    return (
      <main className="present-intro">
        <div className="present-intro__topbar">
          <div className="brand-badge">
            <Logo size="sm" />
            <span className="brand-badge__divider">/</span>
            <span className="brand-badge__context">Retreat 2026</span>
          </div>
          <div className="session-status-pill">
            <span className="session-status-pill__dot" />
            <span>Interactive Session Active</span>
          </div>
        </div>

        <div className="present-intro__content">
          <div className="present-intro__copy">
            <span className="section-eyebrow">Product Vision Experience</span>
            <h1 className="present-intro__title">
              The future of<br />
              <span className="title-highlight">PosterChild</span>
            </h1>
            <p className="present-intro__subtitle">
              An interactive product experience grounded in Postie.
            </p>

            <div className="present-intro__guidance">
              <div className="guidance-step">
                <span className="guidance-step__num">1</span>
                <span>Join from your phone</span>
              </div>
              <div className="guidance-step__arrow">→</div>
              <div className="guidance-step">
                <span className="guidance-step__num">2</span>
                <span>See what PosterChild surfaces</span>
              </div>
              <div className="guidance-step__arrow">→</div>
              <div className="guidance-step">
                <span className="guidance-step__num">3</span>
                <span>Help choose what happens first</span>
              </div>
            </div>
          </div>

          <div className="join-panel">
            <div className="join-panel__card">
              <QRPlaceholder url={joinUrl} />

              <div className="join-panel__details">
                <span className="join-panel__instruction">Scan with your camera to join</span>
                <strong className="join-panel__url">{displayUrl}</strong>
              </div>

              <div className="join-panel__presence">
                <div className="presence-dot">
                  <span className="presence-dot__ping" />
                  <span className="presence-dot__core" />
                </div>
                <strong>{totalJoined} {totalJoined === 1 ? 'person joined' : 'people joined'}</strong>
              </div>
            </div>
          </div>
        </div>

        {renderPresenterDock(false)}
      </main>
    );
  }

  // 2. Reference-driven Desktop Application Shell (1440px, posterchild-home-reference.txt)
  const winnerTitle = winningOption?.label || (state.winner ? WINNER_TITLES[state.winner] || state.winner : undefined);

  return (
    <SidebarProvider>
      <PostieProvider>
        <div className="pc-ref-app-viewport">
          <div className="pc-ref-app-frame">
            {/* Sidebar Region: 280px (expanded) / 64px (collapsed) */}
            <Sidebar activeTab="home" />

            {/* App Content — Home: fluid width */}
            <div className="pc-ref-app-content">
              {/* Main Content Column */}
              <main className="pc-ref-main-content">
                <Outlet
                  context={{
                    scene: state.scene,
                    decisionStatus: state.decisionStatus,
                    activeDecisionId: state.activeDecisionId,
                    votes: state.votes,
                    participantVotes: state.participantVotes,
                    totalVotes,
                    winner: state.winner,
                    winningOptionId: state.winningOptionId,
                    tiedOptionIds: state.tiedOptionIds,
                    winningOption,
                    winnerDestination,
                    advanceToWinner
                  }}
                />
              </main>

              {/* Persistent Right Postie Panel: 360px docked, 400x460 floating, or 40x40 launcher */}
              <PostiePanel
                scene={state.scene}
                winnerTitle={winnerTitle}
                decisionStatus={state.decisionStatus}
                activeDecisionId={state.activeDecisionId}
              />
            </div>
          </div>

          {/* Discreet Presenter Controls Dock */}
          {renderPresenterDock(true)}
        </div>
      </PostieProvider>
    </SidebarProvider>
  );
}