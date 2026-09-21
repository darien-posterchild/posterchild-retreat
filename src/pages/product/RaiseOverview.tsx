import React from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { Badge } from '../../components/posterchild/Badge';
import { MetricCard } from '../../components/posterchild/MetricCard';
import { PosterChildIcon, PosterChildIconName } from '../../components/posterchild/Icon';
import { DecisionChoice } from '../../components/retreat/DecisionChoice';
import { Scene, DecisionStatus } from '../../types/session';
import { getDecision, getDecisionTallies } from '../../config/retreatDecisions';

interface OpportunityRow {
  id: string;
  funder: string;
  focus: string;
  potential: string;
  nextAction: string;
  due: string;
  status: 'ready' | 'upcoming';
  statusLabel: string;
}

const RAISE_OPPORTUNITIES: OpportunityRow[] = [
  {
    id: 'opp-1',
    funder: 'Mellon Foundation',
    focus: 'Workforce Development',
    potential: '$250K – $500K',
    nextAction: 'LOI due',
    due: 'Sep 18, 2026',
    status: 'ready',
    statusLabel: 'In progress',
  },
  {
    id: 'opp-2',
    funder: 'W.K. Kellogg Foundation',
    focus: 'Youth & Education',
    potential: '$150K – $300K',
    nextAction: 'Proposal due',
    due: 'Oct 10, 2026',
    status: 'ready',
    statusLabel: 'In progress',
  },
  {
    id: 'opp-3',
    funder: 'Community Impact Fund',
    focus: 'Community Development',
    potential: '$100K – $200K',
    nextAction: 'Intro call',
    due: 'Oct 25, 2026',
    status: 'upcoming',
    statusLabel: 'Upcoming',
  },
];

interface CampaignActionOption {
  id: string;
  label: string;
  description: string;
  iconName: PosterChildIconName;
}

const CAMPAIGN_ACTIONS: CampaignActionOption[] = [
  {
    id: 'launch',
    label: 'Launch campaign',
    description: 'Everything is ready. Publish and start reaching supporters.',
    iconName: 'coins-hand',
  },
  {
    id: 'refine',
    label: 'Refine first',
    description: 'Review the message, audience, and campaign details before launch.',
    iconName: 'file-06',
  },
  {
    id: 'ask-postie',
    label: 'Ask Postie',
    description: 'Let Postie review the campaign and recommend the strongest next move.',
    iconName: 'stars-01',
  },
];

