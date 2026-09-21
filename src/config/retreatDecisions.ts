export interface DecisionOption {
  id: string;
  label: string;
  description?: string;
  destination: string; // Relative product destination e.g. '/tell/stories'
  iconName?: string;
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
    question: 'Where should we go first?',
    description: 'Help the team decide where to focus our energy in today’s session.',
    options: [
      {
        id: 'ask-postie',
        label: 'Ask Postie',
        description: 'Let Postie analyze priorities and recommend the strongest next move.',
        destination: '/raise/opportunities/kresge',
        iconName: 'stars-01'
      },
      {
        id: 'needs-attention',
        label: 'See what needs attention',
        description: 'Review urgent deadlines like the Kresge Foundation opportunity.',
        destination: '/raise/opportunities/kresge',
        iconName: 'alert-triangle'
      },
      {
        id: 'create-story',
        label: 'Create a new story',
        description: 'Draft a new narrative from recent program impact testimonials.',
        destination: '/tell/stories/create',
        iconName: 'plus'
      },
      {
        id: 'new-testimonials',
        label: 'Explore new testimonials',
        description: 'Connect community voice to active campaigns and partner touchpoints.',
        destination: '/tell/connect',
        iconName: 'coins-hand'
      },
      {
        id: 'suggested-story',
        label: 'View the suggested story',
        description: 'Review the Youth Career Pathways draft prepared by PosterChild.',
        destination: '/tell/stories/review?story=youth-career-pathways&tab=social',
        iconName: 'folder'
      }
    ],
    nextDecisionId: 'kresge-next-action'
  },

  // 2. Kresge Single-Screen Mission Decision
  'kresge-next-action': {
    id: 'kresge-next-action',
    question: 'What should we do next with Kresge?',
    description: 'Decide the next strategic step to strengthen the Kresge Foundation opportunity.',
    options: [
      {
        id: 'review-requirements',
        label: 'Review requirements',
        description: 'Inspect alignment benchmarks, confirmed stories, and checklist.',
        destination: '/raise/opportunities/kresge',
        iconName: 'file-06'
      },
      {
        id: 'strengthen-application',
        label: 'Strengthen application',
        description: 'Target key readiness gaps such as the updated program budget.',
        destination: '/raise/opportunities/kresge',
        iconName: 'sparkles'
      },
      {
        id: 'ask-postie',
        label: 'Ask Postie',
        description: 'Ask Postie for the fastest path to strengthen this opportunity.',
        destination: '/raise/opportunities/kresge',
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
        label: 'Social media',
        description: 'Turn the participant quote into an Instagram spotlight carousel.',
        destination: '/tell/stories/review?story=youth-career-pathways&tab=social',
        iconName: 'message-square-quote'
      },
      {
        id: 'article',
        label: 'Article',
        description: 'Publish full formatted article to the website and newsletter.',
        destination: '/tell/stories/review?story=youth-career-pathways&tab=article',
        iconName: 'file-06'
      },
      {
        id: 'ask-postie',
        label: 'Ask Postie',
        description: 'Let Postie evaluate the fastest high-resonance channel.',
        destination: '/tell/stories/review?story=youth-career-pathways&tab=social',
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
        id: 'review-theme',
        label: 'Review the theme',
        description: 'Analyze recurring signals across the 7 Youth Career Pathways responses.',
        destination: '/tell/connect',
        iconName: 'file-06'
      },
      {
        id: 'use-in-story',
        label: 'Use responses in a story',
        description: 'Connect these testimonials directly into the Youth Career Pathways narrative.',
        destination: '/tell/stories/review?story=youth-career-pathways&tab=social',
        iconName: 'sparkles'
      },
      {
        id: 'ask-postie',
        label: 'Ask Postie',
        description: 'Let Postie summarize the clearest response patterns and recommend next moves.',
        destination: '/tell/connect',
        iconName: 'stars-01'
      }
    ]
  },

  // Legacy Kresge Decision Node
  'kresge-next': {
    id: 'kresge-next',
    question: 'What should we do with Kresge?',
    description: 'Decide the next strategic step to maximize our funding opportunity ($150k).',
    options: [
      {
        id: 'review-opportunity',
        label: 'Review opportunity',
        description: 'Inspect full grant criteria and alignment benchmarks.',
        destination: '/raise/refine',
        iconName: 'file-06'
      },
      {
        id: 'strengthen-application',
        label: 'Strengthen application with Postie',
        description: 'Have Postie incorporate recent youth workforce testimonials.',
        destination: '/raise/refine',
        iconName: 'sparkles'
      },
      {
        id: 'ask-postie',
        label: 'Ask Postie for recommendation',
        description: 'Evaluate strategic fit against existing funded initiatives.',
        destination: '/raise/ask-postie',
        iconName: 'stars-01'
      }
    ],
    nextDecisionId: 'final-next-step'
  },

  // Legacy Story Decision Node
  'story-next': {
    id: 'story-next',
    question: 'How should we use this story?',
    description: 'Choose the product channel to activate the Youth Career Pathways narrative.',
    options: [
      {
        id: 'social',
        label: 'Social media',
        description: 'Turn into social graphics.',
        destination: '/tell/stories/review?story=youth-career-pathways&tab=social',
        iconName: 'message-square-quote'
      },
      {
        id: 'article',
        label: 'Article',
        description: 'Publish as spotlight article.',
        destination: '/tell/stories/review?story=youth-career-pathways&tab=article',
        iconName: 'file-06'
      },
      {
        id: 'ask-postie',
        label: 'Ask Postie',
        description: 'Identify highest-resonance donor segments for this story.',
        destination: '/tell/stories/review?story=youth-career-pathways&tab=social',
        iconName: 'stars-01'
      }
    ],
    nextDecisionId: 'final-next-step'
  },

  // 2. Branch A: Stories Next Decision
  'stories-next': {
    id: 'stories-next',
    question: 'Which story should we move forward?',
    description: 'Select the community story to polish, review, and finalize.',
    options: [
      {
        id: 'mayas-journey',
        label: 'Maya’s Journey',
        description: 'First-generation scholar finding belonging through mentorship.',
        destination: '/tell/stories/review?story=mayas-journey',
        iconName: 'sparkles'
      },
      {
        id: 'youth-voices',
        label: 'Youth Voices Initiative',
        description: 'High school students building peer-led mental health circles.',
        destination: '/tell/stories/review?story=youth-voices',
        iconName: 'message-square-quote'
      },
      {
        id: 'community-gardens',
        label: 'Community Gardens Impact',
        description: 'Transforming vacant urban lots into communal food sanctuaries.',
        destination: '/tell/stories/review?story=community-gardens',
        iconName: 'rocket'
      }
    ],
    nextDecisionId: 'final-next-step'
  },

  // 3. Branch B: Campaigns Next Decision
  'campaigns-next': {
    id: 'campaigns-next',
    question: 'What should we do with the campaign?',
    description: 'Decide the immediate strategic move for the Fall Impact Campaign.',
    options: [
      {
        id: 'launch',
        label: 'Launch campaign',
        description: 'Everything is ready. Publish and start reaching supporters.',
        destination: '/raise/launch',
        iconName: 'coins-hand'
      },
      {
        id: 'refine',
        label: 'Refine first',
        description: 'Review the message, audience, and campaign details before launch.',
        destination: '/raise/refine',
        iconName: 'file-06'
      },
      {
        id: 'ask-postie',
        label: 'Ask Postie',
        description: 'Let Postie review the campaign and recommend the strongest next move.',
        destination: '/raise/ask-postie',
        iconName: 'stars-01'
      }
    ],
    nextDecisionId: 'final-next-step'
  },

  // 4. Branch C: Quotes Next Decision
  'quotes-next': {
    id: 'quotes-next',
    question: 'Where could this quote create the most value?',
    description: 'Choose the product channel to activate this community testimony.',
    options: [
      {
        id: 'story',
        label: 'Feature in a story',
        description: 'Embed as the hero quote in our next spotlight narrative.',
        destination: '/tell/quotes/story',
        iconName: 'sparkles'
      },
      {
        id: 'campaign',
        label: 'Anchor campaign appeal',
        description: 'Use on the donation page header to drive empathy and conversions.',
        destination: '/tell/quotes/campaign',
        iconName: 'rocket'
      },
      {
        id: 'social',
        label: 'Turn into social graphics',
        description: 'Generate formatted quote cards for Instagram and LinkedIn.',
        destination: '/tell/quotes/social',
        iconName: 'message-square-quote'
      }
    ],
    nextDecisionId: 'final-next-step'
  },

  // 5. Convergence Decision: Final Next Steps
  'final-next-step': {
    id: 'final-next-step',
    question: 'What should PosterChild do next?',
    description: 'Synthesize today’s decisions into our shared team roadmap.',
    options: [
      {
        id: 'publish-all',
        label: 'Publish approved assets',
        description: 'Deploy the finalized story and campaign assets to live channels.',
        destination: '/next-steps?action=publish',
        iconName: 'rocket'
      },
      {
        id: 'export-campaign',
        label: 'Export executive summary',
        description: 'Generate a presentation-ready PDF report of retreat outcomes.',
        destination: '/next-steps?action=export',
        iconName: 'sparkles'
      },
      {
        id: 'explore-postie',
        label: 'Deep dive with Postie',
        description: 'Open a collaborative AI strategy session with the entire team.',
        destination: '/next-steps?action=postie',
        iconName: 'message-square-quote'
      }
    ]
  }
};

/**
 * Retrieve a decision by ID, defaulting to 'home-focus'.
 */
export function getDecision(decisionId?: string | null): DecisionNode {
  if (decisionId && RETREAT_DECISIONS[decisionId]) {
    return RETREAT_DECISIONS[decisionId];
  }
  return RETREAT_DECISIONS['home-focus'];
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
