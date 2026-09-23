import React from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { Badge, BadgeVariant } from '../../components/posterchild/Badge';
import { PosterChildIcon } from '../../components/posterchild/Icon';
import { Scene, DecisionStatus } from '../../types/session';
import { getDecision, getDecisionTallies } from '../../config/retreatDecisions';

interface StoryItem {
  id: string;
  title: string;
  program: string;
  updated: string;
  status: BadgeVariant;
  statusLabel: string;
  words: number;
}

const CANONICAL_STORIES: StoryItem[] = [
  {
    id: 'mayas-journey',
    title: 'Maya’s Journey: Finding Belonging Through Mentorship',
    program: 'Youth Mentorship',
    updated: 'Updated 2 hours ago',
    status: 'ready',
    statusLabel: 'Ready for review',
    words: 840,
  },
  {
    id: 'youth-voices',
    title: 'Youth Voices Initiative: Peer Mental Health Circles',
    program: 'Student Wellbeing',
    updated: 'Updated yesterday',
    status: 'ready',
    statusLabel: 'Ready for review',
    words: 920,
  },
  {
    id: 'community-gardens',
    title: 'Community Gardens: Sowing Roots and Trust',
    program: 'Urban Agriculture',
    updated: 'Updated 3 days ago',
    status: 'ready',
    statusLabel: 'Ready for review',
    words: 750,
  },
];

interface StoriesOutletContext {
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

export default function TellStories() {
  const outletCtx = useOutletContext<StoriesOutletContext>() || {};
  const navigate = useNavigate();
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();

  const scene = outletCtx.scene ?? 'dashboard';
  const decisionStatus = outletCtx.decisionStatus ?? 'idle';
  const activeDecisionId = outletCtx.activeDecisionId ?? 'stories-next';
  const votes = outletCtx.votes ?? {};
  const participantVotes = outletCtx.participantVotes ?? {};
  const winner = outletCtx.winner ?? null;
  const winningOptionId = outletCtx.winningOptionId ?? null;
  const tiedOptionIds = outletCtx.tiedOptionIds ?? null;
  const advanceToWinner = outletCtx.advanceToWinner;

  const isVoting = scene === 'voting' || decisionStatus === 'open';
  const isResult = scene === 'result' || decisionStatus === 'result';
  const isTie = decisionStatus === 'tie';

  const activeDecision = getDecision(activeDecisionId === 'stories-next' ? 'stories-next' : 'stories-next');
  const tallies = getDecisionTallies({ votes, participantVotes }, activeDecision);

  const effectiveWinnerId = winningOptionId || winner;

  const handleRowClick = (storyId: string) => {
    if (isResult && effectiveWinnerId === storyId) {
      if (advanceToWinner) {
        advanceToWinner();
      } else {
        navigate(`/present/${sessionId}/tell/stories/review?story=${storyId}`);
      }
    } else if (!isVoting) {
      navigate(`/present/${sessionId}/tell/stories/review?story=${storyId}`);
    }
  };

  return (
    <ProductPage
      figmaNode="tell-stories"
      title="Stories"
      description="Draft, edit, and organize all of your organization’s stories."
      primaryAction={
        <Button variant="primary" size="md" iconLeading="plus">
          Create story
        </Button>
      }
    >
      {/* Stories Table / List */}
      <div className="pc-product-table-card">
        {/* Table Header */}
        <div
          className="pc-product-table-header"
          style={{ gridTemplateColumns: '1fr 180px 160px 160px' }}
        >
          <span>Story Title</span>
          <span>Program</span>
          <span>Status</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
            <span>Word Count</span>
          </div>
        </div>

        {/* Rows */}
        <div className="pc-product-table-body">
          {CANONICAL_STORIES.map((story) => {
            const itemTally = tallies.options[story.id] || { count: 0, percentage: 0 };
            const voteCount = itemTally.count;
            const percentage = itemTally.percentage;

            const isWinner = isResult && effectiveWinnerId === story.id;
            const isTied = isTie && (tiedOptionIds ? tiedOptionIds.includes(story.id) : false);
            const isMuted = isResult && effectiveWinnerId && !isWinner;

            return (
              <div
                key={story.id}
                onClick={() => handleRowClick(story.id)}
                className={`pc-product-table-row ${isWinner ? 'is-team-choice' : ''} ${
                  isMuted ? 'is-muted-item' : ''
                } ${isVoting ? 'is-voting' : ''}`}
                style={{
                  gridTemplateColumns: '1fr 180px 160px 160px',
                  cursor: (isVoting || isWinner || !isResult) ? 'pointer' : 'default'
                }}
              >
                {/* Col 1: Story Title & Update */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span
                    style={{
                      fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                      fontSize: '14px',
                      fontWeight: 600,
                      color: isWinner ? '#171717' : '#171717',
                    }}
                  >
                    {story.title}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                      fontSize: '12px',
                      color: '#737373',
                    }}
                  >
                    {story.updated}
                  </span>
                </div>

                {/* Col 2: Program */}
                <span
                  style={{
                    fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                    fontSize: '14px',
                    color: '#525252',
                  }}
                >
                  {story.program}
                </span>

                {/* Col 3: Status / Team Choice Badge */}
                <div>
                  {isWinner ? (
                    <Badge variant="brand" iconLeading="check">
                      Team choice
                    </Badge>
                  ) : isTied ? (
                    <Badge variant="amber">
                      Tied
                    </Badge>
                  ) : (
                    <Badge variant={story.status} showDot>
                      {story.statusLabel}
                    </Badge>
                  )}
                </div>

                {/* Col 4: Action & Live Votes */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '8px',
                    textAlign: 'right',
                  }}
                >
                  {isWinner ? (
                    <button
                      type="button"
                      className="pc-ref-row-action-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(story.id);
                      }}
                    >
                      <span>Review story</span>
                      <PosterChildIcon name="arrow-right" size={13} strokeWidth={2} />
                    </button>
                  ) : (
                    <>
                      <span
                        style={{
                          fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                          fontSize: '14px',
                          color: '#737373',
                        }}
                      >
                        {story.words} words
                      </span>
                      <PosterChildIcon name="arrow-right" size={14} color="#A3A3A3" />
                    </>
                  )}
                </div>

                {/* Progress bar fill for active voting */}
                {isVoting && voteCount > 0 && (
                  <div className="pc-ref-row-progress-track">
                    <div
                      className="pc-ref-row-progress-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ProductPage>
  );
}