interface RaiseOutletContext {
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

export default function RaiseOverview() {
  const outletCtx = useOutletContext<RaiseOutletContext>() || {};
  const navigate = useNavigate();
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();

  const scene = outletCtx.scene ?? 'dashboard';
  const decisionStatus = outletCtx.decisionStatus ?? 'idle';
  const activeDecisionId = outletCtx.activeDecisionId ?? 'campaigns-next';
  const votes = outletCtx.votes ?? {};
  const participantVotes = outletCtx.participantVotes ?? {};
  const winner = outletCtx.winner ?? null;
  const winningOptionId = outletCtx.winningOptionId ?? null;
  const tiedOptionIds = outletCtx.tiedOptionIds ?? null;
  const advanceToWinner = outletCtx.advanceToWinner;

  const isVoting = scene === 'voting' || decisionStatus === 'open';
  const isResult = scene === 'result' || decisionStatus === 'result';
  const isTie = decisionStatus === 'tie';

  const activeDecision = getDecision('campaigns-next');
  const tallies = getDecisionTallies({ votes, participantVotes }, activeDecision);

  const effectiveWinnerId = winningOptionId || winner;

  const handleActionClick = (actionId: string) => {
    if (isResult && effectiveWinnerId === actionId) {
      if (advanceToWinner) {
        advanceToWinner();
      } else {
        navigate(`/present/${sessionId}/raise/${actionId}`);
      }
    } else if (!isVoting) {
      navigate(`/present/${sessionId}/raise/${actionId}`);
    }
  };

  return (
    <ProductPage
      figmaNode="358:3622"
      title="Raise more. Change more lives."
      description="Smart matches, stronger relationships, more resources for your mission."
      primaryAction={
        <Button variant="primary" size="md" iconLeading="plus">
          Find opportunities
        </Button>
      }
    >
      {/* 1. Metrics Row */}
      <section className="pc-ref-metrics-row" aria-label="Key fundraising metrics">
        <MetricCard
          label="Opportunities"
          value={24}
          icon="folder"
          tone="success"
        />
        <MetricCard
          label="In progress"
          value={7}
          icon="file-06"
          tone="blue"
        />
        <MetricCard
          label="Needs attention"
          value={3}
          icon="alert-triangle"
          tone="warning"
        />
      </section>

      {/* 2. Campaign Focus Area */}
      <section className="pc-product-section" aria-label="Active campaign focus">
        <div className="pc-product-section__header">
          <h2 className="pc-product-section__title">
            Active Campaign
          </h2>
          <Badge variant="ready" showDot>
            Ready to launch
          </Badge>
        </div>

        <div className="pc-product-card" style={{ padding: '24px', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--pc-ref-font-display, serif)",
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#171717',
                  }}
                >
                  Fall Impact Campaign
                </h3>
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                  fontSize: '14px',
                  color: '#525252',
                  lineHeight: '20px',
                }}
              >
                Targeting 2,400 active supporters and major donors across our community network.
              </p>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12px', color: '#737373', fontWeight: 500 }}>Target Goal</span>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#171717' }}>$75,000 USD</span>
            </div>
          </div>

          {/* 3 Decision Next Moves */}
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Recommended Next Move
              </span>
              {isVoting && <span className="pc-ref-live-indicator">Live Voting</span>}
            </div>

            <div className="pc-product-grid-3">
              {CAMPAIGN_ACTIONS.map((action) => {
                const itemTally = tallies.options[action.id] || { count: 0, percentage: 0 };
                const isWinner = isResult && effectiveWinnerId === action.id;
                const isTied = isTie && (tiedOptionIds ? tiedOptionIds.includes(action.id) : false);

                return (
                  <DecisionChoice
                    key={action.id}
                    decisionId="campaigns-next"
                    optionId={action.id}
                    status={decisionStatus}
                    isWinner={isWinner}
                    isTie={isTied}
                    voteCount={itemTally.count}
                    votePercentage={itemTally.percentage}
                    showFeedback={isVoting}
                    onClick={() => handleActionClick(action.id)}
                  >
                    <div
                      style={{
                        padding: '20px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        minHeight: '120px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            backgroundColor: isWinner ? '#FFFDF5' : '#F5F5F5',
                            color: isWinner ? '#B54708' : '#171717',
                            border: isWinner ? '1px solid #FDE68A' : '1px solid #E5E5E5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <PosterChildIcon name={action.iconName} size={18} strokeWidth={2} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span
                            style={{
                              fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                              fontSize: '15px',
                              fontWeight: 600,
                              color: '#171717',
                            }}
                          >
                            {action.label}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                              fontSize: '12px',
                              lineHeight: '16px',
                              color: '#737373',
                            }}
                          >
                            {action.description}
                          </span>
                        </div>
                      </div>

                      {isWinner && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#8F6500', marginTop: '4px' }}>
                          <span>Proceed with {action.label}</span>
                          <PosterChildIcon name="arrow-right" size={13} strokeWidth={2} />
                        </div>
                      )}
                    </div>
                  </DecisionChoice>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Continue Your Work Section */}
      <section className="pc-product-section" aria-label="Continue your work">
        <div className="pc-product-section__header">
          <h2 className="pc-product-section__title">
            Continue your work
          </h2>
          <button type="button" className="pc-product-section__link">
            <span>View all in progress</span>
            <PosterChildIcon name="arrow-right" size={14} color="#8F6500" />
          </button>
        </div>

        <div className="pc-product-table-card">
          <div
            className="pc-product-table-header"
            style={{ gridTemplateColumns: '1fr 160px 140px 140px 120px' }}
          >
            <span>Foundation / Grant</span>
            <span>Potential</span>
            <span>Next Action</span>
            <span>Due</span>
            <span>Status</span>
          </div>

          <div className="pc-product-table-body">
            {RAISE_OPPORTUNITIES.map((opp) => (
              <div
                key={opp.id}
                className="pc-product-table-row"
                style={{ gridTemplateColumns: '1fr 160px 140px 140px 120px' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span
                    style={{
                      fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#171717',
                    }}
                  >
                    {opp.funder}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                      fontSize: '12px',
                      color: '#737373',
                    }}
                  >
                    {opp.focus}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#171717',
                  }}
                >
                  {opp.potential}
                </span>
                <span
                  style={{
                    fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                    fontSize: '14px',
                    color: '#525252',
                  }}
                >
                  {opp.nextAction}
                </span>
                <span
                  style={{
                    fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                    fontSize: '14px',
                    color: '#737373',
                  }}
                >
                  {opp.due}
                </span>
                <div>
                  <Badge variant={opp.status} showDot>
                    {opp.statusLabel}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Top Match Spotlight */}
      <section className="pc-product-section" aria-label="Top match spotlight">
        <h2 className="pc-product-section__title">
          Top match spotlight
        </h2>
        <div className="pc-product-card pc-product-card--banner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#171717',
                }}
              >
                Kresge Foundation — Education &amp; Workforce
              </h3>
              <Badge variant="ready" showDot>
                92% Match
              </Badge>
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                fontSize: '14px',
                color: '#525252',
              }}
            >
              $200K – $500K · Closes Sep 18, 2026 · Strong workforce alignment with 4 testimonials ready.
            </p>
          </div>
          <Button variant="secondary" size="sm">
            Review match
          </Button>
        </div>
      </section>
    </ProductPage>
  );
}
