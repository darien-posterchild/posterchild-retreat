# PosterChild Design System Token Map

This document establishes the official token cross-reference between:
- **Code Design System**: `posterchild-prototype/design-system/tokens/`
- **Retreat Application**: `posterchild-retreat-mvp/src/styles.css`
- **Figma Design System**: `🤖 DS – 2026 (v8.0)`

Status legend:
- `MATCH`: Values are identical or functionally equivalent.
- `REVIEW`: Slight semantic or naming discrepancy requiring reconciliation.
- `MISSING`: Token defined in code DS but not yet formalized in retreat CSS variables.

---

## 1. Color Tokens

### 1.1 Brand Yellow Palette

| Prototype Token | Hex / Value | Retreat Equivalent | Status | Description |
|---|---|---|---|---|
| `primitiveColors.brand[50]` | `#FFFDF5` | `--pc-ref-canvas-bg` | **MATCH** | Warm application canvas background |
| `primitiveColors.brand[100]` | `#FFF9E8` | `--pc-ref-brand-subtle` | **MATCH** | Nav active background & subtle badge fill |
| `primitiveColors.brand[200]` | `#FFF2C7` | `--pc-ref-border-notice` | **MATCH** | Noticed card border & subtle badge stroke |
| `primitiveColors.brand[500]` | `#FFCC33` | `--pc-color-focus-ring` | **MATCH** | Interactive focus ring / highlight |
| `primitiveColors.brand[600]` | `#F4B400` | `--pc-ref-brand-solid` | **MATCH** | Primary brand action button fill |
| `primitiveColors.brand[700]` | `#D99A00` | `--pc-ref-brand-hover` | **MATCH** | Primary button hover fill |
| `primitiveColors.brand[900]` | `#8F6500` | `--pc-ref-brand-text` | **MATCH** | Nav active icon/label & headline highlight |

### 1.2 Neutral Palette

| Prototype Token | Hex / Value | Retreat Equivalent | Status | Description |
|---|---|---|---|---|
| `primitiveColors.base.white` | `#FFFFFF` | `--pc-ref-surface-card` | **MATCH** | Card & container surface |
| `primitiveColors.neutral[50]` | `#FAFAFA` | `--pc-ref-surface-table-th` | **MATCH** | Table header cell background |
| `primitiveColors.neutral[100]` | `#F5F5F5` | *Hardcoded in places* | **REVIEW** | Hover surface & divider fill |
| `primitiveColors.neutral[200]` | `#E5E5E5` | `--pc-ref-border-default` | **MATCH** | Standard card, table & panel border |
| `primitiveColors.neutral[300]` | `#D4D4D4` | `--pc-ref-border-button` | **MATCH** | Skeuomorphic button & input border |
| `primitiveColors.neutral[400]` | `#A3A3A3` | `--pc-ref-text-quaternary` | **MATCH** | Disabled icons, placeholder text |
| `primitiveColors.neutral[500]` | `#737373` | `--pc-ref-text-tertiary` | **MATCH** | Table headers, secondary details |
| `primitiveColors.neutral[600]` | `#525252` | `--pc-ref-text-secondary` | **MATCH** | Subtitles, supporting copy |
| `primitiveColors.neutral[700]` | `#404040` | `--pc-ref-text-nav` | **MATCH** | Inactive nav links, secondary button text |
| `primitiveColors.neutral[900]` | `#171717` | `--pc-ref-text-primary` | **MATCH** | Headings, card titles, primary text |
| `primitiveColors.neutral[950]` | `#0A0A0A` | *None* | **MISSING** | Dark theme root text/background |

### 1.3 Semantic Status & Utility Palettes

