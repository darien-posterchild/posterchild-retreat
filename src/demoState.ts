import { activeSessionAdapter } from './services/session';
import type { DemoAction, DemoState, VoteOption } from './types';
import { createInitialState, sessionReducer } from './services/session/localAdapter';

export const initialState: DemoState = createInitialState('PC26');

export function readState(): DemoState {
  return activeSessionAdapter.getState('PC26');
}

export function writeState(state: DemoState) {
  activeSessionAdapter.dispatch('PC26', { type: 'SYNC', state });
}

export function getClientId() {
  return activeSessionAdapter.getClientId();
}

export function didClientVote() {
  const clientId = getClientId();
  return activeSessionAdapter.hasClientVoted('PC26', clientId);
}

export function markClientVoted(option: VoteOption = 'stories') {
  const clientId = getClientId();
  activeSessionAdapter.markClientVoted('PC26', clientId, option);
}

export function clearClientVote() {
  const clientId = getClientId();
  activeSessionAdapter.clearClientVote('PC26', clientId);
}

export const reducer = sessionReducer;

export function createChannel() {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return null;
  return new BroadcastChannel('pc-retreat-channel:PC26');
}