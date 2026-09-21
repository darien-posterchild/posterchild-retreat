import React from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { Badge } from '../../components/posterchild/Badge';
import { PosterChildIcon } from '../../components/posterchild/Icon';

interface CampaignActionDetails {
  title: string;
  subtitle: string;
  badgeLabel: string;
  badgeVariant: 'brand' | 'ready' | 'upcoming';
  headline: string;
  description: string;
  points: { title: string; desc: string }[];
  primaryCtaText: string;
}

const ACTION_MAP: Record<string, CampaignActionDetails> = {
  launch: {
    title: 'Launch Campaign: Fall Impact Campaign',
    subtitle: 'Deploying the active fundraising campaign live across donor networks.',
    badgeLabel: 'Launch Status: Ready to Publish',
    badgeVariant: 'brand',
    headline: 'Campaign Pre-Flight Verification',
    description: 'The team voted to launch immediately. All automated sequences, donor segmentation lists, and payment processors are confirmed ready.',
    points: [
      {
        title: 'Audience Network Ready',
        desc: '2,400 active donors and community supporters queued for email sequence activation.',
      },
      {
        title: 'Goal & Donation Portal Configured',
        desc: 'Target goal set at $75,000 USD with recurring pledge tiers ($25, $50, $100, $500).',
      },
      {
        title: 'Real-time Conversion Tracking',
        desc: 'Live analytics and Postie donor engagement alerts enabled across web and email channels.',
      },
    ],
    primaryCtaText: 'Confirm & Launch Campaign',
  },
  refine: {
    title: 'Refine Campaign: Fall Impact Campaign',
    subtitle: 'Tighten storytelling hooks, donor tiers, and segment outreach before go-live.',
    badgeLabel: 'Status: Editorial Refinement Active',
    badgeVariant: 'upcoming',
    headline: 'Targeted Copy & Strategy Adjustments',
    description: 'The team voted to refine the campaign first. Postie identified three key areas to strengthen resonance before launching to supporters.',
    points: [
      {
        title: '1. Lead with Community Outcome',
        desc: 'Ground the opening paragraph in verified participant stories rather than administrative milestones.',
      },
      {
        title: '2. Clarify Impact per Tier',
        desc: 'Explicitly specify what each tier accomplishes (e.g., $100 covers 1 month of mentorship support).',
      },
      {
        title: '3. Highlight Urgent Timeline',
        desc: 'Reinforce the fall semester funding deadline to encourage immediate first-week pledge commitments.',
      },
    ],
    primaryCtaText: 'Approve Refinements & Proceed',
  },
  'ask-postie': {
    title: 'Postie Campaign Analysis & Recommendations',
    subtitle: 'Simulated strategic review of donor engagement patterns and messaging resonance.',
    badgeLabel: 'Status: Postie AI Recommendations Ready',
    badgeVariant: 'brand',
    headline: 'Postie Recommendation Summary',
    description: 'The team chose Postie. Reviewing campaign history and supporter data yields three high-impact recommendations:',
    points: [
      {
        title: '1. Lead with the Community Outcome',
        desc: 'Frame the campaign appeal around authentic community impact narratives for 24% higher empathy conversion.',
      },
      {
        title: '2. Tighten the Donor Call-to-Action',
        desc: 'Simplify the pledge button text and emphasize tangible recurring giving options.',
      },
      {
        title: '3. Segment Returning Supporters Separately',
        desc: 'Send a personalized appreciation note to past donors before the general public broadcast.',
      },
    ],
    primaryCtaText: 'Apply Recommendations & Proceed',
  },
};

interface CampaignActionOutletContext {
  winningOptionId?: string | null;
  winner?: string | null;
}

export const CampaignAction: React.FC = () => {
  const { action = 'launch', sessionId = 'PC26' } = useParams<{ action?: string; sessionId?: string }>();
  const navigate = useNavigate();
  const outletCtx = useOutletContext<CampaignActionOutletContext>() || {};

  const effectiveAction = action || outletCtx.winningOptionId || outletCtx.winner || 'launch';
  const info = ACTION_MAP[effectiveAction] || ACTION_MAP['launch'];

  const handleProceed = () => {
    navigate(`/present/${sessionId}/next-steps?source=campaign&action=${effectiveAction}`);
  };

  return (
    <ProductPage
      figmaNode="campaign-action"
      title={info.title}
      description={info.subtitle}
      secondaryAction={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/present/${sessionId}/raise`)}
        >
          ← Back to Raise
        </Button>
      }
      primaryAction={
        <Button
          variant="primary"
          size="md"
          iconLeading="check"
          onClick={handleProceed}
        >
          {info.primaryCtaText}
        </Button>
      }
    >
      <div className="pc-product-card" style={{ padding: '32px', gap: '24px' }}>
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '20px',
            borderBottom: '1px solid #F0F0F0',
          }}
        >
          <Badge variant={info.badgeVariant} showDot>
            {info.badgeLabel}
          </Badge>
          <span
            style={{
              fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
              fontSize: '13px',
              fontWeight: 600,
              color: '#171717',
            }}
          >
            Campaign Goal: $75,000 USD
          </span>
        </div>

        {/* Narrative & Direction */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--pc-ref-font-display, serif)",
              fontSize: '20px',
              fontWeight: 600,
              color: '#171717',
            }}
          >
            {info.headline}
          </h3>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
              fontSize: '15px',
              lineHeight: '24px',
              color: '#374151',
            }}
          >
            {info.description}
          </p>
        </div>

        {/* 3 Structured Recommendations / Action Points */}
        <div className="pc-product-grid-3" style={{ paddingTop: '4px' }}>
          {info.points.map((pt, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid #E5E5E5',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>{pt.title}</div>
              <div style={{ fontSize: '13px', color: '#525252', lineHeight: '18px' }}>{pt.desc}</div>
            </div>
          ))}
        </div>

        {/* Postie Callout Box */}
        <div
          style={{
            backgroundColor: '#FFF9E8',
            border: '1px solid #FFE58F',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#FEF08A',
              color: '#8F6500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <PosterChildIcon name="stars-01" size={20} color="#8F6500" strokeWidth={2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div
              style={{
                fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                fontSize: '14px',
                fontWeight: 600,
                color: '#171717',
              }}
            >
              Postie Fundraising Insight
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                fontSize: '13px',
                lineHeight: '18px',
                color: '#525252',
              }}
            >
              Targeting alumni and past donors during week one historically drives 65% of overall campaign momentum. Postie will assist with real-time conversion monitoring once advanced.
            </p>
          </div>
        </div>

        {/* Footer & Next Steps Handoff */}
        <div
          style={{
            paddingTop: '20px',
            borderTop: '1px solid #F0F0F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
              fontSize: '12px',
              color: '#737373',
            }}
          >
            Campaign Branch • Ready for Convergence
          </span>
          <button
            type="button"
            onClick={handleProceed}
            className="pc-product-section__link"
          >
            <span>Proceed to Convergence Roadmap</span>
            <PosterChildIcon name="arrow-right" size={14} color="#8F6500" />
          </button>
        </div>
      </div>
    </ProductPage>
  );
};

export default CampaignAction;
