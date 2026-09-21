import { useSession } from './services/session/useSession';

/**
 * Hook providing backward-compatible session state access.
 * Delegates to the active transport adapter via useSession().
 */
export function useDemoState(sessionId?: string) {
  return useSession(sessionId);
}