# PosterChild Product Navigation & Sidebar Hierarchy

This document details the data-driven navigation system, submenu expansion behavior, and state management implemented in the PosterChild sidebar.

---

## 1. Data-Driven Navigation Model

Sidebar navigation items are defined generically in `src/navigation/productNavigation.ts` via `PRODUCT_NAVIGATION`:

```typescript
export interface NavChildItemConfig {
  id: string;
  label: string;
  subPath: string; // e.g. "tell/stories"
  icon?: PosterChildIconName;
}

export interface NavItemConfig {
  id: string;
  label: string;
  subPath: string; // e.g. "tell"
  icon: PosterChildIconName;
  children?: NavChildItemConfig[];
}
```

This model is extensible for future additions to `Raise` or `Manage` without rewriting layout or toggle logic.

---

## 2. Hierarchical Behavior & Active States

### 2.1 Tell Expansion Behavior
1. **Active Route Synchronization**:
   - When the user navigates to any route starting with `/tell` (e.g. `/present/PC26/tell/connect`), the `Tell` parent group is automatically expanded.
   - The active subitem (`Connect`) receives the primary active state:
     - Background: `#FFF9E8`
     - Text & Dot: `#8F6500` / `#F4B400`
     - Font: DM Sans Medium 13px
   - The parent `Tell` item retains its section awareness.
2. **Toggle Affordance**:
   - The parent row includes a `chevron-down` button rotated 180° when expanded.
   - Clicking the chevron toggles expansion without forcing navigation.
   - Clicking the `Tell` label directly navigates to the default Overview route (`/tell`).

### 2.2 Collapsed Sidebar Mode (84px Outer Region)
- When the sidebar is collapsed:
  - Each top-level section renders a 36×36px button with its 20px icon.
  - Active section icon is highlighted in brand yellow `#F4B400` with subtle background `#FFFDF5`.
  - Hovering displays a dark floating tooltip (`CollapsedTooltip`).
  - Clicking navigates directly to that section's main route.

---

## 3. Postie Current Page Context Synchronization

The Postie panel dynamically tracks the current active screen via `getProductPageContext(pathname)`:

```typescript
export function getProductPageContext(pathname: string): string {
  const sub = normalizeProductPath(pathname);
  if (!sub) return 'Home';
  if (sub === 'tell') return 'Tell · Overview';
  if (sub === 'tell/stories') return 'Tell · Stories';
  if (sub === 'tell/connect') return 'Tell · Connect';
  if (sub === 'tell/calendar') return 'Tell · Calendar';
  if (sub === 'raise') return 'Raise';
  if (sub === 'manage') return 'Manage';
  if (sub === 'manage/assets') return 'Manage · Assets';
  ...
}
```

The context chip at the top of the Postie composer automatically displays this label (e.g. `Tell · Connect`), grounding AI interactions in the user's current task.
