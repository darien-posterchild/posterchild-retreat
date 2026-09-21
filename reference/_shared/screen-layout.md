# PosterChild Master Screen Layout System

**Authority Source:** `reference/screens/home/` (Master Screen Reference)  
**Canon:** `🤖 DS – 2026 (v8.0)` + Canonical SaaS Desktop Layout

---

## 1. Master Layout Hierarchy & Geometry

PosterChild desktop screens follow a unified 3-region SaaS architecture:
- **Left Rail (Sidebar):** `280px` expanded (`304px` total with `24px` outer left padding) / `64px` collapsed (`88px` total with `24px` outer left padding). Sticky to viewport.
- **Right Rail (Postie):** `360px` docked (`384px` total with `24px` outer right margin) / `0px` layout flow when collapsed or floating. Sticky to viewport.
- **Center Workspace:** Fluid width spanning 100% of available viewport between rails (`min-width: 0`).
- **Product Content Container:** Centered inside the workspace (`margin-inline: auto`), capped at `max-width: 1040px`.

---

## 2. Master Page Rhythm & Spacing Tokens

Every screen inherits these default rhythm rules:

| Spacing Type | Value | Token / CSS | Usage |
| :--- | :--- | :--- | :--- |
| **Page Block Rhythm** | `24px` | `--page-section-gap: 24px` | Vertical spacing between major page sections/containers |
| **Section Content Gap** | `12px` | `--section-content-gap: 12px` | Spacing between a section title row and its child card/table |
| **Page Padding (Block)** | `24px` top, `40px` bottom | `--page-padding-block: 24px 40px` | Outer vertical padding of the product workspace |
| **Page Padding (Inline)** | `24px` | `--app-edge-padding: 24px` | Horizontal gutter around center content workspace |
| **Card / Grid Gap** | `24px` | `--card-grid-gap: 24px` | Gap between metric cards and multi-column card grids |
| **Micro Row / Item Gap**| `8px` – `12px` | `--item-gap: 8px` | Inner gap between list items, chips, or badge rows |

---

## 3. Section Header Structure

Every product section follows this standard header composition:
```html
<div class="pc-product-section__header">
  <div class="pc-product-section__title-group">
    <h2 class="pc-product-section__title">Section Title</h2>
    <p class="pc-product-section__subtitle">Optional supporting subtitle or metadata</p>
  </div>
  <div class="pc-product-section__actions">
    <!-- Optional "View all ->" or utility actions -->
  </div>
</div>
```

- **Title Typography:** `DM Sans`, 16px / 24px, font-weight 600, color `#171717`.
- **Subtitle Typography:** `DM Sans`, 14px / 20px, font-weight 400, color `#525252`.
- **Action Link:** `DM Sans`, 14px / 20px, font-weight 600, color `#8F6500` (Brand Dark) or `#171717`.

---

## 4. Master Table Rhythm

All product tables adhere to the Home Attention Table rhythm:
- **Header Row:** Height `40px`, background `#FAFAFA`, border-bottom `1px solid #E5E5E5`, padding `8px 12px`.
- **Body Row:** Height `64px`, background `#FFFFFF`, border-bottom `1px solid #E5E5E5`, padding `12px`.
- **Table Outer Shell:** `background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 12px; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);`.
- **Row Content:** Primary text (`14px / 20px`, weight 500, `#171717`) over supporting text (`12px-14px / 18px-20px`, weight 400, `#525252` or `#737373`).

---

## 5. Screen Inheritance Rule

> **RULE:** Every new screen in the PosterChild application inherits the Home master rhythm unless its own Figma reference explicitly overrides it. A screen-specific Figma value always takes precedence over the master default.
