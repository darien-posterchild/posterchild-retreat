import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Scene, DecisionStatus } from '../types/session';
import { PostieAnimatedIcon } from './posterchild/PostieAnimatedIcon';
import { PosterChildIcon, PosterChildIconName } from './posterchild/Icon';
import { Badge } from './posterchild/Badge';
import {
  usePostie,
  Message,
  ActionItem,
  PostieSuggestion,
  RetreatTimelineEvent,
  getPostieContextKey
} from '../context/PostieContext';
import { getProductPageContext } from '../navigation/productNavigation';

export type { ActionItem, Message, PostieSuggestion };

export interface AttachedContextItem {
  id: string;
  title: string;
  category: string;
  iconType: 'coins' | 'story' | 'report' | 'asset' | 'org';
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
  onAskPostieClick?: () => void;
  onTimelineCta?: (event: RetreatTimelineEvent) => void;
  isVoteRevealed?: boolean;
  winningOptionId?: string | null;
  onStartVoting?: () => void;
  onRevealVote?: () => void;
  canAskRoom?: boolean;
  roomQuestion?: string;
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

const DEFAULT_HOME_SUGGESTIONS: PostieSuggestion[] = [];

const CONTEXT_SUGGESTIONS: Record<string, PostieSuggestion[]> = {
  home: DEFAULT_HOME_SUGGESTIONS,
  'kresge-opportunity': [
    {
      id: 'kresge-sug-focus',
      text: 'Which funding opportunity should I focus on first?',
      iconName: 'coins-hand',
      response: {
        text: 'I’d start with Kresge. Your Youth Career Pathways work aligns well with Kresge’s focus on economic mobility, equity, and opportunity for people with low incomes. You already have strong participant stories and impact evidence. The main readiness gap is the workforce program budget, last updated in 2025.',
        usedContext: ['Raise', 'Needs attention', 'Kresge Foundation'],
        actions: []
      }
    },
    {
      id: 'kresge-sug-strengthen',
      text: 'How can we strengthen this application?',
      iconName: 'file-check-02',
      response: {
        text: 'Updating the workforce program budget to 2026 and pairing it with participant testimonials from the Youth Voices initiative will strengthen the budget justification.',
        usedContext: ['Kresge Foundation', 'Application Readiness'],
        actions: []
      }
    }
  ],
  connect: [
    {
      id: 'connect-sug-hearing',
      text: 'What are we hearing from our community?',
      iconName: 'message-chat-circle',
      response: {
        text: 'Transportation is the clearest recurring theme in Youth Career Pathways. I also found 3 Spring Alumni responses detailed enough to review as possible story sources.',
        usedContext: ['Connect', 'Youth Career Pathways', 'Testimonials'],
        actions: []
      }
    },
    {
      id: 'connect-sug-use',
      text: 'How can we use these responses?',
      iconName: 'share-04',
      response: {
        text: 'You can link these quotes directly into the Youth Career Pathways narrative or draft a new donor update focusing on transit equity.',
        usedContext: ['Connect', 'Community Voice'],
        actions: []
      }
    }
  ],
  'story-youth-career-pathways': [
    {
      id: 'story-sug-caption',
      text: 'Can you tighten the short caption?',
      iconName: 'edit-04',
      response: {
        text: 'Yes. I’d make the opening more direct and keep the proof point in the second sentence. I can also adapt it for LinkedIn or Instagram without changing the core story.',
        usedContext: ['Youth Career Pathways', 'Social Media', 'Carousel'],
        actions: []
      }
    },
    {
      id: 'story-sug-opening',
      text: 'Can you make the opening stronger?',
      iconName: 'edit-02',
      response: {
        text: 'Yes. I’d open with the participant insight first, then explain the pattern across all four testimonials. That makes the article feel more human before introducing the broader program context.',
        usedContext: ['Youth Career Pathways', 'Article'],
        actions: []
      }
    }
  ],
  manage: [
    {
      id: 'manage-sug-context',
      text: 'What context does PosterChild use?',
      iconName: 'database-01',
      response: {
        text: 'This is the context PosterChild uses to understand your organization — your knowledge, assets, people, connections, and operations.',
        usedContext: ['Manage', 'Organization'],
        actions: []
      }
    }
  ],
  'tell-overview': [
    {
      id: 'tell-sug-stories',
      text: 'What stories are ready for review?',
      iconName: 'file-06',
      response: {
        text: 'You have 3 impact stories drafted, with Youth Career Pathways ready for final review and social publishing.',
        usedContext: ['Tell', 'Stories'],
        actions: [
          { label: 'Review stories', actionType: 'navigate', target: '/tell/stories/review?story=youth-career-pathways', iconType: 'arrow' }
        ]
      }
    }
  ]
};

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
    replyText = 'Kresge closes in 12 days with a 92% match. Your Youth Career Pathways work aligns well with Kresge’s focus on economic mobility, equity, and opportunity.';
    usedCtx = ['Kresge Foundation', '92% Match', 'Action Plan'];
    actions = [
      { label: 'View Action Plan', actionType: 'navigate', target: '/raise/opportunities/kresge?tab=action-plan', iconType: 'arrow' }
    ];
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
  } else if (pathname.includes('/manage')) {
    replyText = 'This is the context PosterChild uses to understand your organization — your knowledge, assets, people, connections, and operations.';
    usedCtx = ['Manage', 'Organization'];
    actions = [];
  }

  return { replyText, usedCtx, actions };
}

