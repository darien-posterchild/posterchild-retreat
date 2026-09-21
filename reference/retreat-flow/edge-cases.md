# PosterChild Retreat Decision Edge Cases

This document describes how the retreat system gracefully manages non-standard conditions during live audience interactions.

---

### 1. Vote Ties

**Scenario**: Two or more choices receive the exact same highest vote count when voting closes.

**System Behavior**:
1. The resolver sets `decisionStatus: 'tie'`, `winner: null`, `winningOptionId: null`.
2. `tiedOptionIds` is populated with the IDs of the tied options.
3. The Presenter Dock displays an alert: `Tie detected` with a prominent button: `Re-vote Tied Options [Space]`.
4. Postie acknowledges: *"The team vote resulted in a tie! We have an even split across priorities. Would you like to run a quick tie-breaker?"*
5. Mobile remote (`/join/:sessionId`) displays: *"It's a tie! The presenter is setting up a quick tie-breaker vote."*
6. When the presenter clicks `Re-vote Tied Options` (or presses `Space`), `REVOTE_TIE` is dispatched:
   - Sets `allowedOptionIds: tiedOptionIds`.
   - Clears participant votes and resets tallies for only the tied options.
   - Mobile devices immediately update to present only the tied options.

---

### 2. Zero Votes

**Scenario**: Voting is closed before any participant has submitted a vote (0 total votes).

**System Behavior**:
1. The resolver sets `decisionStatus: 'closed'`, `winner: null`, `winningOptionId: null`.
2. The Presenter Dock displays `Reopen voting [Space]`.
3. The system does **NOT** advance automatically or pick an arbitrary fallback.
4. Mobile remote displays: *"Voting paused. No votes were received. Waiting for the presenter to reopen voting..."*
5. Clicking `Reopen voting` resets `scene: 'voting'`, `decisionStatus: 'open'` so participants can cast votes.

---

### 3. Changing Votes

**Scenario**: A participant changes their mind while voting is still open.

**System Behavior**:
1. When a participant selects option A, `VOTE` records `participants/{clientId}/option = 'stories'` and increments `votes/stories`.
2. If the participant taps option B before voting closes, `CHANGE_VOTE` is dispatched:
   - Atomically decrements `votes/stories` by 1.
   - Atomically increments `votes/campaigns` by 1.
   - Updates `participants/{clientId}/option = 'campaigns'`.
3. The mobile remote displays: *"Vote sent — Tap another option to change your vote"*.
4. Total participant count remains accurate with zero duplicate votes.

---

### 4. Late Participants

**Scenario**: An attendee opens `/join/PC26` after voting has already started or after results have been revealed.

**System Behavior**:
1. The participant remote reads `state.scene`, `state.activeDecisionId`, `state.decisionStatus`, and `state.winningOptionId`.
2. If voting is currently open: the participant is immediately presented with the active decision choices without being held at the join screen.
3. If results are already revealed: the participant immediately sees *"Team choice locked in — [Winning Choice]"* and is prompted to look at the main screen.

---

### 5. Page Refresh Safety

**Scenario**: The presenter or a participant refreshes their browser tab in the middle of a vote or result reveal.

**System Behavior**:
1. Firebase Realtime Database retains the full session record under `sessions/{sessionId}`.
2. Upon rehydration, `useSession` subscribes to `sessionRef` and restores `activeDecisionId`, `decisionStatus`, `winningOptionId`, and all vote counts.
3. The presenter does not lose their place in the presentation; navigation state and branch context remain intact.

---

### 6. Semantic UI Entry Points

**Scenario**: A user clicks the Stories metric card or the "3 stories ready for review" attention row.

**System Behavior**:
1. Both UI components map to the canonical choice ID `stories`.
2. Votes cast for `campaign` or `campaigns` are normalized to the same option tally.
3. This guarantees that duplicate branches are never created for the same conceptual decision.
