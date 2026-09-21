# PosterChild Retreat Decision Schema

This document defines the TypeScript interfaces and Firebase serialization structures governing the collaborative retreat voting and branching flow.

## 1. Decision Registry Types (`src/config/retreatDecisions.ts`)

```typescript
export interface DecisionOption {
  id: string;              // Semantic option ID e.g. 'stories', 'campaigns'
  label: string;           // Human-readable title e.g. 'Stories'
  description?: string;    // Explanatory copy shown on /join
  destination: string;     // Canonical route e.g. '/tell/stories'
  iconName?: string;       // Design System icon identifier
}

export interface DecisionNode {
  id: string;              // Semantic decision ID e.g. 'home-focus'
  question: string;        // Question displayed on presenter & participant UI
  description?: string;    // Subtitle copy
  options: DecisionOption[];
  nextDecisionId?: string; // Subsequent branch node ID
}
```

## 2. Session State Schema (`src/services/session/types.ts`)

```typescript
export type Scene = 'join' | 'dashboard' | 'voting' | 'result';
export type DecisionStatus = 'idle' | 'open' | 'closed' | 'result' | 'tie';

export interface SessionState {
  sessionId: string;
  scene: Scene;
  simulatedParticipants: number;
  joinedParticipants: number;
  votes: Record<string, number>; // Dynamic tally per option ID
  winner: string | null;

  // Branching Decision Architecture Extensions
  activeDecisionId: string;                     // Active decision node ID (default: 'home-focus')
  decisionStatus: DecisionStatus;               // State machine lifecycle
  winningOptionId: string | null;               // Resolved winning option ID
  tiedOptionIds: string[] | null;               // Option IDs involved in a tie
  allowedOptionIds?: string[] | null;           // Filtered choices for tie-breaker re-votes
  participantVotes?: Record<string, string>;   // clientId -> optionId mapping (prevents double-voting)
}
```

## 3. Session Actions

| Action Type | Payload | Description |
| :--- | :--- | :--- |
| `SET_DECISION` | `{ decisionId: string }` | Activates a new decision node without opening voting. |
| `OPEN_VOTING` | `{ decisionId?: string, allowedOptionIds?: string[] }` | Sets `scene: 'voting'`, `decisionStatus: 'open'`, initializes zero-tallies. |
| `VOTE` / `CHANGE_VOTE` | `{ option: string, clientId: string }` | Records participant vote, decrements prior vote if changed, increments new choice. |
| `CLOSE_VOTING` / `END_VOTING` | - | Freezes voting, calculates tallies, resolves winner, tie, or zero-vote state. |
| `REVEAL_RESULT` | - | Moves `scene` and `decisionStatus` to `'result'`. |
| `REVOTE_TIE` | - | Initiates a re-vote restricted to `tiedOptionIds`. |
| `REOPEN_VOTING` | - | Re-opens voting when zero votes were cast. |
| `RESET` | - | Returns session state to initial join screen. |

## 4. Pure Decision Resolver

```typescript
export function resolveDecisionWinner(
  decision: DecisionNode,
  votes: Record<string, number>
): {
  status: 'zero_votes' | 'tie' | 'winner';
  winner: DecisionOption | null;
  tiedOptions: DecisionOption[];
  totalVotes: number;
};
```
