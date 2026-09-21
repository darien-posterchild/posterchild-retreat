import type {
  Scene,
  SessionAction,
  SessionState,
  VoteOption
} from './services/session/types';

export type { Scene, VoteOption, SessionState, SessionAction };

// Backwards-compatible aliases for existing UI components
export type DemoState = SessionState;
export type DemoAction = SessionAction;