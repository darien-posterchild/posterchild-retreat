import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Scene, DecisionStatus } from '../types/session';
import { PostieAnimatedIcon } from './posterchild/PostieAnimatedIcon';
import { PosterChildIcon, PosterChildIconName } from './posterchild/Icon';
import { usePostie } from '../context/PostieContext';
import { getProductPageContext } from '../navigation/productNavigation';

export interface ActionItem {
  label: string;
  actionType: 'prompt' | 'navigate';
  target: string;
  iconType?: 'arrow' | 'edit' | 'filter';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  usedContext?: string[];
  actions?: ActionItem[];
}

export interface AttachedContextItem {
  id: string;
  title: string;
  category: string;
  iconType: 'coins' | 'story' | 'report' | 'asset' | 'org';
}

export interface PostieSuggestion {
  id: string;
  text: string;
  iconName?: PosterChildIconName;
  response?: {
    text: string;
    usedContext?: string[];
    actions?: ActionItem[];
  };
}

export interface PostiePanelProps {
  scene?: Scene;
  winnerTitle?: string;
  decisionStatus?: DecisionStatus;
  activeDecisionId?: string;
  contextLabel?: string;
  suggestions?: PostieSuggestion[];
  initialState?: 'initial' | 'conversation';
  onActionClick?: (action: ActionItem) => void;
}

function getContextIconName(iconType: AttachedContextItem['iconType']): PosterChildIconName {
  switch (iconType) {
    case 'coins':
      return 'coins-hand';
    case 'story':
    case 'report':
      return 'file-06';
    case 'asset':
    case 'org':
    default:
      return 'folder';
  }
}

function getCategoryIconName(categoryTitle: string): PosterChildIconName {
  const lower = categoryTitle.toLowerCase();
  if (lower.includes('funding')) return 'coins-hand';
  if (lower.includes('story') || lower.includes('stories') || lower.includes('report')) return 'file-06';
  return 'folder';
}

const DEMO_RECENT_CONTEXT: AttachedContextItem[] = [
  { id: 'ctx-stories', title: '3 stories ready for review', category: 'Stories', iconType: 'story' },
  { id: 'ctx-kresge', title: 'Kresge Foundation', category: 'Funding opportunities', iconType: 'coins' },
  { id: 'ctx-quotes', title: '5 strong quotes found in content', category: 'Stories', iconType: 'story' },
  { id: 'ctx-report', title: '2024 Impact Report', category: 'Reports', iconType: 'report' },
];

const DEMO_BROWSE_CATEGORIES = [
  { id: 'cat-stories', title: 'Stories', count: '48' },
  { id: 'cat-funding', title: 'Funding opportunities', count: '14' },
  { id: 'cat-people', title: 'People', count: '32' },
  { id: 'cat-assets', title: 'Assets', count: '394' },
  { id: 'cat-org', title: 'Organization', count: '6' },
];

const RECENT_CHATS = [
  { id: 'recent-1', title: 'Prepare board update' },
  { id: 'recent-2', title: 'Kresge application' },
  { id: 'recent-3', title: 'Workforce story' },
];

const DEFAULT_HOME_SUGGESTIONS: PostieSuggestion[] = [
  {
    id: 'sug-focus',
    text: 'What should I focus on first today?',
    iconName: 'home-line',
    response: {
      text: 'I’d start with Kresge. It closes in 12 days and you already have most of the evidence. Your main gap is the workforce program budget, last updated in 2025.',
      usedContext: ['Home', 'Needs attention', 'Kresge Foundation'],
      actions: [
        { label: 'Review opportunity', actionType: 'navigate', target: '/raise/opportunities/kresge', iconType: 'arrow' },
        { label: 'Prepare update', actionType: 'prompt', target: "Help me prepare tomorrow's board update", iconType: 'edit' }
      ]
    }
  },
  {
    id: 'sug-prep',
    text: 'Help me prepare for tomorrow',
    iconName: 'home-line',
    response: {
      text: "For tomorrow's board meeting, you have 3 impact stories ready for review and 4 new community testimonials from the workforce development program to strengthen your update.",
      usedContext: ['Home', 'Board meeting', '3 stories ready for review'],
      actions: [
        { label: 'Review stories', actionType: 'navigate', target: '/tell/stories/review?story=youth-career-pathways', iconType: 'arrow' }
      ]
    }
  }
];

