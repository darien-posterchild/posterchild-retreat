import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PostieView = 'sidebar' | 'floating' | 'collapsed';

export type RetreatTimelineEventType =
  | 'ask-room-ready'
  | 'room-question'
  | 'team-choice'
  | 'next-step'
  | 'ask-postie-ready'
  | 'ask-postie-pending'
  | 'user-question'
  | 'postie-response'
  | 'action-completed'
  | 'mission-completed';

export interface RetreatTimelineEvent {
  id: string;
  type: RetreatTimelineEventType;
  title: string;
  body?: string;
  meta?: string; // e.g. "7 of 10 votes · 70%"
  decisionId?: string;
  ctaLabel?: string;
  ctaTarget?: string; // navigate target
  timestamp: number;
}

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

export interface PostieSuggestion {
  id: string;
  text: string;
  iconName?: string;
  response?: {
    text: string;
    usedContext?: string[];
    actions?: ActionItem[];
  };
}

export interface PostieContextValue {
  postieView: PostieView;
  setPostieView: (view: PostieView) => void;
  lastOpenPostieView: 'sidebar' | 'floating';
  collapsePostie: () => void;
  openPostie: () => void;
  activePromptRequest: string | null;
  triggerPrompt: (promptText: string) => void;
  clearPromptRequest: () => void;
  // Context-keyed conversations
  conversationsByContext: Record<string, Message[]>;
  getMessagesForContext: (contextKey: string) => Message[];
  addMessageToContext: (contextKey: string, message: Message) => void;
  setMessagesForContext: (contextKey: string, messages: Message[]) => void;
  resetAllConversations: () => void;
  // Retreat shared timeline
  retreatTimeline: RetreatTimelineEvent[];
  addRetreatEvent: (event: Omit<RetreatTimelineEvent, 'id' | 'timestamp'>) => void;
  replaceRetreatEvent: (matchId: string, replacement: Omit<RetreatTimelineEvent, 'id' | 'timestamp'>) => void;
  removeRetreatEvent: (matchId: string) => void;
  clearRetreatTimeline: () => void;
  hasRetreatTimelineEventOfType: (type: RetreatTimelineEventType, dedupKey?: string, forDecisionId?: string) => boolean;
  getRetreatEventOfType: (type: RetreatTimelineEventType, dedupKey?: string, forDecisionId?: string) => RetreatTimelineEvent | undefined;
}

const STORAGE_KEY = 'postie_view';
const LAST_OPEN_KEY = 'postie_last_open';

/**
 * Returns a stable context key based on current URL pathname
 */
export function getPostieContextKey(pathname: string): string {
  if (pathname.includes('/tell/stories/review')) {
    return 'story-youth-career-pathways';
  }
  if (pathname.includes('/tell/stories/create')) {
    return 'story-create';
  }
  if (pathname.includes('/tell/stories')) {
    return 'tell-stories';
  }
  if (pathname.includes('/tell/connect')) {
    return 'connect';
  }
  if (pathname.includes('/tell/quotes')) {
    return 'tell-quotes';
  }
  if (pathname.includes('/tell/calendar')) {
    return 'tell-calendar';
  }
  if (pathname.includes('/tell')) {
    return 'tell-overview';
  }
  if (pathname.includes('/raise/opportunities/kresge')) {
    return 'kresge-opportunity';
  }
  if (pathname.includes('/raise')) {
    return 'raise-overview';
  }
  if (pathname.includes('/manage/assets')) {
    return 'manage-assets';
  }
  if (pathname.includes('/manage')) {
    return 'manage';
  }
  if (pathname.includes('/next-steps')) {
    return 'next-steps';
  }
  return 'home';
}

/**
 * Canonical initial conversation seeded only for Story Review.
 * All other contexts start clean/empty.
 */
export const INITIAL_STORY_REVIEW_MESSAGES: Message[] = [];

export const getInitialConversations = (): Record<string, Message[]> => ({
  'story-youth-career-pathways': [],
  home: [],
  'kresge-opportunity': [],
  connect: [],
  'tell-overview': [],
  'tell-stories': [],
  'tell-quotes': [],
  'tell-calendar': [],
  'raise-overview': [],
  manage: [],
  'next-steps': []
});

const PostieContext = createContext<PostieContextValue | undefined>(undefined);

