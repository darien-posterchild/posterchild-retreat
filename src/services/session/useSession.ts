import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { activeSessionAdapter } from './index';
import type { Scene, SessionAction, SessionState, VoteOption } from './types';
import { getDecision, type DecisionNode } from '../../config/retreatDecisions';

const DEFAULT_SESSION_ID = 'PC26';

export function useSession(customSessionId?: string) {
  const params = useParams<{ sessionId?: string }>();
  const sessionId = customSessionId || params.sessionId || DEFAULT_SESSION_ID;

  const [state, setState] = useState<SessionState>(() => {
    return activeSessionAdapter.getState(sessionId);
  });

  const clientId = activeSessionAdapter.getClientId();
  const clientVote = state.participantVotes?.[clientId] || null;
  const [hasVoted, setHasVoted] = useState<boolean>(() => {
    return Boolean(clientVote) || activeSessionAdapter.hasClientVoted(sessionId, clientId);
  });

  useEffect(() => {
    // Subscribe to state updates from active adapter
    const unsubscribe = activeSessionAdapter.subscribe(sessionId, (newState) => {
      setState(newState);

      // Re-check voting status when scene resets or changes
      if (newState.scene === 'join') {
        setHasVoted(false);
      } else {
        const v = newState.participantVotes?.[clientId];
        setHasVoted(Boolean(v) || activeSessionAdapter.hasClientVoted(sessionId, clientId));
      }
    });

    return unsubscribe;
  }, [sessionId, clientId]);

  const dispatch = useCallback((action: SessionAction) => {
    activeSessionAdapter.dispatch(sessionId, action);
  }, [sessionId]);

  const setScene = useCallback((scene: Scene) => {
    dispatch({ type: 'SET_SCENE', scene });
  }, [dispatch]);

  const vote = useCallback((option: VoteOption) => {
    if (state.scene !== 'voting' && state.decisionStatus !== 'open') {
      return false;
    }

    // Allow voting or changing vote while voting is open
    activeSessionAdapter.markClientVoted(sessionId, clientId, option);
    setHasVoted(true);
    dispatch({ type: 'VOTE', option, clientId });
    return true;
  }, [sessionId, clientId, state.scene, state.decisionStatus, dispatch]);

  const openVoting = useCallback((decisionId?: string, allowedOptionIds?: string[]) => {
    dispatch({ type: 'OPEN_VOTING', decisionId, allowedOptionIds });
  }, [dispatch]);

  const closeVoting = useCallback(() => {
    dispatch({ type: 'CLOSE_VOTING' });
  }, [dispatch]);

  const endVoting = useCallback(() => {
    dispatch({ type: 'END_VOTING' });
  }, [dispatch]);

  const revealResult = useCallback(() => {
    dispatch({ type: 'REVEAL_RESULT' });
  }, [dispatch]);

  const revoteTie = useCallback(() => {
    dispatch({ type: 'REVOTE_TIE' });
  }, [dispatch]);

  const reopenVoting = useCallback(() => {
    dispatch({ type: 'REOPEN_VOTING' });
  }, [dispatch]);

  const setDecision = useCallback((decisionId: string) => {
    dispatch({ type: 'SET_DECISION', decisionId });
  }, [dispatch]);

  const reset = useCallback(() => {
    activeSessionAdapter.clearClientVote(sessionId, clientId);
    setHasVoted(false);
    dispatch({ type: 'RESET' });
  }, [sessionId, clientId, dispatch]);

  const activeDecision: DecisionNode = getDecision(state.activeDecisionId);
  const participantCount = state.joinedParticipants;

  return {
    state,
    sessionId,
    clientId,
    clientVote,
    hasVoted,
    participantCount,
    activeDecision,
    dispatch,
    setScene,
    vote,
    openVoting,
    closeVoting,
    endVoting,
    revealResult,
    revoteTie,
    reopenVoting,
    setDecision,
    reset
  };
}