function getRetreatDynamicReply(
  activeDecisionId: string | undefined,
  decisionStatus: string | undefined,
  winnerTitle: string | undefined,
  pathname: string,
  pageContextLabel: string
): { replyText: string; usedCtx: string[]; actions: ActionItem[] } {
  let replyText = 'I’d start with Kresge. It closes in 12 days and you already have most of the evidence. Your main gap is the workforce program budget, last updated in 2025.';
  let usedCtx = [pageContextLabel || 'Home'];
  let actions: ActionItem[] = [
    { label: 'Review opportunity', actionType: 'navigate', target: '/raise/opportunities/kresge', iconType: 'arrow' }
  ];

  if (decisionStatus === 'tie') {
    replyText = 'The team vote resulted in a tie! We have an even split across priorities. Would you like to run a quick tie-breaker?';
    usedCtx = ['Tie Detected', 'Tie-Breaker Ready'];
    actions = [];
  } else if (decisionStatus === 'open') {
    if (activeDecisionId === 'campaigns-next') {
      replyText = 'The team is deciding what to do with the campaign. Remote votes are arriving in realtime.';
      usedCtx = ['Campaign Decision', 'Live Voting'];
    } else if (activeDecisionId === 'stories-next') {
      replyText = 'The team is deciding which story to move forward. Remote votes are arriving in realtime.';
      usedCtx = ['Story Selection', 'Live Voting'];
    } else {
      replyText = 'The team is deciding what to focus on first. Remote votes are arriving in realtime from participants.';
      usedCtx = ['Live Voting', 'Room Consensus'];
    }
    actions = [];
  } else if (decisionStatus === 'result') {
    const norm = (winnerTitle || '').toLowerCase();
    if (activeDecisionId === 'campaigns-next' || norm.includes('launch') || (norm.includes('refine') && !norm.includes('story')) || (norm.includes('postie') && !norm.includes('insight'))) {
      if (norm.includes('launch')) {
        replyText = "The team chose to launch. The campaign is ready, so let's move into the final launch review.";
        usedCtx = ['Launch Campaign', 'Team Choice'];
      } else if (norm.includes('refine')) {
        replyText = "The team chose to refine first. Let's tighten the message and audience before launch.";
        usedCtx = ['Refine First', 'Team Choice'];
      } else if (norm.includes('postie')) {
        replyText = "The team chose Postie. I'd recommend addressing the Kresge Foundation opportunity first.";
        usedCtx = ['Ask Postie', 'Team Choice', 'Kresge Foundation'];
        actions = [
          { label: 'Review opportunity', actionType: 'navigate', target: '/raise/opportunities/kresge', iconType: 'arrow' }
        ];
      } else {
        replyText = `The team chose "${winnerTitle || 'Action'}". When you're ready, advance to that branch.`;
        usedCtx = [winnerTitle || 'Action', 'Team Choice'];
      }
    } else if (activeDecisionId === 'stories-next' || norm.includes('maya') || norm.includes('youth') || norm.includes('garden')) {
      if (norm.includes('maya')) {
        replyText = "The team chose Maya’s Journey. This piece has high resonance with youth mentorship funders. Let's review the narrative arc.";
        usedCtx = ["Maya's Journey", 'Team Choice'];
      } else if (norm.includes('youth')) {
        replyText = "The team chose Youth Voices Initiative. A strong peer-led mental health story. Let's review the narrative arc.";
        usedCtx = ['Youth Voices', 'Team Choice'];
      } else if (norm.includes('garden')) {
        replyText = "The team chose Community Gardens. An impactful story on grassroots food security. Let's review the narrative arc.";
        usedCtx = ['Community Gardens', 'Team Choice'];
      } else {
        replyText = `The team chose "${winnerTitle || 'Story'}". Let's review the narrative arc and finalize it.`;
        usedCtx = [winnerTitle || 'Story', 'Team Choice'];
      }
    } else if (norm.includes('campaign')) {
      replyText = "The team chose Campaigns. There's already a campaign ready to launch.";
      usedCtx = ['Campaigns', 'Team Choice'];
    } else if (norm.includes('quote') || norm.includes('testimonial')) {
      replyText = 'The team chose Testimonials & Connect. 4 new quotes are ready to link into stories.';
      usedCtx = ['Testimonials', 'Team Choice'];
      actions = [
        { label: 'Explore Connect', actionType: 'navigate', target: '/tell/connect', iconType: 'arrow' }
      ];
    } else {
      replyText = "I’d start with Kresge. It closes in 12 days and you already have most of the evidence. Your main gap is the workforce program budget, last updated in 2025.";
      usedCtx = ['Needs attention', 'Kresge Foundation', 'Team Choice'];
      actions = [
        { label: 'Review opportunity', actionType: 'navigate', target: '/raise/opportunities/kresge', iconType: 'arrow' }
      ];
    }
  } else if (pathname.includes('/raise/opportunities/kresge')) {
    replyText = 'Kresge closes in 12 days with a 92% match. Postie recommendation: verify the workforce development budget readiness checklist.';
    usedCtx = ['Kresge Foundation', '92% Match'];
    actions = [];
  } else if (pathname.includes('/tell/connect')) {
    replyText = '4 new testimonials received around workforce development. You can anchor these directly into the Youth Career Pathways story draft.';
    usedCtx = ['Connect', 'Testimonials'];
    actions = [
      { label: 'Review story draft', actionType: 'navigate', target: '/tell/stories/review?story=youth-career-pathways', iconType: 'arrow' }
    ];
  } else if (pathname.includes('/tell/stories/review')) {
    replyText = 'Youth Career Pathways draft is ready for review. Recommended primary output: Social media spotlight carousel.';
    usedCtx = ['Youth Career Pathways', 'Social Media'];
    actions = [];
  }

  return { replyText, usedCtx, actions };
}