| Semantic Role | Prototype Token | Hex (Bg / Border / Text) | Retreat Variable | Status |
|---|---|---|---|---|
| **Success (Green)** | `utilityColors.green` | `#F0FDF4` / `#BBF7D0` / `#16A34A` (text `#15803D`) | `--pc-ref-status-green-bg`, `--pc-metric-tone-success-bg`, `--pc-metric-tone-success-fg` | **MATCH** |
| **Warning (Yellow/Orange)** | `utilityColors.yellow` / `orange` | `#FEFCE8` / `#FEF08A` / `#A16207` (or orange `#FFF7ED` / `#FED7AA` / `#EA580C`) | `--pc-ref-status-orange-bg`, `--pc-metric-tone-warning-bg`, `--pc-metric-tone-warning-fg` | **MATCH** |
| **Error (Red)** | `utilityColors.red` | `#FEF2F2` / `#FECACA` / `#B91C1C` | `--pc-ref-status-red-bg`, `--pc-ref-status-red-border`, `--pc-ref-status-red-text` | **MATCH** |
| **Info (Blue)** | `utilityColors.blue` | `#EFF6FF` / `#BFDBFE` / `#2563EB` | `--pc-ref-status-blue-bg`, `--pc-metric-tone-blue-bg`, `--pc-metric-tone-blue-fg` | **MATCH** |

---

## 2. Typography Tokens

### 2.1 Font Families

