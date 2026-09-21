# PosterChild Retreat MVP

A small local prototype for **The Future of PosterChild**.

## What is included

- `/present`
  - Join screen
  - Future PosterChild dashboard
  - Voting state
  - Visible winning card
  - Presenter controls
- `/join`
  - Mobile-first participant surface
  - "You're in" state
  - Vote interface
  - Vote confirmation
  - Result state
- Local synchronization
  - `BroadcastChannel` for same-browser live sync
  - `localStorage` fallback for separate tabs/windows
- Centralized CSS variables so the actual PosterChild Design System can replace the temporary visual language later.

## Run

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:5173/present`
- `http://localhost:5173/join`

For the simplest demo, open `/present` in one browser window and `/join` in another tab/window.

## Presenter flow

1. `/present` starts on the Join scene.
2. Use **Enter the future**.
3. Dashboard appears.
4. Use **Ask the room**.
5. `/join` automatically switches to the vote.
6. Vote from `/join`.
7. The vote appears live inside the dashboard cards.
8. Use **Reveal team choice**.
9. The winning product card is highlighted.

## Why local sync for the MVP?

The prototype separates the interaction model from the transport layer.

Later, replace `src/useDemoState.ts` + `src/demoState.ts` with a room/session service:

- `/present/PC26`
- `/join/PC26`
- Supabase Realtime or Firebase
- Anonymous participant IDs
- Presence / participant count
- One vote per participant
- Host controls

The UI components should not need a significant rewrite.

## Suggested next step

Before adding realtime infrastructure, validate these three things at the retreat scale:

1. Does the big screen feel like a real future PosterChild product?
2. Does the phone interaction disappear into the background?
3. Does the team understand the product direction through the interaction without needing much explanation?