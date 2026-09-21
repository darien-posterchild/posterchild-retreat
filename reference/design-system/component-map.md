# Design System Component Map

This document establishes the comprehensive component-level mapping between:
1. **Figma Design System** (`🤖 DS – 2026 (v8.0)`)
2. **Implementation Source of Truth** (`posterchild-prototype`)
3. **Consumer Application** (`posterchild-retreat-mvp`)

---

## 1. Core Primitives & Components

| Component | Figma DS Name | Prototype Source | Retreat Equivalent | Status | Recommended Action |
|---|---|---|---|---|---|
| **Button** | `Buttons/Button` | `components/ui/button.tsx` | `src/components/posterchild/Button.tsx` | **ADAPT** | Reconcile retreat Button props with prototype. Add `tertiary` / `link-color` / `link-gray` hierarchy aliases, `xs` and `xl` sizes, and `state="loading"` support while keeping exact Figma skeuomorphic shadow and 12px radius. |
| **Badge** | `Badges/Badge`, `Badges/Pill` | `components/ui/badge.tsx` | `src/components/posterchild/Badge.tsx` | **ADAPT** | Support `type="pill" \| "badge"`. Map domain variants (`immediate`, `upcoming`, `ready`) as aliases to standard DS color families (`error`, `warning`, `success`). Retain 22px height, 6px dot, and DM Sans 12px Medium. |
| **BadgeGroup** | `Badges/Badge group` | `components/ui/badge-group.tsx` | *None* | **PORT** | Port `BadgeGroup` to retreat for announcements, release notes, and contextual notifications. |
| **FeaturedIcon** | `Featured icons/Featured icon` | `components/ui/featured-icon.tsx` | `src/components/posterchild/FeaturedIcon.tsx` | **ADAPT** | Add `type="modern" \| "gradient" \| "dark" \| "outline"` to retreat `FeaturedIcon`. Reconcile `sm` radius (6px in prototype vs 8px in retreat) and align tone tokens with `posterChildFeaturedIconColors`. |
| **FeaturedIconOutline** | `Featured icons/Featured icon outline` | `components/ui/featured-icon.tsx` | *None* | **PORT** | Port dual-ring concentric outline variant for hero milestones and noticed cards. |
| **Icon** | Untitled UI v8.0 Icons | `public/posterchild-*.svg` | `src/components/posterchild/Icon.tsx` | **ADAPT** | Continue using retreat's centralized `PosterChildIcon` SVG registry. Synchronize missing icon geometries from DS svgs into `Icon.tsx`. |
| **MetricCard** | `Attention Section / Stories Card` (Node `493:5128`) | *Missing in prototype* | `src/components/posterchild/MetricCard.tsx` | **REUSE (Authoritative)** | **Special Case:** Retreat's `MetricCard.tsx` is built from exact Figma CSS export (236×102px, 20px padding, DM Sans 14px uppercase, Fraunces 30px, 32×32 icon container). Authoritative implementation. Upstream to `posterchild-prototype`. |
| **Input** | `Inputs/Input` | `components/ui/input.tsx` | *None (Raw HTML input)* | **PORT** | Port `Input` for session name inputs, presenter modals, and search bars. |
| **InputGroup** | `Inputs/Input group` | `components/ui/input-group.tsx` | *None* | **PORT** | Port composite input with leading/trailing button/dropdown addons. |
| **Textarea** | `Textareas/Textarea` | `components/ui/textarea.tsx` | *Raw HTML in PostiePanel* | **ADAPT / PORT** | Adapt PostiePanel's composer to use standard DS `Textarea` tokens and styles, or port `Textarea` into retreat. |
| **Checkbox** | `Checkboxes/Checkbox` | `components/ui/checkbox.tsx` | *None* | **PORT** | Port for multi-select question items in voting and audience management. |
| **Radio** | `Radio buttons/Radio button` | `components/ui/radio.tsx` | *None* | **PORT** | Port for single-select voting choices in `/join` audience views. |
| **RadioGroupItem** | `Radio buttons/Radio group item` | `components/ui/radio-group-item.tsx` | *None* | **PORT** | Port card-style selectable radio tiles for voting options. |
| **Switch** | `Toggles/Toggle` | `components/ui/switch.tsx` | *None* | **PORT** | Port for presenter controls (auto-advance toggle, vote reveal switch). |
| **DropdownMenu** | `Dropdowns/Dropdown menu` | `components/ui/dropdown-menu.tsx` | *Ad-hoc in PostiePanel* | **ADAPT / PORT** | Standardize Postie chats menu and workspace action menus with DS `DropdownMenu`. |
| **Popover** | `Popovers/Popover` | `components/ui/popover.tsx` | *None* | **PORT** | Reusable floating surface with arrow anchor for tooltips, info popups, and quick settings. |
| **Dialog** | `Modals/Modal` | `components/ui/dialog.tsx` | *Ad-hoc modal in presenter* | **ADAPT / PORT** | Replace custom presenter modal dialogs with standard DS `Dialog`. |
| **Tooltip** | `Tooltips/Tooltip` | `components/ui/tooltip.tsx` | *Native title attributes* | **PORT** | Port custom styled tooltips for icon buttons (collapse sidebar, copy link, mic). |
| **Tabs** | `Tabs/Tabs` | `components/ui/tabs.tsx` | *None* | **PORT** | Port for switching between scenes, question banks, or settings tabs. |
| **CardHeader** | `Headers/Card header` | `components/ui/card-header.tsx` | *Ad-hoc in AttentionTable* | **ADAPT** | Use DS `CardHeader` for Attention Table header and Noticed card headers. |
| **EmptyState** | `Empty states/Empty state` | `components/ui/empty-state.tsx` | *None* | **PORT** | Standard empty state display when no active session votes or drafts exist. |
| **Avatar** | `Avatars/Avatar` | `components/ui/avatar.tsx` | `src/components/Sidebar.tsx` (User snippet) | **ADAPT / PORT** | Reconcile bottom sidebar user avatar (`DM` initials tile) with DS `Avatar`. |
| **AvatarGroup** | `Avatars/Avatar group` | `components/ui/avatar-group.tsx` | *None* | **PORT** | Port for displaying active attendees connected to `/join/:sessionId`. |
| **Pagination** | `Pagination/Pagination` | `components/ui/pagination.tsx` | *None* | **PORT** | Port for multi-page attention items or scene switching. |
| **Slider** | `Sliders/Slider` | `components/ui/slider.tsx` | *None* | **PORT** | Port for timer adjustment or volume/speed settings. |
| **TagInput** | `Inputs/Tag input` | `components/ui/tag-input.tsx` | *Ad-hoc chips in Postie* | **ADAPT / PORT** | Standardize Postie context tags (`Stories: workforce development`) using DS TagInput. |
| **PostieAnimatedIcon** | PosterChild Brand Motion | `components/brand/animated-posterchild-logo.tsx` | `src/components/posterchild/PostieAnimatedIcon.tsx` | **REUSE** | Retreat implementation has exact state machine (`idle`, `thinking`, `speaking`, `hover`) and matches brand artwork. |
| **NavItem** | `Sidebar / Nav item` | *In design-system-sidebar* | `src/components/posterchild/NavItem.tsx` | **REUSE** | Retreat's `NavItem` matches 40px height, 8px/12px padding, and active state pill styling. |