function renderTeamChoiceIcon(title: string) {
  const norm = (title || '').toLowerCase();
  if (norm.includes('story') || norm.includes('suggested story')) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M9.99996 7.83333C9.99996 5.96649 9.99996 5.03307 10.3633 4.32003C10.6828 3.69282 11.1928 3.18289 11.82 2.86331C12.533 2.5 13.4665 2.5 15.3333 2.5H15.6666C16.6 2.5 17.0668 2.5 17.4233 2.68166C17.7369 2.84144 17.9918 3.09641 18.1516 3.41002C18.3333 3.76654 18.3333 4.23325 18.3333 5.16667V12.3333C18.3333 13.2668 18.3333 13.7335 18.1516 14.09C17.9918 14.4036 17.7369 14.6586 17.4233 14.8183C17.0668 15 16.6 15 15.6666 15H14.5209C13.4774 15 12.9556 15 12.482 15.1438C12.0627 15.2712 11.6726 15.4799 11.334 15.7582C10.9516 16.0725 10.6622 16.5066 10.0833 17.3749L9.99996 17.5L9.91658 17.3749C9.33771 16.5066 9.04828 16.0725 8.66588 15.7582C8.32734 15.4799 7.93726 15.2712 7.51796 15.1438C7.04433 15 6.52255 15 5.47898 15H4.33329C3.39987 15 2.93316 15 2.57664 14.8183C2.26304 14.6586 2.00807 14.4036 1.84828 14.09C1.66663 13.7335 1.66663 13.2668 1.66663 12.3333V5.16667C1.66663 4.23325 1.66663 3.76654 1.84828 3.41002C2.00807 3.09641 2.26304 2.84144 2.57664 2.68166C2.93316 2.5 3.39987 2.5 4.33329 2.5H4.66663C6.53347 2.5 7.46689 2.5 8.17993 2.86331C8.80713 3.18289 9.31707 3.69282 9.63665 4.32003C9.99996 5.03307 9.99996 5.96649 9.99996 7.83333ZM9.99996 17.5V7.83333"
          stroke="#171717"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (norm.includes('article') || norm.includes('plan')) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M11.6666 1.89258V5.3347C11.6666 5.80141 11.6666 6.03476 11.7574 6.21302C11.8373 6.36982 11.9648 6.49731 12.1216 6.5772C12.2999 6.66803 12.5332 6.66803 12.9999 6.66803H16.442M13.3333 10.8346H6.66659M13.3333 14.168H6.66659M8.33325 7.5013H6.66659M11.6666 1.66797H7.33325C5.93312 1.66797 5.23306 1.66797 4.69828 1.94045C4.22787 2.18014 3.84542 2.56259 3.60574 3.03299C3.33325 3.56777 3.33325 4.26784 3.33325 5.66797V14.3346C3.33325 15.7348 3.33325 16.4348 3.60574 16.9696C3.84542 17.44 4.22787 17.8225 4.69828 18.0622C5.23306 18.3346 5.93312 18.3346 7.33325 18.3346H12.6666C14.0667 18.3346 14.7668 18.3346 15.3016 18.0622C15.772 17.8225 16.1544 17.44 16.3941 16.9696C16.6666 16.4348 16.6666 15.7348 16.6666 14.3346V6.66797L11.6666 1.66797Z"
          stroke="#171717"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (norm.includes('postie')) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4.33337 8.66536L4.85635 9.71131C5.03334 10.0653 5.12184 10.2423 5.24006 10.3957C5.34497 10.5318 5.46698 10.6538 5.60308 10.7587C5.75645 10.8769 5.93344 10.9654 6.28743 11.1424L7.33337 11.6654L6.28743 12.1883C5.93344 12.3653 5.75645 12.4538 5.60308 12.5721C5.46698 12.677 5.34497 12.799 5.24006 12.9351C5.12184 13.0884 5.03334 13.2654 4.85635 13.6194L4.33337 14.6654L3.8104 13.6194C3.63341 13.2654 3.54491 13.0884 3.42669 12.9351C3.32178 12.799 3.19977 12.677 3.06367 12.5721C2.9103 12.4538 2.7333 12.3653 2.37932 12.1883L1.33337 11.6654L2.37932 11.1424C2.7333 10.9654 2.9103 10.8769 3.06367 10.7587C3.19977 10.6538 3.32178 10.5318 3.42669 10.3957C3.54491 10.2423 3.63341 10.0653 3.8104 9.71131L4.33337 8.66536Z"
          stroke="#171717"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 1.33203L10.7858 3.37498C10.9738 3.8638 11.0678 4.10821 11.214 4.31379C11.3435 4.496 11.5027 4.65519 11.6849 4.78475C11.8905 4.93094 12.1349 5.02494 12.6238 5.21295L14.6667 5.9987L12.6238 6.78445C12.1349 6.97245 11.8905 7.06646 11.6849 7.21264C11.5027 7.3422 11.3435 7.5014 11.214 7.6836C11.0678 7.88919 10.9738 8.1336 10.7858 8.62242L10 10.6654L9.21429 8.62242C9.02628 8.1336 8.93228 7.88919 8.7861 7.6836C8.65654 7.5014 8.49734 7.3422 8.31513 7.21264C8.10955 7.06646 7.86514 6.97245 7.37632 6.78445L5.33337 5.9987L7.37632 5.21295C7.86514 5.02494 8.10955 4.93094 8.31513 4.78475C8.49734 4.65519 8.65654 4.496 8.7861 4.31379C8.93228 4.10821 9.02628 3.8638 9.21429 3.37498L10 1.33203Z"
          stroke="#171717"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (norm.includes('social')) {
    return <PosterChildIcon name="share-01" size={20} strokeWidth={1.67} />;
  }
  if (norm.includes('attention') || norm.includes('kresge') || norm.includes('opportunity')) {
    return <PosterChildIcon name="alert-triangle" size={20} strokeWidth={1.67} />;
  }
  return <PosterChildIcon name="check" size={20} strokeWidth={2} />;
}

