# PosterChild Product Route Architecture

This document specifies the routing hierarchy and session-aware navigation model for the PosterChild product shell in the retreat application.

---

## 1. Route Hierarchy

All product destinations exist nested underneath the presenter session context (`/present/:sessionId`), ensuring that navigation never drops the active session ID, live Firebase listeners, or Postie panel state.

```
/
└── /present/PC26 (Redirect default)
    ├── /present/:sessionId                          Home Workspace
    │   ├── /tell                                    Tell Overview
    │   │   ├── /stories                             Tell Stories List
    │   │   ├── /connect                             Tell Community Conversations
    │   │   └── /calendar                            Tell Content & Event Calendar
    │   ├── /raise                                   Raise Overview & Opportunities
    │   └── /manage                                  Manage Organization Overview
    │       └── /assets                              Manage Assets & Media Library
    └── /join/:sessionId                             Audience Interactive Voting Client
```

---

## 2. Route Manifest

| Route Path | View / Component | Purpose | Postie Context Label |
|---|---|---|---|
| `/present/:sessionId` | `HomeWorkspace` | Morning summary, Attention metric cards, Notice card, Needs attention table | `Home` |
| `/present/:sessionId/tell` | `TellOverview` | Storytelling dashboard, notice banner, in-progress stories | `Tell · Overview` |
| `/present/:sessionId/tell/stories` | `TellStories` | Stories draft & published table | `Tell · Stories` |
| `/present/:sessionId/tell/connect` | `TellConnect` | Community question prompts, donor/alumni conversations, inspiration | `Tell · Connect` |
| `/present/:sessionId/tell/calendar` | `TellCalendar` | Scheduled releases, storytelling campaigns, event deadlines | `Tell · Calendar` |
| `/present/:sessionId/raise` | `RaiseOverview` | Funding opportunities, grants in progress, upcoming LOI/proposal dates | `Raise` |
| `/present/:sessionId/manage` | `ManageOverview` | Organization central hub (Knowledge, Assets, People, Connections, Admin) | `Manage` |
| `/present/:sessionId/manage/assets` | `ManageAssets` | Photos, videos, brand kit, and story templates library | `Manage · Assets` |
| `/join/:sessionId` | `Join` | Mobile/desktop participant voting view (untouched by product navigation) | N/A |

---

## 3. Session Persistence & Preservation

- Navigation links generate session-scoped URLs via `buildProductUrl(sessionId, subPath)`.
- Navigating between `/present/PC26` and `/present/PC26/tell/connect`:
  - Does **not** trigger a full-page reload (`react-router-dom` client-side navigation).
  - Keeps the active Firebase Realtime Database connection live.
  - Keeps the presenter floating dock mounted with keyboard shortcuts active (`Space`, `R`, `Esc`, `Arrow keys`).
  - Preserves the Postie chat history and current panel mode (`docked`, `floating`, or `launcher`).
  - Preserves the sidebar expansion state (`expanded` vs `collapsed`).