---

## 2. METRIC CARD — SPECIAL CASE ANALYSIS

- **Current Retreat Implementation**: [`src/components/posterchild/MetricCard.tsx`](file:///Users/dmenendez/Documents/Coding/posterchild-retreat-mvp/posterchild-retreat-mvp/src/components/posterchild/MetricCard.tsx)
- **Status**: **REUSE (Authoritative)**
- **Audit Findings**:
  1. `posterchild-prototype` does **not** contain a `MetricCard`, `StatCard`, or dashboard KPI component.
  2. The retreat `MetricCard` was authored directly from the authoritative Figma CSS export (Node ID `493:5128`, Attention Section / Stories Card).
  3. Dimensions: exactly `236px × 102px` with `20px` padding.
  4. Heading: DM Sans Medium 500, 14px / 24px, uppercase, tracking `0.04em`, color `#171717`.
  5. Value: Fraunces SemiBold 600, 30px / 38px, color `#171717`.
  6. Featured icon container: `32px × 32px`, `8px` radius, top/right `16px`, background `#F0FDF4`, icon `folder` 16px, stroke `1.33333px`.
- **Verdict**:
  Retreat's `MetricCard` is the authoritative reference for this component across all PosterChild codebases. It must **not** be overwritten or replaced. It should be contributed upstream into `posterchild-prototype/components/ui/metric-card.tsx`.

---

## 3. POSTIE → DESIGN SYSTEM MAPPING

To eliminate ad-hoc CSS styling inside [`src/components/PostiePanel.tsx`](file:///Users/dmenendez/Documents/Coding/posterchild-retreat-mvp/posterchild-retreat-mvp/src/components/PostiePanel.tsx), every visible control maps to a standard DS primitive:

| Postie UI Element | Target DS Component | DS Icon Name | Current Retreat Implementation | Migration Action Required |
|---|---|---|---|---|
| **Chats Dropdown** | `Button` (secondary, sm/md) + `DropdownMenu` | `chevron-down` (20px) | Custom button with inline SVG | Replace custom button with `<Button variant="secondary" size="sm" iconTrailing="chevron-down">Chats</Button>` wrapped in `<DropdownMenu>`. |
| **New Chat Button** | `Button` (secondary icon-only, 36px) | `plus` (20px) | Custom `.postie-icon-btn` | Replace with `<Button variant="secondary" size="sm" iconLeading="plus" aria-label="New chat" />`. |
| **View-Mode Toggle** | `Button` (secondary icon-only, 36px) | `window-position-sidebar` / `window-position-floating` (20px) | Custom `.postie-icon-btn` | Replace with `<Button variant="secondary" size="sm" iconLeading={modeIcon} aria-label="Toggle view" />`. |
| **Close / Collapse Button** | `Button` (secondary / ghost icon-only, 36px) | `x-close` (20px) | Custom `.postie-icon-btn` | Replace with `<Button variant="ghost" size="sm" iconLeading="x-close" aria-label="Close" />`. |
| **Beta Badge** | `Badge` (type="badge", color="brand" / "gray") | *None* | Custom inline `span.postie-beta-tag` | Replace with `<Badge variant="brand" showDot={false}>Beta</Badge>`. |
| **Postie Header Icon** | `FeaturedIcon` (type="modern", size="sm") or `PostieAnimatedIcon` | `PostieAnimatedIcon` | `PostieAnimatedIcon` (24px/32px) | **KEEP**: Already using `PostieAnimatedIcon` with exact state triggers. |
| **Context Chip (Pill)** | `Badge` (type="pill", color="brand") or `Tag` | `x-close` (12px trailing) | Custom `.postie-context-chip` | Map to DS `Tag` or `<Badge type="pill" color="brand">` with removable dismiss action. |
| **Add Context Button** | `Button` (tertiary / secondary sm) | `plus` (16px) | Custom `.postie-add-context-btn` | Replace with `<Button variant="secondary" size="xs" iconLeading="plus">Add context</Button>`. |
| **Message Action Buttons** (Copy, Edit) | `Button` (ghost icon-only, 28px) | `copy`, `edit-02` (16px) | Custom `.postie-msg-action-btn` | Replace with `<Button variant="ghost" size="xs" iconLeading="copy" />`. |
| **Composer Textarea** | `Textarea` (variant="default", size="sm") | *None* | Native `<textarea className="postie-textarea">` | Apply DS Textarea token styles (`--pc-textarea-background`, `--pc-textarea-border`, radius `12px`). |
| **Composer Plus (+)** | `Button` (ghost icon-only, 32px) | `plus` (20px) | Custom `.postie-composer-btn` | Replace with `<Button variant="ghost" size="xs" iconLeading="plus" aria-label="Add attachment" />`. |
| **Composer Settings** | `Button` (ghost icon-only, 32px) | `settings-04` (20px) | Custom `.postie-composer-btn` | Replace with `<Button variant="ghost" size="xs" iconLeading="settings-04" aria-label="Chat settings" />`. |
| **Microphone Button** | `Button` (ghost / secondary icon-only, 32px) | `microphone-01` (20px) | Custom `.postie-composer-btn` | Replace with `<Button variant="ghost" size="xs" iconLeading="microphone-01" aria-label="Voice input" />`. |
| **Send Button** | `Button` (primary / brand icon-only, 32px) | `arrow-up` (16px) | Custom `.postie-send-btn` | Replace with `<Button variant="primary" size="xs" iconLeading="arrow-up" aria-label="Send message" />`. |

---

## 4. TABLE & DATA DISPLAY AUDIT

- **Retreat Component**: [`src/components/AttentionTable.tsx`](file:///Users/dmenendez/Documents/Coding/posterchild-retreat-mvp/posterchild-retreat-mvp/src/components/AttentionTable.tsx)
- **Prototype Equivalents**:
  - `posterchild-prototype` does not yet export a standalone `<Table />` primitive in `@posterchild/ui`.
  - It does contain reusable compositional subcomponents:
    - `<CardHeader />`: Replaces custom title + "View all" container.
    - `<Badge />`: Powers the "Immediate", "Ready", "Upcoming" priority indicators.
    - `<FeaturedIcon />`: Powers the row icon badge (`calendar-heart-02`, `coins-hand`, `file-06`).
- **Audit Findings**:
  - AttentionTable header uses: DM Sans 12px Medium uppercase, tracking 0.04em, `#737373`.
  - Row height: 72px with 16px 20px padding.
  - Border: 1px solid `#E5E5E5` (`var(--pc-ref-border-default)`).
  - Radius: 12px container with overflow hidden.
- **Recommendation**:
  **KEEP RETREAT VERSION** for now; replace inner row status badges with DS `<Badge />`, replace leading icons with DS `<FeaturedIcon />`, and integrate DS `<CardHeader />`.

---

## 5. INPUT / TEXTAREA / FORM CONTROLS AUDIT

`posterchild-prototype` includes 11 form control primitives that can be systematically ported or adapted into retreat:

1. **Input (`components/ui/input.tsx`)**:
   - Standard heights: `sm: 36px`, `md: 40px`, `lg: 44px`.
   - Radius: `8px` (`--pc-radius-md`) to `12px` (`--pc-radius-xl`).
   - Focus treatment: `border-color: var(--pc-color-border-brand)` (`#FFCC33`), double focus ring `0 0 0 2px #FFF, 0 0 0 4px #FFCC33`.
2. **Textarea (`components/ui/textarea.tsx`)**:
   - Heights: `sm: min-height 110px`, `md: min-height 128px`.
   - Built-in support for inner tags (`variant="tags-inner"`) which directly matches Postie context chips!
   - Resize handle: custom SVG resizer mask (`/posterchild-textarea-resize.svg`).
3. **DropdownMenu (`components/ui/dropdown-menu.tsx`)**:
   - Built with Radix / React Aria patterns.
   - Menu widths: simple `216px`, advanced `240px`.
   - Shadows: `var(--pc-box-shadow-lg)`.
4. **Popover (`components/ui/popover.tsx`)**:
   - Padding: 20px, radius: 12px, shadow: `var(--pc-box-shadow-xl)`.
5. **Checkbox / Radio / Switch**:
   - Standard 16px (`sm`) and 20px (`md`) control sizes.
   - Checked color: `var(--pc-color-bg-brand-solid)` (`#F4B400`).

---

## 6. DUPLICATE DETECTION & RESOLUTION MATRIX

| Retreat Component | Prototype Counterpart | Analysis | Recommendation |
|---|---|---|---|
| `src/components/posterchild/Button.tsx` | `components/ui/button.tsx` | High alignment. Retreat has skeuomorphic shadow and exact 40px/10px padding. Prototype has more hierarchy variants (`tertiary`, `link-color`, `link-gray`) and states (`loading`). | **MERGE / ADAPT**: Enrich retreat Button with prototype's hierarchy variants and loading state without breaking existing API. |
| `src/components/posterchild/Badge.tsx` | `components/ui/badge.tsx` | Identical colors, font size (12px), height (22px), and dot (6px). Prototype adds `pill` vs `badge` shape. | **MERGE / ADAPT**: Add `type="pill" \| "badge"` to retreat Badge; alias domain names to DS colors. |
| `src/components/posterchild/FeaturedIcon.tsx` | `components/ui/featured-icon.tsx` | Retreat has `sm` (32px), `md` (40px), `lg` (48px). Prototype adds `xl` (56px) and types (`gradient`, `modern-neue`, `outline`). | **MERGE / ADAPT**: Keep retreat API as base, add prototype's types and outline variant. |
| `src/components/posterchild/MetricCard.tsx` | *None* | Unique to retreat. Derived directly from authoritative Figma CSS export (Node `493:5128`). | **KEEP RETREAT VERSION (AUTHORITATIVE)**: Do not touch. Upstream to prototype later. |
| `src/components/posterchild/PostieAnimatedIcon.tsx` | `components/brand/animated-posterchild-logo.tsx` | Retreat component includes interactive chat state transitions (`idle`, `thinking`, `speaking`, `hover`). | **KEEP RETREAT VERSION**: Highly optimized for retreat presentation and Postie chat context. |
| `src/components/posterchild/NavItem.tsx` | *Inside DS sidebar demo* | Retreat has exact 40px height, 8px/12px padding, and active background `#FFF9E8`. | **KEEP RETREAT VERSION**: Perfectly matches Figma sidebar spec. |
| `src/components/posterchild/Icon.tsx` | *Scattered SVG assets in public/* | Retreat centralizes 27+ DS icons into a type-safe single SVG registry with size & stroke props. | **KEEP RETREAT REGISTRY**: Significantly cleaner than loose SVG files; synchronize additional icon paths as needed. |
