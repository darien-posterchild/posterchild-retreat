import React from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { Badge } from '../../components/posterchild/Badge';
import { PosterChildIcon } from '../../components/posterchild/Icon';
import { InsightBanner } from '../../components/posterchild/InsightBanner';
import { Scene, DecisionStatus } from '../../types/session';
import { useDemoState } from '../../useDemoState';

import thumbYouthCareer from '../../assets/screens/connect/thumb-youth-career.png';
import thumbSpringAlumni from '../../assets/screens/connect/thumb-spring-alumni.png';
import thumbProgramExp from '../../assets/screens/connect/thumb-program-exp.png';
import thumbLeadership from '../../assets/screens/connect/thumb-leadership.png';

interface ConversationItem {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  responses: string;
  statusVariant: 'upcoming' | 'neutral' | 'ready';
  statusLabel: string;
  nextStep: string;
  lastUpdated: string;
}

const CONVERSATIONS: ConversationItem[] = [
  {
    id: 'conv-1',
    title: 'Youth Career Pathways Check-in',
    type: 'Program check-in',
    thumbnail: thumbYouthCareer,
    responses: '23 responses',
    statusVariant: 'upcoming', // warm yellow badge
    statusLabel: 'Active',
    nextStep: 'Review transportation theme.',
    lastUpdated: '2 days ago'
  },
  {
    id: 'conv-2',
    title: 'Spring Alumni Stories',
    type: 'Story collection',
    thumbnail: thumbSpringAlumni,
    responses: '14 responses',
    statusVariant: 'neutral', // neutral gray badge
    statusLabel: 'Active',
    nextStep: 'Review 3 strong responses.',
    lastUpdated: '4 days ago'
  },
  {
    id: 'conv-3',
    title: 'Program Experience',
    type: 'Community feedback',
    thumbnail: thumbProgramExp,
    responses: '42 responses',
    statusVariant: 'ready', // green badge
    statusLabel: 'Analysis ready',
    nextStep: 'Review themes and signals.',
    lastUpdated: '2 weeks ago'
  },
  {
    id: 'conv-4',
    title: 'Community Leadership Follow-up',
    type: 'Follow-up request',
    thumbnail: thumbLeadership,
    responses: '0 responses',
    statusVariant: 'neutral', // neutral gray badge
    statusLabel: 'Draft',
    nextStep: 'Send the request.',
    lastUpdated: '1 week ago'
  }
];

interface ConnectOutletContext {
  scene?: Scene;
  decisionStatus?: DecisionStatus;
  activeDecisionId?: string;
  votes?: Record<string, number>;
  participantVotes?: Record<string, string>;
  totalVotes?: number;
  winner?: string | null;
  winningOptionId?: string | null;
  tiedOptionIds?: string[] | null;
  isVoteRevealed?: boolean;
}

