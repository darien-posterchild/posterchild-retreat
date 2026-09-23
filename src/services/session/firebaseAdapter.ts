import {
  ref,
  onValue,
  set,
  update,
  remove,
  get,
  increment,
  onDisconnect,
  type Database,
  type Unsubscribe
} from 'firebase/database';
import { getFirebaseDatabase, isFirebaseConfigured } from '../firebase/config';
import { createInitialState } from './localAdapter';
import { getDecision, resolveDecisionWinner } from '../../config/retreatDecisions';
import { getAvailableHomeOptions } from '../../config/retreatFlow';
import type {
  DecisionStatus,
  Scene,
  SessionAction,
  SessionAdapter,
  SessionState,
  VoteOption
} from './types';

const CLIENT_KEY = 'pc-retreat-client-id-v2';

/**
 * Firebase Realtime Database Session Adapter.
 * Maps SessionAdapter actions to real-time database paths under sessions/{sessionId}.
 */
export class FirebaseSessionAdapter implements SessionAdapter {
  private db: Database | null = null;
  private stateCache = new Map<string, SessionState>();
  private localVotes = new Map<string, VoteOption>();

  constructor() {
    this.db = getFirebaseDatabase();
  }

  private ensureDatabase(): Database {
    if (!this.db) {
      this.db = getFirebaseDatabase();
    }
    if (!this.db) {
      throw new Error(
        'Firebase Realtime Database is not initialized. Please configure VITE_FIREBASE_API_KEY and VITE_FIREBASE_DATABASE_URL.'
      );
    }
    return this.db;
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
    return (
      sessionStorage.getItem(`pc-voted:${sessionId}:${clientId}`) === 'yes' ||
      (sessionId === 'PC26' && sessionStorage.getItem('pc-retreat-voted') === 'yes')
    );
  }

