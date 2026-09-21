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
}

export default function TellConnect() {
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const outletCtx = useOutletContext<ConnectOutletContext>() || {};
  const { state, dispatch } = useDemoState();

  const scene = outletCtx.scene ?? state.scene ?? 'dashboard';
  const decisionStatus = outletCtx.decisionStatus ?? state.decisionStatus ?? 'idle';
  const winningOptionId = outletCtx.winningOptionId ?? state.winningOptionId ?? state.winner ?? null;

  const isVoting = scene === 'voting' || decisionStatus === 'open';
  const isResult = scene === 'result' || decisionStatus === 'result';
  const isCompleted = state.completedMissionIds?.includes('new-testimonials-connect');

  const completeMission = () => {
    dispatch({ type: 'COMPLETE_MISSION', missionId: 'new-testimonials-connect' });
  };

  const returnHome = () => {
    dispatch({ type: 'RETURN_HOME' });
    navigate(`/present/${sessionId}`);
  };

  const convergeToStory = () => {
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
        ) : isVoting ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: '10px',
              backgroundColor: '#EFF8FF',
              border: '1px solid #B2DDFF',
              color: '#175CD3'
            }}
          >
            <PosterChildIcon name="stars-01" size={18} strokeWidth={2} />
            <strong>Live Voting Active:</strong>
            <span>Audience is deciding on mobile: “What should we do with this signal?”</span>
          </div>
        ) : null}

        {/* Action State: Review Theme Winner */}
        {isResult && winningOptionId === 'review-theme' && (
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
              <PosterChildIcon name="file-06" size={18} strokeWidth={2} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Theme Review: Transportation Signal</h3>
              <Badge variant="ready" size="sm">Audience Choice</Badge>
            </div>
            <p style={{ margin: 0, color: '#475467', fontSize: '14px', lineHeight: 1.5 }}>
              Transportation appears across <strong>7 recent Youth Career Pathways responses</strong>. Key community friction points identified:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '4px' }}>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ display: 'block', fontSize: '13px', color: '#101828' }}>Transit to Program</strong>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Bus schedule conflicts during late labs</span>
              </div>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ display: 'block', fontSize: '13px', color: '#101828' }}>Job Opportunity Access</strong>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Internship commute times exceed 45 mins</span>
              </div>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ display: 'block', fontSize: '13px', color: '#101828' }}>Stipend Allocation</strong>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Dedicated travel passes recommended</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <Button variant="primary" size="sm" iconLeading="check" onClick={completeMission}>
                Complete Theme Review
              </Button>
            </div>
          </div>
        )}

        {/* Action State: Use in Story Winner (Convergence Banner) */}
        {isResult && winningOptionId === 'use-in-story' && (
          <div
            style={{
              backgroundColor: '#F0FDF9',
              border: '1px solid #A7F3D0',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065F46' }}>
              <PosterChildIcon name="sparkles" size={18} strokeWidth={2} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Story Convergence: Youth Career Pathways</h3>
              <Badge variant="brand" size="sm">Audience Choice</Badge>
            </div>
            <p style={{ margin: 0, color: '#047857', fontSize: '14px', lineHeight: 1.5 }}>
              The team decided to connect these community quotes directly into the active narrative draft.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <Button variant="primary" size="sm" iconLeading="arrow-right" onClick={convergeToStory}>
                Advance to Youth Career Pathways [Space]
              </Button>
            </div>
          </div>
        )}

        {/* Action State: Ask Postie Winner */}
        {isResult && winningOptionId === 'ask-postie' && (
          <div
            style={{
              backgroundColor: '#F9F5FF',
              border: '1px solid #E9D7FE',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6941C6' }}>
              <PosterChildIcon name="stars-01" size={18} strokeWidth={2} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Postie Strategic Recommendation</h3>
              <Badge variant="brand" size="sm">Audience Choice</Badge>
            </div>
            <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #D6BBFB' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#6941C6', fontWeight: 600 }}>
                💬 Presenter Question: “What should we do with this signal?”
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#344054', lineHeight: 1.5 }}>
                “I’d review the transportation theme first. It appears across 7 recent Youth Career Pathways responses, and 3 responses are detailed enough to become story sources. If the pattern holds, we can turn it into a stronger story next.”
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="primary" size="sm" iconLeading="check" onClick={completeMission}>
                Follow Postie’s recommendation &amp; Complete
              </Button>
            </div>
          </div>
        )}

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
