# PosterChild Design System Tokens & Component Specifications

**Source Authorities:**
- Figma File: `🤖 DS – 2026 (v8.0)`
- Screen Spec: `reference/home/layout-spec.txt` (Node `493:5128`)
- Live Prototype: `https://posterchild-prototype.vercel.app/design-system`

---

## 1. Typography

### Display / Editorial Font: `Fraunces`
Used for display headers, retreat titles, hero banners, and primary metric numbers.

| Token / Role | Size | Line Height | Weight | Letter Spacing | CSS Equivalent |
|---|---|---|---|---|---|
| `display-2xl` | 72px | 90px | 700 (Bold) | -0.02em | `font-family: 'Fraunces', serif; font-size: 72px; line-height: 1.25; font-weight: 700;` |
| `display-xl` | 60px | 72px | 700 (Bold) | -0.02em | `font-family: 'Fraunces', serif; font-size: 60px; line-height: 1.2; font-weight: 700;` |
| `display-lg` | 48px | 60px | 600 (SemiBold) | -0.02em | `font-family: 'Fraunces', serif; font-size: 48px; line-height: 1.25; font-weight: 600;` |
| `display-md` | 36px | 44px | 600 (SemiBold) | -0.02em | `font-family: 'Fraunces', serif; font-size: 36px; line-height: 1.22; font-weight: 600;` |
| `display-sm` (Home Header) | 30px | 38px | 600 (SemiBold) | -0.015em | `font-family: 'Fraunces', serif; font-size: 30px; line-height: 1.26; font-weight: 600;` |
| `display-xs` (Metric Values) | 24px | 32px | 600 (SemiBold) | -0.01em | `font-family: 'Fraunces', serif; font-size: 24px; line-height: 1.33; font-weight: 600;` |

### Interface Font: `DM Sans`
Used for body text, navigation items, buttons, form inputs, badges, and metadata.

| Token / Role | Size | Line Height | Weight | CSS Equivalent |
|---|---|---|---|---|
| `text-xl` | 20px | 30px | 500 / 600 | `font-family: 'DM Sans', sans-serif; font-size: 20px; font-weight: 500;` |
| `text-lg` | 18px | 28px | 400 / 500 | `font-family: 'DM Sans', sans-serif; font-size: 18px; font-weight: 400;` |
| `text-md` (Body Base) | 16px | 24px | 400 / 500 | `font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 400;` |
| `text-sm` (Nav, Buttons) | 14px | 20px | 500 / 600 | `font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;` |
| `text-xs` (Badges, Meta) | 12px | 18px | 500 / 600 | `font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;` |
| `text-xxs` (Micro) | 11px | 16px | 500 / 600 | `font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500;` |

---

## 2. Color Palette

### Brand Colors (Amber / Gold Accent)
| Token Name | Hex Code | Role / Usage |
|---|---|---|
| `--color-brand-primary` | `#F4B400` | Primary action button, hero highlight, active accent |
| `--color-brand-hover` | `#E0A300` | Hover state for primary buttons |
| `--color-brand-active` | `#C89200` | Active/pressed state for primary buttons |
| `--color-brand-tint` | `#FFF9E8` | Nav item active bg, featured icon container, highlight chip |
| `--color-brand-tint-hover`| `#FFF3D0` | Hover state on tinted items |
| `--color-brand-border` | `#FDE68A` | Border for amber-tinted badge or featured icon container |
| `--color-brand-dark` | `#8F6500` | Nav active label, featured icon stroke, dark amber text |

### Neutral / Surface Colors
| Token Name | Hex Code | Role / Usage |
|---|---|---|
| `--color-surface-page` | `#FFFDF5` | Application background (warm off-white cream) |
| `--color-surface-card` | `#FFFFFF` | Elevated cards, tables, modals, Postie panel |
| `--color-surface-hover` | `#F9FAFB` | Card/table row hover state |
| `--color-border-subtle` | `#E5E5E5` | Structural layout dividers, card borders |
| `--color-border-medium` | `#D1D5DB` | Input borders, secondary button borders |
| `--color-text-primary` | `#111827` | Headings, titles, high-contrast text |
| `--color-text-secondary` | `#4B5563` | Subheadings, navigation labels, body text |
| `--color-text-muted` | `#6B7280` | Metadata, timestamps, placeholders |
| `--color-text-dim` | `#9CA3AF` | Inactive icons, subtle chevrons |

### Feedback / Status Colors
| Status | Background | Border | Text | Icon |
|---|---|---|---|---|
| Success (e.g. +12% Badge) | `#ECFDF5` | `#A7F3D0` | `#047857` | `#059669` |
| Warning (Grant Alert) | `#FEF3C7` | `#FDE68A` | `#92400E` | `#D97706` |
| Error / Critical | `#FEF2F2` | `#FECACA` | `#B91C1C` | `#DC2626` |
| Information / Info | `#EFF6FF` | `#BFDBFE` | `#1D4ED8` | `#2563EB` |