export function PostiePanel({
  scene,
  winnerTitle,
  decisionStatus,
  activeDecisionId,
  contextLabel,
  suggestions,
  initialState = 'initial',
  onActionClick
}: PostiePanelProps) {
  const { postieView, setPostieView, openPostie, collapsePostie } = usePostie();
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();

  const effectiveContextLabel = contextLabel || getProductPageContext(location.pathname);
  const activeSuggestions = suggestions || DEFAULT_HOME_SUGGESTIONS;

  // Dropdown & Popover states
  const [isChatsOpen, setIsChatsOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [isContextPickerOpen, setIsContextPickerOpen] = useState(false);
  const [contextSearchQuery, setContextSearchQuery] = useState('');

  const chatsDropdownRef = useRef<HTMLDivElement>(null);
  const viewMenuDropdownRef = useRef<HTMLDivElement>(null);
  const contextPickerRef = useRef<HTMLDivElement>(null);

  // Attached context & composer input
  const [attachedContext, setAttachedContext] = useState<AttachedContextItem[]>([
    { id: 'ctx-stories', title: '3 stories ready for review', category: 'Stories', iconType: 'story' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  // Explicit Conversation State: Empty by default so initial state is rendered on Home
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activityStatus, setActivityStatus] = useState('Thinking...');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset conversation if session resets to join scene
  useEffect(() => {
    if (scene === 'join') {
      setMessages([]);
      setSelectedPrompt(null);
      setInputValue('');
      setIsTyping(false);
    }
  }, [scene]);

  // Outside click handler for popovers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatsDropdownRef.current && !chatsDropdownRef.current.contains(event.target as Node)) {
        setIsChatsOpen(false);
      }
      if (viewMenuDropdownRef.current && !viewMenuDropdownRef.current.contains(event.target as Node)) {
        setIsViewMenuOpen(false);
      }
      if (contextPickerRef.current && !contextPickerRef.current.contains(event.target as Node)) {
        setIsContextPickerOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsChatsOpen(false);
        setIsViewMenuOpen(false);
        setIsContextPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Auto-scroll when messages are added
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isTyping]);

  const handleActionClick = (action: ActionItem) => {
    if (onActionClick) {
      onActionClick(action);
      return;
    }

    if (action.actionType === 'navigate') {
      const dest = action.target.startsWith('/present')
        ? action.target
        : `/present/${sessionId}${action.target.startsWith('/') ? action.target : `/${action.target}`}`;
      navigate(dest);
    } else if (action.actionType === 'prompt') {
      handleSendMessage(action.target);
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    setSelectedPrompt(promptText);

    const suggestion = activeSuggestions.find((s) => s.text === promptText);

    // 1. Add User Message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: promptText,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setActivityStatus('Reviewing retreat priorities…');

    // 2. Simulate Postie Response after brief organic pause
    setTimeout(() => {
      setIsTyping(false);

      const dynamicFallback = getRetreatDynamicReply(
        activeDecisionId,
        decisionStatus,
        winnerTitle,
        location.pathname,
        effectiveContextLabel
      );

      const replyData = suggestion?.response || {
        text: dynamicFallback.replyText,
        usedContext: dynamicFallback.usedCtx,
        actions: dynamicFallback.actions
      };

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: replyData.text,
        time: 'Just now',
        usedContext: replyData.usedContext || [effectiveContextLabel],
        actions: replyData.actions || []
      };

      setMessages((prev) => [...prev, assistantMsg]);
    }, 450);
  };

  const handleToggleContext = (item: AttachedContextItem) => {
    setAttachedContext((prev) => {
      const exists = prev.some((c) => c.id === item.id);
      if (exists) return prev.filter((c) => c.id !== item.id);
      if (prev.length >= 3) return prev;
      return [...prev, item];
    });
    setIsContextPickerOpen(false);
    setContextSearchQuery('');
  };

  const handleRemoveContext = (id: string) => {
    setAttachedContext((prev) => prev.filter((c) => c.id !== id));
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedPrompt(null);
    setInputValue('');
    setIsTyping(false);
    setIsChatsOpen(false);
  };

  const handleCopyMessage = (id: string, text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedMessageId(id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }
  };

  const handleSendMessage = (overrideText?: string) => {
    const textToSend = (overrideText ?? inputValue).trim();
    if (!textToSend || isTyping) return;

    setSelectedPrompt(null);
    setInputValue('');

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      time: 'Just now'
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      setActivityStatus('Analyzing…');
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);

        const dynamicFallback = getRetreatDynamicReply(
          activeDecisionId,
          decisionStatus,
          winnerTitle,
          location.pathname,
          effectiveContextLabel
        );

        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: dynamicFallback.replyText,
          time: 'Just now',
          usedContext: attachedContext.map((c) => c.title).concat([effectiveContextLabel]),
          actions: dynamicFallback.actions
        };

        setMessages((prev) => [...prev, assistantMsg]);
      }, 500);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContext = DEMO_RECENT_CONTEXT.filter((item) =>
    item.title.toLowerCase().includes(contextSearchQuery.toLowerCase())
  );

  // ----------------------------------------------------
  // MODE 1: Collapsed (40x40 Floating Launcher Button)
  // ----------------------------------------------------
  if (postieView === 'collapsed') {
    return (
      <button
        type="button"
        onClick={openPostie}
        aria-label="Open Postie"
        title="Open Postie"
        className="pc-ref-postie-launcher"
      >
        <PostieAnimatedIcon
          size={40}
          glow={true}
          speed="ambient"
          interactive={true}
          alt="Open Postie"
          className="pc-postie-launcher-icon"
        />
      </button>
    );
  }

  // ----------------------------------------------------
  // MODES 2 & 3: Docked (Sidebar) and Floating Overlay
  // ----------------------------------------------------
  const isFloating = postieView === 'floating';
  const hasConversation = messages.length > 0;

  return (
    <aside
      className={`pc-ref-postie-panel ${isFloating ? 'is-floating' : 'is-docked'}`}
      aria-label="Postie AI Assistant"
    >
      {/* ==================================================
          1. TOP CONTROLS (Figma Node: 358:3341, Height 72px)
          ================================================== */}
      <div className="pc-ref-postie-topbar">
        <div className="pc-ref-postie-topbar-inner">
          {/* Left Group */}
          <div className="pc-ref-postie-topbar-left">
            {/* Chats Dropdown Container */}
            <div ref={chatsDropdownRef} className="pc-ref-postie-dropdown-anchor">
              {/* Chats Button (96px x 40px) */}
              <button
                type="button"
                onClick={() => setIsChatsOpen((prev) => !prev)}
                className={`pc-ref-postie-chats-btn ${isChatsOpen ? 'is-active' : ''}`}
              >
                <span>Chats</span>
                <PosterChildIcon name="chevron-down" size={20} strokeWidth={1.67} className="pc-postie-chevron-icon" />
              </button>

              {/* Chats Dropdown Menu */}
              {isChatsOpen && (
                <div className="pc-ref-postie-chats-menu">
                  <div className="pc-ref-chats-menu-top">
                    <button
                      type="button"
                      onClick={handleNewChat}
                      className="pc-ref-chats-new-btn"
                    >
                      <PosterChildIcon name="plus" size={20} strokeWidth={1.67} className="pc-postie-menu-icon" />
                      <span>New chat</span>
                    </button>
                  </div>
                  <div className="pc-ref-chats-divider" />
                  <div className="pc-ref-chats-menu-label">Recent</div>
                  {RECENT_CHATS.map((chat) => (
                    <div key={chat.id} className="pc-ref-chats-item-row">
                      <button
                        type="button"
                        onClick={() => {
                          setIsChatsOpen(false);
                        }}
                        className="pc-ref-chats-item-btn"
                      >
                        <span className="pc-ref-truncate">{chat.title}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plus Button: 40x40 Card Button */}
            <button
              type="button"
              aria-label="New chat"
              title="New chat"
              onClick={handleNewChat}
              className="pc-ref-postie-new-chat-btn"
            >
              <PosterChildIcon name="plus" size={20} strokeWidth={1.67} className="pc-postie-plus-icon" />
            </button>
          </div>

          {/* Right Group: Presentation View Control (40x40) */}
          <div className="pc-ref-postie-topbar-right">
            <div ref={viewMenuDropdownRef} className="pc-ref-postie-dropdown-anchor">
              <button
                type="button"
                onClick={() => setIsViewMenuOpen((prev) => !prev)}
                aria-label="Choose presentation view"
                title="Choose presentation view"
                className={`pc-ref-postie-view-btn ${isViewMenuOpen ? 'is-active' : ''}`}
              >
                {isFloating ? (
                  <PosterChildIcon name="window-position-floating" size={20} strokeWidth={1.67} className="pc-postie-view-icon" />
                ) : (
                  <PosterChildIcon name="window-position-sidebar" size={20} strokeWidth={1.67} className="pc-postie-view-icon" />
                )}
              </button>

              {/* View Selector Dropdown (177px x 122px) */}
              {isViewMenuOpen && (
                <div className="pc-ref-postie-view-menu">
                  {/* Option 1: Sidebar */}
                  <div className="pc-ref-view-menu-item-row">
                    <button
                      type="button"
                      onClick={() => {
                        setPostieView('sidebar');
                        setIsViewMenuOpen(false);
                      }}
                      className="pc-ref-view-item-btn"
                    >
                      <div className="pc-ref-view-item-lead">
                        <PosterChildIcon name="window-position-sidebar" size={20} strokeWidth={1.67} className="pc-postie-lead-icon" />
                        <span>Sidebar</span>
                      </div>
                      {!isFloating && <PosterChildIcon name="check" size={14} strokeWidth={1.67} className="pc-postie-check-icon" />}
                    </button>
                  </div>

                  {/* Option 2: Floating */}
                  <div className="pc-ref-view-menu-item-row">
                    <button
                      type="button"
                      onClick={() => {
                        setPostieView('floating');
                        setIsViewMenuOpen(false);
                      }}
                      className="pc-ref-view-item-btn"
                    >
                      <div className="pc-ref-view-item-lead">
                        <PosterChildIcon name="window-position-floating" size={20} strokeWidth={1.67} className="pc-postie-lead-icon" />
                        <span>Floating</span>
                      </div>
                      {isFloating && <PosterChildIcon name="check" size={14} strokeWidth={1.67} className="pc-postie-check-icon" />}
                    </button>
                  </div>

                  {/* Option 3: Hide chat */}
                  <div className="pc-ref-view-menu-item-row">
                    <button
                      type="button"
                      onClick={() => {
                        collapsePostie();
                        setIsViewMenuOpen(false);
                      }}
                      className="pc-ref-view-item-btn"
                    >
                      <div className="pc-ref-view-item-lead">
                        <PosterChildIcon name="minus" size={20} strokeWidth={1.67} className="pc-postie-lead-icon" />
                        <span>Hide chat</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          2. CONVERSATION AREA (Figma Node: 358:3350)
          ================================================== */}
      <div className="pc-ref-postie-scroll-area">
        <div className="pc-ref-postie-conversation-stack">
          {/* Flexible spacer that pushes conversation and initial state to bottom when content is short */}
          <div className="pc-ref-postie-flex-spacer" aria-hidden="true" />

          {/* HEADER: COMPACT IF CONVERSATION EXISTS, OR LARGE INTRO IF INITIAL/EMPTY */}
          {!hasConversation ? (
            /* Large Intro Initial State */
            <div className="pc-ref-postie-intro-state">
              <div className="pc-ref-postie-identity-row">
                <div className="pc-ref-postie-identity-left">
                  <PostieAnimatedIcon
                    size={40}
                    speed="ambient"
                    interactive={true}
                    isThinking={isTyping}
                    glow={isTyping}
                    className="pc-postie-intro-icon"
                  />
                  <span className="pc-ref-postie-title">Postie</span>
                  <div className="pc-ref-postie-beta-badge">
                    <span className="pc-ref-beta-dot" />
                    <span className="pc-ref-beta-text">BETA</span>
                  </div>
                </div>
              </div>

              {/* Suggested Starter Prompts */}
              <div className="pc-ref-postie-starters-wrap">
                {activeSuggestions.map((sug) => (
                  <button
                    key={sug.id}
                    type="button"
                    onClick={() => handleSelectPrompt(sug.text)}
                    className={`pc-ref-starter-prompt-btn ${selectedPrompt === sug.text ? 'is-selected' : ''}`}
                  >
                    <PosterChildIcon name={sug.iconName || 'home-line'} size={16} strokeWidth={1.67} color="#D99A00" />
                    <span className="pc-ref-truncate">{sug.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Compact Chat Header */
            <div className="pc-ref-postie-compact-header">
              <div className="pc-ref-postie-compact-inner">
                <PostieAnimatedIcon
                  size={20}
                  speed="ambient"
                  interactive={true}
                  isThinking={isTyping}
                />
                <span className="pc-ref-postie-compact-title">Postie</span>
                <div className="pc-ref-postie-compact-beta">
                  <span className="pc-ref-compact-dot" />
                  <span className="pc-ref-compact-beta-text">BETA</span>
                </div>
              </div>
            </div>
          )}

          {/* Rendered Conversation Messages */}
          {messages.map((msg) =>
            msg.role === 'user' ? (
              /* User Message Bubble */
              <div key={msg.id} className="pc-ref-user-message-row">
                {/* Dedicated Name / Time Flex Row */}
                <div className="pc-ref-msg-meta-row">
                  <span className="pc-ref-msg-author-name">You</span>
                  <span className="pc-ref-msg-timestamp">{msg.time}</span>
                </div>
                {/* User Message Bubble */}
                <div className="pc-ref-user-bubble">
                  <span className="pc-ref-user-bubble-text">{msg.text}</span>
                </div>
              </div>
            ) : (
              /* Postie Response Bubble */
              <div key={msg.id} className="pc-ref-postie-message-row">
                <div className="pc-ref-postie-msg-wrapper">
                  {/* Postie Header Row */}
                  <div className="pc-ref-msg-meta-row">
                    <div className="pc-ref-postie-meta-left">
                      <PostieAnimatedIcon size={20} speed="ambient" interactive={false} />
                      <span className="pc-ref-postie-author-name">Postie</span>
                    </div>

                    <div className="pc-ref-postie-meta-right">
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="pc-ref-copy-action-btn"
                        title="Copy message"
                      >
                        {copiedMessageId === msg.id ? (
                          <>
                            <PosterChildIcon name="check" size={14} strokeWidth={1.67} className="pc-postie-copied-icon" />
                            <span className="pc-postie-copied-text">Copied</span>
                          </>
                        ) : (
                          <PosterChildIcon name="copy" size={14} strokeWidth={1.67} className="pc-postie-copy-icon" />
                        )}
                      </button>
                      <span className="pc-ref-msg-timestamp">{msg.time}</span>
                    </div>
                  </div>

                  {/* Postie Message Bubble */}
                  <div className="pc-ref-postie-bubble">
                    <p className="pc-ref-postie-bubble-text">{msg.text}</p>
                  </div>
                </div>

                {/* Used Data / Grounded Context Chips */}
                {msg.usedContext && msg.usedContext.length > 0 && (
                  <div className="pc-ref-grounded-context-row">
                    <span className="pc-ref-grounded-label">Used</span>
                    {msg.usedContext.map((item) => (
                      <span key={`used-chip-${item}`} className="pc-ref-grounded-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {/* Inline Action Buttons (h-[30px] Skeuomorphic Card Buttons) */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="pc-ref-inline-actions-row">
                    {msg.actions.map((act) => (
                      <button
                        key={`act-btn-${act.label}-${act.target}`}
                        type="button"
                        onClick={() => handleActionClick(act)}
                        className="pc-ref-action-card-btn"
                      >
                        {act.iconType === 'edit' ? (
                          <PosterChildIcon name="edit-02" size={14} strokeWidth={1.67} className="pc-postie-action-icon" />
                        ) : (
                          <PosterChildIcon name="arrow-right" size={14} strokeWidth={1.67} className="pc-postie-action-icon" />
                        )}
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="pc-ref-postie-message-row">
              <div className="pc-ref-postie-msg-wrapper">
                <div className="pc-ref-msg-meta-row">
                  <div className="pc-ref-postie-meta-left">
                    <PostieAnimatedIcon
                      size={20}
                      speed="fast"
                      isThinking={true}
                      interactive={false}
                    />
                    <span className="pc-ref-postie-author-name">Postie</span>
                  </div>
                  <span className="pc-ref-typing-status-text">{activityStatus}</span>
                </div>
                <div className="pc-ref-typing-dots-bubble">
                  <span className="pc-ref-dot-pulse pc-ref-dot-pulse--1" />
                  <span className="pc-ref-dot-pulse pc-ref-dot-pulse--2" />
                  <span className="pc-ref-dot-pulse pc-ref-dot-pulse--3" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="pc-postie-scroll-anchor" />
        </div>
      </div>

      {/* ==================================================
          3. CONTEXT BAR (Above Composer with clear full-width divider)
          ================================================== */}
      <div className="pc-ref-context-bar-container">
        <div ref={contextPickerRef} className="pc-ref-context-bar-inner">
          <span className="pc-ref-context-section-label">Context</span>

          {/* Automatic Current Page Context Chip */}
          <div className="pc-ref-current-page-chip">
            <PosterChildIcon name="home-line" size={12} strokeWidth={1.67} color="#737373" />
            <span>{effectiveContextLabel}</span>
          </div>

          {/* Manually Attached Context Chips */}
          {attachedContext.map((ctx) => (
            <div key={ctx.id} className="pc-ref-attached-context-chip">
              <span className="pc-ref-truncate">{ctx.title}</span>
              <button
                type="button"
                onClick={() => handleRemoveContext(ctx.id)}
                className="pc-ref-chip-close-btn"
                title={`Remove ${ctx.title}`}
              >
                <PosterChildIcon name="x-close" size={12} strokeWidth={1.67} />
              </button>
            </div>
          ))}

          {/* + Add Context Trigger Link */}
          {attachedContext.length < 3 && (
            <button
              type="button"
              onClick={() => setIsContextPickerOpen((prev) => !prev)}
              className="pc-ref-add-context-link"
            >
              <PosterChildIcon name="plus" size={12} strokeWidth={1.67} />
              <span>Add</span>
            </button>
          )}

          {/* Upward Popover Picker */}
          {isContextPickerOpen && (
            <div className="pc-ref-context-picker-modal">
              {/* Top Search Field */}
              <div className="pc-ref-picker-search-bar">
                <PosterChildIcon name="search-sm" size={16} strokeWidth={1.67} className="pc-postie-search-icon" />
                <input
                  type="text"
                  value={contextSearchQuery}
                  onChange={(e) => setContextSearchQuery(e.target.value)}
                  placeholder="Search anything…"
                  className="pc-ref-picker-search-input"
                  autoFocus
                />
              </div>

              {/* Items List */}
              <div className="pc-ref-picker-items-scroll">
                <div className="pc-ref-picker-group-title">Recent</div>
                {filteredContext.map((item) => {
                  const isAttached = attachedContext.some((c) => c.id === item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToggleContext(item)}
                      className={`pc-ref-picker-item-row ${isAttached ? 'is-attached' : ''}`}
                    >
                      <div className="pc-ref-picker-item-lead">
                        <PosterChildIcon name={getContextIconName(item.iconType)} size={16} strokeWidth={1.67} color="#737373" />
                        <span className="pc-ref-truncate">{item.title}</span>
                      </div>
                      {isAttached && (
                        <span className="pc-ref-picker-attached-badge">Attached</span>
                      )}
                    </button>
                  );
                })}

                <div className="pc-ref-picker-divider" />
                <div className="pc-ref-picker-group-title">Browse</div>
                {DEMO_BROWSE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      const matching = DEMO_RECENT_CONTEXT.find((r) => r.category === cat.title);
                      if (matching) handleToggleContext(matching);
                      else setIsContextPickerOpen(false);
                    }}
                    className="pc-ref-picker-browse-row"
                  >
                    <div className="pc-ref-picker-item-lead">
                      <PosterChildIcon name={getCategoryIconName(cat.title)} size={16} strokeWidth={1.67} color="#737373" />
                      <span className="pc-ref-truncate">{cat.title}</span>
                    </div>
                    <span className="pc-ref-picker-count">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================
          4. COMPOSER (Figma Node: 358:3386)
          ================================================== */}
      <div className="pc-ref-composer-outer-row">
        <div className="pc-ref-composer-card">
          {/* Input */}
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Postie anything, or add context with +"
            className="pc-ref-composer-input-field"
          />

          {/* Bottom Actions Row */}
          <div className="pc-ref-composer-bottom-bar">
            {/* Left Controls */}
            <div className="pc-ref-composer-left-tools">
              <button
                type="button"
                aria-label="Add context"
                title="Add context"
                onClick={() => setIsContextPickerOpen((prev) => !prev)}
                className="pc-ref-composer-card-btn"
              >
                <PosterChildIcon name="plus" size={20} strokeWidth={1.67} className="pc-postie-composer-tool-icon" />
              </button>

              <button
                type="button"
                aria-label="Settings"
                title="Settings"
                className="pc-ref-composer-card-btn"
              >
                <PosterChildIcon name="settings-04" size={20} strokeWidth={1.67} className="pc-postie-composer-tool-icon" />
              </button>
            </div>

            {/* Right Controls */}
            <div className="pc-ref-composer-right-tools">
              <button
                type="button"
                aria-label="Microphone"
                title="Microphone"
                className="pc-ref-composer-mic-btn"
              >
                <PosterChildIcon name="microphone-01" size={20} strokeWidth={1.67} className="pc-postie-mic-icon" />
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send message"
                title="Send message"
                className={`pc-ref-composer-submit-btn ${inputValue.trim() && !isTyping ? 'is-active' : 'is-disabled'}`}
              >
                <PosterChildIcon
                  name="arrow-up"
                  size={20}
                  strokeWidth={1.67}
                  color="#171717"
                  className="pc-postie-send-arrow-icon"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default React.memo(PostiePanel);
