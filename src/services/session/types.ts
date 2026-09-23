export type Scene = 'join' | 'dashboard' | 'voting' | 'result';
export type VoteOption = string;
export type DecisionStatus = 'idle' | 'open' | 'closed' | 'result' | 'tie';

export interface DecisionHistoryItem {
  decisionId: string;
  winningOptionId: string | null;
  resolvedAt?: number;
}

/**
 * Shared, serializable state representing a PosterChild presentation session.
 * Designed to map cleanly to Supabase Realtime, Firebase Realtime Database, or Firestore.
 */
export interface SessionState {
  sessionId: string;
  scene: Scene;
  simulatedParticipants: number;
  joinedParticipants: number;
  votes: Record<string, number>;
  winner: string | null;

  // Branching Decision Architecture extensions
  activeDecisionId: string;
  decisionStatus: DecisionStatus;
  winningOptionId: string | null;
  tiedOptionIds: string[] | null;
  allowedOptionIds?: string[] | null;
  participantVotes?: Record<string, string>; // clientId -> optionId

  // Presentation Flow & Mission Progression extensions
  completedMissionIds?: string[];
  currentMissionId?: string | null;
  decisionHistory?: DecisionHistoryItem[];

  // Presenter-side vote reveal extension
  isVoteRevealed?: boolean;
}

/**
 * High-level actions dispatched by presenters or participants.
 */
export type SessionAction =
  | { type: 'SET_SCENE'; scene: Scene }
  | { type: 'JOIN'; clientId?: string }
  | { type: 'VOTE'; option: string; clientId?: string }
  | { type: 'CHANGE_VOTE'; option: string; clientId?: string }
  | { type: 'END_VOTING' }
  | { type: 'RESET' }
  | { type: 'SYNC'; state: SessionState }
  | { type: 'SET_DECISION'; decisionId: string }
  | { type: 'OPEN_VOTING'; decisionId?: string; allowedOptionIds?: string[] }
  | { type: 'CLOSE_VOTING' }
  | { type: 'REVEAL_RESULT' }
  | { type: 'REVOTE_TIE' }
  | { type: 'REOPEN_VOTING' }
  | { type: 'ADVANCE_WINNER'; destination?: string }
  | { type: 'START_MISSION'; missionId: string }
  | { type: 'COMPLETE_MISSION'; missionId: string }
  | { type: 'RETURN_HOME' }
  | { type: 'REVEAL_MANAGE' };

/**
 * Transport adapter interface.
 * Decouples the React UI components from the underlying transport protocol
 * (Local BroadcastChannel/localStorage, Supabase Realtime, Firebase, WebSockets, etc.).
 */
export interface SessionAdapter {
  /**
   * Subscribe to live state updates for a given session room.
   * Returns an unsubscribe function.
   */
  subscribe(
    sessionId: string,
    callback: (state: SessionState) => void
  ): () => void;

  /**
   * Get synchronous snapshot of the current state for a session.
   */
  getState(sessionId: string): SessionState;

  /**
   * Send an action to mutate session state.
   */
  dispatch(sessionId: string, action: SessionAction): Promise<void> | void;

  /**
   * Check whether a specific client has cast a vote in the current session.
   */
  hasClientVoted(sessionId: string, clientId: string): boolean;

  /**
   * Record that a client has voted (enforces 1 vote per participant).
   */
  markClientVoted(sessionId: string, clientId: string, option: VoteOption): void;

  /**
   * Clear local voting lock (e.g. on reset).
   */
  clearClientVote(sessionId: string, clientId: string): void;

  /**
   * Retrieve or create a persistent anonymous device/client identifier.
   */
  getClientId(): string;

  /**
   * Register active presence for a connected /join client.
   * Returns an unregister cleanup function.
   */
  registerPresence?(sessionId: string, clientId: string): () => void;
}
