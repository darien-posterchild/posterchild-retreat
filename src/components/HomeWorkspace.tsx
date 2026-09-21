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
import { getMission, RETREAT_CONFIG } from '../config/retreatFlow';
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

  const completedMissions = state.completedMissionIds || [];
  const hasCompletedTwoMissions = completedMissions.length >= 2;

  const isVoting = scene === 'voting' || decisionStatus === 'open';
  const isResult = scene === 'result' || decisionStatus === 'result';
  const isTie = decisionStatus === 'tie';

  const activeDecision = getDecision(activeDecisionId);
  const tallies = getDecisionTallies({ votes, participantVotes }, activeDecision);

  const effectiveWinnerId = winningOptionId || (winner === 'campaign' ? 'campaigns' : winner);

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

      {/* Subtle Retreat Progress & Outcome State Banner */}
      {hasCompletedTwoMissions ? (
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderRadius: '12px',
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            color: '#166534',
            marginBottom: '4px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#15803D',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 700,
                flexShrink: 0
              }}
            >
              ✓
            </div>
            <div>
              <strong style={{ fontSize: '14px', display: 'block', color: '#14532D' }}>
                Today’s retreat priorities completed ({completedMissions.length} actions)
              </strong>
              <span style={{ fontSize: '13px', color: '#166534' }}>
                {completedMissions.map((id) => getMission(id)?.homeEffect || id).join(' • ')}
              </span>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            iconLeading="arrow-right"
            onClick={handleRevealClick}
          >
            {RETREAT_CONFIG.manageRevealEnabled ? 'Reveal Architecture' : 'Continue to Next Steps'} [Space]
          </Button>
        </div>
      ) : completedMissions.length === 1 ? (
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 16px',
            borderRadius: '10px',
            backgroundColor: '#ECFDF3',
            border: '1px solid #A6F4C5',
            color: '#027A48',
            fontSize: '13px',
            marginBottom: '4px'
          }}
        >
          <PosterChildIcon name="check" size={16} strokeWidth={2.5} />
          <span>
            <strong>1 action completed:</strong> {getMission(completedMissions[0])?.homeEffect || completedMissions[0]}
          </span>
        </div>
      ) : null}

      {/* 1. Definitive Home Header Row (Foreground, z-index: 2) */}
      <div className="pc-ref-header-row">
        <div className="pc-ref-header-text">
          <span className="pc-ref-header-date">Tuesday, November 11, 2027</span>
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
            className="pc-ref-btn-create-story"
            onClick={() => navigate(`/present/${sessionId}/tell/stories/create`)}
          >
            Create story
          </Button>
        </div>
      </div>

      {/* 2. Definitive Metrics Row — 3 Fill Container Cards */}
      <section className="pc-ref-metrics-row" aria-label="Quick metrics">
        {/* Metric 1: New Testimonials */}
        <MetricCard
          label="NEW TESTIMONIALS"
          value={24}
          icon="folder"
          tone="success"
        />

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
      <section className="pc-ref-noticed-section" aria-label="PosterChild notice">
        <InsightBanner
          title="You haven't shared a workforce development story in 6 weeks."
          description="You’re pursuing 3 funders focused on workforce development, and you have 4 new testimonials from that program."
          actionLabel="See why this matters"
          onAction={() => {}}
        />
      </section>

      {/* 4. Needs Your Attention — Table */}
      <AttentionTable
        scene={scene}
        decisionStatus={decisionStatus}
        activeDecisionId={activeDecisionId}
        votes={votes}
        participantVotes={participantVotes}
        winner={winner}
        winningOptionId={winningOptionId}
        tiedOptionIds={tiedOptionIds}
        onSelectWinner={() => advanceToWinner?.()}
      />

      {/* 5. Suggested for you — Story Recommendation */}
      <SuggestedStoryCard />
    </div>
  );
}
