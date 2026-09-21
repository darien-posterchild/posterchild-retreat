import React from 'react';
import { useSearchParams, useNavigate, useParams, useOutletContext } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { Badge } from '../../components/posterchild/Badge';
import { PosterChildIcon } from '../../components/posterchild/Icon';
import { Scene, DecisionStatus } from '../../types/session';
import { useDemoState } from '../../useDemoState';

interface StoryData {
  id: string;
  title: string;
  category: string;
  author: string;
  summary: string;
  excerpt: string;
  words: number;
  readTime: string;
}

const STORY_REGISTRY: Record<string, StoryData> = {
  'youth-career-pathways': {
    id: 'youth-career-pathways',
    title: 'Youth Career Pathways',
    category: 'Participant story · Workforce Development',
    author: 'Elena Vasquez & Postie',
    summary: 'A community-rooted narrative on belonging, peer confidence, and technical career opportunity.',
    excerpt: 'When students joined our summer technical apprenticeship, over 80% reported feeling intimidated by corporate environments. Three months later, their confidence and peer advocacy networks had transformed. By pairing technical training with living stipends and dedicated mentors, we built a bridge directly into Detroit’s tech economy.',
    words: 780,
    readTime: '~3 min'
  },
  'youth-voices': {
    id: 'youth-voices',
    title: 'Youth Career Pathways',
    category: 'Participant story · Workforce Development',
    author: 'Elena Vasquez & Postie',
    summary: 'A community-rooted narrative on belonging, peer confidence, and technical career opportunity.',
    excerpt: 'When students joined our summer technical apprenticeship, over 80% reported feeling intimidated by corporate environments. Three months later, their confidence and peer advocacy networks had transformed. By pairing technical training with living stipends and dedicated mentors, we built a bridge directly into Detroit’s tech economy.',
    words: 780,
    readTime: '~3 min'
  },
  'mayas-journey': {
    id: 'mayas-journey',
    title: "Maya’s Journey: Finding Belonging Through Mentorship",
    category: 'Scholar Profile · Education',
    author: 'Elena Vasquez',
    summary: 'A personal reflection on first-generation college preparation, peer advocacy, and breaking systemic barriers.',
    excerpt: 'When Maya stepped into our community center three years ago, she had never spoken to a college counselor. Today, she is mentoring fifteen high school sophomores while pursuing her environmental engineering degree.',
    words: 840,
    readTime: '~3 min'
  },
  'community-gardens': {
    id: 'community-gardens',
    title: 'Community Gardens: Sowing Roots and Trust',
    category: 'Community Impact · Sustainability',
    author: 'Darnell Washington',
    summary: 'Transforming 4 vacant urban parcels into communal harvests that fed over 300 families.',
    excerpt: 'The vacant lots on 14th street used to collect broken glass. Today they smell of rosemary, bell peppers, and damp fertile soil. Over 300 families harvested fresh produce this summer.',
    words: 750,
    readTime: '~3 min'
  }
};

type StoryTab = 'social' | 'article' | 'content-source';

interface StoryReviewOutletContext {
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

export default function StoryReview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();
  const outletCtx = useOutletContext<StoryReviewOutletContext>() || {};
  const { state, dispatch } = useDemoState();

  const storyKey = searchParams.get('story') || 'youth-career-pathways';
  const story = STORY_REGISTRY[storyKey] || STORY_REGISTRY['youth-career-pathways'];

  const tabParam = (searchParams.get('tab') as StoryTab) || 'social';
  const activeTab: StoryTab = ['social', 'article', 'content-source'].includes(tabParam) ? tabParam : 'social';

  const scene = outletCtx.scene ?? state.scene ?? 'dashboard';
  const decisionStatus = outletCtx.decisionStatus ?? state.decisionStatus ?? 'idle';
  const winningOptionId = outletCtx.winningOptionId ?? state.winningOptionId ?? state.winner ?? null;

  const isVoting = scene === 'voting' || decisionStatus === 'open';
  const isResult = scene === 'result' || decisionStatus === 'result';
  const isCompleted = state.completedMissionIds?.includes('youth-career-story');

