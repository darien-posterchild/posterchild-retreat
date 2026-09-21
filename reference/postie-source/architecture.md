# Postie Prototype Architecture Reference

## Overview

The Postie prototype (`https://github.com/darien-posterchild/postie.git`, live at `https://postie-seven.vercel.app/`) implements the interactive desktop workstation experience for PosterChild. 

The architecture is built around a **3-pane responsive layout**:
1. **Left Column**: Collapsible navigation sidebar (`280px` expanded $\leftrightarrow$ `84px` collapsed)
2. **Center Column**: Fluid main workspace (`flex: 1 1 0%`, min-width 0, responsive via CSS Container Queries)
3. **Right Column**: Dual-mode AI assistant panel (`PostiePanel`: `360px` docked sidebar $\leftrightarrow$ `360/400px` floating modal $\leftrightarrow$ `40px` floating launcher)

```
+-----------------------------------------------------------------------------------------------+
| AppShell (flex row, h-screen, bg: #FFFDF5, overflow: hidden)                                  |
|                                                                                               |
| +-------------------+  +--------------------------------------------+  +--------------------+ |
| | SidebarNavigation |  | Main Workspace Area                        |  | PostiePanel        | |
| |                   |  | (flex: 1 1 0%, min-w: 0, overflow-y: auto) |  |                    | |
| | Expanded: 280px   |  |                                            |  | Mode "sidebar":    | |
| | Collapsed: 84px   |  |  +---------------------------------------+ |  |  360px docked      | |
| |                   |  |  | Page Header / Title + CTA             | |  |                    | |
| | Inner card:       |  |  +---------------------------------------+ |  | Mode "floating":   | |
| |  260px / 64px     |  |  | AttentionMetrics (3 cards)            | |  |  400px fixed card  | |
| |                   |  |  +---------------------------------------+ |  |                    | |
| | Transition:       |  |  | PosterChildNoticed (Gold AI card)     | |  | Mode "collapsed":  | |
| |  200ms ease-out   |  |  +---------------------------------------+ |  |  40px launcher     | |
| |                   |  |  | NeedsAttention (@container table)     | |  |                    | |
| | Tooltips on hover |  |  +---------------------------------------+ |  | Context chips +    | |
| | Persistent state  |  |  | SuggestedForYou                       | |  | streaming composer | |
| +-------------------+  +--------------------------------------------+  +--------------------+ |
+-----------------------------------------------------------------------------------------------+
```

---

## Horizontal Space Distribution & Layout Rules

### 1. Root Container (`app-shell.tsx`)
- Container: `div.flex.h-screen.w-screen.overflow-hidden.bg-[#FFFDF5]`
- Direction: Horizontal flexbox (`flex-row`)
- Height/Width: Exact viewport lock (`100vw x 100vh`), avoiding body scrollbars.
- Sizing coordination:
  - Sidebar: `flex-shrink: 0`. Width transitions dynamically between `280px` and `84px`.
  - Center: `flex: 1 1 0%`, `min-width: 0`. Padded on all sides with `20px` (or `20px 0 20px 20px` when paired with docked Postie).
  - Postie Panel:
    - When `postieView === "sidebar"`: Occupies layout flow with `width: 360px`, `min-width: 360px`, `max-width: 360px`, `flex: 0 0 360px`, `shrink-0`.
    - When `postieView === "floating"` or `"collapsed"`: Does **not** consume horizontal space in the flex shell (`position: fixed`). The center workspace automatically expands to fill the remaining width.

### 2. Space Budgeting Matrix

| Sidebar State | Postie State | Center Main Width (at 1440px viewport) | Total Horizontal Allocation |
|---|---|---|---|
| **Expanded** (`280px`) | **Docked** (`360px`) | $1440 - 280 - 360 = \mathbf{800\text{px}}$ | `280px + 800px + 360px = 1440px` |
| **Collapsed** (`84px`) | **Docked** (`360px`) | $1440 - 84 - 360 = \mathbf{996\text{px}}$ | `84px + 996px + 360px = 1440px` |
| **Expanded** (`280px`) | **Floating / Collapsed** (`0px` in flow) | $1440 - 280 = \mathbf{1160\text{px}}$ | `280px + 1160px = 1440px` |
| **Collapsed** (`84px`) | **Floating / Collapsed** (`0px` in flow) | $1440 - 84 = \mathbf{1356\text{px}}$ | `84px + 1356px = 1440px` |

