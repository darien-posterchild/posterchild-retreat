import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { Badge } from '../../components/posterchild/Badge';
import { PosterChildIcon } from '../../components/posterchild/Icon';

interface QuoteItem {
  id: string;
  quote: string;
  speaker: string;
  role: string;
  resonance: number;
  source: string;
  tags: string[];
}

const SAMPLE_QUOTES: QuoteItem[] = [
  {
    id: 'quote-1',
    quote: "When we started the garden, we didn't just plant vegetables; we planted trust between families who hadn't spoken in years.",
    speaker: "Elena Ramirez",
    role: "Community Organizer",
    resonance: 96,
    source: "Summer Workshop Interview",
    tags: ["Community", "Food Security", "Trust"]
  },
  {
    id: 'quote-2',
    quote: "Before this program, I thought leadership was something given to you. Now I know it's something you build with your peers.",
    speaker: "Marcus Chen",
    role: "Youth Cohort Fellow",
    resonance: 92,
    source: "Post-Graduation Survey",
    tags: ["Youth Leadership", "Mentorship"]
  },
  {
    id: 'quote-3',
    quote: "Every dollar invested here stayed in our neighborhood, multiplied by the sweat equity of our neighbors.",
    speaker: "Darnell Washington",
    role: "Local Business Partner",
    resonance: 88,
    source: "Annual Impact Roundtable",
    tags: ["Economic Empowerment", "Local Impact"]
  }
];

export const TellQuotes: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();

  const handleActivateQuote = (channel: string) => {
    navigate(`/present/${sessionId}/tell/quotes/${channel}`);
  };

  return (
    <ProductPage
      figmaNode="tell-quotes"
      title="Community Quotes"
      description="High-resonance quotes automatically curated from your interviews and community feedback."
      primaryAction={
        <Button
          variant="primary"
          size="md"
          iconLeading="stars-01"
          onClick={() => handleActivateQuote('story')}
        >
          Curate quote
        </Button>
      }
    >
      {/* 1. Highlight Banner */}
      <div
        className="pc-product-card pc-product-card--callout pc-product-card--banner"
        style={{ padding: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#FEF08A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <PosterChildIcon name="stars-01" size={24} color="#8F6500" strokeWidth={2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h3
              style={{
                margin: 0,
                fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                fontSize: '16px',
                fontWeight: 600,
                color: '#171717',
              }}
            >
              5 high-resonance quotes surfaced this week
            </h3>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                fontSize: '13px',
                color: '#525252',
              }}
            >
              Postie analyzed recent youth cohort recordings and highlighted statements with above 90% emotional resonance.
            </p>
          </div>
        </div>
        <div>
          <Button
            variant="secondary"
            size="sm"
            iconLeading="announcement-02"
            onClick={() => handleActivateQuote('campaign')}
          >
            Use in campaign
          </Button>
        </div>
      </div>

      {/* 2. Quotes List */}
      <section className="pc-product-section" aria-label="Surfaced Quotes">
        <div className="pc-product-section__header">
          <h2 className="pc-product-section__title">
            Surfaced Quotes
          </h2>
          <span
            style={{
              fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
              fontSize: '12px',
              color: '#737373',
            }}
          >
            Sorted by emotional resonance
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {SAMPLE_QUOTES.map((q) => (
            <div
              key={q.id}
              className="pc-product-card"
              style={{ padding: '24px', gap: '16px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Badge variant="ready" showDot>
                    {q.resonance}% Resonance
                  </Badge>
                  <span
                    style={{
                      fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                      fontSize: '12px',
                      color: '#737373',
                    }}
                  >
                    {q.source}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontStyle: 'italic',
                    fontSize: '17px',
                    lineHeight: '26px',
                    color: '#171717',
                  }}
                >
                  "{q.quote}"
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid #F5F5F5',
                  paddingTop: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#171717',
                    }}
                  >
                    {q.speaker}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--pc-ref-font-body, 'DM Sans')",
                      fontSize: '12px',
                      color: '#737373',
                    }}
                  >
                    {q.role}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    iconLeading="book-open-01"
                    onClick={() => handleActivateQuote('story')}
                  >
                    Story
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleActivateQuote('social')}
                  >
                    Social card
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ProductPage>
  );
};

export default TellQuotes;