export function PostieProvider({ children }: { children: ReactNode }) {
  const [postieView, setPostieViewState] = useState<PostieView>('sidebar');
  const [lastOpenPostieView, setLastOpenPostieViewState] = useState<'sidebar' | 'floating'>('sidebar');
  const [activePromptRequest, setActivePromptRequest] = useState<string | null>(null);

  // Context-isolated persistent conversation memory
  const [conversationsByContext, setConversationsByContext] = useState<Record<string, Message[]>>(() => {
    return getInitialConversations();
  });

  // Shared retreat timeline — persists across all routes during one session
  const [retreatTimeline, setRetreatTimeline] = useState<RetreatTimelineEvent[]>([]);

  useEffect(() => {
    try {
      const savedView = localStorage.getItem(STORAGE_KEY) as PostieView | null;
      const savedLastOpen = localStorage.getItem(LAST_OPEN_KEY) as ('sidebar' | 'floating') | null;
      if (savedView && ['sidebar', 'floating', 'collapsed'].includes(savedView)) {
        setPostieViewState(savedView);
      }
      if (savedLastOpen && ['sidebar', 'floating'].includes(savedLastOpen)) {
        setLastOpenPostieViewState(savedLastOpen);
      }
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, []);

  const setPostieView = (view: PostieView) => {
    setPostieViewState(view);
    if (view !== 'collapsed') {
      setLastOpenPostieViewState(view);
      try {
        localStorage.setItem(LAST_OPEN_KEY, view);
      } catch {
        // Ignore
      }
    }
    try {
      localStorage.setItem(STORAGE_KEY, view);
      window.dispatchEvent(new Event('posterchild-postie-toggle'));
    } catch {
      // Ignore
    }
  };

  const collapsePostie = () => {
    if (postieView !== 'collapsed') {
      setLastOpenPostieViewState(postieView);
      setPostieViewState('collapsed');
      try {
        localStorage.setItem(LAST_OPEN_KEY, postieView);
        localStorage.setItem(STORAGE_KEY, 'collapsed');
        window.dispatchEvent(new Event('posterchild-postie-toggle'));
      } catch {
        // Ignore
      }
    }
  };

  const openPostie = () => {
    setPostieViewState(lastOpenPostieView);
    try {
      localStorage.setItem(STORAGE_KEY, lastOpenPostieView);
      window.dispatchEvent(new Event('posterchild-postie-toggle'));
    } catch {
      // Ignore
    }
  };

  const triggerPrompt = (promptText: string) => {
    if (postieView === 'collapsed') {
      setPostieViewState(lastOpenPostieView);
      try {
        localStorage.setItem(STORAGE_KEY, lastOpenPostieView);
        window.dispatchEvent(new Event('posterchild-postie-toggle'));
      } catch {
        // Ignore
      }
    }
    setActivePromptRequest(promptText);
  };

  const clearPromptRequest = () => {
    setActivePromptRequest(null);
  };

  const getMessagesForContext = (contextKey: string): Message[] => {
    return conversationsByContext[contextKey] || [];
  };

  const addMessageToContext = (contextKey: string, message: Message) => {
    setConversationsByContext((prev) => ({
      ...prev,
      [contextKey]: [...(prev[contextKey] || []), message]
    }));
  };

  const setMessagesForContext = (contextKey: string, messages: Message[]) => {
    setConversationsByContext((prev) => ({
      ...prev,
      [contextKey]: messages
    }));
  };

  const resetAllConversations = () => {
    setConversationsByContext(getInitialConversations());
  };

  const addRetreatEvent = (event: Omit<RetreatTimelineEvent, 'id' | 'timestamp'>) => {
    const newEvent: RetreatTimelineEvent = {
      ...event,
      id: `retreat-event-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now()
    };
    setRetreatTimeline((prev) => [...prev, newEvent]);
  };

  const clearRetreatTimeline = () => {
    setRetreatTimeline([]);
  };

  /** Replace an event in the timeline by its id, preserving order. */
  const replaceRetreatEvent = (matchId: string, replacement: Omit<RetreatTimelineEvent, 'id' | 'timestamp'>) => {
    setRetreatTimeline((prev) =>
      prev.map((e) =>
        e.id === matchId
          ? { ...replacement, id: e.id, timestamp: e.timestamp }
          : e
      )
    );
  };

  /** Remove an event from the timeline by its id. */
  const removeRetreatEvent = (matchId: string) => {
    setRetreatTimeline((prev) => prev.filter((e) => e.id !== matchId));
  };

  /**
   * Idempotency check: returns true if a retreat event of this type already exists.
   * Optional dedupKey matches against event title (case-insensitive substring).
   * Optional forDecisionId restricts matching to events with that decisionId.
   */
  const hasRetreatTimelineEventOfType = (type: RetreatTimelineEventType, dedupKey?: string, forDecisionId?: string): boolean => {
    return retreatTimeline.some((e) => {
      if (e.type !== type) return false;
      if (forDecisionId && e.decisionId !== forDecisionId) return false;
      if (dedupKey) return e.title.toLowerCase().includes(dedupKey.toLowerCase());
      return true;
    });
  };

  /** Returns the first matching retreat event of the given type, optionally filtered by dedupKey in title or decisionId. */
  const getRetreatEventOfType = (type: RetreatTimelineEventType, dedupKey?: string, forDecisionId?: string): RetreatTimelineEvent | undefined => {
    return retreatTimeline.find((e) => {
      if (e.type !== type) return false;
      if (forDecisionId && e.decisionId !== forDecisionId) return false;
      if (dedupKey) return e.title.toLowerCase().includes(dedupKey.toLowerCase());
      return true;
    });
  };

  return (
    <PostieContext.Provider
      value={{
        postieView,
        setPostieView,
        lastOpenPostieView,
        collapsePostie,
        openPostie,
        activePromptRequest,
        triggerPrompt,
        clearPromptRequest,
        conversationsByContext,
        getMessagesForContext,
        addMessageToContext,
        setMessagesForContext,
        resetAllConversations,
        retreatTimeline,
        addRetreatEvent,
        replaceRetreatEvent,
        removeRetreatEvent,
        clearRetreatTimeline,
        hasRetreatTimelineEventOfType,
        getRetreatEventOfType
      }}
    >
      {children}
    </PostieContext.Provider>
  );
}

export function usePostie(): PostieContextValue {
  const context = useContext(PostieContext);
  if (!context) {
    throw new Error('usePostie must be used within a PostieProvider');
  }
  return context;
}
