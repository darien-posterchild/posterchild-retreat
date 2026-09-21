# PosterChild Retreat Flow — Route Inventory

This inventory documents all routes, screens, missions, and convergence paths for "The Future of PosterChild" interactive presentation.

---

## 1. Summary of Route Categories

| Status | Count | Description |
| :--- | :--- | :--- |
| **AVAILABLE** | 12 | Fully functional routes with complete layout and interaction |
| **CONVERGENCE** | 4 | Routes that unify multiple decision options into cohesive workflows |
| **PLACEHOLDER** | 2 | Functional retreat routes with simplified mock data / draft content |
| **MISSING** | 1 | Conceptual product screens identified in the vision flow needing future design |

---

## 2. Decision Option & Mission Route Mapping

| Option ID | Option Label | Target Pillar | Mission ID | Route / Destination | Status | Resolution Model |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `ask-postie` | Ask Postie | Raise | `kresge-postie` | `/present/:sessionId/raise/opportunities/kresge` | **AVAILABLE** (Provisional Design) | In-Screen Postie recommendation |
| `needs-attention` | See what needs attention | Raise | `kresge-funding` | `/present/:sessionId/raise/opportunities/kresge` | **AVAILABLE** (Provisional Design) | In-Screen Kresge Single-Screen Mission |
| `create-story` | Create a new story | Tell | `create-story-flow` | `/present/:sessionId/tell/stories/create` | **PLACEHOLDER** (Route Implemented) | In-Screen Placeholder completion • Optional branch |
| `new-testimonials` | Explore new testimonials | Tell / Connect | `new-testimonials-connect` | `/present/:sessionId/tell/connect` | **AVAILABLE** | Granular quote-to-story linking modal |
| `suggested-story` | View the suggested story | Tell | `youth-career-story` | `/present/:sessionId/tell/stories/review?story=youth-career-pathways&tab=social` | **AVAILABLE** | Story Detail with Social, Article, and Content Source tabs |
| *Secondary* | Review requirements | Raise | `kresge-funding` | `/present/:sessionId/raise/opportunities/kresge` | **AVAILABLE** (In-Screen) | In-screen criteria scorecard |
| *Secondary* | Strengthen application | Raise | `kresge-funding` | `/present/:sessionId/raise/opportunities/kresge` | **AVAILABLE** (In-Screen) | In-screen budget gap spotlight |
| *Secondary* | Ask Postie (Kresge) | Raise | `kresge-funding` | `/present/:sessionId/raise/opportunities/kresge` | **AVAILABLE** (In-Screen) | In-screen Postie conversation banner |
| *Secondary* | Social media | Tell | `youth-career-story` | `/present/:sessionId/tell/stories/review?story=youth-career-pathways&tab=social` | **AVAILABLE** (In-Screen) | Sets `tab=social` • Publish to Socials |
| *Secondary* | Article | Tell | `youth-career-story` | `/present/:sessionId/tell/stories/review?story=youth-career-pathways&tab=article` | **AVAILABLE** (In-Screen) | Sets `tab=article` • Share Article |
| *Secondary* | Ask Postie (Story) | Tell | `youth-career-story` | `/present/:sessionId/tell/stories/review?story=youth-career-pathways&tab=social` | **AVAILABLE** (In-Screen) | In-Screen Postie recommendation banner |
| *Reveal* | Manage Reveal | Manage | `manage-reveal` | `/present/:sessionId/manage` | **AVAILABLE** | Knowledge graph drill-down |
| *Closing* | Next Steps | Roadmap | `closing-flow` | `/present/:sessionId/next-steps` | **AVAILABLE** | Synthesizes all retreat outcomes |

---

## 3. Detailed Route Breakdown

### Available Routes

1. **`/present/:sessionId` (Home)**
   - **Component**: `HomeWorkspace.tsx`
   - **Description**: Definitive Home dashboard featuring greeting, metric cards, Attention Table (Kresge 92% match), and Suggested Story card.
2. **`/present/:sessionId/raise/opportunities/kresge` (Kresge Single-Screen Mission)**
   - **Component**: `KresgeOpportunityDetail.tsx`
   - **Status**: **ROUTE IMPLEMENTED / VISUAL DESIGN PROVISIONAL**
   - **Description**: Single-screen mission flow supporting IDLE, VOTING, RESULT, ACTION (`review-requirements`, `strengthen-application`, `ask-postie`), and COMPLETION with Return to Home.
3. **`/present/:sessionId/tell/stories/review` (Story Detail — Youth Career Pathways)**
   - **Component**: `StoryReview.tsx`
   - **Status**: **ROUTE IMPLEMENTED / SOCIAL & ARTICLE DESIGN SUPPLIED / CONTENT SOURCE PENDING**
   - **Description**: Canonical story detail workspace supporting `tab=social` (default), `tab=article`, `tab=content-source`, decision `story-output`, in-screen action switching, and completion to Return Home.
