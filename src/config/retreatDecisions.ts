export type DecisionActionType = 'navigate' | 'openPostie' | 'switchTab' | 'completeMission';

export interface DecisionOption {
  id: string;
  label: string;
  description?: string;
  destination: string; // Relative product destination e.g. '/tell/stories'
  actionType: DecisionActionType;
  iconName?: string;
  nextStepExplanation?: string;
  nextStepCtaLabel?: string;
}

export interface DecisionNode {
  id: string;
  question: string;
  description?: string;
  options: DecisionOption[];
  nextDecisionId?: string;
}

/**
 * Centralized Decision Registry for the PosterChild Retreat 2026.
 * All branching logic, questions, choices, and destination routing are maintained here.
 */
export const RETREAT_DECISIONS: Record<string, DecisionNode> = {
  // 1. Root Decision (Home)
  'home-focus': {
    id: 'home-focus',
    question: 'What should we do first today?',
    description: 'Help the team decide where to focus our energy in today’s session.',
    options: [
      {
        id: 'needs-attention',
        label: 'See what needs attention',
        description: 'Review urgent deadlines like the Kresge Foundation opportunity.',
        destination: '/raise/opportunities/kresge',
        actionType: 'navigate',
        iconName: 'alert-triangle',
        nextStepExplanation: 'Kresge Foundation needs your attention. It closes in 12 days and the application is ready for review.',
        nextStepCtaLabel: 'Review opportunity'
      },
      {
        id: 'suggested-story',
        label: 'View suggested story',
        description: 'Review the Youth Career Pathways draft prepared by PosterChild.',
        destination: '/tell/stories/review?story=youth-career-pathways&tab=social',
        actionType: 'navigate',
        iconName: 'book-open-01',
        nextStepExplanation: 'Youth Career Pathways is ready for review. PosterChild has prepared a draft using recent community testimonials.',
        nextStepCtaLabel: 'Review story'
      },
      {
        id: 'ask-postie',
        label: 'Ask Postie',
        description: 'Let Postie analyze priorities and recommend the strongest next move.',
        destination: '/raise/opportunities/kresge',
        actionType: 'openPostie',
        iconName: 'stars-01'
      }
    ],
    nextDecisionId: 'kresge-next-action'
  },

  // 2. Kresge Single-Screen Mission Decision
  'kresge-next-action': {
    id: 'kresge-next-action',
    question: 'What should we do next with this opportunity?',
    description: 'Decide the next strategic step to strengthen the Kresge Foundation opportunity.',
    options: [
      {
        id: 'review-requirements',
        label: 'View Action Plan',
        description: 'Open the Action Plan to review strategic insights, recommended steps, and key talking points.',
        destination: '/raise/opportunities/kresge?tab=action-plan',
        actionType: 'navigate',
        iconName: 'file-06',
        nextStepExplanation: 'The Action Plan shows the remaining work and the clearest path toward submission.',
        nextStepCtaLabel: 'View Action Plan'
      },
      {
        id: 'ask-postie',
        label: 'Ask Postie',
        description: 'Ask Postie for the fastest path to strengthen this opportunity.',
        destination: '/raise/opportunities/kresge',
        actionType: 'openPostie',
        iconName: 'stars-01'
      }
    ]
  },

  // 3. Story Detail Decision Node
  'story-output': {
    id: 'story-output',
    question: 'How should we use this story?',
    description: 'Choose the product channel to activate the Youth Career Pathways narrative.',
    options: [
      {
        id: 'social',
        label: 'Refresh Social Post',
        description: 'Refresh the social version with a stronger opening and visual direction.',
        destination: '/tell/stories/review?story=youth-career-pathways&tab=social&refresh=1',
        actionType: 'navigate',
        iconName: 'share-01',
        nextStepExplanation:
          'Postie can strengthen the social version before publishing — starting with a sharper opening and a refreshed visual direction.',
        nextStepCtaLabel: 'Refresh Social Post'
      },
      {
        id: 'article',
        label: 'Article',
        description: 'Publish full formatted article to the website and newsletter.',
        destination: '/tell/stories/review?story=youth-career-pathways&tab=article',
        actionType: 'switchTab',
        iconName: 'file-06',
        nextStepExplanation: 'Review the long-form Article version.',
        nextStepCtaLabel: 'Open Article'
      },
      {
        id: 'ask-postie',
        label: 'Ask Postie',
        description: 'Let Postie evaluate the fastest high-resonance channel.',
        destination: '/tell/stories/review?story=youth-career-pathways&tab=social&refresh=1',
        actionType: 'openPostie',
        iconName: 'stars-01'
      }
    ]
  },

  // 4. Connect Decision Node
  'connect-next-action': {
    id: 'connect-next-action',
    question: 'What should we do with this signal?',
    description: 'Decide how to act on the recurring transportation pattern found across community voice.',
    options: [
      {
        id: 'use-in-story',
        label: 'Use this in a story',
        description: 'Connect these testimonials directly into the Youth Career Pathways narrative.',
        destination: '/tell/stories/review?story=youth-career-pathways&tab=social',
        actionType: 'navigate',
        iconName: 'sparkles',
        nextStepExplanation: 'Connect these testimonials directly into the Youth Career Pathways narrative.',
        nextStepCtaLabel: 'Use in story'
      },
      {
        id: 'ask-postie',
        label: 'Ask Postie',
        description: 'Let Postie summarize the clearest response patterns and recommend next moves.',
        destination: '/tell/connect',
        actionType: 'openPostie',
        iconName: 'stars-01'
      }
    ]
  }
};

