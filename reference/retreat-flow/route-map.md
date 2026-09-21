# PosterChild Retreat Route Map

A human-readable routing manifest from mobile participant check-in (`/join/:sessionId`) through all branch paths and final synthesis.

```text
JOIN
  └─ /join/:sessionId (Audience Remote)

PRESENTER ROOT
  └─ /present/:sessionId (Home Dashboard)
       │
       ▼
  DECISION: home-focus ("What should PosterChild focus on first?")
       ├─────────────────────────┼─────────────────────────┐
       ▼                         ▼                         ▼
BRANCH A (Stories)        BRANCH B (Campaigns)      BRANCH C (Quotes)
/present/:sessionId/tell/stories  /present/:sessionId/raise  /present/:sessionId/tell/quotes
       │                         │                         │
       ▼                         ▼                         ▼
DECISION: stories-next    DECISION: campaigns-next  DECISION: quotes-next
("Which story?")          ("What to do?")           ("Where to activate?")
       ├─ mayas-journey          ├─ launch                 ├─ story
       ├─ youth-voices           ├─ refine                 ├─ campaign
       └─ community-gardens      └─ ask-postie             └─ social
       │                         │                         │
       ▼                         ▼                         ▼
/tell/stories/review      /raise/:action            /tell/quotes/:channel
       │                         │                         │
       └─────────────────────────┼─────────────────────────┘
                                 ▼
                    DECISION: final-next-step
                  ("What should PosterChild do next?")
                                 │
                                 ▼
                     CONVERGENCE ROADMAP
                     /present/:sessionId/next-steps
```

## Route Index

| Stage | Route URL | Target Component | Purpose |
| :--- | :--- | :--- | :--- |
| **Audience Remote** | `/join/:sessionId` | `Join.tsx` | Mobile interactive voting remote |
| **Home Dashboard** | `/present/:sessionId` | `HomeWorkspace.tsx` | Entry workspace & `home-focus` voting |
| **Branch A: Stories** | `/present/:sessionId/tell/stories` | `TellStories.tsx` | Stories library triage |
| **Branch A: Review** | `/present/:sessionId/tell/stories/review` | `StoryReview.tsx` | Story review & polish |
| **Branch B: Raise** | `/present/:sessionId/raise` | `RaiseOverview.tsx` | Campaign & donor overview |
| **Branch B: Action** | `/present/:sessionId/raise/:action` | `CampaignAction.tsx` | Launch, refine, or Postie analysis |
| **Branch C: Quotes** | `/present/:sessionId/tell/quotes` | `TellQuotes.tsx` | Surfaced community quotes |
| **Branch C: Channel** | `/present/:sessionId/tell/quotes/:channel` | `QuoteAction.tsx` | Story, campaign, or social deployment |
| **Convergence** | `/present/:sessionId/next-steps` | `ConvergenceNextSteps.tsx` | Shared retreat outcomes synthesis |
