import React, { useState } from 'react';
import { useSearchParams, useNavigate, useParams, useOutletContext } from 'react-router-dom';
import ProductPage from '../../components/posterchild/ProductPage';
import { Button } from '../../components/posterchild/Button';
import { Badge } from '../../components/posterchild/Badge';
import { PosterChildIcon } from '../../components/posterchild/Icon';
import { Tabs } from '../../components/posterchild/Tabs';
import { Scene, DecisionStatus } from '../../types/session';
import { useDemoState } from '../../useDemoState';
import communityCatalystLogo from '../../assets/screens/story-review-social/community-catalyst-logo.png';
import galleryImg1 from '../../assets/screens/story-review-article/gallery-1.png';
import galleryImg2 from '../../assets/screens/story-review-article/gallery-2.png';
import galleryImg3 from '../../assets/screens/story-review-article/gallery-3.png';
import galleryImg4 from '../../assets/screens/story-review-article/gallery-4.png';

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
type StoryFormat = 'carousel' | 'single-poster';

interface BrandColorSwatch {
  id: string;
  color: string;
  label: string;
}

const BRAND_COLORS: BrandColorSwatch[] = [
  { id: 'dark-teal', color: '#00382E', label: 'Dark Teal' },
  { id: 'cadet-blue', color: '#5B9B9B', label: 'Cadet Blue' },
  { id: 'orange', color: '#EB5E28', label: 'Orange' },
];

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

  // Format switcher and color selection state
  const [format, setFormat] = useState<StoryFormat>('carousel');
  const [selectedColorId, setSelectedColorId] = useState<string>('dark-teal');

  const activeColor = BRAND_COLORS.find((c) => c.id === selectedColorId)?.color || '#00382E';

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

  const activeActionLabel = activeTab === 'social' ? 'Publish to Socials' : 'Share article';

  return (
    <ProductPage
      title={story.title}
      description={story.category}
      primaryAction={
        isCompleted ? (
          <Button variant="primary" size="md" iconLeading="check" onClick={returnHome}>
            Return to Home [H]
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            iconLeading="check"
            onClick={completeMission}
          >
            {activeActionLabel}
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

        {/* 1. Primary Content Tabs */}
        <Tabs<StoryTab>
          ariaLabel="Story review sections"
          activeId={activeTab}
          onChange={setTab}
          items={[
            {
              id: 'social',
              label: 'Social Media',
              badge: isResult && winningOptionId === 'social' ? (
                <Badge variant="brand" size="sm">Winner</Badge>
              ) : undefined,
            },
            {
              id: 'article',
              label: 'Article',
              badge: isResult && winningOptionId === 'article' ? (
                <Badge variant="brand" size="sm">Winner</Badge>
              ) : undefined,
            },
            {
              id: 'content-source',
              label: 'Content Source',
            },
          ]}
        />

        {/* 2. Secondary Format Switcher */}
        {activeTab === 'social' && (
          <div className="pc-story-format-switcher">
            <button
              type="button"
              className={`pc-story-format-btn ${format === 'carousel' ? 'is-active' : ''}`}
              onClick={() => setFormat('carousel')}
            >
              <PosterChildIcon name="carousel" size={15} />
              <span>Carousel</span>
            </button>
            <button
              type="button"
              className={`pc-story-format-btn ${format === 'single-poster' ? 'is-active' : ''}`}
              onClick={() => setFormat('single-poster')}
            >
              <PosterChildIcon name="poster" size={15} />
              <span>Single Poster</span>
              <Badge variant="upcoming" size="sm">New</Badge>
            </button>
          </div>
        )}

        {/* 3. Tab Content Panels */}
        {activeTab === 'social' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Horizontal Control Bar */}
            <div className="pc-story-control-bar">
              <div className="pc-story-controls-left">
                {/* OUTPUT */}
                <div className="pc-story-control-group">
                  <span className="pc-story-control-label">Output</span>
                  <button type="button" className="pc-story-control-dropdown">
                    <PosterChildIcon name="instagram" size={18} color="#E1306C" strokeWidth={1.8} />
                    <span>Instagram: Carousel</span>
                    <PosterChildIcon name="chevron-down" size={16} color="#737373" strokeWidth={2} />
                  </button>
                </div>

                <div className="pc-story-control-divider" />

                {/* CAROUSEL TEMPLATE */}
                <div className="pc-story-control-group">
                  <span className="pc-story-control-label">Carousel Template</span>
                  <button type="button" className="pc-story-control-dropdown">
                    <span>Spotlight Quote</span>
                    <PosterChildIcon name="chevron-down" size={16} color="#737373" strokeWidth={2} />
                  </button>
                </div>

                <div className="pc-story-control-divider" />

                {/* BRAND COLORS */}
                <div className="pc-story-control-group">
                  <span className="pc-story-control-label">Brand Colors</span>
                  <div className="pc-story-swatches-row">
                    {BRAND_COLORS.map((swatch) => {
                      const isSelected = selectedColorId === swatch.id;
                      return (
                        <button
                          key={swatch.id}
                          type="button"
                          title={swatch.label}
                          aria-label={`Select ${swatch.label}`}
                          className={`pc-story-swatch-btn ${isSelected ? 'is-selected' : ''}`}
                          style={{ backgroundColor: swatch.color }}
                          onClick={() => setSelectedColorId(swatch.id)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS RIGHT */}
              <div className="pc-story-controls-right">
                <Button variant="secondary" size="sm" iconLeading="edit-02">
                  Edit Slides
                </Button>
                <Button variant="primary" size="sm" iconLeading="check" onClick={completeMission}>
                  Publish to Socials
                </Button>
              </div>
            </div>

            {/* Split Preview Grid */}
            <div className="pc-story-preview-grid">
              {/* Left Column: Post Details */}
              <div className="pc-story-details-col">
                <div className="pc-story-details-section">
                  <div className="pc-story-section-header">
                    <h3 className="pc-story-section-title">Caption</h3>
                    <span className="pc-story-char-count">128 chars</span>
                  </div>
                  <div className="pc-story-textarea-wrap">
                    <textarea
                      className="pc-story-textarea"
                      rows={4}
                      defaultValue="For many young people, career confidence doesn’t begin with a résumé. It begins when they can see what’s possible. #YouthCareerPathways"
                    />
                    <div className="pc-story-textarea-actions">
                      <Button variant="secondary" size="sm" iconLeading="stars-01">
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pc-story-details-section">
                  <h3 className="pc-story-section-title">Scheduled Channel</h3>
                  <div className="pc-story-channel-card">
                    <div className="pc-story-channel-icon-wrap">
                      <PosterChildIcon name="instagram" size={20} color="#E1306C" />
                    </div>
                    <div className="pc-story-channel-info">
                      <div className="pc-story-channel-name">Instagram Business</div>
                      <div className="pc-story-channel-handle">@communitycatalyst · Auto-scheduled</div>
                    </div>
                    <Badge variant="ready" size="sm">Connected</Badge>
                  </div>
                </div>

                <div className="pc-story-details-section">
                  <h3 className="pc-story-section-title">Target Audience</h3>
                  <div className="pc-story-tags-row">
                    <span className="pc-story-tag">Local Donors</span>
                    <span className="pc-story-tag">Corporate Partners</span>
                    <span className="pc-story-tag">Youth Advocates</span>
                    <span className="pc-story-tag">Alumni Network</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Slide Visual Preview */}
              <div className="pc-story-visual-col">
                <div className="pc-story-artwork-preview" style={{ backgroundColor: activeColor }}>
                  <div className="pc-story-artwork-brand">
                    <img
                      src={communityCatalystLogo}
                      alt="Community Catalyst Logo"
                      className="pc-story-artwork-brand-img"
                    />
                  </div>

                  <div className="pc-story-artwork-content">
                    <div className="pc-story-artwork-quote-icon">“</div>
                    <p className="pc-story-artwork-quote-text">
                      I didn’t know people in this field before. Now I know who to ask, what to look for, and what I can do next.
                    </p>
                    <div className="pc-story-artwork-attribution">
                      — Youth Career Pathways participant
                    </div>
                  </div>

                  <div className="pc-story-artwork-brand" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>
                      COMMUNITY CATALYST
                    </span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                      01 / 04
                    </span>
                  </div>
                </div>

                {/* Preview Navigation */}
                <div className="pc-story-preview-actions">
                  <Button variant="secondary" size="sm">
                    Preview all 4 slides
                  </Button>
                  <Button variant="secondary" size="sm" iconLeading="download">
                    Export Assets
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'article' && (
          <div className="pc-article-card">
            {/* Header */}
            <div className="pc-article-header">
              <div className="pc-article-header-left">
                <h3 className="pc-article-header-title">Article / Blog / Newsletter</h3>
                <p className="pc-article-header-subtitle">A complete article draft ready to edit, share, or adapt.</p>
              </div>
              <div className="pc-article-header-actions">
                <Button variant="secondary" size="sm">
                  Edit HTML
                </Button>
                <Button variant="primary" size="sm" onClick={completeMission}>
                  Share Article
                </Button>
              </div>
            </div>

            {/* Visual Editor Toolbar */}
            <div className="pc-article-toolbar">
              {/* Undo / Redo */}
              <div className="pc-article-toolbar-group">
                <button type="button" className="pc-article-tool-btn" title="Undo" aria-label="Undo">
                  <PosterChildIcon name="undo" size={20} strokeWidth={1.67} />
                </button>
                <button type="button" className="pc-article-tool-btn" title="Redo" aria-label="Redo">
                  <PosterChildIcon name="redo" size={20} strokeWidth={1.67} />
                </button>
              </div>

              <div className="pc-article-toolbar-divider" />

              {/* Font selector: Inter / Font size: 16px */}
              <div className="pc-article-toolbar-group">
                <button type="button" className="pc-article-tool-select" title="Font family">
                  <span>Inter</span>
                  <PosterChildIcon name="chevron-down" size={14} strokeWidth={2} color="#737373" />
                </button>
                <button type="button" className="pc-article-tool-select" title="Font size">
                  <span>16px</span>
                  <PosterChildIcon name="chevron-down" size={14} strokeWidth={2} color="#737373" />
                </button>
              </div>

              <div className="pc-article-toolbar-divider" />

              {/* Formatting: bold, italic, underline & color swatch */}
              <div className="pc-article-toolbar-group">
                <button type="button" className="pc-article-tool-btn" title="Bold" aria-label="Bold">
                  <PosterChildIcon name="bold" size={20} strokeWidth={1.67} />
                </button>
                <button type="button" className="pc-article-tool-btn" title="Italic" aria-label="Italic">
                  <PosterChildIcon name="italic" size={20} strokeWidth={1.67} />
                </button>
                <button type="button" className="pc-article-tool-btn" title="Underline" aria-label="Underline">
                  <PosterChildIcon name="underline" size={20} strokeWidth={1.67} />
                </button>
                <button type="button" className="pc-article-color-swatch-wrapper" title="Text color" aria-label="Text color">
                  <span className="pc-article-color-swatch" />
                </button>
              </div>

              <div className="pc-article-toolbar-divider" />

              {/* Alignment controls */}
              <div className="pc-article-toolbar-group">
                <button type="button" className="pc-article-tool-btn is-active" title="Align left" aria-label="Align left">
                  <PosterChildIcon name="align-left" size={20} strokeWidth={1.67} />
                </button>
                <button type="button" className="pc-article-tool-btn" title="Align center" aria-label="Align center">
                  <PosterChildIcon name="align-center" size={20} strokeWidth={1.67} />
                </button>
                <button type="button" className="pc-article-tool-btn" title="Align right" aria-label="Align right">
                  <PosterChildIcon name="align-right" size={20} strokeWidth={1.67} />
                </button>
              </div>

              <div className="pc-article-toolbar-divider" />

              {/* List controls */}
              <div className="pc-article-toolbar-group">
                <button type="button" className="pc-article-tool-btn" title="Bullet list" aria-label="Bullet list">
                  <PosterChildIcon name="list" size={20} strokeWidth={1.67} />
                </button>
                <button type="button" className="pc-article-tool-btn" title="Numbered list" aria-label="Numbered list">
                  <PosterChildIcon name="list-ordered" size={20} strokeWidth={1.67} />
                </button>
              </div>

              <div className="pc-article-toolbar-divider" />

              {/* Link, Image, Sparkles */}
              <div className="pc-article-toolbar-group">
                <button type="button" className="pc-article-tool-btn" title="Insert link" aria-label="Insert link">
                  <PosterChildIcon name="link-01" size={20} strokeWidth={1.67} />
                </button>
                <button type="button" className="pc-article-tool-btn" title="Insert image" aria-label="Insert image">
                  <PosterChildIcon name="image-03" size={20} strokeWidth={1.67} />
                </button>
                <button type="button" className="pc-article-tool-btn" title="AI Assistant" aria-label="AI Assistant">
                  <PosterChildIcon name="sparkles" size={20} strokeWidth={1.67} color="#8F6500" />
                </button>
              </div>
            </div>

            {/* Article Canvas Area */}
            <div className="pc-article-canvas">
              {/* 4-up Image Gallery */}
              <div className="pc-article-gallery">
                <img src={galleryImg1} alt="Participant testimonial 1" className="pc-article-gallery-img" />
                <img src={galleryImg2} alt="Participant testimonial 2" className="pc-article-gallery-img" />
                <img src={galleryImg3} alt="Participant testimonial 3" className="pc-article-gallery-img" />
                <img src={galleryImg4} alt="Participant testimonial 4" className="pc-article-gallery-img" />
              </div>

              {/* Article Content */}
              <div className="pc-article-content-body">
                <h2 className="pc-article-content-title">
                  Youth Career Pathways: Networks that build confidence
                </h2>

                <p className="pc-article-p">
                  For many young people, career confidence does not begin with a résumé. It begins when they can see people, places, and opportunities that make a future feel possible.
                </p>

                <p className="pc-article-p">
                  Four recent Youth Career Pathways testimonials point to the same pattern: mentors, peers, and professional connections help participants understand what comes next and feel more prepared to take that step.
                </p>

                <div className="pc-article-pullquote">
                  <p className="pc-article-pullquote-body">
                    “I didn’t know people in this field before. Now I know who to ask, what to look for, and what I can do next.”
                  </p>
                  <p className="pc-article-pullquote-attribution">
                    — Youth Career Pathways participant
                  </p>
                </div>

                <p className="pc-article-p">
                  That sense of connection is becoming a repeatable part of the program’s impact. PosterChild can adapt this story for a newsletter, donor update, website article, or other distribution channel once the article is approved.
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
