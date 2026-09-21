import type {
  DecisionStatus,
  Scene,
  SessionAction,
  SessionAdapter,
  SessionState,
  VoteOption
} from './types';
import { getDecision, getDecisionTallies, resolveDecisionWinner } from '../../config/retreatDecisions';

const STORAGE_PREFIX = 'pc-retreat-session-v2:';
const LEGACY_STORAGE_KEY = 'pc-retreat-demo-state-v1';
const CLIENT_KEY = 'pc-retreat-client-id-v2';

export function createInitialState(sessionId: string): SessionState {
  const rootDecision = getDecision('home-focus');
  const initialVotes: Record<string, number> = {};
  rootDecision.options.forEach((opt) => {
    initialVotes[opt.id] = 0;
  });

  return {
    sessionId,
    scene: 'join',
    simulatedParticipants: 0,
    joinedParticipants: 0,
    votes: initialVotes,
    winner: null,
    activeDecisionId: 'home-focus',
    decisionStatus: 'idle',
    winningOptionId: null,
    tiedOptionIds: null,
    allowedOptionIds: null,
    participantVotes: {},
    completedMissionIds: [],
    currentMissionId: null,
    decisionHistory: []
  };
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SET_SCENE':
      return {
        ...state,
        scene: action.scene,
        winner: action.scene === 'voting' ? null : state.winner,
        winningOptionId: action.scene === 'voting' ? null : state.winningOptionId,
        decisionStatus: action.scene === 'voting' ? 'open' : action.scene === 'result' ? 'result' : 'idle'
      };
    case 'JOIN':
      return {
        ...state,
        joinedParticipants: Math.max(0, state.joinedParticipants)
      };
    case 'VOTE':
    case 'CHANGE_VOTE': {
      if (state.scene !== 'voting' && state.decisionStatus !== 'open') return state;
      const clientId = action.clientId || 'local-client';
      const targetOption = action.option === 'campaign' ? 'campaigns' : action.option;

      // Filter by allowedOptionIds if present (e.g. tie-breaker)
      if (state.allowedOptionIds && state.allowedOptionIds.length > 0 && !state.allowedOptionIds.includes(targetOption)) {
        return state;
      }

      const newParticipantVotes = {
        ...(state.participantVotes || {}),
        [clientId]: targetOption
      };

      const decision = getDecision(state.activeDecisionId);
      const tallies = getDecisionTallies({ participantVotes: newParticipantVotes }, decision);
      const newVotes: Record<string, number> = {};
      decision.options.forEach((opt) => {
        newVotes[opt.id] = tallies.options[opt.id]?.count || 0;
      });

      return {
        ...state,
        votes: newVotes,
        participantVotes: newParticipantVotes
      };
    }
    case 'END_VOTING':
    case 'CLOSE_VOTING': {
      const decision = getDecision(state.activeDecisionId);
      const resolution = resolveDecisionWinner(decision, state);

      if (resolution.status === 'tie') {
        return {
          ...state,
          decisionStatus: 'tie',
          tiedOptionIds: resolution.tiedOptions.map((o) => o.id),
          winner: null,
          winningOptionId: null
        };
      }

      if (resolution.status === 'zero_votes') {
        return {
          ...state,
          decisionStatus: 'closed',
          winner: null,
          winningOptionId: null,
          tiedOptionIds: null
        };
      }

      const newHistoryItem = {
        decisionId: state.activeDecisionId,
        winningOptionId: resolution.winner?.id ?? null,
        resolvedAt: Date.now()
      };

      return {
        ...state,
        scene: 'result',
        decisionStatus: 'result',
        winner: resolution.winner?.id ?? null,
        winningOptionId: resolution.winner?.id ?? null,
        tiedOptionIds: null,
        decisionHistory: [...(state.decisionHistory || []), newHistoryItem]
      };
    }
    case 'REVEAL_RESULT': {
      return {
        ...state,
        scene: 'result',
        decisionStatus: 'result'
      };
    }
    case 'REVOTE_TIE': {
      const decision = getDecision(state.activeDecisionId);
      const resetVotes: Record<string, number> = {};
      const tied = state.tiedOptionIds || decision.options.map((o) => o.id);
      tied.forEach((optId) => {
        resetVotes[optId] = 0;
      });

      return {
        ...state,
        scene: 'voting',
        decisionStatus: 'open',
        allowedOptionIds: tied,
        votes: resetVotes,
        winner: null,
        winningOptionId: null,
        participantVotes: {}
      };
    }
    case 'REOPEN_VOTING': {
      return {
        ...state,
        scene: 'voting',
        decisionStatus: 'open',
        winner: null,
        winningOptionId: null,
        tiedOptionIds: null
      };
    }
    case 'SET_DECISION': {
      const decision = getDecision(action.decisionId);
      const initialVotes: Record<string, number> = {};
      decision.options.forEach((opt) => {
        initialVotes[opt.id] = 0;
      });

      return {
        ...state,
        scene: 'dashboard',
        activeDecisionId: action.decisionId,
        decisionStatus: 'idle',
        allowedOptionIds: null,
        votes: initialVotes,
        winner: null,
        winningOptionId: null,
        tiedOptionIds: null,
        participantVotes: {}
      };
    }
    case 'OPEN_VOTING': {
      const decisionId = action.decisionId || state.activeDecisionId || 'home-focus';
      const decision = getDecision(decisionId);
      const initialVotes: Record<string, number> = {};
      decision.options.forEach((opt) => {
        initialVotes[opt.id] = 0;
      });

      return {
        ...state,
        scene: 'voting',
        activeDecisionId: decisionId,
        decisionStatus: 'open',
        allowedOptionIds: action.allowedOptionIds || null,
        votes: initialVotes,
        winner: null,
        winningOptionId: null,
        tiedOptionIds: null,
        participantVotes: {}
      };
    }
    case 'START_MISSION': {
      return {
        ...state,
        currentMissionId: action.missionId,
        scene: 'dashboard',
        decisionStatus: 'idle'
      };
    }
    case 'COMPLETE_MISSION': {
      const existing = state.completedMissionIds || [];
      const updated = existing.includes(action.missionId) ? existing : [...existing, action.missionId];
      return {
        ...state,
        completedMissionIds: updated,
        currentMissionId: null
      };
    }
    case 'RETURN_HOME': {
      const rootDecision = getDecision('home-focus');
      const resetVotes: Record<string, number> = {};
      rootDecision.options.forEach((opt) => {
        resetVotes[opt.id] = 0;
      });

      return {
        ...state,
        scene: 'dashboard',
        activeDecisionId: 'home-focus',
        decisionStatus: 'idle',
        winner: null,
        winningOptionId: null,
        tiedOptionIds: null,
        allowedOptionIds: null,
        votes: resetVotes,
        participantVotes: {}
      };
    }
    case 'REVEAL_MANAGE': {
      return {
        ...state,
        scene: 'dashboard',
        decisionStatus: 'idle'
      };
    }
    case 'RESET':
      return {
        ...createInitialState(state.sessionId),
        simulatedParticipants: 0,
        joinedParticipants: 0
      };
    case 'SYNC':
      return action.state;
    default:
      return state;
  }
}

