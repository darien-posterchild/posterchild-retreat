# PosterChild Design System Migration Plan

This document defines the phased, risk-ranked roadmap for synchronizing the retreat application (`posterchild-retreat-mvp`) with the official code design system (`posterchild-prototype`) and Figma (`🤖 DS – 2026 (v8.0)`).

---

## 1. The Core Migration Principle

> **Rule of Engagement:**
> - If a component exists in `posterchild-prototype`: **reuse or adapt it**.
> - If a component does not exist in `posterchild-prototype`: **build it from exact Figma CSS/reference**.
> - **Never** recreate a component from scratch when an equivalent design system implementation exists.

---

## 2. Component Status & Priority Roadmap

Future migrations are structured into sequential, non-breaking phases ordered by **lowest risk** and **highest reuse**.

```
Phase 1: Foundation Primitives (Icons, Button, Badge, FeaturedIcon)
   │
   ▼
Phase 2: Postie Shell Alignment (Composer Controls, Context Chips, Dropdowns)
   │
   ▼
Phase 3: Form Primitives & Inputs (Input, Textarea, Tooltips, Popovers)
   │
   ▼
Phase 4: Data Display & Tables (AttentionTable Refinements, CardHeader)
   │
   ▼
Phase 5: Modals & Composite Layers (Dialog, EmptyState, Tabs)
```

---

### Phase 1: Foundation Primitives (Zero Visual Disruption)

| Step | Component | Action | Risk | Notes |
|---|---|---|---|---|
| **1.1** | **Icons** | Synchronize missing icons (`dots-vertical`, `help-circle`, `check-circle`, `eye`, `trash-01`) from prototype SVGs into retreat's type-safe `src/components/posterchild/Icon.tsx`. | **Very Low** | Purely additive. No existing UI affected. |
| **1.2** | **MetricCard** | **VERIFY / REUSE (Authoritative)**. Do not recreate. Stories card is already complete from exact Figma CSS (Node `493:5128`). Mark Campaigns and Quotes variants as pending-reference. | **Zero** | Preserved in place. Ready to contribute upstream to `posterchild-prototype`. |
| **1.3** | **Button** | **ADAPT**: Reconcile retreat `Button.tsx` props to support `tertiary`, `link-color`, `link-gray` hierarchy aliases, `xs` (32px) and `xl` (48px) sizes, and `loading` state while maintaining exact skeuomorphic shadow and 12px radius. | **Low** | Backward compatible with existing `<Button variant="primary">` usages. |
| **1.4** | **Badge** | **ADAPT**: Add `type="pill" \| "badge"` shape toggle to retreat `Badge.tsx`. Map domain variants (`immediate`, `upcoming`, `ready`) to standard DS utility color tokens (`error`, `warning`, `success`). | **Low** | Colors and 22px height already match. |
| **1.5** | **FeaturedIcon** | **ADAPT**: Extend retreat `FeaturedIcon.tsx` with `type="modern" \| "gradient" \| "dark" \| "outline"`. Align 32px (`sm`), 40px (`md`), 48px (`lg`), and 56px (`xl`) with `posterChildFeaturedIconSizes`. | **Low** | Preserves existing usages in AttentionTable and Home workspace. |

---

### Phase 2: Postie Shell Alignment (Eliminate Ad-Hoc Styling)

| Step | Element | Target DS Primitive | Implementation Action |
|---|---|---|---|
| **2.1** | Postie Header Actions | `<Button variant="secondary" size="sm">` + `<DropdownMenu>` | Replace custom `.postie-icon-btn` and ad-hoc chat dropdown with standard DS Button and DropdownMenu. |
| **2.2** | Context Chips | `<Badge type="pill" color="brand">` or `<Tag>` | Standardize context tags with dismissible close icon. |
| **2.3** | Composer Action Row | `<Button variant="ghost" size="xs">` | Standardize Plus (+), Settings, Mic, and Send controls with DS Button and exact DS icon tokens (`plus`, `settings-04`, `microphone-01`, `arrow-up`). |
| **2.4** | Beta Tag | `<Badge variant="brand">` | Replace custom `.postie-beta-tag` with official Badge. |

---

### Phase 3: Form Primitives & Feedback Layer

| Step | Component | Prototype Source | Retreat Destination | Notes |
|---|---|---|---|---|
| **3.1** | `Input` | `components/ui/input.tsx` | `src/components/posterchild/Input.tsx` | Port input with 36px/40px/44px heights and double focus rings. |
| **3.2** | `Textarea` | `components/ui/textarea.tsx` | `src/components/posterchild/Textarea.tsx` | Port textarea with optional tag integration and custom resize handle. |
| **3.3** | `Tooltip` | `components/ui/tooltip.tsx` | `src/components/posterchild/Tooltip.tsx` | Port dark tooltip with arrow anchor for presenter shortcut hints. |
| **3.4** | `Popover` | `components/ui/popover.tsx` | `src/components/posterchild/Popover.tsx` | Port floating popover surface with 12px radius and XL shadow. |

---

### Phase 4: Data Display & Table Refinements

| Step | Target | Implementation Action |
|---|---|---|
| **4.1** | `CardHeader` | Port `components/ui/card-header.tsx` to standardize Attention Table and PosterChild Noticed headers. |
| **4.2** | `AttentionTable` Row Statuses | Refactor row priority badges from hardcoded CSS to `<Badge variant={status}>`. |
| **4.3** | `AttentionTable` Row Icons | Refactor leading row icons from inline SVGs to `<FeaturedIcon size="sm" variant={tone}>`. |

---

### Phase 5: Composite Overlays & Modals

| Step | Component | Target | Notes |
|---|---|---|---|
| **5.1** | `Dialog` | `components/ui/dialog.tsx` | Replace ad-hoc presenter modal overlays with standardized DS Dialog. |
| **5.2** | `EmptyState` | `components/ui/empty-state.tsx` | Provide standard empty state displays for zero-vote / zero-story states. |
| **5.3** | `Tabs` | `components/ui/tabs.tsx` | Provide tab navigation for future retreat presenter settings screens. |

---

## 3. The SINGLE Best Component to Migrate Next

**`Button` (`src/components/posterchild/Button.tsx`)** is the single best component to migrate next.

**Rationale:**
1. **Immediate Impact on Postie Panel**: PostiePanel contains 9 separate ad-hoc button implementations (`.postie-icon-btn`, `.postie-send-btn`, `.postie-composer-btn`, `.postie-add-context-btn`, `.postie-msg-action-btn`). Reconciling `Button` to support icon-only and compact `xs` (32px) sizes allows replacing virtually all Postie buttons with a single DS primitive.
2. **Zero Regressions**: The retreat `Button` already implements the exact skeuomorphic shadow and 12px radius. Adding `tertiary` / `ghost` aliases and `xs` / `xl` sizing is purely non-breaking and additive.
3. **High Architectural Leverage**: It unlocks immediate cleanup of Home workspace, Postie panel, and presenter controls simultaneously.
