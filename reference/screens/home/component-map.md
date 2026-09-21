# PosterChild Home Screen Component Map

**Figma Source Reference:** `Home — QA Exploration 05 / Reference-driven` (Node ID: `493:5128`)  
**Design System Canon:** `🤖 DS – 2026 (v8.0)` + Canonical SaaS Desktop Layout

---

## 1. Component Map & Reusability Matrix

| Figma Source Chunk | Target Component | Evaluation | Action / Adaptation Plan |
| :--- | :--- | :--- | :--- |
| **Global Shell** | `AppShell` | **REUSE** | Viewport-wide 3-region SaaS layout (Sidebar + Workspace + Postie) |
| **Sidebar Rail** | `Sidebar` (`Sidebar.tsx`) | **REUSE** | 280px expanded / 64px collapsed, 16px radius, tooltips, avatar |
| **Header Row** | `ProductPage` / `HeaderRow` | **REUSE** | Fraunces 36px/44px title + DM Sans 16px/24px subtitle + Button |
| **Primary Action** | `Button variant="primary"` | **REUSE** | Height 40px `#F4B400` with `plus` icon and shadow |
| **Metrics Row** | `HomeMetricsRow` / `.pc-ref-metrics-row` | **REUSE** | 3-column `repeat(3, minmax(0, 1fr))` with `gap: 24px` |
| **Metric Cards (3x)** | `MetricCard` (`MetricCard.tsx`) | **REUSE** | Fluid width (`width: 100%; min-width: 0;`), 102px height, 20px padding |
| **Voting Decorator** | `DecisionChoice` | **REUSE** | Wraps each MetricCard for retreat session interaction |
| **Notice AI Card** | `PosterChildNoticed` | **REUSE** | Gold gradient background, `stars-01` badge, action link |
| **Attention Section Title** | `SectionHeader` | **REUSE** | DM Sans 16px weight 600 + "View all" action link |
| **Attention Table** | `AttentionTable` (`AttentionTable.tsx`) | **REUSE** | 3-column table (224px, 110px, 1fr), 40px header, 64px row |
| **Priority Pills** | `Badge` (`Badge.tsx`) | **REUSE** | `Immediate`, `Ready`, `Upcoming` with colored dots |
| **Table Featured Icons** | `FeaturedIcon` (`FeaturedIcon.tsx`) | **REUSE** | 40x40 container with 10px radius (Calendar, Coins, File) |
| **Suggested Story Section** | `SuggestedStoryCard` | **ADAPT / NEW** | Composite card: 250x224 image, Fraunces 24px title, tags, description |
| **Postie Panel** | `PostiePanel` (`PostiePanel.tsx`) | **REUSE** | 360px docked / floating overlay with 16px outer radius |

---

## 2. Component Status Definitions

- **REUSE (12 components):** Uses existing Design System components without altering visual contract.
- **ADAPT (1 component):** `SuggestedStoryCard` composite structure to encapsulate photographic image + metadata tags + AI badge.
- **MISSING (0 components):** All base primitives exist in `src/components/posterchild/`.
- **SCREEN-SPECIFIC (1 composite):** Home page assembly in `HomeWorkspace.tsx` orchestrating metrics, retreat decision decorator, attention table, and suggested story.