/**
 * Local implementation of SessionAdapter.
 * Uses BroadcastChannel for same-origin multi-tab sync,
 * and localStorage for persistent fallback across tabs/windows.
 */
export class LocalSessionAdapter implements SessionAdapter {
  private subscribers = new Map<string, Set<(state: SessionState) => void>>();
  private channels = new Map<string, BroadcastChannel>();
  private stateCache = new Map<string, SessionState>();
  private windowStorageListenerRegistered = false;

  constructor() {
    this.setupStorageListener();
  }

  private getStorageKey(sessionId: string): string {
    return `${STORAGE_PREFIX}${sessionId}`;
  }

  private getPresenceKey(sessionId: string): string {
    return `pc-retreat-presence:${sessionId}`;
  }

  getLivePresenceCount(sessionId: string): number {
    if (typeof window === 'undefined') return 0;
    try {
      const raw = localStorage.getItem(this.getPresenceKey(sessionId));
      if (!raw) return 0;
      const parsed = JSON.parse(raw) as Record<string, number>;
      const now = Date.now();
      let activeCount = 0;
      const cleaned: Record<string, number> = {};
      let hasExpired = false;

      for (const [cId, lastSeen] of Object.entries(parsed)) {
        // Active if pinged within last 6 seconds
        if (now - lastSeen < 6000) {
          cleaned[cId] = lastSeen;
          activeCount++;
        } else {
          hasExpired = true;
        }
      }

      if (hasExpired) {
        localStorage.setItem(this.getPresenceKey(sessionId), JSON.stringify(cleaned));
      }
      return activeCount;
    } catch {
      return 0;
    }
  }