  markClientVoted(sessionId: string, clientId: string, option: VoteOption): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(`pc-voted:${sessionId}:${clientId}`, 'yes');
    sessionStorage.setItem(`pc-voted-opt:${sessionId}:${clientId}`, option);
    if (sessionId === 'PC26') {
      sessionStorage.setItem('pc-retreat-voted', 'yes');
    }
    this.localVotes.set(`${sessionId}:${clientId}`, option);
  }

  clearClientVote(sessionId: string, clientId: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(`pc-voted:${sessionId}:${clientId}`);
    sessionStorage.removeItem(`pc-voted-opt:${sessionId}:${clientId}`);
    if (sessionId === 'PC26') {
      sessionStorage.removeItem('pc-retreat-voted');
    }
    this.localVotes.delete(`${sessionId}:${clientId}`);
  }

  registerPresence(sessionId: string, clientId: string): () => void {
    if (!isFirebaseConfigured() || typeof window === 'undefined') return () => { };

    try {
      const db = this.ensureDatabase();
      const presenceRef = ref(db, `sessions/${sessionId}/presence/${clientId}`);
      const connectedRef = ref(db, '.info/connected');

      const connectedUnsub = onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          onDisconnect(presenceRef).remove().catch(() => { });
          set(presenceRef, {
            participantId: clientId,
            connected: true,
            joinedAt: Date.now(),
            lastSeen: Date.now()
          }).catch(() => { });
        }
      });

      const heartbeatInterval = window.setInterval(() => {
        update(presenceRef, {
          lastSeen: Date.now(),
          connected: true
        }).catch(() => { });
      }, 5000);

      const cleanup = () => {
        window.clearInterval(heartbeatInterval);
        connectedUnsub();
        onDisconnect(presenceRef).cancel().catch(() => { });
        remove(presenceRef).catch(() => { });
      };

      window.addEventListener('beforeunload', cleanup, { once: true });
      window.addEventListener('pagehide', cleanup, { once: true });

      return cleanup;
    } catch (err) {
      console.error('[FirebaseSessionAdapter] registerPresence error:', err);
      return () => { };
    }
  }

  getState(sessionId: string): SessionState {
    if (this.stateCache.has(sessionId)) {
      return this.stateCache.get(sessionId)!;
    }
    const initial = createInitialState(sessionId);
    this.stateCache.set(sessionId, initial);
    return initial;
  }

  subscribe(sessionId: string, callback: (state: SessionState) => void): () => void {
    // Deliver current cached state first
    callback(this.getState(sessionId));

    if (!isFirebaseConfigured()) {
      console.warn(
        `[FirebaseSessionAdapter] Firebase is not fully configured. Using cached state for session: ${sessionId}`
      );
      return () => { };
    }

    try {
      const db = this.ensureDatabase();
      const sessionRef = ref(db, `sessions/${sessionId}`);

      const unsubscribe: Unsubscribe = onValue(
        sessionRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            // First time this session is observed in Firebase: initialize it
            const initial = createInitialState(sessionId);
            const initialPayload = {
              scene: initial.scene,
              votes: initial.votes,
              winner: initial.winner,
              simulatedParticipants: 0,
              activeDecisionId: initial.activeDecisionId,
              decisionStatus: initial.decisionStatus,
              winningOptionId: initial.winningOptionId,
              tiedOptionIds: initial.tiedOptionIds,
              allowedOptionIds: initial.allowedOptionIds,
              updatedAt: Date.now()
            };
            set(sessionRef, initialPayload).catch(console.error);
            this.stateCache.set(sessionId, initial);
            callback(initial);
            return;
          }

          const data = snapshot.val() || {};
          // Ensure base properties are populated in the database if partially initialized
          if (!data.scene || !data.votes) {
            const initial = createInitialState(sessionId);
            update(sessionRef, {
              scene: data.scene || initial.scene,
              votes: data.votes || initial.votes,
              winner: data.winner || null,
              activeDecisionId: data.activeDecisionId || initial.activeDecisionId,
              decisionStatus: data.decisionStatus || initial.decisionStatus,
              simulatedParticipants: 0,
              updatedAt: Date.now()
            }).catch(() => { });
          }

          const participants = data.participants || {};
          const presence = data.presence || {};
          const now = Date.now();
          let livePresenceCount = 0;

          // Count live presence records
          for (const [pId, pVal] of Object.entries(presence)) {
            const p = pVal as { connected?: boolean; lastSeen?: number; joinedAt?: number };
            if (p && p.connected !== false && now - (p.lastSeen || p.joinedAt || 0) < 45000) {
              livePresenceCount++;
            } else if (p && now - (p.lastSeen || p.joinedAt || 0) >= 45000) {
              // Asynchronously clean up stale presence record
              remove(ref(db, `sessions/${sessionId}/presence/${pId}`)).catch(() => { });
            }
          }

          const participantVotes: Record<string, string> = {};
          for (const [pId, pData] of Object.entries(participants)) {
            const p = pData as { option?: string };
            if (p?.option) {
              participantVotes[pId] = p.option;
            }
          }

          const mappedState: SessionState = {
            sessionId,
            scene: (data.scene as Scene) || 'join',
            simulatedParticipants: 0,
            joinedParticipants: livePresenceCount,
            votes: data.votes || {
              stories: 0,
              campaigns: 0,
              quotes: 0
            },
            winner: (data.winner as VoteOption) || null,
            activeDecisionId: data.activeDecisionId || 'home-focus',
            decisionStatus: (data.decisionStatus as DecisionStatus) || (data.scene === 'voting' ? 'open' : data.scene === 'result' ? 'result' : 'idle'),
            winningOptionId: data.winningOptionId || data.winner || null,
            tiedOptionIds: data.tiedOptionIds || null,
            allowedOptionIds: data.allowedOptionIds || null,
            participantVotes,
            completedMissionIds: data.completedMissionIds || [],
            currentMissionId: data.currentMissionId || null,
            decisionHistory: data.decisionHistory || [],
            isVoteRevealed: Boolean(data.isVoteRevealed)
          };

          this.stateCache.set(sessionId, mappedState);
          callback(mappedState);
        },
        (error) => {
          console.error(`[FirebaseSessionAdapter] Listener error on session ${sessionId}:`, error);
        }
      );

      return () => {
        unsubscribe();
      };
    } catch (err) {
      console.error('[FirebaseSessionAdapter] Subscription failed:', err);
      return () => { };
    }
  }

  async dispatch(sessionId: string, action: SessionAction): Promise<void> {
    if (!isFirebaseConfigured()) {
      console.warn('[FirebaseSessionAdapter] Cannot dispatch: Firebase is not configured.');
      return;
    }

    const db = this.ensureDatabase();
    const sessionRef = ref(db, `sessions/${sessionId}`);

    switch (action.type) {
      case 'SET_SCENE': {
        const updatePayload: Record<string, unknown> = {
          scene: action.scene,
          decisionStatus: action.scene === 'voting' ? 'open' : action.scene === 'result' ? 'result' : 'idle',
          isVoteRevealed: action.scene === 'result',
          updatedAt: Date.now()
        };
        if (action.scene === 'voting') {
          updatePayload.winner = null;
          updatePayload.winningOptionId = null;
        }
        await update(sessionRef, updatePayload);
        break;
      }

      case 'JOIN': {
        const clientId = action.clientId || this.getClientId();
        await update(ref(db, `sessions/${sessionId}/participants/${clientId}`), {
          joinedAt: Date.now()
        });
        break;
      }

      case 'VOTE':
      case 'CHANGE_VOTE': {
        const clientId = action.clientId || this.getClientId();
        const partRef = ref(db, `sessions/${sessionId}/participants/${clientId}`);
        const partSnap = await get(partRef);
        const prevPartData = partSnap.val() || {};
        const prevOption = prevPartData.option;

        const voteUpdates: Record<string, unknown> = {
          [`participants/${clientId}/voted`]: true,
          [`participants/${clientId}/option`]: action.option,
          updatedAt: Date.now()
        };

        if (prevOption && prevOption !== action.option) {
          voteUpdates[`votes/${prevOption}`] = increment(-1);
          voteUpdates[`votes/${action.option}`] = increment(1);
        } else if (!prevOption) {
          voteUpdates[`votes/${action.option}`] = increment(1);
        }

        await update(sessionRef, voteUpdates);
        this.markClientVoted(sessionId, clientId, action.option);
        break;
      }

      case 'END_VOTING':
      case 'CLOSE_VOTING': {
        const snapshot = await get(sessionRef);
        const data = snapshot.val() || {};
        const activeDecisionId = data.activeDecisionId || 'home-focus';
        const decision = activeDecisionId === 'home-focus'
          ? { ...getDecision('home-focus'), options: getAvailableHomeOptions(data) }
          : getDecision(activeDecisionId);
        const votes = data.votes || {};

        const resolution = resolveDecisionWinner(decision, votes);

        if (resolution.status === 'tie') {
          await update(sessionRef, {
            decisionStatus: 'tie',
            tiedOptionIds: resolution.tiedOptions.map((o) => o.id),
            winner: null,
            winningOptionId: null,
            isVoteRevealed: true,
            updatedAt: Date.now()
          });
        } else if (resolution.status === 'zero_votes') {
          await update(sessionRef, {
            decisionStatus: 'closed',
            tiedOptionIds: null,
            winner: null,
            winningOptionId: null,
            isVoteRevealed: true,
            updatedAt: Date.now()
          });
        } else {
          const winningOptionId = resolution.winner?.id ?? null;

          const existingHistory = Array.isArray(data.decisionHistory)
            ? data.decisionHistory
            : Object.values(data.decisionHistory || {});

          const nextHistory = data.isVoteRevealed
            ? existingHistory
            : [
              ...existingHistory,
              {
                decisionId: activeDecisionId,
                winningOptionId,
                resolvedAt: Date.now(),
              },
            ];

          await update(sessionRef, {
            scene: 'result',
            decisionStatus: 'result',
            winner: winningOptionId,
            winningOptionId,
            tiedOptionIds: null,
            decisionHistory: nextHistory,
            isVoteRevealed: true,
            updatedAt: Date.now(),
          });
        }
        break;
      }

      case 'REVEAL_RESULT': {
        await update(sessionRef, {
          scene: 'result',
          decisionStatus: 'result',
          isVoteRevealed: true,
          updatedAt: Date.now()
        });
        break;
      }

      case 'REVOTE_TIE': {
        const snapshot = await get(sessionRef);
        const data = snapshot.val() || {};
        const decision = getDecision(data.activeDecisionId);
        const tied = (data.tiedOptionIds as string[]) || decision.options.map((o) => o.id);

        const resetVotes: Record<string, number> = {};
        tied.forEach((optId) => {
          resetVotes[optId] = 0;
        });

        await update(sessionRef, {
          scene: 'voting',
          decisionStatus: 'open',
          allowedOptionIds: tied,
          votes: resetVotes,
          winner: null,
          winningOptionId: null,
          participants: {},
          isVoteRevealed: false,
          updatedAt: Date.now()
        });
        break;
      }

      case 'REOPEN_VOTING': {
        await update(sessionRef, {
          scene: 'voting',
          decisionStatus: 'open',
          winner: null,
          winningOptionId: null,
          tiedOptionIds: null,
          isVoteRevealed: false,
          updatedAt: Date.now()
        });
        break;
      }

      case 'SET_DECISION': {
        const decision = getDecision(action.decisionId);
        const initialVotes: Record<string, number> = {};
        decision.options.forEach((opt) => {
          initialVotes[opt.id] = 0;
        });

        await update(sessionRef, {
          activeDecisionId: action.decisionId,
          decisionStatus: 'idle',
          allowedOptionIds: null,
          votes: initialVotes,
          winner: null,
          winningOptionId: null,
          tiedOptionIds: null,
          participants: {},
          isVoteRevealed: false,
          updatedAt: Date.now()
        });
        break;
      }

      case 'OPEN_VOTING': {
        const cached = this.stateCache.get(sessionId);
        const decisionId = action.decisionId || cached?.activeDecisionId || 'home-focus';
        const decision = getDecision(decisionId);
        const initialVotes: Record<string, number> = {};
        decision.options.forEach((opt) => {
          initialVotes[opt.id] = 0;
        });

        await update(sessionRef, {
          scene: 'voting',
          activeDecisionId: decisionId,
          decisionStatus: 'open',
          allowedOptionIds: action.allowedOptionIds || null,
          winner: null,
          winningOptionId: null,
          tiedOptionIds: null,
          votes: initialVotes,
          participants: {},
          isVoteRevealed: false,
          updatedAt: Date.now()
        });
        break;
      }

      case 'START_MISSION': {
        await update(sessionRef, {
          currentMissionId: action.missionId,
          scene: 'dashboard',
          decisionStatus: 'idle',
          isVoteRevealed: false,
          updatedAt: Date.now()
        });
        break;
      }

      case 'COMPLETE_MISSION': {
        const snapshot = await get(sessionRef);
        const data = snapshot.val() || {};
        const existingMissions = (data.completedMissionIds as string[]) || [];
        const updatedMissions = existingMissions.includes(action.missionId)
          ? existingMissions
          : [...existingMissions, action.missionId];

        await update(sessionRef, {
          completedMissionIds: updatedMissions,
          currentMissionId: null,
          updatedAt: Date.now()
        });
        break;
      }

      case 'RETURN_HOME': {
        const snapshot = await get(sessionRef);
        const data = snapshot.val() || {};
        const availableOptions = getAvailableHomeOptions(data);
        const resetVotes: Record<string, number> = {};
        availableOptions.forEach((opt) => {
          resetVotes[opt.id] = 0;
        });

        await update(sessionRef, {
          scene: 'dashboard',
          activeDecisionId: 'home-focus',
          decisionStatus: 'idle',
          winner: null,
          winningOptionId: null,
          tiedOptionIds: null,
          allowedOptionIds: null,
          votes: resetVotes,
          participants: {},
          isVoteRevealed: false,
          updatedAt: Date.now()
        });
        break;
      }

      case 'REVEAL_MANAGE': {
        await update(sessionRef, {
          scene: 'dashboard',
          decisionStatus: 'idle',
          isVoteRevealed: false,
          updatedAt: Date.now()
        });
        break;
      }

      case 'RESET': {
        const initial = createInitialState(sessionId);
        await update(sessionRef, {
          scene: 'join',
          votes: initial.votes,
          winner: null,
          winningOptionId: null,
          activeDecisionId: initial.activeDecisionId,
          decisionStatus: initial.decisionStatus,
          tiedOptionIds: null,
          allowedOptionIds: null,
          completedMissionIds: [],
          currentMissionId: null,
          decisionHistory: [],
          participants: {},
          isVoteRevealed: false,
          simulatedParticipants: 0,
          updatedAt: Date.now()
        });
        const clientId = this.getClientId();
        this.clearClientVote(sessionId, clientId);
        break;
      }

      case 'SYNC': {
        await update(sessionRef, {
          scene: action.state.scene,
          votes: action.state.votes,
          winner: action.state.winner,
          winningOptionId: action.state.winningOptionId,
          activeDecisionId: action.state.activeDecisionId,
          decisionStatus: action.state.decisionStatus,
          tiedOptionIds: action.state.tiedOptionIds,
          allowedOptionIds: action.state.allowedOptionIds,
          completedMissionIds: action.state.completedMissionIds || [],
          currentMissionId: action.state.currentMissionId || null,
          decisionHistory: action.state.decisionHistory || [],
          updatedAt: Date.now()
        });
        break;
      }
    }
  }
}
