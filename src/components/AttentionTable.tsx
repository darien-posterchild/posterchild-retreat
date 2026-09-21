import React from 'react';
import { Scene, DecisionStatus } from '../types/session';
import { PosterChildIcon, PosterChildIconName } from './posterchild/Icon';
import { FeaturedIcon, FeaturedIconVariant } from './posterchild/FeaturedIcon';
import { Badge, BadgeVariant } from './posterchild/Badge';
import { getDecision, getDecisionTallies } from '../config/retreatDecisions';

interface PriorityItem {
  id: string;
  category: string;
  title: string;
  priorityLabel: string;
  priorityType: BadgeVariant;
  primaryText: string;
  supportingText: string;
  actionLabel: string;
  iconName: PosterChildIconName;
  iconVariant: FeaturedIconVariant;
}

const PRIORITIES: PriorityItem[] = [
  {
    id: 'stories',
    category: 'Upcoming event',
    title: 'Board meeting',
    priorityLabel: 'Immediate',
    priorityType: 'immediate',
    primaryText: 'Tomorrow',
    supportingText: '3 stories could strengthen your update.',
    actionLabel: 'Review stories',
    iconName: 'calendar-heart-02',
    iconVariant: 'brand'        // warm amber bg (#FFF9E8), amber icon (#8F6500)
  },
  {
    id: 'campaigns',
    category: 'Funding opportunity',
    title: 'Kresge Foundation',
    priorityLabel: 'Upcoming',
    priorityType: 'upcoming',
    primaryText: 'Closes in 12 days',
    supportingText: 'Strong match (92%). Application is ready for your review.',
    actionLabel: 'Review opportunity',
    iconName: 'coins-hand',
    iconVariant: 'purple'       // lavender bg (#FAF5FF), purple icon (#9333EA)
  },
  {
    id: 'quotes',
    category: 'Story draft',
    title: 'Youth Career Pathways',
    priorityLabel: 'Ready',
    priorityType: 'ready',
    primaryText: 'Draft is complete',
    supportingText: 'Review and publish when you\u2019re ready.',
    actionLabel: 'Review draft',
    iconName: 'file-06',
    iconVariant: 'success'      // green bg (#F0FDF4), green icon (#16A34A)
  }
];

interface AttentionTableProps {
  scene?: Scene;
  decisionStatus?: DecisionStatus;
  activeDecisionId?: string;
  votes?: Record<string, number>;
  participantVotes?: Record<string, string>;
  totalVotes?: number;
  winner?: string | null;
  winningOptionId?: string | null;
  tiedOptionIds?: string[] | null;
  onSelectWinner?: (optionId: string) => void;
}

export default function AttentionTable({
  scene = 'dashboard',
  decisionStatus = 'idle',
  activeDecisionId = 'home-focus',
  votes = {},
  participantVotes = {},
  winner = null,
  winningOptionId = null,
  tiedOptionIds = null,
  onSelectWinner
}: AttentionTableProps) {
  const isVoting = scene === 'voting' || decisionStatus === 'open';
  const isResult = scene === 'result' || decisionStatus === 'result';
  const isTie = decisionStatus === 'tie';

  const activeDecision = getDecision(activeDecisionId);
  const tallies = getDecisionTallies({ votes, participantVotes }, activeDecision);

  const effectiveWinnerId = winningOptionId || (winner === 'campaign' ? 'campaigns' : winner);

  return (
    <section className="pc-ref-attention-section" aria-label="Needs your attention">
      <div className="pc-ref-attention-header">
        <h2 className="pc-ref-section-title">Needs your attention</h2>
        <button type="button" className="pc-ref-view-all-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span>View all</span>
          <PosterChildIcon name="arrow-right" size={13} color="#8F6500" strokeWidth={2} />
        </button>
      </div>

      {/* 740px Table Card from PosterChild Reference */}
      <div className="pc-ref-table-card">
        {/* Header Row */}
        <div className="pc-ref-table-header">
          <div className="pc-ref-th pc-ref-th--item">Item</div>
          <div className="pc-ref-th pc-ref-th--priority">Priority</div>
          <div className="pc-ref-th pc-ref-th--details">
            <span>What you should know</span>
            {isVoting && <span className="pc-ref-live-indicator">Live Voting</span>}
          </div>
        </div>

        {/* Body Rows */}
        <div className="pc-ref-table-body">
          {PRIORITIES.map((item) => {
            const itemTally = tallies.options[item.id] || { count: 0, percentage: 0 };
            const voteCount = itemTally.count;
            const percentage = itemTally.percentage;

            const isWinner = isResult && effectiveWinnerId === item.id;
            const isTied = isTie && (tiedOptionIds ? tiedOptionIds.includes(item.id) : false);
            const isMuted = isResult && effectiveWinnerId && !isWinner;

            return (
              <div
                key={item.id}
                className={`pc-ref-table-row ${isWinner ? 'is-team-choice' : ''} ${isMuted ? 'is-muted-item' : ''
                  } ${isVoting ? 'is-voting' : ''}`}
              >
                {/* Col 1: Item */}
                <div className="pc-ref-td--item">
                  <FeaturedIcon
                    name={item.iconName}
                    variant={item.iconVariant}
                    size="md"
                    shape="rounded"
                  />
                  <div className="pc-ref-item-text-group">
                    <span className="pc-ref-item-title">{item.title}</span>
                    <span className="pc-ref-item-subtext">{item.category}</span>
                  </div>
                </div>

                {/* Col 2: Priority */}
                <div className="pc-ref-td--priority">
                  {isWinner ? (
                    <Badge variant="brand" iconLeading="check">
                      Team choice
                    </Badge>
                  ) : isTied ? (
                    <Badge variant="amber">
                      Tied
                    </Badge>
                  ) : (
                    <Badge variant={item.priorityType} showDot>
                      {item.priorityLabel}
                    </Badge>
                  )}
                </div>

                {/* Col 3: Details & Action */}
                <div className="pc-ref-td--details">
                  <div className="pc-ref-details-text-group">
                    <p className="pc-ref-details-primary">{item.primaryText}</p>
                    <p className="pc-ref-details-supporting">{item.supportingText}</p>
                  </div>

                  <div className="pc-ref-details-action-slot">
                    {isVoting ? (
                      <div className="pc-ref-vote-pill">
                        <span style={{ color: '#171717', fontWeight: 600 }}>{voteCount}</span>
                        <span style={{ color: '#737373' }}>({percentage}%)</span>
                      </div>
                    ) : isWinner ? (
                      <button
                        type="button"
                        className="pc-ref-row-action-link"
                        onClick={() => onSelectWinner?.(item.id)}
                      >
                        <span>{item.actionLabel}</span>
                        <PosterChildIcon name="arrow-right" size={13} strokeWidth={2} />
                      </button>
                    ) : (
                      <button type="button" className="pc-ref-more-btn" title="More options">
                        <PosterChildIcon name="chevron-selector-vertical" size={16} color="#A3A3A3" strokeWidth={1.8} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Subtle voting progress bar at bottom of row only when voting is active and votes exist */}
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
    </section>
  );
}
