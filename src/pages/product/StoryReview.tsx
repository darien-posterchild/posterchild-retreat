import React, { useRef, useState } from 'react';
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
import youthCareerPathwaysImage from '../../assets/screens/home/youth-career-pathways.png';


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
  isVoteRevealed?: boolean;
  completeMission?: (missionId?: string) => void;
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
  const [socialRefreshed, setSocialRefreshed] = useState(false);
  const [isRefreshingSocial, setIsRefreshingSocial] = useState(false);
  const [typedRefreshQuote, setTypedRefreshQuote] = useState('');
  const [typedRefreshQuote2, setTypedRefreshQuote2] = useState('');
  const [typedRefreshQuote3, setTypedRefreshQuote3] = useState('');
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    const el = carouselRef.current;

    if (!el) return;

    const amount = 436;

    el.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  const activeColor = BRAND_COLORS.find((c) => c.id === selectedColorId)?.color || '#00382E';

  React.useEffect(() => {
    const shouldRefresh = searchParams.get('refresh') === '1';

    if (!shouldRefresh || socialRefreshed || isRefreshingSocial) return;

    setIsRefreshingSocial(true);

    // During transition (~900ms): change selected brand color from dark teal to orange
    const colorTimer = window.setTimeout(() => {
      setSelectedColorId('orange');
    }, 1400);

    // After ~2000ms: finish in refreshed state with updated copy
    const finishTimer = window.setTimeout(() => {
      setSocialRefreshed(true);
      setIsRefreshingSocial(false);

      // Clean up ?refresh=1 from URL so it doesn't auto-refresh on subsequent visits
      const nextParams = new URLSearchParams(window.location.search);
      if (nextParams.has('refresh')) {
        nextParams.delete('refresh');
        setSearchParams(nextParams, { replace: true });
      }
    }, 3200);

    return () => {
      window.clearTimeout(colorTimer);
      window.clearTimeout(finishTimer);
    };
  }, [searchParams, socialRefreshed, setSearchParams]);
  React.useEffect(() => {
    if (!socialRefreshed) return;

    const quotes = [
      'A clearer first step can turn uncertainty into momentum — and help young people see where they can go next.',
      'With stronger support and clearer connections, young people can move from curiosity to real opportunity.',
      'Career confidence grows when the next step feels visible, practical, and supported.',
    ];

    setTypedRefreshQuote('');
    setTypedRefreshQuote2('');
    setTypedRefreshQuote3('');

    const timers: number[] = [];

    const typeText = (
      text: string,
      setter: React.Dispatch<React.SetStateAction<string>>,
      delay: number
    ) => {
      const startTimer = window.setTimeout(() => {
        let index = 0;

        const typingTimer = window.setInterval(() => {
          index += 1;
          setter(text.slice(0, index));

          if (index >= text.length) {
            window.clearInterval(typingTimer);
          }
        }, 22);

        timers.push(typingTimer);
      }, delay);

      timers.push(startTimer);
    };

    typeText(quotes[0], setTypedRefreshQuote, 0);
    typeText(quotes[1], setTypedRefreshQuote2, 180);
    typeText(quotes[2], setTypedRefreshQuote3, 360);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [socialRefreshed]);

  const scene = outletCtx.scene ?? state.scene ?? 'dashboard';
  const decisionStatus = outletCtx.decisionStatus ?? state.decisionStatus ?? 'idle';
  const winningOptionId = outletCtx.winningOptionId ?? state.winningOptionId ?? state.winner ?? null;

  const isVoteRevealed = (outletCtx as { isVoteRevealed?: boolean }).isVoteRevealed ?? state.isVoteRevealed ?? false;
  const isVoting = scene === 'voting' || decisionStatus === 'open';
  const isResult = (scene === 'result' || decisionStatus === 'result') && isVoteRevealed;
  const isCompleted = state.completedMissionIds?.includes('youth-career-story');

  const setTab = (newTab: StoryTab) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', newTab);
    setSearchParams(nextParams);
  };

  const completeMission = () => {
    if (outletCtx.completeMission) {
      outletCtx.completeMission('youth-career-story');
    } else {
      dispatch({ type: 'COMPLETE_MISSION', missionId: 'youth-career-story' });
    }
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

        {/* 1. Primary Content Tabs */}
        <Tabs<StoryTab>
          ariaLabel="Story review sections"
          activeId={activeTab}
          onChange={setTab}
          items={[
            {
              id: 'social',
              label: 'Social Media',
            },
            {
              id: 'article',
              label: 'Article',
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
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4.66659 6.3337L1.33325 8.00037L7.7614 11.2144C7.84886 11.2582 7.89259 11.28 7.93845 11.2886C7.97908 11.2963 8.02076 11.2963 8.06138 11.2886C8.10725 11.28 8.15098 11.2582 8.23843 11.2144L14.6666 8.00037L11.3333 6.3337M4.66659 9.66703L1.33325 11.3337L7.7614 14.5478C7.84886 14.5915 7.89259 14.6134 7.93845 14.622C7.97908 14.6296 8.02076 14.6296 8.06138 14.622C8.10725 14.6134 8.15098 14.5915 8.23843 14.5478L14.6666 11.3337L11.3333 9.66703M1.33325 4.66704L7.7614 1.45296C7.84886 1.40923 7.89259 1.38737 7.93845 1.37876C7.97907 1.37114 8.02076 1.37114 8.06138 1.37876C8.10725 1.38737 8.15098 1.40923 8.23843 1.45296L14.6666 4.66704L8.23843 7.88111C8.15098 7.92484 8.10725 7.9467 8.06138 7.95531C8.02076 7.96293 7.97907 7.96293 7.93845 7.95531C7.89259 7.9467 7.84886 7.92484 7.7614 7.88111L1.33325 4.66704Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Carousel</span>
            </button>
            <button
              type="button"
              className={`pc-story-format-btn ${format === 'single-poster' ? 'is-active' : ''}`}
              onClick={() => setFormat('single-poster')}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M8.23843 4.78499C8.15098 4.74126 8.10725 4.7194 8.06138 4.71079C8.02076 4.70317 7.97907 4.70317 7.93845 4.71079C7.89259 4.7194 7.84886 4.74126 7.7614 4.78499L1.33325 7.99907L7.7614 11.2131C7.84886 11.2569 7.89259 11.2787 7.93845 11.2873C7.97907 11.295 8.02076 11.295 8.06138 11.2873C8.10725 11.2787 8.15098 11.2569 8.23843 11.2131L14.6666 7.99907L8.23843 4.78499Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
                <div className="pc-story-control-group pc-story-output-group">
                  <span className="pc-story-control-label pc-story-output-label">
                    Output
                  </span>

                  <button
                    type="button"
                    className="pc-story-control-dropdown pc-story-output-dropdown"
                  >
                    <PosterChildIcon
                      name="instagram"
                      size={20}
                      color="#E1306C"
                      strokeWidth={1.8}
                    />

                    <span className="pc-story-output-text">
                      Instagram: Carousel
                    </span>

                    <PosterChildIcon
                      name="chevron-down"
                      size={20}
                      color="#A3A3A3"
                      strokeWidth={1.67}
                    />
                  </button>
                </div>

                <div className="pc-story-control-divider" />

                {/* CAROUSEL TEMPLATE */}
                <div className="pc-story-control-group pc-story-output-group">
                  <span className="pc-story-control-label pc-story-output-label">
                    Carousel Template
                  </span>

                  <button
                    type="button"
                    className="pc-story-control-dropdown pc-story-output-dropdown"
                  >
                    <span className="pc-story-output-text">
                      Spotlight Quote
                    </span>

                    <PosterChildIcon
                      name="chevron-down"
                      size={20}
                      color="#A3A3A3"
                      strokeWidth={1.67}
                    />
                  </button>
                </div>

                <div className="pc-story-control-divider" />

                {/* BRAND COLORS */}
                <div className="pc-story-control-group pc-story-output-group">
                  <span className="pc-story-control-label pc-story-output-label">
                    Brand Colors
                  </span>
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
                <Button
                  variant="primary"
                  size="sm"
                  iconLeading="download"
                  onClick={completeMission}
                >
                  Download All
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
                <div className="pc-story-carousel-shell">

                  <div
                    ref={carouselRef}
                    className="pc-story-carousel-strip"
                  >
                    {[
                      {
                        id: 1,
                        quote: socialRefreshed
                          ? typedRefreshQuote
                          : "I didn’t know people in this field before. Now I know who to ask, what to look for, and what I can do next.",
                        attribution: '— Youth Career Pathways participant',
                        photo: false,
                      },
                      {
                        id: 2,
                        quote: socialRefreshed
                          ? typedRefreshQuote2
                          : 'The program helped me turn an interest into a real path forward — with people I can actually reach out to.',
                        attribution: '— Youth Career Pathways participant',
                        photo: true,
                      },
                      {
                        id: 3,
                        quote: socialRefreshed
                          ? typedRefreshQuote3
                          : 'Confidence grows when young people can see the next step — and know someone is there to help them take it.',
                        attribution: 'Youth Career Pathways',
                        photo: false,
                      },
                      {
                        id: 4,
                        quote:
                          'A stronger network can change what feels possible.',
                        attribution: 'Youth Career Pathways',
                        photo: false,
                      },
                    ].map((slide) => (
                      <div
                        key={slide.id}
                        className={`pc-story-artwork-preview pc-story-artwork-preview--carousel ${slide.photo ? 'is-photo' : ''
                          } ${slide.id <= 3 && isRefreshingSocial ? 'is-refreshing' : ''
                          } ${slide.id <= 3 && socialRefreshed ? 'is-refreshed' : ''
                          }`}
                        style={{
                          backgroundColor: slide.photo ? undefined : activeColor,
                        }}
                      >
                        {slide.photo && (
                          <>
                            <img
                              src={youthCareerPathwaysImage}
                              alt=""
                              className="pc-story-carousel-photo"
                            />

                            <div
                              className="pc-story-carousel-photo-overlay"
                              style={{ backgroundColor: activeColor }}
                            />
                          </>
                        )}

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
                            {slide.quote}
                          </p>

                          <div className="pc-story-artwork-attribution">
                            {slide.attribution}
                          </div>
                        </div>

                        <div
                          className="pc-story-artwork-brand"
                          style={{
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255,255,255,0.7)',
                              letterSpacing: '0.05em',
                            }}
                          >
                            COMMUNITY CATALYST
                          </span>

                          <span
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255,255,255,0.7)',
                            }}
                          >
                            {String(slide.id).padStart(2, '0')} / 04
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Carousel Navigation */}
                <div className="pc-story-preview-actions">
                  <button
                    type="button"
                    className="pc-story-carousel-nav pc-story-carousel-nav--inline"
                    onClick={() => scrollCarousel('left')}
                    aria-label="Previous slide"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M12.5 15L7.5 10L12.5 5"
                        stroke="#414651"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="pc-story-carousel-nav pc-story-carousel-nav--inline"
                    onClick={() => scrollCarousel('right')}
                    aria-label="Next slide"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="#414651"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
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
    </ProductPage >
  );
}