---

## 3. Radii & Spacing

### Border Radius
- `radius-xs`: `4px` (micro chips)
- `radius-sm`: `6px` (tooltips, small badges)
- `radius-md`: `8px` (nav items, table action buttons)
- `radius-lg`: `12px` (primary action buttons, input fields)
- `radius-xl`: `16px` (action cards, table containers, popovers)
- `radius-full`: `9999px` (metric pills, circular avatars)

### Spacing Scale
- `space-1`: `4px`
- `space-2`: `8px`
- `space-3`: `12px`
- `space-4`: `16px`
- `space-5`: `20px`
- `space-6`: `24px`
- `space-8`: `32px`
- `space-10`: `40px`
- `space-12`: `48px`

---

## 4. Shadows & Elevation

```css
/* Card & Container Elevation */
--shadow-xs: 0px 1px 2px rgba(16, 24, 40, 0.05);
--shadow-sm: 0px 1px 3px rgba(16, 24, 40, 0.04), 0px 1px 2px rgba(16, 24, 40, 0.02);
--shadow-md: 0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08);
--shadow-lg: 0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08);
```

---

## 5. Standard Component Specifications

### Primary Action Button (`Button variant="primary"`)
- **Height:** `40px`
- **Padding:** `10px 16px`
- **Border Radius:** `12px` (`radius-lg`)
- **Background:** `#F4B400`
- **Text:** `DM Sans` 14px, weight 600, color `#111827`
- **Icon:** 20x20 stroke icon with 8px gap
- **Shadow:** `var(--shadow-xs)`
- **Hover:** Background `#E0A300`

### Secondary Action Button (`Button variant="secondary"`)
- **Height:** `36px` / `40px`
- **Padding:** `8px 14px`
- **Border Radius:** `8px` / `12px`
- **Background:** `#FFFFFF`
- **Border:** `1px solid #D1D5DB`
- **Text:** `DM Sans` 14px, weight 500, color `#374151`
- **Hover:** Background `#F9FAFB`

### Featured Icon Container (`FeaturedIcon`)
- **Dimensions:** `40px x 40px` (standard `md`), `32px x 32px` (compact `sm`)
- **Border Radius:** `10px` (or `8px` for compact)
- **Border:** `1px solid` matching palette
- **Variants:**
  - `brand`: background `#FFF9E8`, border `#FDE68A`, icon `#8F6500`
  - `success`: background `#F0FDF4`, border `#BBF7D0`, icon `#16A34A`
  - `info`: background `#EFF6FF`, border `#BFDBFE`, icon `#2563EB`
  - `warning`: background `#FFF7ED`, border `#FED7AA`, icon `#EA580C`
- **Icon Size:** `20px x 20px` (16px in compact)

### Status & Priority Badge (`Badge`)
- **Height:** `22px`
- **Padding:** `2px 6px`
- **Border Radius:** `6px` (`radius-sm`, from DS spec lines 4487, 4580, 4673)
- **Gap:** `4px`
- **Dot Size:** `6px x 6px` circular (`border-radius: 50%`)
- **Typography:** `DM Sans` 12px, line-height 18px (150%), weight 500
- **Variants:**
  - `immediate`: background `#FEF2F2`, border `#FECACA`, text `#B91C1C`, dot `#EF4444`
  - `upcoming`: background `#FEFCE8`, border `#FEF08A`, text `#A16207`, dot `#EAB308`
  - `ready`: background `#F0FDF4`, border `#BBF7D0`, text `#15803D`, dot `#22C55E`
  - `brand` (Team Choice): background `#FFF9E8`, border `#FDE68A`, text `#8F6500`, dot `#F4B400`
  - `neutral` / `gray`: background `#F9FAFB`, border `#E5E7EB`, text `#374151`, dot `#9CA3AF`

### Attention Table Architecture
- **Total Width:** `740px`
- **Header Height:** `40px` (`background: #FAFAFA; border-bottom: 1px solid #E5E5E5;`)
- **Row Height:** `64px` (`background: #FFFFFF; border-bottom: 1px solid #E5E5E5;`)
- **Column Geometry:**
  - `Item`: `224px` (padding: `12px`)
  - `Priority`: `110px` (padding: `12px`)
  - `What you should know`: `406px` (padding: `8px 16px 8px 12px`)
- **Team Choice Winning State:**
  - `border-left: 3px solid #F4B400`
  - `background: #FFFDF2`
  - Row height strictly preserved at `64px` with zero vertical distortion
