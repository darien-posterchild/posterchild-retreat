import { isFirebaseConfigured } from '../firebase/config';
import { FirebaseSessionAdapter } from './firebaseAdapter';
import { LocalSessionAdapter } from './localAdapter';
import type { SessionAdapter } from './types';

export * from './types';
export * from './localAdapter';
export * from './firebaseAdapter';

/**
 * Adapter selection:
 * - 'local': LocalSessionAdapter (BroadcastChannel + localStorage)
 * - 'firebase': FirebaseSessionAdapter (Firebase Realtime Database)
 *
 * Configured via VITE_SESSION_ADAPTER or changed directly here.
 * If 'firebase' is chosen but Firebase environment variables are not yet provided,
 * it safely falls back to LocalSessionAdapter so the prototype continues running locally.
 */
const requestedAdapter = import.meta.env.VITE_SESSION_ADAPTER || 'local';

function createActiveAdapter(): SessionAdapter {
  if (requestedAdapter === 'firebase') {
    if (isFirebaseConfigured()) {
      return new FirebaseSessionAdapter();
    } else {
      console.info(
        '[PosterChild Session] VITE_SESSION_ADAPTER is set to "firebase", but required environment variables are missing. Safely using LocalSessionAdapter.'
      );
      return new LocalSessionAdapter();
    }
  }
  return new LocalSessionAdapter();
}

export const activeSessionAdapter: SessionAdapter = createActiveAdapter();
