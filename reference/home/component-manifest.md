# PosterChild Home Screen Component Manifest

**Figma Source Reference:** `Home — QA Exploration 05 / Reference-driven` (Node ID: `493:5128`)  
**Specification Export:** `reference/home/layout-spec.txt`  
**Design System Authority:** `🤖 DS – 2026 (v8.0)`

---

## 1. Badge / Status Badge (`Badge`)

- **Role:** Status and priority pills in table cells and context headers.
- **Dimensions:** Height `22px`, width auto (content-driven, ~64px–85px).
- **Padding:** `2px 6px`
- **Gap:** `4px`
- **Radius:** `6px` (`border-radius: 6px`, from DS spec lines 4487, 4580, 4673)
- **Typography:** `DM Sans`, 12px / 18px (line-height 150%), font-weight 500 (`font-weight: 500;`), text-align center.
- **Dot:** Circular indicator `width: 6px; height: 6px; border-radius: 50%;`
- **Variants & Color Tokens:**
  - **Immediate:** `background: #FEF2F2; border: 1px solid #FECACA; color: #B91C1C; dot: #EF4444;`
  - **Ready:** `background: #F0FDF4; border: 1px solid #BBF7D0; color: #15803D; dot: #22C55E;`
  - **Upcoming / Warning:** `background: #FEFCE8; border: 1px solid #FEF08A; color: #A16207; dot: #EAB308;`
  - **Team Choice / Brand:** `background: #FFF9E8; border: 1px solid #FDE68A; color: #8F6500; icon/dot: #F4B400;`
  - **Neutral / Gray:** `background: #F9FAFB; border: 1px solid #E5E7EB; color: #374151; dot: #9CA3AF;`

---

## 2. Attention Table (`AttentionTable`)

- **Container Dimensions:** Width `740px`, height `232px`, auto height with rows.
- **Border & Radius:** `border: 1px solid #E5E5E5; border-radius: 12px;`
- **Surface & Shadow:** `background: #FFFFFF; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);`
- **Column Proportions (3-Column Architecture):**
  - **Column 1 (Item):** Width `224px`
  - **Column 2 (Priority):** Width `110px`
  - **Column 3 (What you should know / Action):** Width `406px`
  - *Total:* 224px + 110px + 406px = `740px`

---

## 3. Table Header Cell (`TableHeaderCell`)

- **Dimensions:** Height `40px` (max-height `40px`), widths matching columns (`224px`, `110px`, `406px`).
- **Padding:** `8px 12px`
- **Gap:** `12px`
- **Background & Border:** `background: #FAFAFA; border-bottom: 1px solid #E5E5E5;`
- **Typography:** `DM Sans`, 12px / 18px (line-height 150%), font-weight 600, color `#737373` (`--pc-ref-text-tertiary`).

---

## 4. Table Body Cell (`TableBodyCell`)

- **Dimensions:** Row height `64px` (max-height `64px`).
- **Background & Border:** `background: #FFFFFF; border-bottom: 1px solid #E5E5E5;`
- **Column 1 Cell (Item):**
  - Padding: `12px`
  - Layout: `display: flex; align-items: center; gap: 8px;`
  - Featured Icon: `40px x 40px`, radius `10px` or `12px`
  - Title: `DM Sans`, 14px / 20px, font-weight 500, color `#171717`
  - Subtitle: `DM Sans`, 12px / 18px, font-weight 400, color `#737373`
- **Column 2 Cell (Priority):**
  - Padding: `12px`
  - Layout: `display: flex; align-items: center;`
  - Content: `<Badge variant="..." />`
- **Column 3 Cell (What you should know):**
  - Padding: `8px 20px 8px 12px`
  - Layout: `display: flex; flex-direction: column; justify-content: center; gap: 0px;`
  - Content: Primary text (`DM Sans`, 14px / 20px, font-weight 500, `#171717`) + supporting copy (`DM Sans`, 14px / 20px, font-weight 400, `#525252`). Total height `40px` centered inside `64px`.

---

## 5. Featured Icon (`FeaturedIcon`)

- **Role:** Icon badge container in table rows and notice cards.
- **Dimensions:** `40px x 40px` (standard `md`), `32px x 32px` (compact `sm`).
- **Radius:** `10px` (or `12px`).
- **Icon Size:** `20px x 20px` (16px in compact).
- **Variants:**
  - **Brand / Amber:** `background: #FFF9E8; border: 1px solid #FDE68A; icon color: #8F6500;`
  - **Success / Green:** `background: #F0FDF4; border: 1px solid #BBF7D0; icon color: #16A34A;`
  - **Info / Blue:** `background: #EFF6FF; border: 1px solid #BFDBFE; icon color: #2563EB;`
  - **Warning / Orange:** `background: #FFF7ED; border: 1px solid #FED7AA; icon color: #EA580C;`

---

## 6. Primary Button (`Button variant="primary"`)