export default function TellConnect() {
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const outletCtx = useOutletContext<ConnectOutletContext>() || {};
  const { state, dispatch } = useDemoState();

  const scene = outletCtx.scene ?? state.scene ?? 'dashboard';
  const decisionStatus = outletCtx.decisionStatus ?? state.decisionStatus ?? 'idle';
  const winningOptionId = outletCtx.winningOptionId ?? state.winningOptionId ?? state.winner ?? null;

  const isVoteRevealed = (outletCtx as { isVoteRevealed?: boolean }).isVoteRevealed ?? state.isVoteRevealed ?? false;
  const isVoting = scene === 'voting' || decisionStatus === 'open';
  const isResult = (scene === 'result' || decisionStatus === 'result') && isVoteRevealed;
  const isCompleted = state.completedMissionIds?.includes('new-testimonials-connect');

  const completeMission = () => {
    dispatch({ type: 'COMPLETE_MISSION', missionId: 'new-testimonials-connect' });
  };

  const returnHome = () => {
    dispatch({ type: 'RETURN_HOME' });
    navigate(`/present/${sessionId}`);
  };

  const convergeToStory = () => {
    dispatch({ type: 'COMPLETE_MISSION', missionId: 'new-testimonials-connect' });
    dispatch({ type: 'START_MISSION', missionId: 'youth-career-story' });
    navigate(`/present/${sessionId}/tell/stories/review?story=youth-career-pathways&tab=social`);
  };

  return (
    <ProductPage
      figmaNode="tell-connect"
      title="Hear from your community."
      description="Collect experiences, voices, and perspectives that can become stories."
      primaryAction={
        isCompleted ? (
          <Button variant="primary" size="md" iconLeading="check" onClick={returnHome}>
            Return to Home [H]
          </Button>
        ) : isResult && winningOptionId === 'use-in-story' ? (
          <Button variant="primary" size="md" iconLeading="arrow-right" onClick={convergeToStory}>
            Use in Youth Career Story
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            iconLeading="plus"
            onClick={() => {
              // Future retreat concept:
              // PosterChild generates a follow-up form from detected community signals.
            }}
          >
            Ask your community
          </Button>
        )
      }
      secondaryAction={
        <Badge variant={isCompleted ? 'ready' : 'upcoming'} size="md">
          {isCompleted ? 'Mission Complete' : 'Community Signals Active'}
        </Badge>
      }
    >
      <div className="tell-connect-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Subtle Status Notice */}
        {isCompleted ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderRadius: '10px',
              backgroundColor: '#ECFDF3',
              border: '1px solid #A6F4C5',
              color: '#027A48'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PosterChildIcon name="check" size={18} strokeWidth={2.5} />
              <strong>Community Connect Mission Completed</strong>
              <span>— Testimonials &amp; transportation pattern review captured.</span>
            </div>
            <Button variant="primary" size="sm" onClick={returnHome}>
              Return to Home [H]
            </Button>
          </div>
        ) : null}

        {/* 1. PosterChild Insight Banner */}
        <section aria-label="PosterChild community insight">
          <InsightBanner
            title="Transportation keeps coming up. Is there more to understand?"
            description="PosterChild found transportation mentioned across 7 recent Youth Career Pathways responses. It may be worth asking a follow-up before turning the theme into a story."
            actionLabel="Ask your community"
            onAction={() => {
              // Future retreat concept:
              // PosterChild generates a follow-up form from detected community signals.
            }}
          />
        </section>

        {/* 2. Active Conversations Table Section */}
        <section className="pc-connect-section" aria-label="Active conversations">
          <div className="pc-connect-section-header">
            <h2 className="pc-connect-section-title">
              Active conversations
            </h2>
            <button
              type="button"
              className="pc-connect-view-all-btn"
            >
              <span>View all</span>
              <PosterChildIcon name="arrow-right" size={14} color="#8F6500" strokeWidth={2} />
            </button>
          </div>

          <div className="pc-connect-table-card">
            {/* Table Header */}
            <div className="pc-connect-table-header">
              <span>Conversation</span>
              <span>Status</span>
              <span>Responses</span>
              <span>Next step</span>
              <span>Last updated</span>
            </div>

            {/* Table Rows */}
            <div className="pc-connect-table-body">
              {CONVERSATIONS.map((conv) => (
                <div key={conv.id} className="pc-connect-table-row">
                  {/* Conversation Column */}
                  <div className="pc-connect-cell-conv">
                    <img
                      src={conv.thumbnail}
                      alt={conv.title}
                      className="pc-connect-conv-thumb"
                    />
                    <div className="pc-connect-conv-info">
                      <h3 className="pc-connect-conv-title">{conv.title}</h3>
                      <span className="pc-connect-conv-type">{conv.type}</span>
                    </div>
                  </div>

                  {/* Status Column */}
                  <div className="pc-connect-cell-status">
                    <Badge variant={conv.statusVariant} size="sm">
                      {conv.statusLabel}
                    </Badge>
                  </div>

                  {/* Responses Column */}
                  <div className="pc-connect-cell-responses">
                    {conv.responses}
                  </div>

                  {/* Next step Column */}
                  <div className="pc-connect-cell-nextstep">
                    {conv.nextStep}
                  </div>

                  {/* Last updated Column */}
                  <div className="pc-connect-cell-updated">
                    {conv.lastUpdated}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </ProductPage>
  );
}