/**
 * Returns dynamic Home decision question based on whether any missions were completed.
 */
export function getHomeQuestion(sessionState?: { completedMissionIds?: string[] } | null): string {
  const completed = sessionState?.completedMissionIds || [];
  return completed.length > 0 ? 'What should we do now?' : 'What should we do first today?';
}

/**
 * Retrieve a decision by ID, defaulting to 'home-focus'.
 */
export function getDecision(decisionId?: string | null, sessionState?: { completedMissionIds?: string[] } | null): DecisionNode {
  const decId = decisionId || 'home-focus';
  const node = RETREAT_DECISIONS[decId] || RETREAT_DECISIONS['home-focus'];
  if (decId === 'home-focus') {
    return {
      ...node,
      question: getHomeQuestion(sessionState)
    };
  }
  return node;
}

export interface OptionTally {
  count: number;
  percentage: number;
}

export interface DecisionTallies {
  options: Record<string, OptionTally>;
  totalVotes: number;
}

/**
 * Derive canonical option counts, total votes, and percentages from session state.
 * Guaranteed to never return negative numbers or NaN percentages.
 */
export function getDecisionTallies(
  sessionState: { votes?: Record<string, number>; participantVotes?: Record<string, string> },
  decision: DecisionNode
): DecisionTallies {
  const options = decision.options;
  const counts: Record<string, number> = {};

  options.forEach((opt) => {
    counts[opt.id] = 0;
  });

  if (sessionState.participantVotes && Object.keys(sessionState.participantVotes).length > 0) {
    Object.values(sessionState.participantVotes).forEach((optId) => {
      const normalizedId = optId === 'campaign' ? 'campaigns' : optId;
      if (counts[normalizedId] !== undefined) {
        counts[normalizedId] += 1;
      }
    });
  } else if (sessionState.votes) {
    options.forEach((opt) => {
      let rawCount = sessionState.votes?.[opt.id] || 0;
      if (opt.id === 'campaigns') {
        rawCount += sessionState.votes?.['campaign'] || 0;
      }
      counts[opt.id] = Math.max(0, rawCount);
    });
  }

  const totalVotes = Object.values(counts).reduce((sum, c) => sum + c, 0);

  const optionTallies: Record<string, OptionTally> = {};
  options.forEach((opt) => {
    const count = counts[opt.id] || 0;
    const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
    optionTallies[opt.id] = { count, percentage };
  });

  return {
    options: optionTallies,
    totalVotes
  };
}

export interface DecisionResolution {
  status: 'zero_votes' | 'tie' | 'winner';
  winner: DecisionOption | null;
  tiedOptions: DecisionOption[];
  totalVotes: number;
}

/**
 * Pure decision resolver. Analyzes vote tallies and returns winner, ties, or zero-vote status.
 */
export function resolveDecisionWinner(
  decision: DecisionNode,
  votesOrState: Record<string, number> | { votes?: Record<string, number>; participantVotes?: Record<string, string> }
): DecisionResolution {
  const tallies = getDecisionTallies(
    ('votes' in votesOrState || 'participantVotes' in votesOrState)
      ? (votesOrState as { votes?: Record<string, number>; participantVotes?: Record<string, string> })
      : { votes: votesOrState as Record<string, number> },
    decision
  );

  const totalVotes = tallies.totalVotes;
  if (totalVotes === 0) {
    return {
      status: 'zero_votes',
      winner: null,
      tiedOptions: [],
      totalVotes: 0
    };
  }

  let maxVotes = 0;
  decision.options.forEach((opt) => {
    const count = tallies.options[opt.id]?.count || 0;
    if (count > maxVotes) {
      maxVotes = count;
    }
  });

  if (maxVotes === 0) {
    return {
      status: 'zero_votes',
      winner: null,
      tiedOptions: [],
      totalVotes: 0
    };
  }

  const topOptions = decision.options.filter(
    (opt) => (tallies.options[opt.id]?.count || 0) === maxVotes
  );

  if (topOptions.length > 1) {
    return {
      status: 'tie',
      winner: null,
      tiedOptions: topOptions,
      totalVotes
    };
  }

  return {
    status: 'winner',
    winner: topOptions[0] || null,
    tiedOptions: [],
    totalVotes
  };
}

/**
 * Build destination path preserving the active session context.
 * Example: '/tell/stories', 'PC26' -> '/present/PC26/tell/stories'
 */
export function buildDestinationUrl(destination: string, sessionId: string = 'PC26'): string {
  const cleanDestination = destination.startsWith('/') ? destination : `/${destination}`;
  return `/present/${sessionId}${cleanDestination}`;
}
