# PosterChild Master Surface & Elevation Tokens

**Source Authorities:** `reference/screens/home/` (Master Screen Reference) & `🤖 DS – 2026 (v8.0)`

---

## 1. Surface Types & Containers

| Surface Role | Background | Border | Radius | Shadow | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Canvas / App Viewport** | `#FFFDF5` / `#ececeb` | None | `0px` | None | Global viewport background |
| **Standard Card** | `#FFFFFF` | `1px solid #E5E5E5` | `12px` | `0px 1px 2px rgba(0,0,0,0.05)` | Metric cards, suggested stories, manage cards |
| **Table Container** | `#FFFFFF` | `1px solid #E5E5E5` | `12px` | `0px 1px 2px rgba(0,0,0,0.05)` | Attention table, data tables |
| **Insight / Banner Surface**| Luxury Gold Gradient (`#FFFDF5` → `#FEF0C7`) | `1px solid #FDE68A` | `12px` | `0px 1px 2px rgba(0,0,0,0.05)` | PosterChild Noticed AI insight card |
| **Shell Rails (Sidebar/Postie)**| `#FFFFFF` | `1px solid #E5E5E5` | `16px` | `0px 4px 20px -2px rgba(0,0,0,0.06)` | Navigation sidebar card, docked Postie panel |
| **Floating Overlay** | `#FFFFFF` | `1px solid #E5E5E5` | `16px` | `0px 10px 25px -5px rgba(0,0,0,0.1)` | Floating Postie panel |
| **Table Header Row** | `#FAFAFA` | `1px solid #E5E5E5` (bottom)| `0px` (top clipped) | None | Data table column header strip |
| **Badge / Tag Pill** | Variant-specific (e.g. `#FEF2F2`, `#F0FDF4`) | `1px solid` variant | `6px` | None | Status pills, category tags |
| **Featured Icon Container** | Tone-specific (e.g. `#F0FDF4`, `#EFF6FF`) | `1px solid` tone | `10px` / `12px` | None | Table row icons, category icons |

---

## 2. Elevation & Shadow Scale

```css
/* Design System Shadows */
--shadow-xs: 0px 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);
--shadow-md: 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-rail: 0px 4px 20px -2px rgba(0, 0, 0, 0.06);
--shadow-floating: 0px 10px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.05);
```
