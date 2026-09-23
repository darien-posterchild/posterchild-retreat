import React, { useState } from 'react';
import { useNavigate, useParams, useOutletContext, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const outletCtx = useOutletContext<KresgeOutletContext>() || {};
  const { state, dispatch } = useDemoState();
  const { openPostie, triggerPrompt } = usePostie();

  const tabParam = searchParams.get('tab');
  const [selectedTab, setSelectedTab] = useState('Profile');
  const activeTab = tabParam === 'action-plan' ? 'Action Plan' : (tabParam === 'profile' ? 'Profile' : selectedTab);

  const scene = outletCtx.scene ?? state.scene ?? 'dashboard';
  const decisionStatus = outletCtx.decisionStatus ?? state.decisionStatus ?? 'idle';
  const winningOptionId = outletCtx.winningOptionId ?? state.winningOptionId ?? state.winner ?? null;

  const isVoteRevealed = (outletCtx as { isVoteRevealed?: boolean }).isVoteRevealed ?? state.isVoteRevealed ?? false;
  const isVoting = scene === 'voting' || decisionStatus === 'open';
  const isResult = (scene === 'result' || decisionStatus === 'result') && isVoteRevealed;
  const isCompleted = state.completedMissionIds?.includes('kresge-funding') || state.completedMissionIds?.includes('kresge-postie');

  const completeMission = () => {
    dispatch({ type: 'COMPLETE_MISSION', missionId: 'kresge-funding' });
  };

  const returnHome = () => {
    dispatch({ type: 'RETURN_HOME' });
    navigate(`/present/${sessionId}`);
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    if (tab === 'Action Plan') {
      navigate(`/present/${sessionId}/raise/opportunities/kresge?tab=action-plan`);
    } else if (tab === 'Profile') {
      navigate(`/present/${sessionId}/raise/opportunities/kresge`);
    } else {
      setSelectedTab(tab);
    }
  };

  // View Plan activates the Action Plan tab
  const handleViewPlan = () => {
    dispatch({ type: 'SET_WINNER', winner: 'review-requirements' });
    dispatch({ type: 'SET_SCENE', scene: 'result' });
    navigate(`/present/${sessionId}/raise/opportunities/kresge?tab=action-plan`);
  };

  const handleAskPostie = () => {
    openPostie();
    triggerPrompt('What should we do next with this opportunity?');
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
              onClick={handleViewPlan}
            >
              View Plan
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

        {/* 2. Horizontal Tabs */}
        <Tabs
          ariaLabel="Opportunity tabs"
          activeId={activeTab}
          onChange={handleTabChange}
          items={TABS.map((tab) => ({
            id: tab,
            label: tab,
          }))}
        />

        {/* Action Plan Tab Content */}
        {activeTab === 'Action Plan' && (
          <>
            {/* 1. Key Takeaways */}
            <section className="pc-kresge-overview-card" aria-label="Key Takeaways">
              <h2 className="pc-kresge-overview-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PosterChildIcon name="stars-01" size={16} className="pc-kresge-section-header-icon" />
                <span>Key Takeaways</span>
              </h2>
              <ul className="pc-kresge-bullet-list" style={{ paddingLeft: '24px' }}>
                <li className="pc-kresge-bullet-item">
                  Strong alignment with workforce development, economic mobility, and youth opportunity.
                </li>
                <li className="pc-kresge-bullet-item">
                  Existing stories, testimonials, and impact evidence already support the opportunity.
                </li>
                <li className="pc-kresge-bullet-item">
                  The main remaining gap is ensuring the program budget and application materials are current.
                </li>
              </ul>
            </section>

            {/* 2. Strategic Insights */}
            <section className="pc-kresge-overview-card" aria-label="Strategic Insights">
              <h2 className="pc-kresge-overview-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PosterChildIcon name="target-05" size={16} className="pc-kresge-section-header-icon" />
                <span>Strategic Insights</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ fontFamily: "var(--pc-ref-font-body, 'DM Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#344054' }}>
                    Strong fit for the program
                  </div>
                  <p className="pc-kresge-section-body" style={{ paddingLeft: 0, marginTop: '2px' }}>
                    “The Youth Career Pathways initiative aligns closely with the opportunity’s workforce and economic mobility focus.”
                  </p>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--pc-ref-font-body, 'DM Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#344054' }}>
                    Existing evidence reduces the work
                  </div>
                  <p className="pc-kresge-section-body" style={{ paddingLeft: 0, marginTop: '2px' }}>
                    “Recent testimonials, placement metrics, and the current Youth Career Pathways story can support the application.”
                  </p>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--pc-ref-font-body, 'DM Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#344054' }}>
                    Timing matters
                  </div>
                  <p className="pc-kresge-section-body" style={{ paddingLeft: 0, marginTop: '2px' }}>
                    “The opportunity closes soon, so the strongest next move is to validate the remaining materials and prepare the application.”
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Recommended Approach */}
            <section className="pc-kresge-overview-card" aria-label="Recommended Approach">
              <h2 className="pc-kresge-overview-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PosterChildIcon name="check-circle" size={16} className="pc-kresge-section-header-icon" />
                <span>Recommended Approach</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontFamily: "var(--pc-ref-font-body, 'DM Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#344054', marginBottom: '6px' }}>
                    What to do
                  </div>
                  <ul className="pc-kresge-bullet-list" style={{ paddingLeft: '24px' }}>
                    <li className="pc-kresge-bullet-item">Confirm the latest Youth Career Pathways program budget.</li>
                    <li className="pc-kresge-bullet-item">Attach the strongest participant testimonials.</li>
                    <li className="pc-kresge-bullet-item">Include current placement and impact metrics.</li>
                    <li className="pc-kresge-bullet-item">Use the Youth Career Pathways story as narrative evidence.</li>
                    <li className="pc-kresge-bullet-item">Review final application materials before submission.</li>
                  </ul>
                </div>

                <div>
                  <div style={{ fontFamily: "var(--pc-ref-font-body, 'DM Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#344054', marginBottom: '6px' }}>
                    Key talking points
                  </div>
                  <ul className="pc-kresge-bullet-list" style={{ paddingLeft: '24px' }}>
                    <li className="pc-kresge-bullet-item">Young people gain direct pathways into employment.</li>
                    <li className="pc-kresge-bullet-item">Participant stories demonstrate belonging and opportunity.</li>
                    <li className="pc-kresge-bullet-item">Current placement outcomes provide measurable evidence.</li>
                    <li className="pc-kresge-bullet-item">The program connects workforce development with economic mobility.</li>
                  </ul>
                </div>

                <div>
                  <div style={{ fontFamily: "var(--pc-ref-font-body, 'DM Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#344054' }}>
                    When to act
                  </div>
                  <p className="pc-kresge-section-body" style={{ paddingLeft: 0, marginTop: '2px' }}>
                    “Now — the opportunity is approaching its deadline.”
                  </p>
                </div>

                <div>
                  <div style={{ fontFamily: "var(--pc-ref-font-body, 'DM Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#344054', marginBottom: '8px' }}>
                    Prerequisites
                  </div>
                  <div className="pc-kresge-pill-tags" style={{ paddingLeft: 0 }}>
                    <span className="pc-kresge-pill">Current program budget</span>
                    <span className="pc-kresge-pill">Latest impact metrics</span>
                    <span className="pc-kresge-pill">Participant testimonials</span>
                    <span className="pc-kresge-pill">Youth Career Pathways story</span>
                    <span className="pc-kresge-pill">Final program information</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Challenges to Consider */}
            <section className="pc-kresge-overview-card" aria-label="Challenges to Consider">
              <h2 className="pc-kresge-overview-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PosterChildIcon name="alert-triangle" size={16} className="pc-kresge-section-header-icon" />
                <span>Challenges to Consider</span>
              </h2>
              <ul className="pc-kresge-bullet-list" style={{ paddingLeft: '24px' }}>
                <li className="pc-kresge-bullet-item">Program budget needs a final freshness check.</li>
                <li className="pc-kresge-bullet-item">Application evidence should use the most recent outcomes.</li>
                <li className="pc-kresge-bullet-item">Narrative and quantitative evidence should tell the same story.</li>
              </ul>
            </section>

            {/* 5. Application Process & Deadline */}
            <section className="pc-kresge-overview-card" aria-label="Application Process and Deadline">
              <h2 className="pc-kresge-overview-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PosterChildIcon name="arrow-right" size={16} className="pc-kresge-section-header-icon" />
                <span>Application Process & Deadline</span>
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontFamily: "var(--pc-ref-font-body, 'DM Sans', sans-serif)", fontSize: '14px', color: '#525252' }}>
                  Validate supporting materials
                </span>
                <span style={{ color: '#98A2B3', fontSize: '14px' }}>→</span>
                <span style={{ fontFamily: "var(--pc-ref-font-body, 'DM Sans', sans-serif)", fontSize: '14px', color: '#525252' }}>
                  Prepare application narrative
                </span>
                <span style={{ color: '#98A2B3', fontSize: '14px' }}>→</span>
                <span style={{ fontFamily: "var(--pc-ref-font-body, 'DM Sans', sans-serif)", fontSize: '14px', color: '#525252' }}>
                  Final review
                </span>
                <span style={{ color: '#98A2B3', fontSize: '14px' }}>→</span>
                <span style={{ fontFamily: "var(--pc-ref-font-body, 'DM Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#101828' }}>
                  Submit before deadline
                </span>
              </div>
            </section>

            {/* 6. Ready to Act? */}
            <section className="pc-kresge-overview-card" aria-label="Ready to act">
              <h2 className="pc-kresge-overview-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PosterChildIcon name="stars-01" size={16} className="pc-kresge-section-header-icon" />
                <span>Ready to Act?</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '2px' }}>
                <div>
                  <div style={{ fontFamily: "var(--pc-ref-font-body, 'DM Sans', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#101828' }}>
                    Create a Funder One-Pager
                  </div>
                  <p className="pc-kresge-section-body" style={{ paddingLeft: 0, marginTop: '2px' }}>
                    Generate a shareable brief using the stories, impact data, and program information already in PosterChild.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    iconTrailing="arrow-right"
                    onClick={() => handleTabChange('One-Pager')}
                  >
                    Create One-Pager
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    iconLeading="copy"
                    onClick={() => { }}
                  >
                    Copy Talking Points
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => { }}
                  >
                    Prepare Application
                  </Button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Profile Tab Content */}
        {activeTab === 'Profile' && (
          <>
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
          </>
        )}
      </div>
    </ProductPage>
  );
}
