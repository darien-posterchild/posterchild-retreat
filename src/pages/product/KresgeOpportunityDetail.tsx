import React from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { Badge } from '../../components/posterchild/Badge';
import { MetricCard } from '../../components/posterchild/MetricCard';
import { PosterChildIcon } from '../../components/posterchild/Icon';
import { Scene, DecisionStatus } from '../../types/session';
import { useDemoState } from '../../useDemoState';

interface KresgeOutletContext {
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

export default function KresgeOpportunityDetail() {
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const outletCtx = useOutletContext<KresgeOutletContext>() || {};
  const { state, dispatch } = useDemoState();

  const scene = outletCtx.scene ?? state.scene ?? 'dashboard';
  const decisionStatus = outletCtx.decisionStatus ?? state.decisionStatus ?? 'idle';
  const winningOptionId = outletCtx.winningOptionId ?? state.winningOptionId ?? state.winner ?? null;

  const isVoting = scene === 'voting' || decisionStatus === 'open';
  const isResult = scene === 'result' || decisionStatus === 'result';
  const isCompleted = state.completedMissionIds?.includes('kresge-funding');

  const completeMission = () => {
    dispatch({ type: 'COMPLETE_MISSION', missionId: 'kresge-funding' });
  };

  const returnHome = () => {
    dispatch({ type: 'RETURN_HOME' });
    navigate(`/present/${sessionId}`);
  };

  const backToRaise = () => {
    navigate(`/present/${sessionId}/raise`);
  };

  return (
    <ProductPage
      title="Kresge Foundation"
      description="Youth Career Pathways Initiative • $150,000 USD • 92% Alignment Match"
      primaryAction={
        isCompleted ? (
          <Button variant="primary" size="md" iconLeading="arrow-left" onClick={returnHome}>
            Return to Home
          </Button>
        ) : isResult ? (
          <Button variant="primary" size="md" iconLeading="check" onClick={completeMission}>
            Complete Mission
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="md"
            iconLeading="arrow-left"
            onClick={backToRaise}
          >
            All Opportunities
          </Button>
        )
      }
      secondaryAction={
        <Badge variant={isCompleted ? 'ready' : 'upcoming'} size="md">
          {isCompleted ? 'Mission Complete' : 'Deadline: Nov 23 (12 days)'}
        </Badge>
      }
    >
      <div className="kresge-mission-view" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              <strong>Kresge Mission Completed</strong>
              <span>— Application alignment confirmed & budget readiness recommendations captured.</span>
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
            <span>Audience is deciding on mobile: “What should we do next with Kresge?”</span>
          </div>
        ) : null}

        {/* 1. Quick Metrics Row */}
        <section className="pc-ref-metrics-row" aria-label="Opportunity benchmarks" style={{ margin: 0 }}>
          <MetricCard
            label="ALIGNMENT MATCH"
            value="92%"
            delta="High programmatic fit"
            deltaDirection="up"
            iconName="stars-01"
            tagText="Top Match"
            tagVariant="neutral"
          />
          <MetricCard
            label="GRANT POTENTIAL"
            value="$150,000"
            delta="Renewable multi-year"
            deltaDirection="up"
            iconName="coins-hand"
            tagText="Tier 1"
            tagVariant="neutral"
          />
          <MetricCard
            label="READINESS CHECKLIST"
            value="3 of 4"
            delta="1 update needed"
            deltaDirection="neutral"
            iconName="file-06"
            tagText="Actionable"
            tagVariant="neutral"
          />
        </section>