- **Role:** Main page action (`+ Create story`).
- **Dimensions:** Height `40px`, width auto (~141px).
- **Padding:** `10px 14px`
- **Gap:** `4px`
- **Radius:** `12px`
- **Background:** `#F4B400` (Hover: `#E0A500`, Active: `#C89200`)
- **Typography:** `DM Sans`, 14px / 20px, font-weight 600, color `#171717`.
- **Icon:** `plus`, 18px / 20px, stroke-width `2.2`, opacity `0.75` / `1.0`.
- **Shadow:**
  `0px 1px 2px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 1px rgba(0, 0, 0, 0.18), inset 0px -2px 0px rgba(0, 0, 0, 0.05)`

---

## 7. Secondary / Utility Button (`Button variant="secondary"` / `RowAction`)

- **Role:** Table row inline action, card links, secondary utilities.
- **Dimensions:** Height `32px`–`36px`.
- **Padding:** `4px 10px` (inline) or `8px 14px` (standard secondary).
- **Radius:** `8px`
- **Background & Border:** `background: #FFFFFF; border: 1px solid #D1D5DB; color: #374151;`
- **Compact Text Action (Retreat Row):** `color: #8F6500; font-weight: 600; font-size: 13px; line-height: 18px;`

---

## 8. Sidebar Navigation Item (`NavItem`)

- **Role:** Navigation links in left sidebar.
- **Dimensions:** Width `228px`, height `36px` (container row `38px`).
- **Padding:** `8px 12px`
- **Gap:** `8px`
- **Radius:** `12px`
- **Typography:** `DM Sans`, 14px / 20px, font-weight 600 (`is-active`) or 500 (default).
- **States:**
  - **Active (Home):** `background: #FFF9E8; color: #8F6500; icon color: #F4B400;`
  - **Inactive:** `background: transparent; color: #404040; icon color: #A3A3A3;`
  - **Hover:** `background: #F8F9FA; color: #171717; icon color: #737373;`

---

## 9. Sidebar Account Card (`_Nav account card`)

- **Dimensions:** Width `228px`, height `64px`.
- **Padding:** `12px`
- **Radius:** `12px`
- **Border & Background:** `border: 1px solid #E5E5E5; background: #FFFFFF; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);`
- **Avatar:** `32px x 32px` or `40px x 40px`, radius `8px` or circular (`border-radius: 50%`), online indicator dot (6px `#16A34A`).
- **Typography:** Name 14px / 20px font-weight 600 `#171717`, email 12px / 18px font-weight 400 `#737373`.
- **Action:** `chevron-selector-vertical` (16px `#A3A3A3`).

---

## 10. Postie Message Bubble

- **User Bubble:**
  - Background: `#F5F5F5`
  - Border radius: `12px 12px 2px 12px`
  - Padding: `10px 14px`
  - Typography: `DM Sans`, 14px / 20px, color `#171717`
- **Postie Bubble:**
  - Background: `#FFFFFF`
  - Border: `1px solid #E5E5E5`
  - Border radius: `12px 12px 12px 2px`
  - Padding: `12px 14px`
  - Typography: `DM Sans`, 14px / 20px, color `#374151`
  - Sender label: `DM Sans`, 12px / 18px font-weight 600 `#8F6500` with `stars-01` icon (12px `#F4B400`).

---

## 11. Postie Composer

- **Container:** Width `328px`, padding `16px`, background `#FFFFFF`.
- **Input Box:** `border: 1px solid #D1D5DB; border-radius: 12px; padding: 8px 12px;`
- **Input Text:** `DM Sans`, 14px / 20px, placeholder `#737373`.
- **Toolbar Icons:** `16px` (`plus`, `settings-04`, `microphone-01`).
- **Send Button:** `28px x 28px` circular, background `#F4B400`, icon `arrow-up` (15px `#171717`).

---

## 12. Metric Card (`MetricItem`)

- **Dimensions:** Width `236px`, height `102px` (`order: 0..2, flex-grow: 1`).
- **Padding:** `20px`
- **Radius:** `12px`
- **Border & Background:** `border: 1px solid #E5E5E5; background: #FFFFFF;`
- **Shadow:** `0px 1px 2px rgba(0, 0, 0, 0.05)` (`shadow-xs`).
- **Heading:** `DM Sans`, 14px / 24px, uppercase, letter-spacing `0.04em`, font-weight 500, color `#171717`.
- **Number:** `Fraunces`, 30px / 38px, font-weight 600, color `#171717`.
- **Top-Right Icon Badge:** `32px x 32px`, radius `8px`, position `top: 16px; right: 16px;`
  - Stories: `background: #F0FDF4; icon: folder (16px #16A34A);`
  - Campaigns: `background: #EFF6FF; icon: file-06 / announcement-02 (16px #2563EB);`
  - Quotes: `background: #FFF7ED; icon: alert-triangle (16px #EA580C);`