| Role | Prototype Token | Font Stack | Retreat Token | Status |
|---|---|---|---|---|
| **Display** | `fontFamily.display` | `'Fraunces', Georgia, serif` | `--pc-ref-font-display` | **MATCH** |
| **Body** | `fontFamily.body` | `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | `--pc-ref-font-body` | **MATCH** |

### 2.2 Display Scale (Fraunces)

| Size Step | Prototype Font Size | Prototype Line Height | Used in Retreat | Status |
|---|---|---|---|---|
| `sm` | `30px` | `38px` | `MetricCard` numerical value | **MATCH** |
| `md` | `36px` | `44px` | Page header ("Good morning, Jayla") | **MATCH** |
| `lg` | `48px` | `60px` | Live Session Big Results / Winner Banner | **MATCH** |
| `xl` | `60px` | `72px` | Hero marketing / Keynote title | **REVIEW** |
| `2xl` | `72px` | `90px` | Big display screens | **MISSING** |

### 2.3 Body Scale (DM Sans)

| Size Step | Prototype Font Size | Prototype Line Height | Used in Retreat | Status |
|---|---|---|---|---|
| `xs` | `12px` | `18px` | `Badge`, Table Column Header, Captions | **MATCH** |
| `sm` | `14px` | `20px` (24px in MetricCard) | `MetricCard` heading, Nav items, Table cells | **MATCH** |
| `md` | `16px` | `24px` | Page subtitles, button labels, Postie chat text | **MATCH** |
| `lg` | `18px` | `28px` | Featured card text, section intros | **REVIEW** |
| `xl` | `20px` | `30px` | Large body / lead text | **REVIEW** |

---

## 3. Spacing Tokens

| Step | Primitive | Value | CSS Variable | Status | Common Use |
|---|---|---|---|---|---|
| `none` | `Spacing/0` | `0px` | `--pc-spacing-none` | **MATCH** | Reset |
| `xxs` | `Spacing/0.5` | `2px` | `--pc-spacing-xxs` | **MATCH** | Dot ring, micro gap |
| `xs` | `Spacing/1` | `4px` | `--pc-spacing-xs` | **MATCH** | Button icon gap, badge gap |
| `sm` | `Spacing/1.5` | `6px` | `--pc-spacing-sm` | **MATCH** | Badge horizontal padding, compact gap |
| `md` | `Spacing/2` | `8px` | `--pc-spacing-md` | **MATCH** | Icon box radius, list gap |
| `lg` | `Spacing/3` | `12px` | `--pc-spacing-lg` | **MATCH** | Nav item padding, card radius |
| `xl` | `Spacing/4` | `16px` | `--pc-spacing-xl` | **MATCH** | Row gap (metrics row), Postie header padding |
| `2xl` | `Spacing/5` | `20px` | `--pc-spacing-2xl` | **MATCH** | `MetricCard` padding (20px) |
| `3xl` | `Spacing/6` | `24px` | `--pc-spacing-3xl` | **MATCH** | Section gap, container margins |
| `4xl` | `Spacing/8` | `32px` | `--pc-spacing-4xl` | **MATCH** | Large section spacing |
| `5xl` | `Spacing/10` | `40px` | `--pc-spacing-5xl` | **MATCH** | Major layout dividers |

---

## 4. Radius Tokens

| Token Name | Value | Prototype Variable | Retreat Usage | Status |
|---|---|---|---|---|
| `none` | `0px` | `--pc-radius-none` | Sharp corners | **MATCH** |
| `xs` | `4px` | `--pc-radius-xs` | Small indicators, tag inputs | **MATCH** |
| `sm` | `6px` | `--pc-radius-sm` | `Badge` (non-pill), tooltips | **MATCH** |
| `md` | `8px` | `--pc-radius-md` | `FeaturedIcon` (sm/md), `MetricCard` icon box | **MATCH** |
| `lg` | `10px` | `--pc-radius-lg` | Medium cards, dialog subcontainers | **REVIEW** |
| `xl` | `12px` | `--pc-radius-xl` | `MetricCard` (12px), `Button` (12px), Table (12px) | **MATCH** |
| `2xl` | `16px` | `--pc-radius-2xl` | Noticed card, Postie panel, dialogs | **MATCH** |
| `3xl` | `20px` | `--pc-radius-3xl` | Modal surfaces, large hero banners | **MATCH** |
| `full` | `9999px` | `--pc-radius-full` | Pill badges, radio circles, circular avatars | **MATCH** |

---

## 5. Shadow Tokens

| Token Name | Prototype Definition | Retreat Equivalent | Status |
|---|---|---|---|
| `xs` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | `--pc-ref-shadow-xs` | **MATCH** |
| `xsSkeuomorphic` | `0 1px 2px 0 rgba(0, 0, 0, 0.05), inset 0 -2px 0 0 rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(0, 0, 0, 0.18)` | `--pc-ref-shadow-skeuomorphic` | **MATCH** |
| `sm` | `0 1px 2px -1px rgba(0, 0, 0, 0.10), 0 1px 3px 0 rgba(0, 0, 0, 0.10)` | *Ad-hoc* | **REVIEW** |
| `md` | `0 2px 4px -2px rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.10)` | *Ad-hoc* | **REVIEW** |
| `lg` | `0 2px 2px -1px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.03), 0 12px 16px -4px rgba(0, 0, 0, 0.08)` | Dropdowns, menus | **REVIEW** |
| `xl` | `0 3px 3px -1.5px rgba(0, 0, 0, 0.04), 0 8px 8px -4px rgba(0, 0, 0, 0.03), 0 20px 24px -4px rgba(0, 0, 0, 0.08)` | Popover, floating Postie panel | **MATCH** |
| `focusRing` | `0 0 0 2px #FFFFFF, 0 0 0 4px #FFCC33` | Interactive focus state | **MATCH** |

---

## 6. Control Size Standards

| Control | Size Step | Height / Dimension | Padding | Icon Size |
|---|---|---|---|---|
| **Button** | `xs` | `32px` | `6px 10px` | `16px` |
| | `sm` | `36px` | `8px 12px` | `16px / 20px` |
| | `md` | `40px` | `10px 14px` | `18px / 20px` |
| | `lg` | `44px` | `10px 18px` | `20px` |
| | `xl` | `48px` | `12px 18px` | `20px` |
| **Badge** | `sm` | `22px` | `2px 6px` (or `2px 8px` pill) | `12px` (dot `6px`) |
| **Featured Icon** | `sm` | `32px × 32px` | Centered | `16px` |
| | `md` | `40px × 40px` | Centered | `20px` |
| | `lg` | `48px × 48px` | Centered | `24px` |
| | `xl` | `56px × 56px` | Centered | `28px` |
| **Input / Select** | `sm` | `36px` | `8px 12px` | `16px` |
| | `md` | `40px` | `8px 12px` | `20px` |
| | `lg` | `44px` | `10px 14px` | `20px` |
| **Metric Card** | Fixed | `236px × 102px` | `20px` (uniform) | `16px` in `32px` box |