---

## State Management Flow

### Postie Context (`postie-context.tsx`)
The interaction states are governed by a lightweight React Context with local storage persistence:

```typescript
export type PostieView = "sidebar" | "floating" | "collapsed";

interface PostieContextType {
  postieView: PostieView;
  setPostieView: (view: PostieView) => void;
  isPostieOpen: boolean;
  openPostie: () => void;
  collapsePostie: () => void;
  lastOpenPostieView: "sidebar" | "floating";
}
```

#### State Lifecycle:
1. **Hydration**: On mount, reads `localStorage.getItem("postie_view")`. Defaults to `"sidebar"`.
2. **View Memory**: Tracks `lastOpenPostieView` (`"sidebar"` or `"floating"`).
3. **Collapsing**: When collapsed, sets `postieView = "collapsed"`.
4. **Restoring**: Calling `openPostie()` restores `lastOpenPostieView` (defaulting to `"sidebar"`).
5. **Thread Persistence**: Conversation thread (`postie_persistent_thread`) and attached contexts (`postie_attached_context`) are persisted separately in `localStorage`.

### Sidebar State (`sidebar-navigation.tsx`)
- Managed via `localStorage.getItem("posterchild_sidebar_collapsed")`.
- Uses React's `useSyncExternalStore` (or `useState + useEffect`) to synchronize state cleanly across tabs and avoid SSR/hydration mismatch flicker.
- Dispatches a custom window event `"posterchild-sidebar-toggle"` so any component in the app tree can react to layout collapse events immediately.

---

## Technical Stack & Framework Comparison

| Dimension | Postie Prototype (Source) | PosterChild Retreat MVP (Target) | Adaptation Strategy |
|---|---|---|---|
| **Build System / Framework** | Next.js 14/15 App Router | Vite 6 + React 19 SPA | Pure client-side React. Zero Next.js imports. |
| **Routing** | `next/navigation` (`usePathname`, `useRouter`, `Link`) | `react-router-dom` (`useLocation`, `useNavigate`, `Link`) | Replace `usePathname()` with `useLocation().pathname`. Replace `router.push(path)` with `navigate(path)`. |
| **Styling Engine** | Tailwind CSS v3/v4 utility classes + CSS Modules | Vanilla CSS Design Tokens (`reference/_shared/tokens.md` & CSS variables) | Translate utility classes to PosterChild DS tokens and dedicated BEM/modular CSS. |
| **Image Handling** | `next/image` (`<Image priority ... />`) | Standard `<img>` or SVG components (`<Icon>`, `<Badge>`, etc.) | Use local SVG assets from `src/assets/posterchild/`. |
| **Icons & Assets** | Figma exported SVGs via custom `<FigmaAsset>` component | Reusable PosterChild DS components (`<Icon>`, `<FeaturedIcon>`, `<Badge>`) | Replace ad-hoc SVGs with standard design system primitives. |
| **Container Queries** | Native CSS container queries (`container-type: inline-size`) | Native CSS container queries | Retain container queries directly; fully supported in modern browsers. |

---

## Architectural Principles for Retreat Porting

1. **Retreat Remains Primary**: Do not disrupt `/present`, `/join`, Firebase Realtime Database sync, or presenter controls.
2. **Visual Fidelity Source of Truth**: The Figma Design System (`🤖 DS – 2026 (v8.0)`) and `reference/_shared/tokens.md` govern colors, typography, borders, shadows, and radii.
3. **Behavioral Source of Truth**: The Postie prototype repository governs widths, transitions, collapse logic, context attachments, and chat interaction states.
4. **Zero Framework Pollution**: Never introduce Next.js server actions, `next/image`, or Next.js routing patterns into the retreat Vite SPA.
