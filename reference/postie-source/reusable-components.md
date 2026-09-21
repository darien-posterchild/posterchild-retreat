# Reusable Components Evaluation & Classification

This document analyzes every component inspected in the Postie prototype repository and categorizes it according to its porting feasibility, architecture, and value to the PosterChild Retreat MVP.

---

## Classification Taxonomy

- **A. PORT**: High-value behavioral logic that can be incorporated directly with minimal changes (pure React hooks, state machines, math/layout routines).
- **B. ADAPT**: Strong interaction logic and layout rules that should be ported, but must be restyled or refactored to use the PosterChild Design System primitives (`src/components/posterchild/`) and local CSS tokens.
- **C. REFERENCE ONLY**: Useful for reverse-engineering layout formulas, breakpoints, or styling intent, but should not be directly imported into the retreat project codebase.
- **D. IGNORE**: Unrelated to the retreat MVP, obsolete explorations, or Next.js-specific scaffolding.

---

## Component Analysis Matrix

| Component | Source Path | Classification | Value to Retreat MVP | Key Dependencies / Considerations |
|---|---|:---:|---|---|
| **`SidebarNavigation`** | `src/components/layout/sidebar-navigation.tsx` | **B. ADAPT** | **Highest (Immediate)**. Proven `280px` $\leftrightarrow$ `84px` collapse/expand state, hover tooltips, morphing logo toggle, and `localStorage` persistence. | Restyle using retreat's `<Icon>` and `<NavItem>` primitives. Remove Next.js `next/link` and `usePathname`. |
| **`PostieContext`** | `src/lib/postie-context.tsx` | **A. PORT** | **High**. Clean 3-state view manager (`"sidebar" \| "floating" \| "collapsed"`), view memory, and storage persistence. Pure React, zero dependencies. | Directly usable as a React Context provider in Vite. |
| **`AppShell`** | `src/components/layout/app-shell.tsx` | **B. ADAPT** | **High**. 3-pane flex coordinator that manages horizontal space sharing and prevents horizontal scroll blowout. | Adapt router layout to wrap retreat's `/present` view while preserving presenter toolbar isolation. |
| **`PostiePanel`** | `src/components/layout/postie-panel.tsx` | **B. ADAPT** | **High (Phase 2)**. Rich assistant interface: docked/floating/collapsed views, context chips, upward search popover, simulated streaming, inline actions. | 1,700 lines. Replace Next.js router with React Router; replace ad-hoc SVGs with PosterChild DS tokens and icons. |
| **`NeedsAttention`** | `src/components/home/needs-attention.tsx` + `.css` | **B. ADAPT** | **High**. Superb implementation of CSS container queries (`@container attention-table`) that seamlessly morphs from 3-col grid to stacked card list. | Restyle priority pills using `<Badge>` component from retreat DS. Port `.css` container query rules. |
| **`AttentionMetrics`** | `src/components/home/attention-metrics.tsx` | **B. ADAPT** | **Medium**. Clean 3-card metric summary with featured icon badges and Fraunces serif typography. | Replace inline styles/Tailwind with retreat DS tokens and `<FeaturedIcon>`. |
| **`PosterChildNoticed`** | `src/components/home/posterchild-noticed.tsx` | **B. ADAPT** | **Medium**. Highly polished gold AI insight card with animated mesh background, harmonic sinusoidal SVG curves, and constellation nodes. | Keep vector math and gradients; replace ad-hoc assets with retreat design system tokens. |
| **`Header`** | `src/components/layout/header.tsx` | **C. REFERENCE ONLY** | **Low**. This represents the older top-navigation prototype (Node 358:3217). The retreat project is committed to the Left Sidebar desktop shell (Node 493:5128). | Do not port navigation logic. Useful only as reference for the expandable `⌘K` search bar behavior. |
| **`PrimaryButton`** | `src/components/ui/primary-button.tsx` | **B. ADAPT** | **Medium**. Golden CTA button with inset bevel shadow and plus icon. | Harmonize with retreat's existing `src/components/posterchild/Button.tsx`. |
| **`Button`** | `src/components/ui/button.tsx` | **D. IGNORE** | **None**. Basic un-themed Tailwind button. | The retreat project already has a complete, tokenized `Button.tsx` in `src/components/posterchild/Button.tsx`. |
| **`PostieAnimatedIcon`** | `src/components/common/postie-animated-icon.tsx` | **A. PORT** | **High**. Mathematically centered SVG icon with smooth, ambient on-axis continuous rotation (20x20, 40x40) and pulse glow states. | Pure SVG + CSS animations. Direct drop-in into `src/components/posterchild/`. |
| **`home-v05.css`** | `src/app/home-v05.css` | **C. REFERENCE ONLY** | **Medium**. Massive (1,216 line) CSS export of Figma frame 513:11470 / 493:5128. | Do not import wholesale. Used to verify exact Figma margin/padding tokens. |
| **`page.tsx`** | `src/app/page.tsx` | **C. REFERENCE ONLY** | **Low**. Next.js App Router entry point assembling the home widgets. | The retreat project handles presentation composition in `src/pages/PresenterSession.tsx` and `src/components/posterchild/`. |

