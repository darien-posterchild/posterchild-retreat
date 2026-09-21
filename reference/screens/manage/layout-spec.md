# Manage Overview — Layout & Token Specification

This document details the visual hierarchy, exact dimensional values, and design token mappings extracted directly from the Figma export (`Node 512:6840`).

---

## 1. Semantic DOM Hierarchy

```text
APP SHELL (.app-shell)
├── LEFT SIDEBAR (.sidebar-navigation)
│   └── INNER CONTAINER (.sidebar-content)
│       ├── BRAND HEADER (.brand-logo-container)
│       ├── NAV GROUPS (.nav-groups)
│       └── USER PROFILE TILE (.sidebar-footer)
│
├── CENTER WORKSPACE (.manage-workspace)
│   ├── MANAGE HEADER (.manage-header)
│   │   ├── TITLE GROUP (.manage-header-titles)
│   │   │   ├── Title (.manage-title): "Your organization, all in one place."
│   │   │   └── Description (.manage-description): "Everything PosterChild knows..."
│   │   └── PRIMARY ACTION (.manage-header-action)
│   │       └── Button Secondary: "+ Add to organization"
│   │
│   └── MANAGE CATEGORY GRID (.manage-grid)
│       ├── ROW 1
│       │   ├── Card 1: Knowledge (.manage-card[data-category="knowledge"])
│       │   ├── Card 2: Assets (.manage-card[data-category="assets"])
│       │   └── Card 3: Organization (.manage-card[data-category="organization"])
│       └── ROW 2
│           ├── Card 4: People (.manage-card[data-category="people"])
│           ├── Card 5: Connections (.manage-card[data-category="connections"])
│           └── Card 6: Admin (.manage-card[data-category="admin"])
│
└── RIGHT POSTIE PANEL (.postie-panel)
    └── INNER PANEL (.postie-panel-inner)
```

### Card Internal Semantic Structure
Each Manage card adheres to a unified composite layout:
1. **Top Header Block**:
   - `FeaturedIcon` container (44×44px with custom tonal background and 1px matching border).
   - Trailing chevron / navigation indicator (`arrow-right` 20px).
   - Title (`DM Sans` 18px / 24px Bold 600, color `#171717`).
   - Supporting Description (`DM Sans` 13px / 18px Regular 400, color `#525252`).
2. **Inventory Rows Block**:
   - Separator line (`1px solid #F5F5F5`).
   - Key-value inventory rows (Label: `#737373` 13px; Value: `#171717` 13px Medium 500; Status: `#16A34A` 13px SemiBold 600).
3. **Card Footer Action**:
   - Separator line (`1px solid #F5F5F5`).
   - Action label (e.g. "View knowledge") in Brand text color (`#8F6500`, 13px SemiBold 600) + trailing `arrow-right` icon (14px).

---

## 2. Exact Layout & Geometric Values

### 2.1 Page & Canvas
- **Background**: `#FFFDF5` (`--brand-50` / `--pc-ref-canvas-bg`)
- **Max Width**: `1440px`
- **Min Height**: `1024px` (stretches to `100vh`)
- **Layout Model**: Flexbox row (`align-items: stretch`)

### 2.2 Left Sidebar
- **Total Slot Width**: `280px`
- **Padding**: `20px 0px 20px 20px`
- **Inner Content Width**: `260px`
- **Inner Background**: `#FFFFFF` (`--neutral-white`)
- **Border**: `1px solid #E5E5E5` (`--neutral-200`)
- **Border Radius**: `16px` (`--radius-xl`)
- **Box Shadow**: `0px 1px 3px rgba(16, 24, 40, 0.1)` (`--shadow-sm`)

### 2.3 Center Manage Workspace
- **Padding**: `32px 32px 40px 32px` (`--space-8` top/horizontal, 40px bottom)
- **Flex Grow**: `1 1 0%` (expands to fill available center space)
- **Overflow**: `overflow-y: auto`

### 2.4 Manage Header
- **Margin Bottom**: `28px`
- **Layout**: Flexbox row, `justify-content: space-between`, `align-items: flex-start`
- **Title Typography**: `Fraunces` SemiBold 600, `36px` font size, `44px` line height, tracking `-0.02em`, color `#171717`
- **Description Typography**: `DM Sans` Regular 400, `16px` font size, `24px` line height, color `#525252`, max width `640px`
- **Action Button**: Secondary button (`height: 40px`, padding `10px 16px`, radius `12px`, border `1px solid #D4D4D4`, icon leading `16px`)

### 2.5 Manage Grid
- **Columns**: `repeat(3, minmax(0, 1fr))` (3 equal fluid columns)
- **Rows**: `2` (auto rows with equal stretch height)
- **Grid Gap**: `24px` (`--space-6`)

### 2.6 Manage Category Card
- **Min Height**: `340px`
- **Padding**: `24px` (`--space-6`)
- **Background**: `#FFFFFF` (`--neutral-white`)
- **Border**: `1px solid #E5E5E5` (`--neutral-200`)
- **Border Radius**: `16px` (`--radius-xl`)
- **Box Shadow (Rest)**: `0px 1px 3px rgba(16, 24, 40, 0.06)`
- **Box Shadow (Hover)**: `0px 4px 8px -2px rgba(16, 24, 40, 0.1)`, border color shifts to `#D4D4D4`
- **Internal Gap (Top block)**: `16px`

