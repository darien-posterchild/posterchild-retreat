# Implementation Notes: Home Screen

**Source Reference:** `Home — QA Exploration 05 / Reference-driven`  
**Figma Node ID:** `493:5128`  
**Export Specification:** `reference/home/layout-spec.txt`  
**Design System:** `🤖 DS – 2026 (v8.0)`

---

## 1. Shell Layout Architecture (1440px Desktop)

The desktop frame is a 3-column application shell:

```
+----------------------------------------------------------------------------------------------------+
|                                       Desktop Viewport (1440px)                                    |
+-------------------+---------------------------------------------------------+----------------------+
| Left Sidebar      | Main Workspace (Fluid Center)                           | Postie AI Panel      |
| Width: 240px      | Flex: 1                                                 | Width: 360px         |
| Background:       | Background: #FFFDF5                                     | Background: #FFFFFF  |
| #FFFDF5           | Padding: 32px 32px                                      | Border-Left: 1px     |
| Border-Right: 1px | Gap: 32px                                               | #E5E5E5              |
| #E5E5E5           |                                                         |                      |
+-------------------+---------------------------------------------------------+----------------------+
```

---

## 2. Component Breakdown & CSS Specifications

### A. Left Navigation Sidebar
- **Dimensions:** Width `240px`, height `100vh`, flex column, `padding: 24px 16px 24px 16px`.
- **Background & Border:** `background: #FFFDF5`, `border-right: 1px solid #E5E5E5`.
- **Brand Logo:** `137px x 28px` full logo (`posterchild-logo.svg`) or `32px x 32px` mark (`posterchild-mark.svg`).
- **Navigation Items (`NavItem`):**
  - Height: `40px`
  - Padding: `8px 12px`
  - Border radius: `8px`
  - Font: `DM Sans`, 14px, weight 500
  - Default: Color `#4B5563`, background transparent, hover `#F3F4F6`
  - Active: Color `#8F6500`, background `#FFF9E8`, font weight 600
  - Icon: 20x20 stroke icon (`home-line`, `announcement-02`, `coins-hand`, `folder`)
- **Footer Utilities:**
  - Support (`life-buoy-01`) & Settings (`settings-01`).
- **Account Section:**
  - Border-top: `1px solid #E5E5E5`, padding-top: `16px`.
  - Avatar: 40x40 rounded rectangle (`border-radius: 8px`).
  - Text: Name (14px semi-bold `#111827`), email (12px regular `#6B7280`).
  - Selector: `chevron-selector-vertical` (20x20 `#9CA3AF`).

### B. Main Workspace Header & Actions
- **Page Header:**
  - Title: `Fraunces`, 28px–32px, weight 600, color `#111827`, letter-spacing `-0.02em`.
  - Subtitle / Greeting: "Good morning, Olivia", `DM Sans`, 14px, `#4B5563`.
  - Primary Action Button:
    - Height: `40px`
    - Padding: `10px 16px`
    - Radius: `12px`
    - Background: `#F4B400`
    - Text: `DM Sans`, 14px, weight 600, color `#111827`
    - Shadow: `0px 1px 2px rgba(16, 24, 40, 0.05)`
    - Icon: `plus` (20x20).

### C. Needs Attention Table (`AttentionTable`)
- **Container:**
  - Background: `#FFFFFF`, border: `1px solid #E5E5E5`, radius: `16px`, shadow: `0px 1px 3px rgba(16, 24, 40, 0.04)`.
  - Table Header: 12px uppercase, weight 600, color `#6B7280`, letter-spacing `0.05em`.
- **Table Rows:**
  - Height: `72px`, border-bottom: `1px solid #F3F4F6`.
  - Featured Icons: 40x40 circle / rounded rect, background `#FFF9E8`, border `1px solid #FDE68A`, icon color `#8F6500`.
  - Actions: Secondary buttons (height 36px, radius 8px, border `1px solid #D1D5DB`, background `#FFFFFF`).

### D. Metric Action Cards (`ActionCard`)
- **Layout:** 3-column grid (`grid-template-columns: repeat(3, 1fr)`), gap `20px`.
- **Card Styling:**
  - Background: `#FFFFFF`, border: `1px solid #E5E5E5`, radius: `16px`, padding: `20px 24px`.
  - Value: `Fraunces`, 28px, weight 600, color `#111827`.
  - Badge: Pill (`border-radius: 9999px`), background `#ECFDF5`, text `#047857`, font size 12px, weight 600, with `arrow-up` (12x12).
  - Footer Link: Text 13px, weight 600, color `#8F6500`, with `arrow-right` (16x16).

### E. Postie AI Copilot Panel (`PostiePanel`)
- **Dimensions:** Width `360px`, height `100vh`, flex column, background `#FFFFFF`, border-left `1px solid #E5E5E5`.
- **Header:**
  - Icon badge: `stars-01` in `#FFF9E8` pill.
  - Title: "Postie AI", 16px semi-bold.
  - Window toggle: `window-position-sidebar` (layout-left icon).
- **Prompt Bar:**
  - Border: `1px solid #D1D5DB`, radius: `12px`, padding: `10px 14px`.
  - Voice icon: `microphone-01` (20x20 `#6B7280`).
  - Submit arrow: `arrow-up` (20x20 in circular yellow button).

---

## 3. Asset Mapping Summary
All 20 UI icons are mapped to local SVG files in `src/assets/posterchild/icons/` with standard 20x20 / 24x24 bounding boxes, stroked with `currentColor` so they adapt seamlessly to themes and hover states.