        {/* 2. Action Outcome Highlights (Inline Dynamic State) */}
        {isResult && winningOptionId === 'review-requirements' && (
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
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Requirements Review Summary</h3>
              <Badge variant="ready" size="sm">Audience Choice</Badge>
            </div>
            <p style={{ margin: 0, color: '#475467', fontSize: '14px', lineHeight: 1.5 }}>
              The team reviewed grant requirements. All narrative criteria and youth workforce evidence are fully verified.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '6px' }}>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ display: 'block', fontSize: '13px', color: '#027A48' }}>✓ Workforce Alignment</strong>
                <span style={{ fontSize: '13px', color: '#64748B' }}>92% rubric fit confirmed</span>
              </div>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ display: 'block', fontSize: '13px', color: '#027A48' }}>✓ Verified Testimonials</strong>
                <span style={{ fontSize: '13px', color: '#64748B' }}>3 community quotes linked</span>
              </div>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ display: 'block', fontSize: '13px', color: '#027A48' }}>✓ Impact Evidence</strong>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Placement statistics attached</span>
              </div>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #FDB022' }}>
                <strong style={{ display: 'block', fontSize: '13px', color: '#B54708' }}>⚠️ Budget Update</strong>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Needs refresh before submit</span>
              </div>
            </div>
          </div>
        )}

        {isResult && winningOptionId === 'strengthen-application' && (
          <div
            style={{
              backgroundColor: '#FFFAEB',
              border: '1px solid #FEDF89',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B54708' }}>
              <PosterChildIcon name="sparkles" size={18} strokeWidth={2} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Strengthen Application: Priority Action</h3>
              <Badge variant="upcoming" size="sm">Audience Choice</Badge>
            </div>
            <p style={{ margin: 0, color: '#7A2E0E', fontSize: '14px', lineHeight: 1.5 }}>
              <strong>Key Readiness Gap:</strong> Program Budget — Needs update.
            </p>
            <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #FEE4E2' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#344054' }}>
                💡 <strong>Recommendation:</strong> “Update the workforce program budget to reflect recent mentor stipend expansions. This will increase readiness score from <strong>92% → 98%</strong>.”
              </p>
            </div>
          </div>
        )}

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
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Postie Strategic Analysis</h3>
              <Badge variant="brand" size="sm">Audience Choice</Badge>
            </div>
            <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #D6BBFB' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#6941C6', fontWeight: 600 }}>
                💬 Presenter Question: “What should we do first to strengthen this opportunity?”
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#344054', lineHeight: 1.5 }}>
                “I’d update the workforce program budget first. It’s the only major readiness gap I found. Your stories, testimonials, and impact evidence are already strong.”
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" size="sm" iconLeading="check" onClick={completeMission}>
                Apply recommendation & Complete
              </Button>
            </div>
          </div>
        )}

        {/* 3. Grant Details & Readiness Checklist Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E5E5',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Opportunity Profile
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#101828', margin: '4px 0 8px 0' }}>
              Youth Career Pathways & Belonging Grant
            </h2>
            <p style={{ fontSize: '14px', color: '#475467', lineHeight: 1.6, margin: 0 }}>
              The Kresge Foundation’s education and workforce initiative funds scalable community programs providing underrepresented youth with technical mentorship, living stipends, and direct workforce placement.
            </p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #EAECF0', margin: 0 }} />

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#101828', margin: '0 0 14px 0' }}>
              Application Readiness Checklist
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PosterChildIcon name="check" size={16} style={{ color: '#027A48' }} />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>
                    Workforce-development alignment confirmed
                  </span>
                </div>
                <Badge variant="ready" size="sm">Verified (92%)</Badge>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PosterChildIcon name="check" size={16} style={{ color: '#027A48' }} />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>
                    Existing stories & community testimonials identified
                  </span>
                </div>
                <Badge variant="ready" size="sm">3 Stories Attached</Badge>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PosterChildIcon name="check" size={16} style={{ color: '#027A48' }} />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>
                    Verified impact evidence & placement metrics attached
                  </span>
                </div>
                <Badge variant="ready" size="sm">Verified</Badge>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: (isResult && (winningOptionId === 'strengthen-application' || winningOptionId === 'ask-postie')) ? '#FFFAEB' : '#F8FAFC',
                  border: (isResult && (winningOptionId === 'strengthen-application' || winningOptionId === 'ask-postie')) ? '1px solid #FDB022' : '1px solid #E2E8F0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PosterChildIcon
                    name="alert-triangle"
                    size={16}
                    style={{ color: (isResult && (winningOptionId === 'strengthen-application' || winningOptionId === 'ask-postie')) ? '#B54708' : '#64748B' }}
                  />
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: (isResult && (winningOptionId === 'strengthen-application' || winningOptionId === 'ask-postie')) ? 600 : 500,
                      color: (isResult && (winningOptionId === 'strengthen-application' || winningOptionId === 'ask-postie')) ? '#7A2E0E' : '#334155'
                    }}
                  >
                    Updated program budget
                  </span>
                </div>
                <Badge variant="upcoming" size="sm">Needs Update</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProductPage>
  );
}