4. **`/present/:sessionId/tell/stories/create` (Create Story Placeholder Branch)**
   - **Component**: `CreateStory.tsx`
   - **Status**: **ROUTE IMPLEMENTED / VISUAL DESIGN PENDING / RETREAT BRANCH OPTIONAL**
   - **Description**: Structural placeholder supporting `create-story-flow` lifecycle, presenter completion button, and clean integration hook (`/* FINAL CREATE STORY DESIGN GOES HERE */`). Controllable via `enabled: true/false` flag.
5. **`/present/:sessionId/tell` (Tell Overview)**
   - **Component**: `TellOverview.tsx`
   - **Description**: Tell pillar landing page with story pipeline, quick stats, and content drafts.
6. **`/present/:sessionId/tell/stories` (Stories Catalog)**
   - **Component**: `TellStories.tsx`
   - **Description**: Filterable grid of community stories (Maya's Journey, Youth Voices, Community Gardens).
7. **`/present/:sessionId/tell/connect` (Connect / Testimonials)**
   - **Component**: `TellConnect.tsx`
   - **Status**: **ROUTE IMPLEMENTED / VISUAL REFERENCE SUPPLIED / MISSION IMPLEMENTED**
   - **Description**: Community voices and active conversation monitor ("Hear from your community"). Supports mission `new-testimonials-connect`, decision `connect-next-action` (Review the theme, Use responses in a story, Ask Postie), and converges cleanly into Youth Career Story without double-counting mission completion.
8. **`/present/:sessionId/tell/quotes` (Quotes Hub)**
   - **Component**: `TellQuotes.tsx`
   - **Description**: Quote card library ready for activation across channels.
9. **`/present/:sessionId/tell/quotes/:channel` (Quote Action)**
   - **Component**: `QuoteAction.tsx`
   - **Description**: Social graphic, story hero, or campaign header asset generator.
10. **`/present/:sessionId/raise` (Raise Overview)**
    - **Component**: `RaiseOverview.tsx`
    - **Description**: Active campaigns and funding opportunities list (Kresge Foundation $150k highlight).
11. **`/present/:sessionId/raise/:action` (Campaign Action / Refine)**
    - **Component**: `CampaignAction.tsx`
    - **Description**: Campaign review, audience targeting, and launch readiness inspection.
12. **`/present/:sessionId/manage` (Manage Overview)**
    - **Component**: `ManageOverview.tsx`
    - **Status**: **ROUTE IMPLEMENTED / REVEAL STAGE / VISUAL DESIGN EXISTING / POLISH LATER**
    - **Description**: Architectural reveal screen showcasing Knowledge, Assets, Organization, People, Connections, and Admin. Triggered after 2 completed missions without an extra audience vote. Narrates *"So where is PosterChild getting all of this context from?"*.
13. **`/present/:sessionId/manage/assets` (Manage Assets)**
    - **Component**: `ManageAssets.tsx`
    - **Description**: Centralized digital asset management table with tagging and source provenance.
14. **`/present/:sessionId/next-steps` (Next Steps / Closing Synthesis)**
    - **Component**: `NextSteps.tsx`
    - **Status**: **ROUTE IMPLEMENTED / VISUAL DESIGN PROVISIONAL**
    - **Description**: Final team synthesis and next steps roadmap. Features the Explore-Decide-Act conceptual framework, dynamic summary of the 2 completed retreat missions, safe 2-tap session restart (`R`), and return to Home (`H`).
15. **`/join/:sessionId` (Audience Mobile App)**
    - **Component**: `Join.tsx`
    - **Description**: Generic participant mobile interface with optimistic voting, tie-breaker support, and presentation-in-progress status feedback during Manage Reveal and Next Steps. No audience decision occurs after the second mission.

---

### Convergence Paths

1. **Funding Convergence (`kresge-funding`)**:
   - `ask-postie` ("Ask Postie") and `needs-attention` ("See what needs attention") both route to `/raise/opportunities/kresge`.
   - All 3 secondary actions (`review-requirements`, `strengthen-application`, `ask-postie`) resolve in-screen and mark `kresge-funding` as completed.
2. **Story Narrative Convergence (`youth-career-story`)**:
   - `suggested-story` ("View the suggested story") and `create-story` ("Create a new story") route directly into the Story workspace (`/tell/stories/review` and `/tell/stories/create`).
   - Secondary decision `story-output` resolves into `tab=social` or `tab=article` and marks `youth-career-story` as completed.
3. **Closing Convergence (`final-next-step`)**:
   - All completed mission branches return Home and converge into the **Manage Reveal** (`/manage`) and **Next Steps** (`/next-steps`).

---

### Placeholder Routes

1. **`/present/:sessionId/tell/calendar`**
   - Content distribution calendar placeholder.

---

### Missing Screens (Future Design Scope)

1. **`Live AI Postie Strategy Co-Pilot Overlay`** (`/postie/workspace`):
   - Expanded canvas mode for Postie multi-document synthesis.