  registerPresence(sessionId: string, clientId: string): () => void {
    if (typeof window === 'undefined') return () => {};

    const key = this.getPresenceKey(sessionId);

    const ping = () => {
      try {
        const raw = localStorage.getItem(key);
        const parsed: Record<string, number> = raw ? JSON.parse(raw) : {};
        parsed[clientId] = Date.now();
        localStorage.setItem(key, JSON.stringify(parsed));

        const count = this.getLivePresenceCount(sessionId);
        const current = this.getState(sessionId);
        if (current.joinedParticipants !== count || current.simulatedParticipants !== 0) {
          const next: SessionState = {
            ...current,
            joinedParticipants: count,
            simulatedParticipants: 0
          };
          this.stateCache.set(sessionId, next);
          this.writeStorage(sessionId, next);
          this.getChannel(sessionId)?.postMessage({ type: 'STATE', state: next });
          this.notifySubscribers(sessionId, next);
        }
      } catch {}
    };

    // Initial ping immediately
    ping();

    // Heartbeat every 2 seconds
    const interval = window.setInterval(ping, 2000);

    const cleanup = () => {
      window.clearInterval(interval);
      window.removeEventListener('beforeunload', cleanup);
      window.removeEventListener('pagehide', cleanup);
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed: Record<string, number> = JSON.parse(raw);
          delete parsed[clientId];
          localStorage.setItem(key, JSON.stringify(parsed));
        }
        const count = this.getLivePresenceCount(sessionId);
        const current = this.getState(sessionId);
        const next: SessionState = {
          ...current,
          joinedParticipants: count,
          simulatedParticipants: 0
        };
        this.stateCache.set(sessionId, next);
        this.writeStorage(sessionId, next);
        this.getChannel(sessionId)?.postMessage({ type: 'STATE', state: next });
        this.notifySubscribers(sessionId, next);
      } catch {}
    };

    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);

    return cleanup;
  }

  private setupStorageListener() {
    if (typeof window === 'undefined' || this.windowStorageListenerRegistered) return;
    this.windowStorageListenerRegistered = true;

    window.addEventListener('storage', (event: StorageEvent) => {
      if (!event.key || !event.newValue) return;

      let sessionId: string | null = null;
      if (event.key.startsWith(STORAGE_PREFIX)) {
        sessionId = event.key.slice(STORAGE_PREFIX.length);
      } else if (event.key === LEGACY_STORAGE_KEY) {
        sessionId = 'PC26';
      } else if (event.key.startsWith('pc-retreat-presence:')) {
        sessionId = event.key.slice('pc-retreat-presence:'.length);
      }

      if (sessionId) {
        try {
          const current = this.getState(sessionId);
          const liveCount = this.getLivePresenceCount(sessionId);
          const updated: SessionState = {
            ...current,
            joinedParticipants: liveCount,
            simulatedParticipants: 0
          };
          this.stateCache.set(sessionId, updated);
          this.notifySubscribers(sessionId, updated);
        } catch {}
      }
    });
  }

  private getChannel(sessionId: string): BroadcastChannel | null {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return null;

    if (!this.channels.has(sessionId)) {
      const channel = new BroadcastChannel(`pc-retreat-channel:${sessionId}`);
      channel.onmessage = (event) => {
        if (event.data?.type === 'STATE' && event.data.state) {
          const newState = event.data.state as SessionState;
          newState.joinedParticipants = this.getLivePresenceCount(sessionId);
          newState.simulatedParticipants = 0;
          this.stateCache.set(sessionId, newState);
          this.notifySubscribers(sessionId, newState);
        }
      };
      this.channels.set(sessionId, channel);
    }
    return this.channels.get(sessionId)!;
  }

  private notifySubscribers(sessionId: string, state: SessionState) {
    const subs = this.subscribers.get(sessionId);
    if (subs) {
      subs.forEach((cb) => cb(state));
    }
  }

  private writeStorage(sessionId: string, state: SessionState) {
    try {
      const json = JSON.stringify(state);
      localStorage.setItem(this.getStorageKey(sessionId), json);
      if (sessionId === 'PC26') {
        localStorage.setItem(LEGACY_STORAGE_KEY, json);
      }
    } catch {}
  }

  getState(sessionId: string): SessionState {
    const livePresence = this.getLivePresenceCount(sessionId);

    if (this.stateCache.has(sessionId)) {
      const cached = this.stateCache.get(sessionId)!;
      cached.joinedParticipants = livePresence;
      cached.simulatedParticipants = 0;
      return cached;
    }

    try {
      const raw = localStorage.getItem(this.getStorageKey(sessionId))
        || (sessionId === 'PC26' ? localStorage.getItem(LEGACY_STORAGE_KEY) : null);

      if (raw) {
        const parsed = JSON.parse(raw);
        const resolved: SessionState = {
          ...createInitialState(sessionId),
          ...parsed,
          sessionId,
          simulatedParticipants: 0,
          joinedParticipants: livePresence
        };
        this.stateCache.set(sessionId, resolved);
        return resolved;
      }
    } catch {}

    const initial = createInitialState(sessionId);
    initial.joinedParticipants = livePresence;
    initial.simulatedParticipants = 0;
    this.stateCache.set(sessionId, initial);
    return initial;
  }

  subscribe(sessionId: string, callback: (state: SessionState) => void): () => void {
    if (!this.subscribers.has(sessionId)) {
      this.subscribers.set(sessionId, new Set());
    }
    this.subscribers.get(sessionId)!.add(callback);

    // Initial broadcast of cached state with live presence count
    callback(this.getState(sessionId));

    // Ensure BroadcastChannel is listening
    this.getChannel(sessionId);

    return () => {
      const subs = this.subscribers.get(sessionId);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscribers.delete(sessionId);
          const channel = this.channels.get(sessionId);
          if (channel) {
            channel.close();
            this.channels.delete(sessionId);
          }
        }
      }
    };
  }

  dispatch(sessionId: string, action: SessionAction): void {
    const current = this.getState(sessionId);
    const next = sessionReducer(current, action);

    // Always ensure live presence count and 0 simulated participants
    next.joinedParticipants = this.getLivePresenceCount(sessionId);
    next.simulatedParticipants = 0;

    this.stateCache.set(sessionId, next);
    this.writeStorage(sessionId, next);

    const channel = this.getChannel(sessionId);
    channel?.postMessage({ type: 'STATE', state: next });

    this.notifySubscribers(sessionId, next);

    if (action.type === 'RESET') {
      this.clearAllClientVotes(sessionId);
    }
  }

  getClientId(): string {
    if (typeof window === 'undefined') return 'server';
    let id = sessionStorage.getItem(CLIENT_KEY);
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `client-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      sessionStorage.setItem(CLIENT_KEY, id);
    }
    return id;
  }

  hasClientVoted(sessionId: string, clientId: string): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(`pc-voted:${sessionId}:${clientId}`) === 'yes'
      || (sessionId === 'PC26' && sessionStorage.getItem('pc-retreat-voted') === 'yes');
  }

  markClientVoted(sessionId: string, clientId: string, option: VoteOption): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(`pc-voted:${sessionId}:${clientId}`, 'yes');
    sessionStorage.setItem(`pc-voted-opt:${sessionId}:${clientId}`, option);
    if (sessionId === 'PC26') {
      sessionStorage.setItem('pc-retreat-voted', 'yes');
    }
  }

  clearClientVote(sessionId: string, clientId: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(`pc-voted:${sessionId}:${clientId}`);
    sessionStorage.removeItem(`pc-voted-opt:${sessionId}:${clientId}`);
    if (sessionId === 'PC26') {
      sessionStorage.removeItem('pc-retreat-voted');
    }
  }

  private clearAllClientVotes(sessionId: string) {
    if (typeof window === 'undefined') return;
    const clientId = this.getClientId();
    this.clearClientVote(sessionId, clientId);
  }
}