  const setTab = (newTab: StoryTab) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', newTab);
    setSearchParams(nextParams);
  };

  const completeMission = () => {
    dispatch({ type: 'COMPLETE_MISSION', missionId: 'youth-career-story' });
  };

  const returnHome = () => {
    dispatch({ type: 'RETURN_HOME' });
    navigate(`/present/${sessionId}`);
  };

  const backToStories = () => {
    navigate(`/present/${sessionId}/tell/stories`);
  };

  return (
    <ProductPage
      title={story.title}
      description={story.category}
      primaryAction={
        isCompleted ? (
          <Button variant="primary" size="md" iconLeading="arrow-left" onClick={returnHome}>
            Return to Home
          </Button>
        ) : isResult ? (
          <Button
            variant="primary"
            size="md"
            iconLeading="check"
            onClick={completeMission}
          >
            {activeTab === 'social' ? 'Publish to Socials' : 'Share Article'}
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="md"
            iconLeading="arrow-left"
            onClick={backToStories}
          >
            Stories Catalog
          </Button>
        )
      }
      secondaryAction={
        <Badge variant={isCompleted ? 'ready' : 'upcoming'} size="md">
          {isCompleted ? 'Mission Complete' : 'Story Draft Studio'}
        </Badge>
      }
    >
      <div className="story-review-view" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              <strong>Story Mission Completed</strong>
              <span>— {story.title} activated and published.</span>
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
            <span>Audience is deciding on mobile: “How should we use this story?”</span>
          </div>
        ) : null}

        {/* Audience Choice Result Banner (when Ask Postie wins) */}
        {isResult && winningOptionId === 'ask-postie' && (
          <div
            style={{
              backgroundColor: '#F9F5FF',
              border: '1px solid #E9D7FE',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6941C6' }}>
              <PosterChildIcon name="stars-01" size={18} strokeWidth={2} />
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Postie Recommendation</h3>
              <Badge variant="brand" size="sm">Audience Choice</Badge>
            </div>
            <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D6BBFB' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#6941C6', fontWeight: 600 }}>
                💬 Presenter Question: “How should we use this story?”
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#344054', lineHeight: 1.5 }}>
                “I’d start with social. The participant quote is strong and the carousel gives you a quick way to test the story with your audience. You can still reuse the same core story for an article afterward.”
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button
                variant="primary"
                size="sm"
                iconLeading="check"
                onClick={() => {
                  setTab('social');
                  completeMission();
                }}
              >
                Use Postie’s recommendation &amp; Publish
              </Button>
            </div>
          </div>
        )}

        {/* 1. Tab Bar Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid #E4E7EC',
            paddingBottom: '2px'
          }}
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'social'}
            onClick={() => setTab('social')}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: activeTab === 'social' ? 600 : 500,
              color: activeTab === 'social' ? '#7F56D9' : '#667085',
              border: 'none',
              borderBottom: activeTab === 'social' ? '2px solid #7F56D9' : '2px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PosterChildIcon name="message-square-quote" size={16} />
            <span>Social Media</span>
            {isResult && winningOptionId === 'social' && (
              <Badge variant="brand" size="sm">Winner</Badge>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'article'}
            onClick={() => setTab('article')}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: activeTab === 'article' ? 600 : 500,
              color: activeTab === 'article' ? '#7F56D9' : '#667085',
              border: 'none',
              borderBottom: activeTab === 'article' ? '2px solid #7F56D9' : '2px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PosterChildIcon name="file-06" size={16} />
            <span>Article</span>
            {isResult && winningOptionId === 'article' && (
              <Badge variant="brand" size="sm">Winner</Badge>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'content-source'}
            onClick={() => setTab('content-source')}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: activeTab === 'content-source' ? 600 : 500,
              color: activeTab === 'content-source' ? '#7F56D9' : '#667085',
              border: 'none',
              borderBottom: activeTab === 'content-source' ? '2px solid #7F56D9' : '2px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PosterChildIcon name="folder" size={16} />
            <span>Content Source</span>
            <span style={{ fontSize: '11px', background: '#F2F4F7', color: '#667085', padding: '2px 6px', borderRadius: '4px' }}>
              Pending
            </span>
          </button>
        </div>

        {/* 2. Tab Content Panels */}
        {activeTab === 'social' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Social Header & Controls */}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#101828', margin: 0 }}>
                    Instagram Spotlight Carousel
                  </h2>
                  <p style={{ fontSize: '14px', color: '#667085', margin: '4px 0 0 0' }}>
                    Formatted multi-slide quote carousel ready for Instagram and LinkedIn publishing.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="secondary" size="sm" iconLeading="file-06">
                    Download All
                  </Button>
                  <Button variant="primary" size="sm" iconLeading="check" onClick={completeMission}>
                    Publish to Socials
                  </Button>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px'
                }}
              >
                {/* Slide 1 Preview */}
                <div
                  style={{
                    backgroundColor: '#1D2939',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '24px',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    PosterChild • Slide 1
                  </span>
                  <p style={{ fontSize: '16px', fontWeight: 500, lineHeight: 1.4, margin: '16px 0' }}>
                    “Building confidence wasn’t just about code. It was about knowing we had a team in our corner.”
                  </p>
                  <span style={{ fontSize: '12px', color: '#D0D5DD' }}>
                    — Participant, Youth Career Pathways
                  </span>
                </div>

                {/* Slide 2 Preview */}
                <div
                  style={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #EAECF0',
                    borderRadius: '12px',
                    padding: '24px',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#667085', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    PosterChild • Slide 2
                  </span>
                  <div>
                    <strong style={{ fontSize: '24px', color: '#7F56D9', display: 'block' }}>80% → 100%</strong>
                    <p style={{ fontSize: '13px', color: '#475467', margin: '6px 0 0 0' }}>
                      Program retention across summer apprenticeships with full stipend support.
                    </p>
                  </div>
                  <span style={{ fontSize: '12px', color: '#98A2B3' }}>
                    #YouthVoices #Belonging
                  </span>
                </div>
              </div>

              {/* Postie Context Box */}
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #EAECF0',
                  borderRadius: '8px',
                  padding: '14px 16px'
                }}
              >
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#475467', fontWeight: 600 }}>
                  💬 Caption Optimization with Postie
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#344054', lineHeight: 1.5 }}>
                  <em>Postie: “I’d make the opening more direct and keep the proof point in the second sentence. I can also adapt it for LinkedIn or Instagram without changing the core story.”</em>
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'article' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Article Content Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '12px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#7F56D9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Article / Blog / Newsletter
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#101828', margin: '6px 0 8px 0' }}>
                    Youth Career Pathways: Networks that build confidence
                  </h2>
                  <p style={{ fontSize: '14px', color: '#667085', margin: 0 }}>
                    A complete article draft ready to edit, share, or adapt.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="secondary" size="sm" iconLeading="file-06">
                    Edit HTML
                  </Button>
                  <Button variant="primary" size="sm" iconLeading="check" onClick={completeMission}>
                    Share Article
                  </Button>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #EAECF0', margin: 0 }} />

              <div style={{ fontSize: '15px', lineHeight: 1.7, color: '#334155', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ margin: 0 }}>
                  {story.excerpt}
                </p>
                <p style={{ margin: 0 }}>
                  When youth are asked what makes the largest difference in career readiness, technical skills are only half the answer. The defining factor is relational capital: having mentors who have navigated the same barriers and having a cohort of peers to lean on when the learning curve steepens.
                </p>
              </div>

              {/* Postie Article Assistant Box */}
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #EAECF0',
                  borderRadius: '8px',
                  padding: '14px 16px'
                }}
              >
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#475467', fontWeight: 600 }}>
                  💬 Article Tone Tuning with Postie
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#344054', lineHeight: 1.5 }}>
                  <em>Postie: “I’d open with the participant insight first, then explain the pattern across all four testimonials. That makes the article feel more human before introducing the broader program context.”</em>
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content-source' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px dashed #D0D5DD',
              borderRadius: '12px',
              padding: '48px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '12px'
            }}
          >
            <PosterChildIcon name="folder" size={32} style={{ color: '#98A2B3' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#101828', margin: 0 }}>
              Content Source &amp; Raw Materials
            </h3>
            <Badge variant="upcoming" size="sm">VISUAL DESIGN PENDING</Badge>
            <p style={{ fontSize: '14px', color: '#667085', maxWidth: '460px', margin: 0 }}>
              This tab will house recorded voice notes, raw interview transcripts, media releases, and attribution source mappings in future product releases.
            </p>
          </div>
        )}
      </div>
    </ProductPage>
  );
}
