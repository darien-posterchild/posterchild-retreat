# PosterChild Home Screen Layout Specification

**Figma Reference:** `Home — QA Exploration 05 / Reference-driven` (Node ID: `493:5128`)  
**Canonical Desktop Frame:** `1728 x 1117`  
**Master Screen Hierarchy:** Authoritative reference for page rhythm, card geometry, and table proportions.

---

## 1. Dimensional Blueprint

```
+----------------------------------------------------------------------------------------------------+
| VIEWPORT: 100% width, min-height: 100dvh                                                           |
|                                                                                                    |
| +-----------+  +-------------------------------------------------------------------+  +----------+ |
| | SIDEBAR   |  | CENTER WORKSPACE: Fluid width, padding: 24px 24px 40px 24px       |  | POSTIE   | |
| |           |  |                                                                   |  |          | |
| | Expanded: |  | +---------------------------------------------------------------+ |  | Docked:  | |
| | 280px     |  | | HOME CONTENT CONTAINER: max-width: 1040px, margin: 0 auto      | |  | 360px    | |
| | card      |  | |                                                               | |  | panel   | |
| |           |  | | 1. Header (70px): "Good morning, Jayla" + "+ Create story"   | |  |          | |
| | Collapsed:|  | |    Gap: 24px                                                  | |  | Radius:  | |
| | 64px card |  | | 2. 3x Metric Cards (102px): Stories | Campaigns | Quotes      | |  | 16px     | |
| |           |  | |    Gap: 24px                                                  | |  |          | |
| | Radius:   |  | | 3. PosterChild Noticed AI Insight Card                        | |  | Sticky   | |
| | 16px      |  | |    Gap: 24px                                                  | |  | to view  | |
| |           |  | | 4. Needs Your Attention Table (Header 40px + 3x 64px rows)    | |  |          | |
| | Sticky    |  | |    Gap: 24px                                                  | |  |          | |
| | to view   |  | | 5. Suggested For You Story Card (250x224 img + metadata)     | |  |          | |
| |           |  | +---------------------------------------------------------------+ |  |          | |
| +-----------+  +-------------------------------------------------------------------+  +----------+ |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Section Breakdown & Spacing Hierarchy

### Section 1: Header Row
- **Height:** `70px`
- **Title:** `Fraunces SemiBold 36px / 44px`, letter-spacing `-0.02em`, color `#171717`.
- **Subtitle:** `DM Sans Regular 16px / 24px`, color `#525252`, gap `2px` below title.
- **Action:** Primary Button, `40px` height, `10px 14px` padding, `#F4B400` background, `DM Sans SemiBold 14px / 20px`, `12px` radius.

### Section 2: Metrics Row (Fill Container)
- **Grid Template:** `repeat(3, minmax(0, 1fr))`, `gap: 24px`, `width: 100%`.
- **Cards (Stories, Campaigns, Quotes):**
  - Height: `102px`
  - Padding: `20px`
  - Radius: `12px`
  - Border: `1px solid #E5E5E5`
  - Shadow: `0px 1px 2px rgba(0, 0, 0, 0.05)`
  - Heading: `DM Sans Medium 14px / 24px` uppercase
  - Value: `Fraunces SemiBold 30px / 38px`
  - Icon Box: `32px x 32px` absolute at `top: 16px; right: 16px;`, radius `8px`

### Section 3: PosterChild Noticed Luxury Card
- **Surface:** Gold gradient background (`#FFFDF5` to `#FEF0C7`), `1px solid #FDE68A`, `border-radius: 12px`, padding `20px`.
- **Header:** `stars-01` 20px icon + `DM Sans SemiBold 16px / 24px` title `#171717`, gap `8px`.
- **Body:** `DM Sans SemiBold 16px / 24px` callout + `DM Sans Regular 14px / 20px` explanation.
- **Action:** `DM Sans SemiBold 14px / 20px` link in `#8F6500` ("See why this matters ->").

### Section 4: Needs Your Attention Table
- **Header Row:** "Needs your attention" (`DM Sans SemiBold 16px / 24px` `#171717`) + Action "View all" (`DM Sans SemiBold 14px / 20px` `#8F6500`).
- **Table Container:** `background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 12px; box-shadow: 0px 1px 2px rgba(0,0,0,0.05);`.
- **Table Columns:** `224px` (Item), `110px` (Priority), `1fr` / `406px` (What you should know).
- **Header Cell (40px):** `DM Sans SemiBold 12px / 18px` `#737373`, background `#FAFAFA`.
- **Body Row (64px):**
  - FeaturedIcon: `40px x 40px`, radius `10px`.
  - Item text: `DM Sans Medium 14px / 20px` `#171717`.
  - Badge: `Immediate` (`#FEF2F2`), `Ready` (`#F0FDF4`), `Upcoming` (`#FEFCE8`).
  - Info copy: `DM Sans Medium 14px / 20px` `#171717` + `DM Sans Regular 14px / 20px` `#525252`.

### Section 5: Suggested For You
- **Section Header:** "Suggested for you" (`DM Sans SemiBold 16px / 24px`) + Subtitle (`DM Sans Regular 14px / 20px` `#525252`) + "View all ->".
- **Card Surface:** `background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 12px; padding: 20px; display: flex; gap: 20px;`.
- **Image:** `250px x 224px`, radius `10px`, `border: 1px solid rgba(0, 0, 0, 0.1)`.
- **Title:** `Fraunces SemiBold 24px / 32px` `#171717`.
- **Description:** `DM Sans Regular 14px / 20px` `#525252`.
- **Tags:** `Workforce Development`, `Mentorship` (`DM Sans Medium 12px / 18px`, `#FAFAFA` pill).