export function PostiePanel({
  scene,
  winnerTitle,
  decisionStatus,
  activeDecisionId,
  contextLabel,
  suggestions,
  initialState = 'initial',
  onActionClick,
  onAskPostieClick,
  onTimelineCta,
  isVoteRevealed,
  winningOptionId,
  onStartVoting,
  onRevealVote,
  canAskRoom,
  roomQuestion
}: PostiePanelProps) {
  const {
    postieView,
    setPostieView,
    openPostie,
    collapsePostie,
    activePromptRequest,
    clearPromptRequest,
    conversationsByContext,
    addMessageToContext,
    setMessagesForContext,
    resetAllConversations,
    retreatTimeline
  } = usePostie();

  // In retreat mode, when there are timeline events, suppress generic chips
  const hasRetreatTimeline = retreatTimeline.length > 0;

  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId = 'PC26' } = useParams<{ sessionId?: string }>();

  const currentContextKey = getPostieContextKey(location.pathname);
  const isRetreatMode = hasRetreatTimeline || location.pathname.startsWith('/present');
  const rawMessages = conversationsByContext[currentContextKey] || [];
  const messages = isRetreatMode
    ? rawMessages.filter(
      (msg) => msg.id !== 'story-review-user-q' && msg.id !== 'story-review-postie-reply'
    )
    : rawMessages;

  const effectiveContextLabel =
    location.pathname.includes('/tell/stories/review')
      ? 'Youth Career Pathways'
      : location.pathname.includes('/tell/connect')
        ? 'Connect'
        : location.pathname.includes('/manage')
          ? 'Manage'
          : contextLabel || getProductPageContext(location.pathname);

  // Suppress generic starter chips when retreat timeline is active
  const activeSuggestions = hasRetreatTimeline
    ? []
    : (suggestions || CONTEXT_SUGGESTIONS[currentContextKey] || DEFAULT_HOME_SUGGESTIONS);

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
    { id: 'ctx-default', label: effectiveContextLabel, type: 'page' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  useEffect(() => {
    setAttachedContext([{ id: 'ctx-default', label: effectiveContextLabel, type: 'page' }]);
  }, [effectiveContextLabel]);

  const [isTyping, setIsTyping] = useState(false);
  const [activityStatus, setActivityStatus] = useState('Thinking...');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const prevTimelineLengthRef = useRef(retreatTimeline.length);
  const prevPathnameRef = useRef(location.pathname);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset conversation if session resets to join scene
  useEffect(() => {
    if (scene === 'join') {
      resetAllConversations();
      setSelectedPrompt(null);
      setInputValue('');
      setIsTyping(false);
    }
  }, [scene, resetAllConversations]);

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

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    // Scroll the dedicated Postie scroll container directly
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior
      });
    }
    // Also use messagesEndRef scrollIntoView as preferred
    try {
      messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
    } catch {
      // Ignore
    }
  };

  // Auto-scroll when new retreat timeline items or messages are added
  useEffect(() => {
    const timelineChanged = retreatTimeline.length !== prevTimelineLengthRef.current;
    prevTimelineLengthRef.current = retreatTimeline.length;

    if (timelineChanged || retreatTimeline.length > 0 || messages.length > 0 || isTyping || canAskRoom || scene === 'voting' || decisionStatus === 'open') {
      const timer = setTimeout(() => {
        scrollToBottom('smooth');
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [retreatTimeline.length, retreatTimeline, messages.length, isTyping, canAskRoom, scene, decisionStatus]);

  // When navigating to another product route and the retreat timeline already has content,
  // show the most recent timeline item in Postie
  useEffect(() => {
    if (location.pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = location.pathname;
      if (retreatTimeline.length > 0) {
        const timer = setTimeout(() => {
          scrollToBottom('smooth');
        }, 80);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, retreatTimeline.length]);

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

  const handleTimelineCta = (event: RetreatTimelineEvent) => {
    if (onTimelineCta) {
      onTimelineCta(event);
      return;
    }
    if (event.ctaTarget) {
      navigate(event.ctaTarget);
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    const contextKey = getPostieContextKey(location.pathname);
    const existingMessages = conversationsByContext[contextKey] || [];

    // Idempotency check: if prompt was already asked in this context, DO NOT duplicate!
    const alreadyAsked = existingMessages.some(
      (m) => m.role === 'user' && m.text.trim().toLowerCase() === promptText.trim().toLowerCase()
    );

    if (alreadyAsked) {
      if (postieView === 'collapsed') {
        openPostie();
      }
      return;
    }

    setSelectedPrompt(promptText);

    // 1. Add User Message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: promptText,
      time: 'Just now'
    };

    addMessageToContext(contextKey, userMsg);
    setIsTyping(true);
    setActivityStatus('Reviewing retreat priorities…');

    // 2. Simulate Postie Response after brief organic pause
    setTimeout(() => {
      setIsTyping(false);

      const suggestion = activeSuggestions.find(
        (s) => s.text.trim().toLowerCase() === promptText.trim().toLowerCase()
      );

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

      addMessageToContext(contextKey, assistantMsg);
    }, 450);
  };

  // Trigger predetermined conversation if requested externally (e.g. from presenter dock)
  useEffect(() => {
    if (activePromptRequest) {
      handleSelectPrompt(activePromptRequest);
      clearPromptRequest();
    }
  }, [activePromptRequest]);

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
    setMessagesForContext(currentContextKey, []);
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

    const contextKey = getPostieContextKey(location.pathname);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      time: 'Just now'
    };
    addMessageToContext(contextKey, userMsg);

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

        addMessageToContext(contextKey, assistantMsg);
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

  const isPostieWinner = Boolean(
    isVoteRevealed && (winningOptionId === 'ask-postie' || (winnerTitle && winnerTitle.toLowerCase().includes('postie')))
  );

  // ----------------------------------------------------
  // MODE 1: Collapsed (40x40 Floating Launcher Button)
  // ----------------------------------------------------
  if (postieView === 'collapsed') {
    return (
      <div className="pc-ref-postie-launcher-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
        <button
          type="button"
          onClick={openPostie}
          aria-label="Open Postie"
          title="Open Postie"
          className={`pc-ref-postie-launcher ${isPostieWinner ? 'is-winner' : ''}`}
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
        {isPostieWinner && (
          <div style={{ position: 'absolute', top: '-8px', right: '-12px', zIndex: 10, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
            <Badge variant="brand" iconLeading="check" size="sm">
              Team choice
            </Badge>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // MODES 2 & 3: Docked (Sidebar) and Floating Overlay
  // ----------------------------------------------------
  const isFloating = postieView === 'floating';
  const hasConversation = messages.length > 0;

  return (
    <aside
      className={`pc-ref-postie-panel ${isFloating ? 'is-floating' : 'is-docked'} ${isPostieWinner ? 'is-winner pc-option--winner' : ''}`}
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
      <div ref={scrollAreaRef} className="pc-ref-postie-scroll-area">
        <div className="pc-ref-postie-conversation-stack">
          {/* Flexible spacer that pushes conversation and initial state to bottom when content is short */}
          <div className="pc-ref-postie-flex-spacer" aria-hidden="true" />

          {/* PERSISTENT POSTIE BRAND HEADER (ALWAYS LARGE) */}
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

            {/* Suggested Starter Prompts — only show when no conversation and no retreat timeline */}
            {!hasConversation && !hasRetreatTimeline && activeSuggestions.length > 0 && (
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
            )}
          </div>

          {/* ================================================
              RETREAT TIMELINE — shared persistent events across all routes
              Renders: room-question | team-choice | next-step | ask-postie-ready | user-question | postie-response | action-completed | mission-completed
              ================================================ */}
          {retreatTimeline.map((event) => (
            <div key={event.id} className={`pc-retreat-timeline-event pc-retreat-timeline-event--${event.type}`}>
              {event.type === 'room-question' && (
                <div className="pc-ref-postie-message-row">
                  <div className="pc-ref-postie-msg-wrapper">

                    <div className="pc-ref-msg-meta-row">
                      <div className="pc-ref-postie-meta-left">
                        <PostieAnimatedIcon
                          size={20}
                          speed="ambient"
                          interactive={false}
                        />

                        <span className="pc-ref-postie-author-name">
                          Postie
                        </span>
                      </div>

                      <span className="pc-ref-msg-timestamp">
                        Just now
                      </span>
                    </div>

                    <div className="pc-ref-postie-bubble">
                      <p className="pc-ref-postie-bubble-text">
                        {event.title}
                      </p>
                    </div>

                  </div>
                </div>
              )}
              {event.type === 'team-choice' && (
                <div className="pc-retreat-team-choice">
                  <div className="pc-retreat-team-choice-header">
                    <span>Team Choice</span>
                    <span className="pc-retreat-team-choice-time">Just now</span>
                  </div>

                  <div className="pc-retreat-team-choice-card">
                    <div className="pc-retreat-team-choice-icon">
                      {renderTeamChoiceIcon(event.title)}
                    </div>

                    <div className="pc-retreat-team-choice-content">
                      <div className="pc-retreat-team-choice-title">
                        {event.title}
                      </div>

                      {event.meta && (
                        <div className="pc-retreat-team-choice-meta">
                          {event.meta}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {event.type === 'next-step' && (
                <div className="pc-retreat-action-card pc-retreat-next-step">
                  <div className="pc-retreat-action-card-content pc-retreat-next-step-content">
                    <div className="pc-retreat-action-card-heading pc-retreat-next-step-heading">
                      <PosterChildIcon
                        name="arrow-right"
                        size={16}
                        strokeWidth={1.67}
                      />

                      <span>Next Step</span>
                    </div>

                    <div className="pc-retreat-action-card-title pc-retreat-next-step-title">
                      {event.title}
                    </div>

                    {event.ctaLabel && (
                      <button
                        type="button"
                        className="pc-retreat-action-card-cta pc-retreat-next-step-cta"
                        onClick={() => handleTimelineCta(event)}
                      >
                        <span>{event.ctaLabel}</span>

                        <PosterChildIcon
                          name="arrow-right"
                          size={16}
                          strokeWidth={1.67}
                        />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {(event.type === 'ask-postie-ready' || event.type === 'ask-postie-pending') && (
                <div className="pc-retreat-next-step">
                  <div className="pc-retreat-next-step-content">

                    <div className="pc-retreat-next-step-heading">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <g clipPath="url(#ask-postie-sparkles)">
                          <path
                            d="M4.33337 8.66536L4.85635 9.71131C5.03334 10.0653 5.12184 10.2423 5.24006 10.3957C5.34497 10.5318 5.46698 10.6538 5.60308 10.7587C5.75645 10.8769 5.93344 10.9654 6.28743 11.1424L7.33337 11.6654L6.28743 12.1883C5.93344 12.3653 5.75645 12.4538 5.60308 12.5721C5.46698 12.677 5.34497 12.799 5.24006 12.9351C5.12184 13.0884 5.03334 13.2654 4.85635 13.6194L4.33337 14.6654L3.8104 13.6194C3.63341 13.2654 3.54491 13.0884 3.42669 12.9351C3.32178 12.799 3.19977 12.677 3.06367 12.5721C2.9103 12.4538 2.7333 12.3653 2.37932 12.1883L1.33337 11.6654L2.37932 11.1424C2.7333 10.9654 2.9103 10.8769 3.06367 10.7587C3.19977 10.6538 3.32178 10.5318 3.42669 10.3957C3.54491 10.2423 3.63341 10.0653 3.8104 9.71131L4.33337 8.66536Z"
                            stroke="#A3A3A3"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 1.33203L10.7858 3.37498C10.9738 3.8638 11.0678 4.10821 11.214 4.31379C11.3435 4.496 11.5027 4.65519 11.6849 4.78475C11.8905 4.93094 12.1349 5.02494 12.6238 5.21295L14.6667 5.9987L12.6238 6.78445C12.1349 6.97245 11.8905 7.06646 11.6849 7.21264C11.5027 7.3422 11.3435 7.5014 11.214 7.6836C11.0678 7.88919 10.9738 8.1336 10.7858 8.62242L10 10.6654L9.21429 8.62242C9.02628 8.1336 8.93228 7.88919 8.7861 7.6836C8.65654 7.5014 8.49734 7.3422 8.31513 7.21264C8.10955 7.06646 7.86514 6.97245 7.37632 6.78445L5.33337 5.9987L7.37632 5.21295C7.86514 5.02494 8.10955 4.93094 8.31513 4.78475C8.49734 4.65519 8.65654 4.496 8.7861 4.31379C8.93228 4.10821 9.02628 3.8638 9.21429 3.37498L10 1.33203Z"
                            stroke="#A3A3A3"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>

                        <defs>
                          <clipPath id="ask-postie-sparkles">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <span>Ask Postie</span>
                    </div>

                    <div className="pc-retreat-next-step-title">
                      {event.title}
                    </div>

                    <button
                      type="button"
                      className="pc-retreat-next-step-cta"
                      onClick={() => onAskPostieClick?.()}
                    >
                      <span>Ask Postie</span>

                      <PosterChildIcon
                        name="arrow-right"
                        size={16}
                        strokeWidth={1.67}
                      />
                    </button>

                  </div>
                </div>
              )}

              {event.type === 'user-question' && (
                <div className="pc-ref-user-message-row">
                  <div className="pc-ref-msg-meta-row">
                    <span className="pc-ref-msg-author-name">You</span>
                    <span className="pc-ref-msg-timestamp">Just now</span>
                  </div>
                  <div className="pc-ref-user-bubble">
                    <span className="pc-ref-user-bubble-text">{event.title}</span>
                  </div>
                </div>
              )}

              {event.type === 'postie-response' && (
                <div className="pc-retreat-next-step">
                  <div className="pc-retreat-next-step-content">

                    <div className="pc-retreat-next-step-heading">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <g clipPath="url(#postie-response-sparkles)">
                          <path
                            d="M4.33337 8.66536L4.85635 9.71131C5.03334 10.0653 5.12184 10.2423 5.24006 10.3957C5.34497 10.5318 5.46698 10.6538 5.60308 10.7587C5.75645 10.8769 5.93344 10.9654 6.28743 11.1424L7.33337 11.6654L6.28743 12.1883C5.93344 12.3653 5.75645 12.4538 5.60308 12.5721C5.46698 12.677 5.34497 12.799 5.24006 12.9351C5.12184 13.0884 5.03334 13.2654 4.85635 13.6194L4.33337 14.6654L3.8104 13.6194C3.63341 13.2654 3.54491 13.0884 3.42669 12.9351C3.32178 12.799 3.19977 12.677 3.06367 12.5721C2.9103 12.4538 2.7333 12.3653 2.37932 12.1883L1.33337 11.6654L2.37932 11.1424C2.7333 10.9654 2.9103 10.8769 3.06367 10.7587C3.19977 10.6538 3.32178 10.5318 3.42669 10.3957C3.54491 10.2423 3.63341 10.0653 3.8104 9.71131L4.33337 8.66536Z"
                            stroke="#A3A3A3"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 1.33203L10.7858 3.37498C10.9738 3.8638 11.0678 4.10821 11.214 4.31379C11.3435 4.496 11.5027 4.65519 11.6849 4.78475C11.8905 4.93094 12.1349 5.02494 12.6238 5.21295L14.6667 5.9987L12.6238 6.78445C12.1349 6.97245 11.8905 7.06646 11.6849 7.21264C11.5027 7.3422 11.3435 7.5014 11.214 7.6836C11.0678 7.88919 10.9738 8.1336 10.7858 8.62242L10 10.6654L9.21429 8.62242C9.02628 8.1336 8.93228 7.88919 8.7861 7.6836C8.65654 7.5014 8.49734 7.3422 8.31513 7.21264C8.10955 7.06646 7.86514 6.97245 7.37632 6.78445L5.33337 5.9987L7.37632 5.21295C7.86514 5.02494 8.10955 4.93094 8.31513 4.78475C8.49734 4.65519 8.65654 4.496 8.7861 4.31379C8.93228 4.10821 9.02628 3.8638 9.21429 3.37498L10 1.33203Z"
                            stroke="#A3A3A3"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>

                        <defs>
                          <clipPath id="postie-response-sparkles">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <span>Postie</span>
                    </div>

                    <div className="pc-retreat-next-step-title">
                      {event.body}
                    </div>

                    {event.ctaLabel && event.ctaTarget && (
                      <button
                        type="button"
                        className="pc-retreat-next-step-cta"
                        onClick={() => handleTimelineCta(event)}
                      >
                        <span>{event.ctaLabel}</span>

                        <PosterChildIcon
                          name="arrow-right"
                          size={16}
                          strokeWidth={1.67}
                        />
                      </button>
                    )}

                  </div>
                </div>
              )}

              {(event.type === 'action-completed' || event.type === 'mission-completed') && (
                <div className="pc-retreat-action-completed pc-retreat-mission-completed">
                  <div className="pc-retreat-action-completed-label pc-retreat-mission-completed-label">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M13.3333 4L5.99996 11.3333L2.66663 8"
                        stroke="#16A34A"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span>{event.type === 'action-completed' ? 'Action Completed' : 'Mission Completed'}</span>
                  </div>

                  <div className="pc-retreat-action-completed-title pc-retreat-mission-completed-title">
                    {event.title}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* While voting is active, show the Reveal Vote button */}
          {(scene === 'voting' || decisionStatus === 'open') && onRevealVote && (
            <div className="pc-retreat-reveal-vote-row">
              <button
                type="button"
                className="pc-retreat-ask-room-row"
                onClick={onRevealVote}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  style={{ flex: '0 0 20px' }}
                >
                  <path
                    d="M2.01677 10.5956C1.90328 10.4159 1.84654 10.3261 1.81477 10.1875C1.79091 10.0834 1.79091 9.91922 1.81477 9.81512C1.84654 9.67654 1.90328 9.58669 2.01677 9.40699C2.95461 7.922 5.74617 4.16797 10.0003 4.16797C14.2545 4.16797 17.0461 7.922 17.9839 9.40699C18.0974 9.58669 18.1541 9.67654 18.1859 9.81512C18.2098 9.91922 18.2098 10.0834 18.1859 10.1875C18.1541 10.3261 18.0974 10.4159 17.9839 10.5956C17.0461 12.0806 14.2545 15.8346 10.0003 15.8346C5.74617 15.8346 2.95461 12.0806 2.01677 10.5956Z"
                    stroke="#A3A3A3"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.0003 12.5013C11.381 12.5013 12.5003 11.382 12.5003 10.0013C12.5003 8.62059 11.381 7.5013 10.0003 7.5013C8.61962 7.5013 7.50034 8.62059 7.50034 10.0013C7.50034 11.382 8.61962 12.5013 10.0003 12.5013Z"
                    stroke="#A3A3A3"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="pc-retreat-ask-room-question">
                  Reveal vote
                </span>
              </button>
            </div>
          )}

          {/* When ready to ask (before voting starts), show compact Ask Room row */}
          {canAskRoom && !(scene === 'voting' || decisionStatus === 'open') && !isVoteRevealed && onStartVoting && roomQuestion && (
            <button
              type="button"
              className="pc-retreat-ask-room-row"
              onClick={onStartVoting}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                style={{ flex: '0 0 19px' }}
              >
                <path
                  d="M6.74329 6.66927C6.93921 6.11233 7.32592 5.64269 7.83492 5.34355C8.34393 5.0444 8.94237 4.93505 9.52427 5.03486C10.1062 5.13468 10.634 5.43721 11.0142 5.88888C11.3944 6.34055 11.6025 6.91221 11.6016 7.5026C11.6016 9.16927 9.10163 10.0026 9.10163 10.0026M9.16829 13.3359H9.17663M17.5016 9.16927C17.5016 13.7716 13.7707 17.5026 9.16829 17.5026C4.56592 17.5026 0.834961 13.7716 0.834961 9.16927C0.834961 4.5669 4.56592 0.835938 9.16829 0.835938C13.7707 0.835938 17.5016 4.5669 17.5016 9.16927Z"
                  stroke="#A3A3A3"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="pc-retreat-ask-room-question">
                Ask Room – {roomQuestion}
              </span>

            </button>
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
          {attachedContext
            .filter((ctx) => ctx.title?.trim())
            .map((ctx) => (
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