### 2.7 Featured Icon Container
- **Dimensions**: `44px × 44px`
- **Border Radius**: `10px`
- **Icon Size**: `20px × 20px` (stroke `1.67px` or `2px`)
- **Category Specific Tones**:
  - **Knowledge**: Fill `#FFF9E8`, Border `1px solid #FFF2C7`, Icon `#8F6500`
  - **Assets**: Fill `#F0FDF4`, Border `1px solid #BBF7D0`, Icon `#16A34A`
  - **Organization**: Fill `#FAF5FF`, Border `1px solid #E9D5FF`, Icon `#9333EA`
  - **People**: Fill `#EFF6FF`, Border `1px solid #BFDBFE`, Icon `#2563EB`
  - **Connections**: Fill `#FDF2F8`, Border `1px solid #FBCFE8`, Icon `#DB2777`
  - **Admin**: Fill `#F5F5F5`, Border `1px solid #E5E5E5`, Icon `#525252`

### 2.8 Inventory Rows
- **Divider**: `1px solid #F5F5F5` (`padding-top: 14px; margin-top: 16px;`)
- **Row Height**: `24px` (gap `8px` between rows)
- **Label**: `DM Sans` Regular 400, `13px`, line height `18px`, color `#737373`
- **Value**: `DM Sans` Medium 500, `13px`, line height `18px`, color `#171717`
- **Connected Status**: `DM Sans` SemiBold 600, `13px`, color `#16A34A`

### 2.9 Card Footer CTA
- **Divider**: `1px solid #F5F5F5` (`padding-top: 14px; margin-top: 16px;`)
- **Typography**: `DM Sans` SemiBold 600, `13px`, line height `18px`, color `#8F6500`
- **Trailing Icon**: `arrow-right`, `14px × 14px`, color `#8F6500`

### 2.10 Right Postie Panel
- **Total Slot Width**: `380px`
- **Padding**: `20px 20px 20px 0px`
- **Inner Border**: `1px solid #E5E5E5`
- **Inner Radius**: `16px`
- **Inner Background**: `#FFFFFF`

---

## 3. Source Tokens vs. Design System Token Map

| Source Token | Raw Value | DS Equivalent Token | Category | Status | Notes |
|---|---|---|---|---|---|
| `--brand-50` | `#FFFDF5` | `--pc-ref-canvas-bg` | Color | **MATCH** | Identical canvas background |
| `--brand-100` | `#FFF9E8` | `--pc-ref-brand-subtle` | Color | **MATCH** | Knowledge card icon fill |
| `--brand-200` | `#FFF2C7` | `--pc-ref-border-notice` | Color | **MATCH** | Knowledge card icon border |
| `--brand-900` | `#8F6500` | `--pc-ref-brand-text` | Color | **MATCH** | Card footer CTA & highlight text |
| `--neutral-white` | `#FFFFFF` | `--pc-ref-surface-card` | Color | **MATCH** | Card surface background |
| `--neutral-100` | `#F5F5F5` | Hardcoded / `--pc-surface-hover` | Color | **REVIEW** | Inventory row divider |
| `--neutral-200` | `#E5E5E5` | `--pc-ref-border-default` | Color | **MATCH** | Card & sidebar borders |
| `--neutral-300` | `#D4D4D4` | `--pc-ref-border-button` | Color | **MATCH** | Card hover border & button borders |
| `--neutral-500` | `#737373` | `--pc-ref-text-tertiary` | Color | **MATCH** | Inventory row labels |
| `--neutral-600` | `#525252` | `--pc-ref-text-secondary` | Color | **MATCH** | Card & header descriptions |
| `--neutral-900` | `#171717` | `--pc-ref-text-primary` | Color | **MATCH** | Headings, titles, values |
| `--utility-green-bg` | `#F0FDF4` | `--pc-ref-status-green-bg` | Color | **MATCH** | Assets card icon fill |
| `--utility-green-border`| `#BBF7D0` | `--pc-ref-status-green-border` | Color | **MATCH** | Assets card icon border |
| `--utility-green-text` | `#16A34A` | `--pc-ref-status-green-text` | Color | **MATCH** | Connections "Connected" badge |
| `--utility-blue-bg` | `#EFF6FF` | `--pc-ref-status-blue-bg` | Color | **MATCH** | People card icon fill |
| `--utility-purple-bg` | `#FAF5FF` | *Screen-specific tone* | Color | **DS EQUIVALENT** | Map to DS purple tone (`--pc-tone-purple-bg`) |
| `--utility-pink-bg` | `#FDF2F8` | *Screen-specific tone* | Color | **DS EQUIVALENT** | Map to DS pink tone (`--pc-tone-pink-bg`) |
| `--font-display` | `'Fraunces', serif` | `--pc-ref-font-display` | Typography | **MATCH** | Display font |
| `--font-body` | `'DM Sans', sans-serif` | `--pc-ref-font-body` | Typography | **MATCH** | Body font |
| `--space-6` | `24px` | `--pc-spacing-3xl` | Spacing | **MATCH** | Manage grid gap & card padding |
| `--space-8` | `32px` | `--pc-spacing-4xl` | Spacing | **MATCH** | Workspace padding |
| `--radius-xl` | `16px` | `--pc-radius-2xl` / 16px | Radii | **MATCH** | Card & sidebar radius |
