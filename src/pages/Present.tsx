import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import PostiePanel from '../components/PostiePanel';
import Logo from '../components/Logo';
import QRPlaceholder from '../components/QRPlaceholder';
import { useDemoState } from '../useDemoState';
import { PosterChildIcon, PosterChildIconName } from '../components/posterchild/Icon';
import { SidebarProvider } from '../context/SidebarContext';
import { PostieProvider, usePostie } from '../context/PostieContext';
import RetreatVoteReveal from '../components/retreat/RetreatVoteReveal';
import { getDecision, getDecisionTallies, buildDestinationUrl, type DecisionOption } from '../config/retreatDecisions';
import { getMissionByOption, getAvailableHomeOptions, canRevealManage, RETREAT_MAX_MISSIONS, RETREAT_CONFIG } from '../config/retreatFlow';

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
  'suggested-story': 'View suggested story',
  'review-opportunity': 'Review opportunity',
  'review-requirements': 'View Action Plan',
  'use-in-story': 'Use this in a story',
  social: 'Social Media',
  article: 'Article'
};

function PresentInner() {
  const { state, dispatch, sessionId } = useDemoState();
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerPrompt, openPostie, resetAllConversations, addRetreatEvent, replaceRetreatEvent, removeRetreatEvent, clearRetreatTimeline, retreatTimeline, hasRetreatTimelineEventOfType, getRetreatEventOfType } = usePostie();

  const totalJoined = state.joinedParticipants;
  const totalVotes = Object.values(state.votes || {}).reduce((a, b) => a + b, 0);

  const lastPathRef = useRef(location.pathname);

  // Floating reveal dismissed state & Postie prompt triggered tracker
  const [revealDismissed, setRevealDismissed] = useState(false);
  const [postiePromptTriggered, setPostiePromptTriggered] = useState(false);

  // Deterministic 4-second reveal auto-dismiss timer — owned here, not inside RetreatVoteReveal.
  // Cleared on startVoting, endVoting (restart), and reset.
  const revealTimerRef = useRef<number | null>(null);

  const startRevealTimer = () => {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    revealTimerRef.current = window.setTimeout(() => {
      setRevealDismissed(true);
    }, 4000);
  };

  const clearRevealTimer = () => {
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  };

  // Clean up reveal timer on unmount
  useEffect(() => {
    return () => clearRevealTimer();
  }, []);

  // Sync active decision ONLY when the presenter genuinely navigates to a new route
  useEffect(() => {
    if (lastPathRef.current === location.pathname) {
      return;
    }
    lastPathRef.current = location.pathname;

    setRevealDismissed(false);
    setPostiePromptTriggered(false);

    const path = location.pathname;
    if (path.includes('/raise/opportunities/kresge')) {
      dispatch({ type: 'SET_DECISION', decisionId: 'kresge-next-action' });
    } else if (path.includes('/tell/connect')) {
      dispatch({ type: 'SET_DECISION', decisionId: 'connect-next-action' });
    } else if (path.includes('/tell/stories/review')) {
      dispatch({ type: 'SET_DECISION', decisionId: 'story-output' });
    } else if (
      path === `/present/${sessionId}` ||
      path === `/present/${sessionId}/` ||
      path === '/present' ||
      path === '/present/'
    ) {
      dispatch({ type: 'SET_DECISION', decisionId: 'home-focus' });
    }
  }, [location.pathname, dispatch, sessionId]);

  const isHome = location.pathname === `/present/${sessionId}` || location.pathname === `/present/${sessionId}/` || location.pathname === '/present' || location.pathname === '/present/';
  const isManage = location.pathname.includes('/manage');
  const isNextSteps = location.pathname.includes('/next-steps');
  const isMissionActive = !isHome && !isManage && !isNextSteps;
  const completedMissions = state.completedMissionIds || [];
  const hasCompletedTwoMissions = canRevealManage(state);

  const activeDecision = React.useMemo(() => {
    const base = getDecision(state.activeDecisionId);
    if (state.activeDecisionId === 'home-focus') {
      return {
        ...base,
        options: getAvailableHomeOptions(state)
      };
    }
    return base;
  }, [state.activeDecisionId, state.completedMissionIds]);

  const tallies = getDecisionTallies({ votes: state.votes, participantVotes: state.participantVotes }, activeDecision);

  const winningOption = state.winningOptionId
    ? activeDecision.options.find((o) => o.id === state.winningOptionId)
    : (state.winner ? activeDecision.options.find((o) => o.id === state.winner || (o.id === 'campaigns' && state.winner === 'campaign')) : null);

  const isRevealed = Boolean(state.isVoteRevealed);
  const winnerVoteCount = winningOption ? tallies.options[winningOption.id]?.count || 0 : 0;
  const winnerPercentage = totalVotes > 0 ? Math.round((winnerVoteCount / totalVotes) * 100) : 0;

  const tiedOptions = state.tiedOptionIds
    ? activeDecision.options.filter((o) => state.tiedOptionIds!.includes(o.id))
    : [];
  const tiedVoteCount = tiedOptions.length > 0 ? tallies.options[tiedOptions[0].id]?.count || 0 : 0;

  const winnerDestination = winningOption ? buildDestinationUrl(winningOption.destination, sessionId) : null;

  // When a vote is revealed:
  // 1. Append team-choice event (idempotent).
  // 2. If winner's actionType is 'openPostie', also append ask-postie-pending event
  //    with the contextual question — the presenter must explicitly click to send it.
  useEffect(() => {
    if (!isRevealed || !winningOption) return;

    openPostie();

    const currentDecId = isHome && (state.completedMissionIds || []).length > 0 ? 'home-focus-2' : (state.activeDecisionId || 'home-focus');

    // --- team-choice (idempotent by winningOption.id and decisionId) ---
    const alreadyLogged = hasRetreatTimelineEventOfType('team-choice', winningOption.id, currentDecId);
    if (!alreadyLogged) {
      const voteNoun = totalVotes === 1 ? 'vote' : 'votes';
      const meta = totalVotes > 0
        ? `${winnerVoteCount} of ${totalVotes} ${voteNoun} · ${winnerPercentage}%`
        : undefined;

      addRetreatEvent({
        type: 'team-choice',
        title: winningOption.label,
        meta,
        decisionId: currentDecId
      });
    }

    if (winningOption.actionType === 'openPostie') {
      // Ask Postie won the room vote:
      // respond immediately instead of repeating the question
      // or requiring another Ask Postie click.

      const alreadyAnswered = hasRetreatTimelineEventOfType(
        'postie-response',
        undefined,
        currentDecId
      );

      if (!alreadyAnswered) {
        const question = getCanonicalPromptForScreen();
        const response = getAskPostieRetreatResponse();

        addRetreatEvent({
          type: 'postie-response',
          title: question,
          body: response.text,
          decisionId: currentDecId,
          ctaLabel: response.ctaLabel,
          ctaTarget: response.ctaTarget
        });
      }
    } else {
      // --- next-step shared across all non-Postie winning options ---
      const alreadyHasNextStep = hasRetreatTimelineEventOfType('next-step', undefined, currentDecId);
      if (!alreadyHasNextStep) {
        const explanation = winningOption.nextStepExplanation || winningOption.description || `Continue with ${winningOption.label}`;
        const ctaLabel = winningOption.nextStepCtaLabel || winningOption.label;
        const targetUrl = buildDestinationUrl(winningOption.destination, sessionId);

        addRetreatEvent({
          type: 'next-step',
          title: explanation,
          ctaLabel,
          ctaTarget: targetUrl,
          decisionId: currentDecId
        });
      }
    }
  }, [isRevealed, winningOption?.id, state.activeDecisionId]);

  const isCurrentScreenMissionCompleted = () => {
    const completed = state.completedMissionIds || [];
    if (location.pathname.includes('/raise/opportunities/kresge')) {
      return completed.includes('kresge-funding') || completed.includes('kresge-postie');
    }
    if (location.pathname.includes('/tell/connect')) {
      return completed.includes('new-testimonials-connect');
    }
    if (location.pathname.includes('/tell/stories/review')) {
      return completed.includes('youth-career-story');
    }
    if (isHome) {
      return completed.length >= 2;
    }
    return false;
  };

  const getCanonicalPromptForScreen = () => {
    if (isHome) {
      const hasCompleted = (state.completedMissionIds || []).length > 0;
      return hasCompleted ? 'What should we do now?' : 'What should we do first today?';
    }
    if (location.pathname.includes('/tell/connect')) {
      return 'What are we hearing from our community?';
    }
    if (location.pathname.includes('/tell/stories/review')) {
      return 'How should we use this story?';
    }
    if (location.pathname.includes('/raise/opportunities/kresge')) {
      return 'What should we do next with this opportunity?';
    }
    const hasCompleted = (state.completedMissionIds || []).length > 0;
    return hasCompleted ? 'What should we do now?' : 'What should we do first today?';
  };

  const getAskPostieRetreatResponse = (): { text: string; ctaLabel?: string; ctaTarget?: string; usedContext: string[] } => {
    // Returns context-aware Postie answer for the current retreat decision, using decision question as input
    if (isHome) {
      const completed = state.completedMissionIds || [];
      const isKresgeCompleted = completed.includes('kresge-funding') || completed.includes('kresge-postie');

      if (isKresgeCompleted) {
        return {
          text: "Since we've already reviewed the Kresge opportunity, I recommend exploring our Youth Career Pathways suggested story next. It has high community resonance and is ready for campaign activation.",
          ctaLabel: 'Review story',
          ctaTarget: `/present/${sessionId}/tell/stories/review?story=youth-career-pathways&tab=social`,
          usedContext: ['Home', 'Youth Career Pathways', 'Story Review']
        };
      }

      return {
        text: "I'd start with the Kresge Foundation opportunity. It closes in 12 days, has a 92% match, and the application is ready for review. Your main readiness gap is the workforce program budget.",
        ctaLabel: 'Review opportunity',
        ctaTarget: `/present/${sessionId}/raise/opportunities/kresge`,
        usedContext: ['Home', 'Kresge Foundation', 'Needs Attention']
      };
    }
    if (location.pathname.includes('/tell/connect')) {
      return {
        text: "Transportation appears across several recent Youth Career Pathways responses. I'd use this signal to strengthen the narrative and gather one more layer of detail before publishing.",
        ctaLabel: 'Use in story',
        ctaTarget: `/present/${sessionId}/tell/stories/review?story=youth-career-pathways&tab=social`,
        usedContext: ['Connect', 'Youth Career Pathways', 'Testimonials']
      };
    }
    if (location.pathname.includes('/raise/opportunities/kresge')) {
      return {
        text: "I’d open the Action Plan next. Kresge is a strong fit, and the plan shows the remaining work, key talking points, and what should happen before the deadline.",
        ctaLabel: 'View Action Plan',
        ctaTarget: `/present/${sessionId}/raise/opportunities/kresge?tab=action-plan`,
        usedContext: ['Kresge Foundation', 'Action Plan', '92% Match']
      };
    }
    if (location.pathname.includes('/tell/stories/review')) {
      return {
        text: "Youth Career Pathways is ready for publishing. The social carousel is the fastest high-resonance channel for this story.",
        ctaLabel: 'Open Social Media',
        ctaTarget: `/present/${sessionId}/tell/stories/review?story=youth-career-pathways&tab=social`,
        usedContext: ['Youth Career Pathways', 'Social Media']
      };
    }
    return {
      text: "I'd start with the Kresge Foundation opportunity — it has the strongest urgency and match for your current priorities.",
      ctaLabel: 'Review opportunity',
      ctaTarget: `/present/${sessionId}/raise/opportunities/kresge`,
      usedContext: ['Home', 'Kresge Foundation']
    };
  };

  const handleAskPostieAction = () => {
    openPostie();
    setPostiePromptTriggered(true);

    const currentDecisionId = isHome && (state.completedMissionIds || []).length > 0 ? 'home-focus-2' : (state.activeDecisionId || 'home-focus');
    const alreadyAnswered = hasRetreatTimelineEventOfType('postie-response', undefined, currentDecisionId);
    if (alreadyAnswered) return;

    const question = getCanonicalPromptForScreen();
    const response = getAskPostieRetreatResponse();

    addRetreatEvent({
      type: 'postie-response',
      title: question,
      body: response.text,
      decisionId: currentDecisionId,
      ctaLabel: response.ctaLabel,
      ctaTarget: response.ctaTarget
    });
  };

  const MISSION_LABELS: Record<string, string> = {
    'kresge-funding': 'Kresge Foundation opportunity reviewed.',
    'kresge-postie': 'Kresge Foundation opportunity reviewed.',
    'new-testimonials-connect': 'Transportation signal connected to Youth Career Pathways.',
    'youth-career-story': 'Youth Career Pathways story reviewed/published.'
  };

  const completeMission = (specificMissionId?: string) => {
    let activeMissionId = specificMissionId || state.currentMissionId;
    if (!activeMissionId) {
      if (location.pathname.includes('/raise/opportunities/kresge')) {
        activeMissionId = 'kresge-funding';
      } else if (location.pathname.includes('/tell/connect')) {
        activeMissionId = 'new-testimonials-connect';
      } else if (location.pathname.includes('/tell/stories/review')) {
        activeMissionId = 'youth-career-story';
      } else if (winningOption) {
        activeMissionId = getMissionByOption(winningOption.id)?.id || 'kresge-funding';
      }
    }
    if (activeMissionId) {
      dispatch({ type: 'COMPLETE_MISSION', missionId: activeMissionId });

      // Log to retreat timeline — idempotent
      const alreadyLogged = hasRetreatTimelineEventOfType('action-completed', activeMissionId) ||
        hasRetreatTimelineEventOfType('mission-completed', activeMissionId);
      if (!alreadyLogged) {
        const isFinalMission = (state.completedMissionIds || []).length + 1 >= 2;
        addRetreatEvent({
          type: isFinalMission ? 'mission-completed' : 'action-completed',
          title: MISSION_LABELS[activeMissionId] || `${activeMissionId} completed.`,
          decisionId: state.activeDecisionId || undefined
        });

        if (activeMissionId === 'kresge-funding' || activeMissionId === 'kresge-postie' || activeMissionId === 'youth-career-story') {
          addRetreatEvent({
            type: 'next-step',
            title: activeMissionId === 'youth-career-story'
              ? 'Youth Career Pathways story reviewed. Ready to return to Home?'
              : 'Kresge action plan reviewed. Ready to return to Home?',
            ctaLabel: 'Return to Home',
            ctaTarget: `/present/${sessionId}`
          });
        }
      }
    }
  };

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

  const executeDecisionAction = (option: DecisionOption) => {
    // If the mission on this screen is already completed, Continue smoothly returns to Home
    if (isMissionActive && isCurrentScreenMissionCompleted()) {
      returnToHome();
      return;
    }

    const actionType = option.actionType;

    if (actionType === 'openPostie') {
      const response = getAskPostieRetreatResponse();
      if (response.ctaTarget) {
        handleTimelineCta({
          id: 'postie-response-cta',
          type: 'postie-response',
          title: '',
          body: response.text,
          ctaLabel: response.ctaLabel,
          ctaTarget: response.ctaTarget
        });
      }
      return;
    }

    if (actionType === 'completeMission') {
      completeMission();
      return;
    }

    if (actionType === 'switchTab') {
      const destUrl = buildDestinationUrl(option.destination, sessionId);
      navigate(destUrl);
      if (location.pathname.includes('/tell/stories/review')) {
        completeMission('youth-career-story');
      } else {
        completeMission();
      }
      return;
    }

    if (actionType === 'navigate') {
      const destUrl = buildDestinationUrl(option.destination, sessionId);
      if (isHome) {
        if (option.id === 'suggested-story') {
          dispatch({ type: 'START_MISSION', missionId: 'youth-career-story' });
          dispatch({ type: 'SET_DECISION', decisionId: 'story-output' });
        } else {
          const mission = getMissionByOption(option.id);
          if (mission) {
            dispatch({ type: 'START_MISSION', missionId: mission.id });
          }
        }
      } else if (option.id === 'use-in-story') {
        dispatch({ type: 'COMPLETE_MISSION', missionId: 'new-testimonials-connect' });
        dispatch({ type: 'START_MISSION', missionId: 'youth-career-story' });
      } else if (option.id === 'review-requirements') {
        completeMission('kresge-funding');
      }
      navigate(destUrl);
      return;
    }

    if (winnerDestination) {
      advanceToWinner();
    } else {
      completeMission();
    }
  };

  const handleTimelineCta = (event: RetreatTimelineEvent) => {
    if (event.type === 'next-step') {
      if (event.ctaLabel === 'Return to Home' || event.ctaTarget === `/present/${sessionId}`) {
        returnToHome();
        return;
      }
      if (winningOption) {
        executeDecisionAction(winningOption);
        return;
      }
      if (event.ctaTarget) {
        navigate(event.ctaTarget);
        return;
      }
    }
    if (event.type === 'postie-response') {
      if (event.ctaTarget) {
        if (isHome) {
          if (event.ctaTarget.includes('/tell/stories/review')) {
            dispatch({ type: 'START_MISSION', missionId: 'youth-career-story' });
            dispatch({ type: 'SET_DECISION', decisionId: 'story-output' });
          } else if (event.ctaTarget.includes('/raise/opportunities/kresge')) {
            const mission = getMissionByOption('needs-attention') || getMissionByOption('ask-postie');
            if (mission) {
              dispatch({ type: 'START_MISSION', missionId: mission.id });
            }
          }
        } else if (location.pathname.includes('/raise/opportunities/kresge')) {
          if (event.ctaTarget.includes('tab=action-plan')) {
            completeMission('kresge-funding');
          }
        } else if (location.pathname.includes('/tell/stories/review')) {
          completeMission('youth-career-story');
        }
        navigate(event.ctaTarget);
      }
      return;
    }
  };

  const getContinueButtonLabel = (option: DecisionOption) => {
    if (isMissionActive && isCurrentScreenMissionCompleted()) {
      return 'Continue to Return to Home';
    }

    if (option.actionType === 'openPostie') {
      const response = getAskPostieRetreatResponse();
      if (response.ctaLabel) {
        return `Continue to ${response.ctaLabel}`;
      }
      return `Continue to ${option.label}`;
    }

    return `Continue to ${option.label}`;
  };

  const getContinueButtonIcon = (option: DecisionOption): PosterChildIconName => {
    if (isMissionActive && isCurrentScreenMissionCompleted()) {
      return 'arrow-left';
    }
    if (option.actionType === 'completeMission') return 'check';
    return 'arrow-right';
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
      }
    }
    if (missionIdToComplete) {
      dispatch({ type: 'COMPLETE_MISSION', missionId: missionIdToComplete });
    }
    setRevealDismissed(false);
    setPostiePromptTriggered(false);
    dispatch({ type: 'RETURN_HOME' });
    navigate(`/present/${sessionId}`);
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

  const startVoting = () => {
    setRevealDismissed(false);
    setPostiePromptTriggered(false);
    clearRevealTimer();

    let decisionIdToStart = state.activeDecisionId;
    if (isHome) {
      decisionIdToStart = 'home-focus';
    } else if (location.pathname.includes('/raise/opportunities/kresge')) {
      decisionIdToStart = 'kresge-next-action';
    } else if (location.pathname.includes('/tell/stories/review')) {
      decisionIdToStart = 'story-output';
    } else if (location.pathname.includes('/tell/connect')) {
      decisionIdToStart = 'connect-next-action';
    }

    if (decisionIdToStart) {
      dispatch({ type: 'SET_DECISION', decisionId: decisionIdToStart });
    }

    dispatch({ type: 'START_VOTING', decisionId: decisionIdToStart || undefined });
    dispatch({ type: 'SET_SCENE', scene: 'voting' });

    const question = getCanonicalPromptForScreen();
    const currentDecId = isHome && (state.completedMissionIds || []).length > 0 ? 'home-focus-2' : (decisionIdToStart || state.activeDecisionId || 'home-focus');

    const alreadyHasRoomQuestion = hasRetreatTimelineEventOfType('room-question', undefined, currentDecId);
    if (!alreadyHasRoomQuestion) {
      addRetreatEvent({
        type: 'room-question',
        title: question,
        decisionId: currentDecId
      });
    }

    openPostie();
  };

  const endVoting = () => {
    setRevealDismissed(false);
    setPostiePromptTriggered(false);
    dispatch({ type: 'END_VOTING' });
    startRevealTimer();
    openPostie();
  };

  const reset = () => dispatch({ type: 'RESET' });

  // Safe reset state with 3-second confirmation window to prevent accidental live resets
  const [resetConfirming, setResetConfirming] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const triggerReset = () => {
    if (resetConfirming) {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      setResetConfirming(false);
      setRevealDismissed(false);
      setPostiePromptTriggered(false);
      clearRevealTimer();
      resetAllConversations();
      clearRetreatTimeline();
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
          return;
        } else if (state.scene === 'dashboard' || state.decisionStatus === 'idle') {
          startVoting();
        } else if (state.scene === 'voting' || state.decisionStatus === 'open') {
          if (state.decisionStatus === 'tie') dispatch({ type: 'REVOTE_TIE' });
          else endVoting();
        } else if (state.decisionStatus === 'closed' && !state.winningOptionId) {
          dispatch({ type: 'REOPEN_VOTING' });
        } else if ((state.scene === 'result' || state.decisionStatus === 'result') && isRevealed) {
          if (winningOption) {
            executeDecisionAction(winningOption);
          } else {
            startVoting();
          }
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
  }, [state.scene, state.decisionStatus, winnerDestination, resetConfirming, isHome, isManage, isNextSteps, isMissionActive, hasCompletedTwoMissions, isRevealed, winningOption, postiePromptTriggered]);

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
                    <span>Ask room</span>
                    <PosterChildIcon name="arrow-right" size={13} />
                    <kbd className="dock-kbd">Space</kbd>
                  </button>
                )}

                {(state.scene === 'voting' || state.decisionStatus === 'open') && state.decisionStatus !== 'tie' && (
                  <button className="dock-button dock-button--primary" onClick={endVoting} type="button">
                    <span>Reveal vote</span>
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

                {(state.scene === 'result' || state.decisionStatus === 'result') && isRevealed && (
                  <>
                    {winningOption && (
                      <button
                        className="dock-button dock-button--ghost"
                        onClick={() => executeDecisionAction(winningOption)}
                        type="button"
                      >
                        <span>{getContinueButtonLabel(winningOption)}</span>
                        <PosterChildIcon name={getContinueButtonIcon(winningOption)} size={13} />
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
                <button className="dock-button dock-button--primary" onClick={startVoting} type="button">
                  <span>Ask room</span>
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

            {(state.scene === 'voting' || state.decisionStatus === 'open') && state.decisionStatus !== 'tie' && (
              <>
                <button className="dock-button dock-button--primary" onClick={endVoting} type="button">
                  <span>Reveal vote</span>
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

            {(state.scene === 'result' || state.decisionStatus === 'result') && isRevealed && (
              <>
                {winningOption && (
                  <button
                    className="dock-button dock-button--ghost"
                    onClick={() => executeDecisionAction(winningOption)}
                    type="button"
                  >
                    <span>{getContinueButtonLabel(winningOption)}</span>
                    <PosterChildIcon name={getContinueButtonIcon(winningOption)} size={13} />
                    <kbd className="dock-kbd">Space</kbd>
                  </button>
                )}
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
  const canAskRoom = (() => {
    if (isManage || isNextSteps || state.scene === 'join') return false;
    if (isCurrentScreenMissionCompleted()) return false;
    if (state.scene === 'voting' || state.decisionStatus === 'open') return false;
    if (isRevealed || state.scene === 'result' || state.decisionStatus === 'result') return false;
    return (state.scene === 'dashboard' || state.decisionStatus === 'idle');
  })();

  const winnerTitle = winningOption?.label || (state.winner ? WINNER_TITLES[state.winner] || state.winner : undefined);

  return (
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
                advanceToWinner,
                isVoteRevealed: isRevealed
              }}
            />
          </main>

          {/* Persistent Right Postie Panel: 360px docked, 400x460 floating, or 40x40 launcher */}
          <PostiePanel
            scene={state.scene}
            winnerTitle={winnerTitle}
            decisionStatus={state.decisionStatus}
            activeDecisionId={state.activeDecisionId}
            isVoteRevealed={isRevealed}
            winningOptionId={state.winningOptionId}
            onAskPostieClick={handleAskPostieAction}
            onTimelineCta={handleTimelineCta}
            onStartVoting={startVoting}
            onRevealVote={endVoting}
            canAskRoom={canAskRoom}
            roomQuestion={getCanonicalPromptForScreen()}
          />
        </div>
      </div>

      {/* Floating Retreat Vote Reveal Overlay */}
      {isRevealed && !revealDismissed && !isManage && !isNextSteps && state.scene !== 'join' && (
        <RetreatVoteReveal
          winningOption={winningOption}
          winnerTitle={winnerTitle}
          totalVotes={totalVotes}
          winnerVotes={state.decisionStatus === 'tie' ? tiedVoteCount : winnerVoteCount}
          percentage={winnerPercentage}
          isTie={state.decisionStatus === 'tie'}
          tiedOptions={tiedOptions}
          isZeroVotes={state.decisionStatus === 'closed' && !winningOption}
          autoDismissMs={0}
          onDismiss={() => setRevealDismissed(true)}
        />
      )}

      {/* Discreet Presenter Controls Dock */}
      {renderPresenterDock(true)}
    </div>
  );
}

export default function Present() {
  return (
    <SidebarProvider>
      <PostieProvider>
        <PresentInner />
      </PostieProvider>
    </SidebarProvider>
  );
}