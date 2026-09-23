import React from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { Scene, DecisionStatus } from '../types/session';
import AttentionTable from './AttentionTable';
import { Button } from './posterchild/Button';
import { PosterChildIcon } from './posterchild/Icon';
import { MetricCard } from './posterchild/MetricCard';
import { SuggestedStoryCard } from './posterchild/SuggestedStoryCard';
import { InsightBanner } from './posterchild/InsightBanner';
import { DecisionChoice } from './retreat/DecisionChoice';
import { getDecision, getDecisionTallies } from '../config/retreatDecisions';
import { RETREAT_CONFIG } from '../config/retreatFlow';
import { useDemoState } from '../useDemoState';
import headerLandscape from '../assets/screens/home/header-landscape.png';

interface HomeWorkspaceProps {
  scene?: Scene;
  decisionStatus?: DecisionStatus;
  activeDecisionId?: string;
  votes?: Record<string, number>;
  participantVotes?: Record<string, string>;
  totalVotes?: number;
  winner?: string | null;
  winningOptionId?: string | null;
  tiedOptionIds?: string[] | null;
  advanceToWinner?: () => void;
  isVoteRevealed?: boolean;
}

export default function HomeWorkspace(props: HomeWorkspaceProps) {
  const navigate = useNavigate();
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();
  const { state, dispatch } = useDemoState();
  const outletCtx = useOutletContext<HomeWorkspaceProps>() || {};
  const scene = props.scene ?? outletCtx.scene ?? state.scene ?? 'dashboard';
  const decisionStatus = props.decisionStatus ?? outletCtx.decisionStatus ?? state.decisionStatus ?? 'idle';
  const activeDecisionId = props.activeDecisionId ?? outletCtx.activeDecisionId ?? state.activeDecisionId ?? 'home-focus';
  const votes = props.votes ?? outletCtx.votes ?? state.votes ?? {};
  const participantVotes = props.participantVotes ?? outletCtx.participantVotes ?? state.participantVotes ?? {};
  const winner = props.winner ?? outletCtx.winner ?? state.winner ?? null;
  const winningOptionId = props.winningOptionId ?? outletCtx.winningOptionId ?? state.winningOptionId ?? null;
  const tiedOptionIds = props.tiedOptionIds ?? outletCtx.tiedOptionIds ?? state.tiedOptionIds ?? null;
  const advanceToWinner = props.advanceToWinner ?? outletCtx.advanceToWinner;
  const isVoteRevealed = props.isVoteRevealed ?? (outletCtx as { isVoteRevealed?: boolean }).isVoteRevealed ?? state.isVoteRevealed ?? false;

  const completedMissions = state.completedMissionIds || [];
  const hasCompletedTwoMissions = completedMissions.length >= 2;

  const isVoting = scene === 'voting' || decisionStatus === 'open';
  const isResult = (scene === 'result' || decisionStatus === 'result') && isVoteRevealed;
  const isTie = decisionStatus === 'tie' && isVoteRevealed;

  const activeDecision = getDecision(activeDecisionId);
  const tallies = getDecisionTallies({ votes, participantVotes }, activeDecision);

  const effectiveWinnerId = winningOptionId || (winner === 'campaign' ? 'campaigns' : winner);

  // Option winners on Home
  const isCreateStoryWinner = isResult && effectiveWinnerId === 'create-story';
  const isNewTestimonialsWinner = isResult && effectiveWinnerId === 'new-testimonials';
  const isAttentionWinner = isResult && (effectiveWinnerId === 'needs-attention' || effectiveWinnerId === 'stories' || effectiveWinnerId === 'campaigns' || effectiveWinnerId === 'quotes');
  const isSuggestedStoryWinner = isResult && effectiveWinnerId === 'suggested-story';
  const hasAnyWinner = isResult && Boolean(effectiveWinnerId);

  const isStoriesWinner = isResult && effectiveWinnerId === 'stories';
  const isCampaignsWinner = isResult && effectiveWinnerId === 'campaigns';
  const isQuotesWinner = isResult && effectiveWinnerId === 'quotes';

  const isStoriesTied = isTie && (tiedOptionIds ? tiedOptionIds.includes('stories') : false);
  const isCampaignsTied = isTie && (tiedOptionIds ? tiedOptionIds.includes('campaigns') : false);
  const isQuotesTied = isTie && (tiedOptionIds ? tiedOptionIds.includes('quotes') : false);

  const storiesTally = tallies.options['stories'] || { count: 0, percentage: 0 };
  const campaignsTally = tallies.options['campaigns'] || { count: 0, percentage: 0 };
  const quotesTally = tallies.options['quotes'] || { count: 0, percentage: 0 };

  const handleRevealClick = () => {
    if (RETREAT_CONFIG.manageRevealEnabled) {
      dispatch({ type: 'REVEAL_MANAGE' });
      navigate(`/present/${sessionId}/manage`);
    } else {
      navigate(`/present/${sessionId}/next-steps`);
    }
  };

  return (
    <div className="pc-ref-main-column">
      {/* Background Decorative Art Layer (313x209, Top-Right Anchored, z-index: 1, pointer-events: none) */}
      <div className="image-49-parent pc-ref-home-bg-art pc-ref-header-art-composition" aria-hidden="true">
        <img
          src={headerLandscape}
          alt=""
          className="image-49-icon pc-ref-header-art-img"
        />
        <div className="text10 pc-ref-header-art-text">
          <span className="pc-ref-decorative-line1">Stronger Stories.</span>
          <span className="pc-ref-decorative-line2">A brighter tomorrow.</span>
        </div>
      </div>

      {/* 1. Definitive Home Header Row (Foreground, z-index: 2) */}
      <div className="pc-ref-header-row">
        <div className="pc-ref-header-text">
          <span className="pc-ref-header-date">
            {new Intl.DateTimeFormat('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date())}
          </span>
          <h1 className="pc-ref-page-title">Good morning, Darien!</h1>
          <p className="pc-ref-page-subtitle">
            Here’s what matters most today.
          </p>
        </div>
        <div className="pc-ref-header-actions">
          <Button
            variant="primary"
            size="md"
            iconLeading="plus"
            className={`pc-ref-btn-create-story ${isCreateStoryWinner ? 'pc-option--winner' : hasAnyWinner && !isCreateStoryWinner ? 'pc-option--muted' : ''}`}
            onClick={() => navigate(`/present/${sessionId}/tell/stories/create`)}
          >
            Create story
          </Button>
        </div>
      </div>

      {/* 2. Definitive Metrics Row — 3 Fill Container Cards */}
      <section className={`pc-ref-metrics-row ${hasAnyWinner && !isNewTestimonialsWinner ? 'pc-option--muted' : ''}`} aria-label="Quick metrics">
        {/* Metric 1: New Testimonials */}
        <div className={isNewTestimonialsWinner ? 'pc-option--winner' : ''} style={isNewTestimonialsWinner ? { borderRadius: '12px' } : undefined}>
          <MetricCard
            label="NEW TESTIMONIALS"
            value={24}
            icon="folder"
            tone="success"
          />
        </div>

        {/* Metric 2: Relevant Founders */}
        <MetricCard
          label="RELEVANT FOUNDERS"
          value={7}
          icon="file-06"
          tone="blue"
        />

        {/* Metric 3: Program Match — value in warning orange (#EA580C matches icon) */}
        <MetricCard
          label="PROGRAM MATCH"
          value={3}
          icon="alert-triangle"
          tone="warning"
          valueColor="#EA580C"
        />
      </section>

      {/* 3. PosterChild Noticed — no visible heading per final Figma CSS */}
      <section className={`pc-ref-noticed-section ${hasAnyWinner ? 'pc-option--muted' : ''}`} aria-label="PosterChild notice">
        <InsightBanner
          title="You haven't shared a workforce development story in 6 weeks."
          description="You’re pursuing 3 funders focused on workforce development, and you have 4 new testimonials from that program."
          actionLabel="See why this matters"
          onAction={() => { }}
        />
      </section>

      {/* 4. Needs Your Attention — Table */}
      <div className={isAttentionWinner && effectiveWinnerId === 'needs-attention' ? 'pc-option--winner' : hasAnyWinner && !isAttentionWinner ? 'pc-option--muted' : ''} style={isAttentionWinner && effectiveWinnerId === 'needs-attention' ? { borderRadius: '12px' } : undefined}>
        <AttentionTable
          scene={scene}
          decisionStatus={decisionStatus}
          activeDecisionId={activeDecisionId}
          votes={votes}
          participantVotes={participantVotes}
          winner={winner}
          winningOptionId={winningOptionId}
          tiedOptionIds={tiedOptionIds}
          isVoteRevealed={isVoteRevealed}
          onSelectWinner={() => advanceToWinner?.()}
        />
      </div>

      {/* 5. Suggested for you — Story Recommendation */}
      <div className={isSuggestedStoryWinner ? 'pc-option--winner' : hasAnyWinner && !isSuggestedStoryWinner ? 'pc-option--muted' : ''} style={isSuggestedStoryWinner ? { borderRadius: '12px' } : undefined}>
        <SuggestedStoryCard
          onCardClick={() => {
            dispatch({ type: 'START_MISSION', missionId: 'youth-career-story' });
            navigate(`/present/${sessionId}/tell/stories/review?story=youth-career-pathways&tab=social`);
          }}
          onViewAll={() => {
            dispatch({ type: 'START_MISSION', missionId: 'youth-career-story' });
            navigate(`/present/${sessionId}/tell/stories/review?story=youth-career-pathways&tab=social`);
          }}
        />
      </div>
    </div>
  );
}
