import { DecisionOption, RETREAT_DECISIONS } from './retreatDecisions';
import type { SessionState } from '../services/session/types';

export type RetreatMissionStatus = 'locked' | 'available' | 'active' | 'completed' | 'placeholder';

export interface RetreatMission {
  id: string;
  label: string;
  description: string;
  entryRoute: string;
  sourceDecisionId: string;
  sourceOptionId: string;
  completionRoute?: string;
  returnToHome: boolean;
  homeEffect?: string;
  nextDecisionId?: string;
  targetPillar: 'Tell' | 'Raise' | 'Manage' | 'Connect';
  convergenceMissionId?: string;
  enabled?: boolean;
  status?: RetreatMissionStatus;
}

/**
 * Maximum number of audience-directed product missions before advancing to the Manage reveal.
 */
export const RETREAT_MAX_MISSIONS = 2;

/**
 * Global Retreat Flow Feature Flags.
 */
export const RETREAT_CONFIG = {
  manageRevealEnabled: true
};

/**
 * Canonical Retreat Mission Registry for "The Future of PosterChild".
 */
export const RETREAT_MISSIONS: Record<string, RetreatMission> = {
  'kresge-funding': {
    id: 'kresge-funding',
    label: 'Kresge Foundation Funding Opportunity',
    description: 'Review the 92% matched grant opportunity ($150k) closing in 12 days and sharpen our application with Postie.',
    entryRoute: '/raise/opportunities/kresge',
    sourceDecisionId: 'home-focus',
    sourceOptionId: 'needs-attention',
    completionRoute: '/raise/opportunities/kresge',
    returnToHome: true,
    homeEffect: 'Kresge Application Draft Reviewed & Donor Touchpoint Prepared',
    nextDecisionId: 'kresge-next-action',
    targetPillar: 'Raise',
    convergenceMissionId: 'kresge-funding',
    enabled: true,
    status: 'available'
  },
  'kresge-postie': {
    id: 'kresge-postie',
    label: 'Ask Postie: Strategy Recommendation',
    description: 'Postie recommends addressing the urgent Kresge Foundation opportunity first, converging into the funding workflow.',
    entryRoute: '/raise/opportunities/kresge',
    sourceDecisionId: 'home-focus',
    sourceOptionId: 'ask-postie',
    completionRoute: '/raise/opportunities/kresge',
    returnToHome: true,
    homeEffect: 'Kresge Strategy Identified & Application Reviewed',
    nextDecisionId: 'kresge-next-action',
    targetPillar: 'Raise',
    convergenceMissionId: 'kresge-funding',
    enabled: true,
    status: 'available'
  },
  'youth-career-story': {
    id: 'youth-career-story',
    label: 'Youth Career Pathways Story',
    description: 'Review and polish the auto-drafted narrative highlighting belonging, confidence, and career opportunity.',
    entryRoute: '/tell/stories/review?story=youth-career-pathways&tab=social',
    sourceDecisionId: 'home-focus',
    sourceOptionId: 'suggested-story',
    completionRoute: '/tell/stories/review?story=youth-career-pathways&tab=social',
    returnToHome: true,
    homeEffect: 'Youth Career Pathways Story Draft Published',
    nextDecisionId: 'story-output',
    targetPillar: 'Tell',
    convergenceMissionId: 'youth-career-story',
    enabled: true,
    status: 'available'
  },
  'new-testimonials-connect': {
    id: 'new-testimonials-connect',
    label: 'Community Testimonials & Connect',
    description: 'Explore newly surfaced quotes from program participants and link them to our donor touchpoints.',
    entryRoute: '/tell/connect',
    sourceDecisionId: 'connect-next-action',
    sourceOptionId: 'use-in-story',
    completionRoute: '/tell/connect',
    returnToHome: true,
    homeEffect: '4 New Testimonials Connected to Stories',
    nextDecisionId: 'connect-next-action',
    targetPillar: 'Connect',
    convergenceMissionId: 'youth-career-story',
    enabled: true,
    status: 'available'
  }
};

/**
 * Retrieve mission definition by mission ID.
 */
export function getMission(missionId?: string | null): RetreatMission | undefined {
  if (!missionId) return undefined;
  return RETREAT_MISSIONS[missionId];
}

/**
 * Retrieve mission definition associated with a specific decision option.
 */
export function getMissionByOption(optionId?: string | null): RetreatMission | undefined {
  if (!optionId) return undefined;
  return Object.values(RETREAT_MISSIONS).find((m) => m.sourceOptionId === optionId);
}

/**
 * Check if the retreat has completed its allocated mission count (default 2)
 * and is ready for the Manage reveal.
 */
export function canRevealManage(sessionState?: Partial<SessionState>): boolean {
  const completed = sessionState?.completedMissionIds || [];
  return completed.length >= RETREAT_MAX_MISSIONS;
}

/**
 * Returns the dynamic list of Home decision options for the current session state.
 * Filters out options corresponding to missions that are disabled or have already been completed.
 */
export function getAvailableHomeOptions(sessionState?: Partial<SessionState>): DecisionOption[] {
  const rootDecision = RETREAT_DECISIONS['home-focus'];
  if (!rootDecision) return [];

  const completed = sessionState?.completedMissionIds || [];
  if (completed.length === 0) {
    return rootDecision.options;
  }

  // Find option IDs that correspond to completed direct paths
  // Ask Postie must remain available unless Ask Postie itself has explicitly been consumed
  const completedOptionIds = new Set<string>();
  completed.forEach((missionId) => {
    if (missionId === 'kresge-funding' || missionId === 'kresge-postie') {
      completedOptionIds.add('needs-attention');
    } else if (missionId === 'youth-career-story' || missionId === 'new-testimonials-connect') {
      completedOptionIds.add('suggested-story');
    } else {
      const mission = getMission(missionId);
      if (mission?.sourceOptionId) {
        completedOptionIds.add(mission.sourceOptionId);
      }
    }
  });

  const available = rootDecision.options.filter((opt) => !completedOptionIds.has(opt.id));
  return available.length > 0 ? available : rootDecision.options;
}

/**
 * Compute the progression stage of the presentation.
 */
export type PresentationStage =
  | 'HOME_1'
  | 'DECISION_1'
  | 'MISSION_1'
  | 'RETURN_HOME_1'
  | 'HOME_2'
  | 'DECISION_2'
  | 'MISSION_2'
  | 'RETURN_HOME_2'
  | 'MANAGE_REVEAL'
  | 'CLOSING';

export function getPresentationStage(
  pathname: string,
  sessionState?: Partial<SessionState>
): PresentationStage {
  const completedCount = (sessionState?.completedMissionIds || []).length;
  const isHome = pathname === '/present' || pathname.endsWith('/present') || pathname.endsWith('/present/PC26') || pathname === '/' || pathname.endsWith('/');
  const isManage = pathname.includes('/manage');
  const isNextSteps = pathname.includes('/next-steps');
  const isVoting = sessionState?.scene === 'voting' || sessionState?.decisionStatus === 'open';

  if (isNextSteps) return 'CLOSING';
  if (isManage) return 'MANAGE_REVEAL';

  if (completedCount === 0) {
    if (isHome) return isVoting ? 'DECISION_1' : 'HOME_1';
    return 'MISSION_1';
  }

  if (completedCount === 1) {
    if (isHome) return isVoting ? 'DECISION_2' : 'HOME_2';
    return 'MISSION_2';
  }

  // 2 or more completed missions
  if (isHome) return 'RETURN_HOME_2';
  return 'MANAGE_REVEAL';
}