---

## In-Depth Analysis of Key Components

### 1. `SidebarNavigation`
- **Source**: `src/components/layout/sidebar-navigation.tsx`
- **Classification**: **ADAPT**
- **Existing Strengths**:
  - Exact width transitions (`280px` $\leftrightarrow$ `84px`) with `200ms ease-out`.
  - Morphing header button: smoothly switches between brand logo (in collapsed resting state) and `layout-left` icon (on hover).
  - Clean tooltip floating popover for collapsed icon items with 300ms hover delay.
  - Multi-tab synchronized storage persistence via `useSyncExternalStore`.
- **Modifications Required for Retreat**:
  - Replace `next/link` with `react-router-dom` `Link`.
  - Replace `next/navigation` `usePathname()` with `useLocation().pathname`.
  - Replace raw SVGs with retreat's `<Icon>` component.
  - Re-skin the account footer to match retreat's session/presenter indicator.

### 2. `PostieContext`
- **Source**: `src/lib/postie-context.tsx`
- **Classification**: **PORT**
- **Existing Strengths**:
  - Zero framework dependencies (pure React).
  - Robust state machine handling 3 distinct layout views.
  - Remembers user preference between `"sidebar"` and `"floating"`.
  - Synchronizes with `localStorage` safely.
- **Modifications Required for Retreat**:
  - None. Ready for direct inclusion in `src/context/PostieContext.tsx`.

### 3. `PostiePanel`
- **Source**: `src/components/layout/postie-panel.tsx`
- **Classification**: **ADAPT**
- **Existing Strengths**:
  - Unified component managing docked, floating, and collapsed launcher views.
  - Context-aware starter prompts and automatic route sensing.
  - Upward context picker popover with search and browse categories.
  - Realistic progressive streaming simulation with dynamic typing status.
  - Inline suggested actions (`navigate` or `prompt`).
- **Modifications Required for Retreat**:
  - Decouple from Next.js `useRouter`.
  - Refactor to consume retreat's shared design tokens.
  - Isolate streaming/chat state into a custom hook (`usePostieChat.ts`) for maintainability.

### 4. `NeedsAttention` + `needs-attention.css`
- **Source**: `src/components/home/needs-attention.tsx` & `needs-attention.css`
- **Classification**: **ADAPT**
- **Existing Strengths**:
  - Implements container queries (`@container attention-table`) enabling the table to seamlessly adapt when the sidebar collapses or Postie opens.
  - Clean data model separating Item, Priority, and Details.
- **Modifications Required for Retreat**:
  - Replace raw priority divs with retreat's `<Badge>` primitive (`variant="red" | "yellow" | "green"`).
  - Replace Next.js `next/image` with SVG `<Icon>`.

### 5. `PostieAnimatedIcon`
- **Source**: `src/components/common/postie-animated-icon.tsx`
- **Classification**: **PORT**
- **Existing Strengths**:
  - Solves the common SVG rotation jitter bug by applying mathematical center offset translation `translate(-0.0759, -0.0759)`.
  - Ambient rotation (`30s linear infinite`) speeds up when `isThinking` (`1.5s linear infinite`).
- **Modifications Required for Retreat**:
  - Can be ported directly into `src/components/posterchild/PostieAnimatedIcon.tsx` with zero dependencies.
