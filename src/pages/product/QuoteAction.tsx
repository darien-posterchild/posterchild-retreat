import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { Badge } from '../../components/posterchild/Badge';
import { PosterChildIcon } from '../../components/posterchild/Icon';

const CHANNEL_DETAILS: Record<string, { title: string; subtitle: string; description: string; previewType: string }> = {
  'story': {
    title: 'Quote Featured in Impact Story',
    subtitle: 'Embedding community testimony as the anchor narrative.',
    description: 'The team selected this quote to open our next long-form community impact story. It will appear with speaker photo and community context.',
    previewType: 'Story Hero Quote'
  },
  'campaign': {
    title: 'Quote Anchored in Campaign Appeal',
    subtitle: 'Prominently positioned on the donation and partnership landing page.',
    description: 'The team voted to place this quote above the primary donation form. Direct community voice increases donor empathy and recurring contribution rates.',
    previewType: 'Campaign Callout'
  },
  'social': {
    title: 'Quote Formatted for Social Media',
    subtitle: 'Generated square and vertical graphic assets for multi-channel distribution.',
    description: 'Postie has generated social quote cards optimized for Instagram, LinkedIn, and community bulletin boards.',
    previewType: 'Social Media Card'
  }
};

export const QuoteAction: React.FC = () => {
  const { channel = 'story', sessionId = 'PC26' } = useParams<{ channel?: string; sessionId?: string }>();
  const navigate = useNavigate();
  const details = CHANNEL_DETAILS[channel] || CHANNEL_DETAILS['story'];

  const handleProceed = () => {
    navigate(`/present/${sessionId}/next-steps`);
  };

  return (
    <ProductPage
      figmaNode="quote-action"
      title={details.title}
      description={details.subtitle}
      secondaryAction={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/present/${sessionId}/tell/quotes`)}
        >
          ← Back to Quotes
        </Button>
      }
      primaryAction={
        <Button
          variant="primary"
          size="md"
          iconLeading="check"
          onClick={handleProceed}
        >
          Approve Placement
        </Button>
      }
    >
      <div className="pc-product-card" style={{ padding: '32px', gap: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '20px',
            borderBottom: '1px solid #F0F0F0',
          }}
        >
          <Badge variant="ready" showDot>
            {details.previewType}
          </Badge>
          <span
            style={{
              fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
              fontSize: '13px',
              color: '#737373',
            }}
          >
            Verified Community Release
          </span>
        </div>

        {/* Live Preview Card */}
        <div
          style={{
            backgroundColor: '#FFF9E8',
            border: '1px solid #FFE58F',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: 'italic',
              fontSize: '18px',
              lineHeight: '28px',
              color: '#171717',
            }}
          >
            "When we started the garden, we didn't just plant vegetables; we planted trust between families who hadn't spoken in years."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#171717',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ER
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#171717',
                }}
              >
                Elena Ramirez
              </div>
              <div
                style={{
                  fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                  fontSize: '12px',
                  color: '#737373',
                }}
              >
                Community Organizer • Urban Sanctuaries
              </div>
            </div>
          </div>
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
            fontSize: '14px',
            lineHeight: '22px',
            color: '#525252',
          }}
        >
          {details.description}
        </p>

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
              color: '#A3A3A3',
            }}
          >
            Quote Node • quotes-next branch
          </span>
          <button
            type="button"
            onClick={handleProceed}
            className="pc-product-section__link"
          >
            <span>Proceed to Convergence</span>
            <PosterChildIcon name="arrow-right" size={14} color="#8F6500" />
          </button>
        </div>
      </div>
    </ProductPage>
  );
};

export default QuoteAction;
