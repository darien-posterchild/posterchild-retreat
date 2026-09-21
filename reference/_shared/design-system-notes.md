# PosterChild Design System Notes

**Authoritative Sources:**
1. Figma Design System: `🤖 DS – 2026 (v8.0)`  
   https://www.figma.com/design/1obJOqckbRrlZ9sfeYtyns/%F0%9F%A4%96-DS-%E2%80%93-2026--v8.0-
2. Code Prototype:  
   https://posterchild-prototype.vercel.app/design-system

---

## 1. Icon Library Foundation

The icon family throughout `🤖 DS – 2026 (v8.0)` and all product screens in `🤖 PosterChild - AI` is derived from **Untitled UI Icons** (line style, 24x24 / 20x20 viewbox with standard 2px stroke and round stroke-linecap/join).

### Key Icon Rules:
- **No Replacement Icons:** Never substitute icons with Lucide, Feather, FontAwesome, or generic SVGs.
- **Stroke/Fill Integrity:** All line icons must use `fill="none"`, `stroke="currentColor"`, and `stroke-width="2"`, allowing dynamic color cascading from parent text/state styles.
- **Unified Registry:** All product components consume icons exclusively through `<PosterChildIcon name="..." />` located in `src/components/posterchild/Icon.tsx`.

---

## 2. Brand Identity & Vectors

- **Logo Full (`posterchild-logo.svg`):**
  - Dimensions: `137px x 28px`
  - Composed of the geometric 8-leaf flower mark (`#F4B400` / `#111827`) + "POSTERCHILD" logotype set in uppercase grotesque sans with balanced tracking.
- **Brand Mark (`posterchild-mark.svg`):**
  - Dimensions: `32px x 32px`
  - Used for app icon, favicon, collapsed sidebar states, and compact mobile badges.

---

## 3. Core Color Hierarchy

The PosterChild brand experience is defined by:
1. **Warm Cream Canvas (`#FFFDF5`):** Creates an inviting, human, non-sterile application backdrop that softens high-contrast screens.
2. **Elevated Crisp White Containers (`#FFFFFF`):** Sits on the cream canvas with subtle border lines (`#E5E5E5`) and micro-shadows (`rgba(16, 24, 40, 0.04)`).
3. **Warm Gold / Amber Accent (`#F4B400`):** Draws the eye to key CTAs, active navigation items, and AI Copilot moments without causing visual fatigue.
4. **Editorial Typography (`Fraunces`):** Pairs with clean interface typography (`DM Sans`) to balance warmth and software rigor.

---

## 4. Shared Component Layer

All reusable primitives live in:
`src/components/posterchild/`

- `Icon.tsx`: Centralized registry for all resolved vector icons.
- `Button.tsx`: Primary, secondary, and ghost buttons with standard Figma radii and shadows.
- `Badge.tsx`: Status and metric pills.
- `FeaturedIcon.tsx`: 40px icon badge containers.
- `NavItem.tsx`: Reusable sidebar navigation item with active state highlighting.
