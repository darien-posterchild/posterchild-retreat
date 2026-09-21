import React, { useState } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { Badge } from '../../components/posterchild/Badge';
import { PosterChildIcon } from '../../components/posterchild/Icon';
import { Tabs } from '../../components/posterchild/Tabs';
import { Scene, DecisionStatus } from '../../types/session';
import { useDemoState } from '../../useDemoState';
import { usePostie } from '../../context/PostieContext';

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

const TABS = [
  'Profile',
  'Action Plan',
  'One-Pager',
  'LOI',
  'Pathway',
  'Contacts',
  'Grants [1]',
];

const ALIGNMENT_DATA = [
  { category: 'Mission', score: 60, weight: '30%' },
  { category: 'Programmatic', score: 72, weight: '25%' },
  { category: 'Financial', score: 78, weight: '20%' },
  { category: 'Relationship', score: 38, weight: '15%' },
  { category: 'Geographic', score: 42, weight: '10%' },
];

export default function KresgeOpportunityDetail() {
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const outletCtx = useOutletContext<KresgeOutletContext>() || {};
  const { state, dispatch } = useDemoState();
  const { openPostie } = usePostie();

  const [activeTab, setActiveTab] = useState('Profile');

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

  // Preserve retreat action behavior
  const handleReviewRequirements = () => {
    dispatch({ type: 'SET_WINNER', winner: 'review-requirements' });
    dispatch({ type: 'SET_SCENE', scene: 'result' });
  };

  const handleStrengthenApplication = () => {
    dispatch({ type: 'SET_WINNER', winner: 'strengthen-application' });
    dispatch({ type: 'SET_SCENE', scene: 'result' });
  };

  const handleAskPostie = () => {
    openPostie();
    dispatch({ type: 'SET_WINNER', winner: 'ask-postie' });
  };

  return (
    <ProductPage
      title="Kresge Foundation"
      description="Youth Career Pathways Initiative • $150,000 USD • 92% Alignment Match"
      primaryAction={
        <div className="pc-kresge-header-actions">
          <button
            type="button"
            className="pc-kresge-icon-btn"
            aria-label="Bookmark opportunity"
            title="Bookmark"
          >
            <PosterChildIcon name="bookmark" size={18} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className="pc-kresge-share-btn"
            aria-label="Share opportunity"
          >
            <PosterChildIcon name="share-04" size={16} strokeWidth={1.8} />
            <span>Share</span>
          </button>
          <button
            type="button"
            className="pc-kresge-icon-btn"
            aria-label="More actions"
            title="More"
          >
            <PosterChildIcon name="dots-horizontal" size={18} strokeWidth={1.8} />
          </button>
        </div>
      }
    >
      <div className="pc-kresge-page-container">
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

        {/* 1. Funder Summary Card */}
        <section className="pc-kresge-summary-card" aria-label="Funder Summary">
          <div className="pc-kresge-summary-top">
            {/* Left: Match Block */}
            <div className="pc-kresge-match-block" aria-label="92% Match: Excellent">
              <span className="pc-kresge-match-label">Match</span>
              <span className="pc-kresge-match-value">92%</span>
              <span className="pc-kresge-match-badge">Excellent</span>
            </div>

            {/* Center: Funding details + category tags */}
            <div className="pc-kresge-summary-center">
              {/* Three primary data groups */}
              <div className="pc-kresge-metrics-grid">
                <div className="pc-kresge-metric-col">
                  <span className="pc-kresge-metric-label">Funding Range</span>
                  <span className="pc-kresge-metric-value">$250K - $500K</span>
                  <span className="pc-kresge-metric-subtext">Typical grant size</span>
                </div>
                <div className="pc-kresge-metric-col">
                  <span className="pc-kresge-metric-label">Application Deadline</span>
                  <span className="pc-kresge-metric-value">Nov 11, 2026</span>
                  <span className="pc-kresge-metric-subtext">Full Proposal</span>
                </div>
                <div className="pc-kresge-metric-col">
                  <span className="pc-kresge-metric-label">Avg. Grant (est.)</span>
                  <span className="pc-kresge-metric-value">$350K</span>
                  <span className="pc-kresge-metric-subtext">Based on recent grants</span>
                </div>
              </div>

              {/* Exact Category Badges */}
              <div className="pc-kresge-tags-row" aria-label="Category tags">
                <span className="pc-kresge-tag">
                  <PosterChildIcon name="stars-01" size={14} className="pc-kresge-tag-icon" />
                  <span>Recommended</span>
                </span>
                <span className="pc-kresge-tag">
                  <PosterChildIcon name="target-05" size={14} className="pc-kresge-tag-icon" />
                  <span>Mission Aligned</span>
                </span>
                <span className="pc-kresge-tag">
                  <PosterChildIcon name="users-02" size={14} className="pc-kresge-tag-icon" />
                  <span>Human Services</span>
                </span>
                <span className="pc-kresge-tag">
                  <PosterChildIcon name="coins-hand" size={14} className="pc-kresge-tag-icon" />
                  <span>Economic Mobility</span>
                </span>
                <span className="pc-kresge-tag">
                  <PosterChildIcon name="bank" size={14} className="pc-kresge-tag-icon" />
                  <span>Private Foundation</span>
                </span>
                <span className="pc-kresge-tag">
                  <PosterChildIcon name="marker-pin-01" size={14} className="pc-kresge-tag-icon" />
                  <span>National (US)</span>
                </span>
              </div>
            </div>
          </div>

          <hr className="pc-kresge-summary-divider" />

          {/* Bottom: Action Buttons */}
          <div className="pc-kresge-summary-actions">
            <Button
              variant="primary"
              size="md"
              iconTrailing="arrow-up-right"
              onClick={handleReviewRequirements}
            >
              Review requirements
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleStrengthenApplication}
            >
              Strengthen application
            </Button>
            <Button
              variant="secondary"
              size="md"
              iconLeading="sparkles"
              onClick={handleAskPostie}
            >
              Ask Postie
            </Button>
          </div>
        </section>

        {/* Action Outcome Highlights (Inline Dynamic State) */}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
                <PosterChildIcon name="file-06" size={18} strokeWidth={2} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Requirements Review Summary</h3>
                <Badge variant="ready" size="sm">Audience Choice</Badge>
              </div>
              {!isCompleted && (
                <Button variant="primary" size="sm" iconLeading="check" onClick={completeMission}>
                  Complete Mission
                </Button>
              )}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B54708' }}>
                <PosterChildIcon name="sparkles" size={18} strokeWidth={2} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Strengthen Application: Priority Action</h3>
                <Badge variant="upcoming" size="sm">Audience Choice</Badge>
              </div>
              {!isCompleted && (
                <Button variant="primary" size="sm" iconLeading="check" onClick={completeMission}>
                  Complete Mission
                </Button>
              )}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6941C6' }}>
                <PosterChildIcon name="stars-01" size={18} strokeWidth={2} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Postie Strategic Analysis</h3>
                <Badge variant="brand" size="sm">Audience Choice</Badge>
              </div>
              {!isCompleted && (
                <Button variant="primary" size="sm" iconLeading="check" onClick={completeMission}>
                  Complete Mission
                </Button>
              )}
            </div>
            <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #D6BBFB' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#6941C6', fontWeight: 600 }}>
                💬 Presenter Question: “Which funding opportunity should I focus on first?”
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#344054', lineHeight: 1.5 }}>
                “I’d start with Kresge. Your Youth Career Pathways work aligns well with Kresge’s focus on economic mobility, equity, and opportunity for people with low incomes. You already have strong participant stories and impact evidence. The main readiness gap is the workforce program budget, last updated in 2025.”
              </p>
            </div>
          </div>
        )}

        {/* 2. Horizontal Tabs */}
        <Tabs
          ariaLabel="Opportunity tabs"
          activeId={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          items={TABS.map((tab) => ({
            id: tab,
            label: tab,
          }))}
        />

        {/* 3. Funding Alignment Card */}
        <section className="pc-kresge-alignment-card" aria-label="Funding Alignment">
          <div className="pc-kresge-alignment-header">
            <h2 className="pc-kresge-alignment-title">Funding Alignment</h2>
          </div>
          <div className="pc-kresge-table" role="table">
            <div className="pc-kresge-table-header" role="row">
              <span className="pc-kresge-th pc-kresge-th--category" role="columnheader">Category</span>
              <span className="pc-kresge-th pc-kresge-th--alignment" role="columnheader">Alignment</span>
              <span className="pc-kresge-th pc-kresge-th--weight" role="columnheader">Weight</span>
            </div>
            {ALIGNMENT_DATA.map((row) => (
              <div key={row.category} className="pc-kresge-table-row" role="row">
                <span className="pc-kresge-td--category" role="cell">{row.category}</span>
                <div className="pc-kresge-td--alignment" role="cell">
                  <div className="pc-kresge-progress-track">
                    <div
                      className="pc-kresge-progress-fill"
                      style={{ width: `${row.score}%` }}
                    />
                  </div>
                  <span className="pc-kresge-progress-num">{row.score}</span>
                </div>
                <span className="pc-kresge-td--weight" role="cell">{row.weight}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Funder Overview Card */}
        <section className="pc-kresge-overview-card" aria-label="Funder Overview">
          <h2 className="pc-kresge-overview-title">Funder Overview</h2>

          {/* Section 1: Their Mission */}
          <div className="pc-kresge-section-group">
            <div className="pc-kresge-section-header">
              <PosterChildIcon name="target-05" size={16} className="pc-kresge-section-header-icon" />
              <span>Their Mission</span>
            </div>
            <p className="pc-kresge-section-body">
              The Kresge Foundation works to expand equity and opportunity in America’s cities, creating pathways for people with low incomes to improve their life circumstances and participate more fully in the economic mainstream.
            </p>
          </div>

          {/* Section 2: Where They Give */}
          <div className="pc-kresge-section-group">
            <div className="pc-kresge-section-header">
              <PosterChildIcon name="globe-01" size={16} className="pc-kresge-section-header-icon" />
              <span>Where They Give</span>
            </div>
            <p className="pc-kresge-section-body">
              Nationally across the United States, with deep place-based work in Detroit, Memphis, New Orleans, and Fresno.
            </p>
            <p className="pc-kresge-section-body" style={{ marginTop: '4px', color: '#737373' }}>
              Focus: cities, communities, and systems that expand equity and opportunity.
            </p>
          </div>

          {/* Section 3: Who They Support */}
          <div className="pc-kresge-section-group">
            <div className="pc-kresge-section-header">
              <PosterChildIcon name="users-02" size={16} className="pc-kresge-section-header-icon" />
              <span>Who They Support</span>
            </div>
            <ul className="pc-kresge-bullet-list">
              <li className="pc-kresge-bullet-item">Nonprofit and community-based organizations</li>
              <li className="pc-kresge-bullet-item">Organizations advancing economic and social mobility</li>
              <li className="pc-kresge-bullet-item">Cross-sector partnerships and place-based coalitions</li>
              <li className="pc-kresge-bullet-item">Organizations working to reduce structural barriers for people with low incomes</li>
            </ul>
          </div>

          {/* Section 4: Funding Priorities */}
          <div className="pc-kresge-section-group">
            <div className="pc-kresge-section-header">
              <PosterChildIcon name="file-06" size={16} className="pc-kresge-section-header-icon" />
              <span>Funding Priorities</span>
            </div>
            <div className="pc-kresge-pill-tags">
              <span className="pc-kresge-pill">American Cities</span>
              <span className="pc-kresge-pill">Arts & Culture</span>
              <span className="pc-kresge-pill">Detroit</span>
              <span className="pc-kresge-pill">Education</span>
              <span className="pc-kresge-pill">Environment</span>
              <span className="pc-kresge-pill">Health</span>
              <span className="pc-kresge-pill">Human Services</span>
              <span className="pc-kresge-pill">Social Investment</span>
            </div>
          </div>

          {/* Section 5: Core Values */}
          <div className="pc-kresge-section-group">
            <div className="pc-kresge-section-header">
              <PosterChildIcon name="check-circle" size={16} className="pc-kresge-section-header-icon" />
              <span>Core Values</span>
            </div>
            <div className="pc-kresge-pill-tags">
              <span className="pc-kresge-pill">Equity</span>
              <span className="pc-kresge-pill">Opportunity</span>
              <span className="pc-kresge-pill">Community</span>
              <span className="pc-kresge-pill">Collaboration</span>
              <span className="pc-kresge-pill">Systems Change</span>
              <span className="pc-kresge-pill">Racial Justice</span>
            </div>
          </div>

          {/* Section 6: About the Funder */}
          <div className="pc-kresge-section-group">
            <div className="pc-kresge-section-header">
              <PosterChildIcon name="building-02" size={16} className="pc-kresge-section-header-icon" />
              <span>About the Funder</span>
            </div>
            <div style={{ display: 'flex', gap: '32px', margin: '4px 0 6px 24px' }}>
              <div>
                <div className="pc-kresge-founders-label" style={{ margin: 0 }}>FOUNDED</div>
                <div style={{ fontFamily: "var(--pc-ref-font-body, 'DM Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#101828', marginTop: '2px' }}>1924</div>
              </div>
              <div>
                <div className="pc-kresge-founders-label" style={{ margin: 0 }}>FOUNDER</div>
                <div style={{ fontFamily: "var(--pc-ref-font-body, 'DM Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#101828', marginTop: '2px' }}>Sebastian Spering Kresge</div>
              </div>
            </div>
            <p className="pc-kresge-section-body" style={{ marginTop: '8px' }}>
              Founded in Detroit in 1924, The Kresge Foundation is a private, national foundation that uses grants, social investments, and other tools to expand equity and opportunity in America’s cities.
            </p>
          </div>
        </section>
      </div>
    </ProductPage>
  );
}
