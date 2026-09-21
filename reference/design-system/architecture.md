# PosterChild Design System Architecture & Synchronization Map

This document establishes the official four-tier synchronization architecture between the design system assets, code reference repositories, product prototypes, and the retreat consumer application.

---

## 1. The Four Tiers of Truth

```
┌──────────────────────────────────────────────────────────────────┐
│  1. FIGMA DESIGN SYSTEM: 🤖 DS – 2026 (v8.0)                     │
│     Authoritative Visual Source of Truth                         │
│     - Geometry, exact pixel spacing, layout constraints          │
│     - Typography (DM Sans, Fraunces scales), colors, radii       │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│  2. CODE DESIGN SYSTEM: posterchild-prototype (@posterchild/ui)  │
│     Authoritative Implementation Source of Truth                 │
│     - Complete token definitions (colors, spacing, radius, etc.) │
│     - Reusable React UI primitives (Button, Badge, Input, etc.)  │
│     - Shadcn / Registry architecture                             │
└──────────────────┬───────────────────────────────┬───────────────┘
                   │                               │
                   ▼                               ▼
┌──────────────────────────────────┐ ┌─────────────────────────────┐
│ 3. PRODUCT BEHAVIOR: postie-mvp  │ │ 4. CONSUMER: retreat-mvp    │
│    Interaction & UX Reference    │ │    Production Consumer App  │
│    - Sidebar collapse/docking    │ │    - Presenter & Join apps  │
│    - Chat state & context flows  │ │    - Realtime Firebase sync │
│    - Floating / docked panels    │ │    - Local mini-DS adapter  │
└──────────────────────────────────┘ └─────────────────────────────┘
```

### Tier 1: Figma Design System (`🤖 DS – 2026 (v8.0)`)
- **Role**: Supreme Visual Source of Truth.
- **Node References**:
  - Home Screen: Node `493:5128` (`Home — QA Exploration 05 / Reference-driven`).
  - Metric Cards: Attention Section (`Stories`, `Campaigns`, `Quotes`).
  - Untitled UI v8.0 instance-swap defaults and base vectors.
- **Authority**: If code and Figma disagree on layout, dimensions, typography, or color values, Figma takes priority.

### Tier 2: Code Design System (`posterchild-prototype`)
- **Repository**: `https://github.com/darien-posterchild/posterchild-prototype.git`
- **Live System**: `https://posterchild-prototype.vercel.app/design-system`
- **Role**: Implementation Source of Truth.
- **Key Artifacts**:
  - `packages/ui/`: `@posterchild/ui` shared primitive exports.
  - `design-system/tokens/`: Canonical TS token files (`colors.ts`, `radius.ts`, `shadows.ts`, `spacing.ts`, `typography.ts`, `containers.ts`).
  - `components/ui/`: 33+ completed UI primitives (Button, Badge, Input, Textarea, FeaturedIcon, Popover, Dialog, DropdownMenu, etc.).
  - `registry.json`: Shadcn-compatible distribution registry.

### Tier 3: Product Behavior Reference (`postie` / `postie-mvp`)
- **Repository**: `https://github.com/darien-posterchild/postie.git`
- **Live Reference**: `https://postie-seven.vercel.app/`
- **Role**: Product Interaction Reference.
- **Authority**: Governs how primitives assemble into actual product workflows (collapsible 280px/84px sidebar, docked vs floating Postie panel, context tagging, chat composer states, keyboard shortcuts).

### Tier 4: Consumer Application (`posterchild-retreat-mvp`)
- **Current Workspace**: Vite + React + TypeScript + Firebase Realtime DB.
- **Role**: Consumer of DS primitives and Postie UX shell.
- **Component Layer**: `src/components/posterchild/` hosts the retreat application's adapter layer, mapping DS primitives directly into retreat screens (`/present` and `/join`).

---

## 2. Synchronization Rules of Engagement

1. **Check `@posterchild/ui` Before Creating Primitives**:
   Never recreate a UI primitive (Button, Input, Select, Checkbox, Radio, Badge, Popover) from scratch. Always reference `posterchild-prototype/components/ui/`.
2. **Figma Fidelity Takes Priority Over Abstraction**:
   If an existing component in `posterchild-prototype` has approximate styling that deviates from the authoritative Figma node, the Figma values take precedence.
3. **The Stories MetricCard Exception**:
   `posterchild-prototype` does not yet have a specialized MetricCard. The retreat project's `MetricCard.tsx` was built from exact Figma CSS export (Node ID `493:5128`) and is the authoritative reference for this component.
4. **Behavioral Separation**:
   Do not mix retreat business logic (session voting, presenter controls, Firebase listeners) into Design System primitives. Primitives remain dumb, stateless or controlled, and fully theme-tokenized.
5. **No Blind Upgrades**:
   Retreat styling should be reconciled through documented token mapping and non-breaking component adaptation, avoiding regressions on live voting and presentation surfaces.
