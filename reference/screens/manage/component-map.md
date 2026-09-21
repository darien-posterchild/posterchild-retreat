# Manage Overview — Component Mapping Specification

This document maps all Figma elements and semantic sections of the **Manage Overview** screen to the authoritative PosterChild Design System components.

---

## 1. Screen Component Mapping

| Figma Element | Source HTML Class | Existing DS Component | Status | Implementation / Migration Action |
|---|---|---|---|---|
| **App Shell** | `.app-shell` | `src/pages/Present.tsx` layout shell | **REUSE** | App shell already handles three-column layout (Sidebar + Main + Postie). |
| **Left Sidebar** | `.sidebar-navigation`, `.sidebar-content` | `src/components/Sidebar.tsx` + `NavItem.tsx` | **REUSE** | Reusable navigation sidebar with active state for Manage route (`/present/:sessionId/manage`). |
| **Page Header & Wrapper** | `.manage-header`, `.manage-title`, `.manage-description` | `src/components/posterchild/ProductPage.tsx` | **REUSE** | `ProductPage` renders Fraunces display title, DM Sans subtitle, and primary action slot. |
| **Header Primary Action** | `.btn-secondary` | `src/components/posterchild/Button.tsx` | **REUSE** | `<Button variant="secondary" size="md" iconLeading="plus">Add to organization</Button>`. |
| **Manage Category Grid** | `.manage-grid` | CSS grid utility (`.pc-product-grid-3` / `.manage-grid`) | **REUSE** | Standard 3-column responsive auto-fit grid. |
| **Category Card Container** | `.manage-card` | `ManageCategoryCard` (see Section 2) | **MISSING (Composite)** | Composite category card patterned after DS Card with 16px radius, hover states, and inventory rows. |
| **Featured Icon** | `.featured-icon-container` | `src/components/posterchild/FeaturedIcon.tsx` | **ADAPT** | Adapt `FeaturedIcon` to support custom tonal fills/borders (`knowledge`, `assets`, `organization`, `people`, `connections`, `admin`). |
| **Card Top Chevron** | `.card-chevron-icon` | `src/components/posterchild/Icon.tsx` (`name="arrow-right"`) | **REUSE** | `<PosterChildIcon name="arrow-right" size={20} />`. |
| **Inventory Status Indicator** | `.inventory-value.connected` | `src/components/posterchild/Badge.tsx` or colored value | **ADAPT** | Render green text (`#16A34A`) or DS Badge (`variant="success"`) for connected integration states. |
| **Card Footer CTA** | `.manage-card-footer`, `.manage-card-cta` | `src/components/posterchild/Button.tsx` (tertiary) or custom link | **ADAPT** | Render link styled as DS tertiary button with `arrow-right` trailing icon (14px). |
| **Right Postie Panel** | `.postie-panel` | `src/components/PostiePanel.tsx` | **REUSE** | Docked / floating Postie panel managed via `PostieProvider`. |

---

## 2. Repeated Card Pattern: `ManageCategoryCard`

### 2.1 Audit in Upstream Prototypes
An audit of `posterchild-prototype/components/ui/` and `postie/` reveals:
- **Result**: No standalone `<ManageCategoryCard />` exists in the core `@posterchild/ui` primitive package.
- **Classification**: **MISSING (Composite Pattern)**.
- **Strategy**: Define a clean, high-fidelity composite component in `src/components/posterchild/ManageCategoryCard.tsx` (or compose directly using DS primitives `FeaturedIcon`, `Badge`, `Button`, `Icon`).

### 2.2 Conceptual Component API

```tsx
export interface ManageInventoryItem {
  label: string;
  value: string | number;
  status?: 'default' | 'connected' | 'warning';
}

export type ManageCardTone = 
  | 'brand'        // Knowledge (Yellow #FFF9E8)
  | 'success'      // Assets (Green #F0FDF4)
  | 'purple'       // Organization (Purple #FAF5FF)
  | 'blue'         // People (Blue #EFF6FF)
  | 'pink'         // Connections (Pink #FDF2F8)
  | 'gray';        // Admin (Gray #F5F5F5)

export interface ManageCategoryCardProps {
  id: string;
  title: string;
  description: string;
  icon: PosterChildIconName;
  tone: ManageCardTone;
  badgeLabel?: string;
  items: ManageInventoryItem[];
  actionLabel: string;
  onAction?: () => void;
  onClick?: () => void;
}
```

### 2.3 Visual States
1. **Rest**:
   - Surface: `#FFFFFF`, Border: `1px solid #E5E5E5`, Radius: `16px`, Shadow: `--shadow-sm`.
2. **Hover**:
   - Border: `1px solid #D4D4D4`, Shadow: `--shadow-md`, chevron translates `+2px` on X-axis.
3. **Interactive Click Target**:
   - Clicking either the card body or the footer CTA navigates to sub-route (e.g. `/present/:sessionId/manage/assets`).
