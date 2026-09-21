# Postie Behavioral & Interaction Specification

This document details the exact runtime behaviors, animations, dimensions, and state transitions reverse-engineered from the live Postie prototype repository (`postie`).

---

## 1. Sidebar Navigation (`sidebar-navigation.tsx`)

### Dimensions & Structure
- **Outer Shell Wrapper**:
  - Expanded: `width: 280px`, `min-width: 280px`, `max-width: 280px`
  - Collapsed: `width: 84px`, `min-width: 84px`, `max-width: 84px`
  - Padding: `padding: 20px 0px 20px 20px` (outer wrapper maintains 20px left margin from viewport)
  - Box sizing: `border-box`
  - Transition: `transition-[width] duration-200 ease-out`
- **Inner Floating Card**:
  - Expanded: `width: 260px`
  - Collapsed: `width: 64px`
  - Background: `#FFFFFF`
  - Border: `1px solid #E5E5E5`
  - Border Radius: `16px`
  - Shadow: `0px 1px 2px rgba(0, 0, 0, 0.03)`
  - Transition: `transition-[width] duration-200 ease-out`

### Header Area & Morphing Toggle Button
- **Expanded State**:
  - Top header row: `h-[64px]` with `p-[20px]`.
  - Left: Logo lockup (24x24 logomark + 99x24 logotype).
  - Right: Collapse button (36x36 hoverable square, rounded 12px, containing a 20x20 `layout-left` icon).
  - Hover state on collapse button: `hover:bg-[#F5F5F5]`.
- **Collapsed State (Morphing Toggle)**:
  - Top header row transforms into a centered 36x36 hoverable button:
    - Default state: Displays the 24x24 brand logomark.
    - Hover state: Cross-fades / morphs to show the 20x20 `layout-left` icon (re-open indicator) on a `#F5F5F5` rounded background.
  - Clicking this button re-expands the sidebar to `280px`.

### Navigation Items (`NavItems`)
- **Item Geometry**:
  - Row height: `36px` (`h-[36px]`, `p-[8px]`, gap `8px`).
  - Active background: `#FFF9E8` with active text `#8F6500` and active icon `#D99A00` / `#F4B400`.
  - Inactive background: `transparent` with text `#404040` and icon `#737373` (`hover:bg-[#F5F5F5]`, `hover:text-[#171717]`).
  - Radius: `12px`.
- **Expanded Navigation**:
  - Displays icon (`20x20`) + label text (`DM Sans, 14px, font-weight 600, leading 20px`).
- **Collapsed Navigation (Icon-Only Mode)**:
  - Label text is hidden.
  - Icon is centered inside the 36x36 row (`justify-center`).
  - **Tooltips on Hover**:
    - Floating dark tooltip appears to the right: `left-[calc(100%+22px)]`, `top-1/2 -translate-y-1/2`.
    - Background: `#262626` (zinc-800), text: `#FFFFFF`, radius: `6px`, font size: `12px`.
    - Delay: `300ms` delay before appearance (`transition-opacity duration-150 delay-300`).
    - Tooltip arrow / triangle: small left-pointing border triangle pointing back to the icon.
    - Elevation: `z-50`, `pointer-events-none`.

### Subnavigation (e.g. `/tell`)
- When the active route has nested pages (such as `/tell`), an accordion submenu expands below the parent item with a left indentation line (`border-l border-[#E5E5E5] ml-4 pl-3`).
- Submenu auto-collapses completely when the sidebar enters collapsed mode.

### Footer & Account Area
- **Free Trial Progress Card**:
  - Visible **only** when expanded.
  - Contains progress bar: background `#E5E5E5`, fill `#F4B400` (31.6% width), text "12 days left in trial", and "Upgrade" button.
  - Automatically unmounts / hides when collapsed (`display: none`).
- **Account / Profile Card**:
  - Expanded: `40px` circular avatar with online status badge, User name ("Darien M."), Organization ("PosterChild"), and vertical chevron selector.
  - Collapsed: Collapses down to a centered `40px` avatar with a hover tooltip displaying "Darien M. · PosterChild".
- **State Persistence**:
  - Persisted in `localStorage` under key `"posterchild_sidebar_collapsed"` (`"true"` | `"false"`).
  - Listens to and dispatches `"posterchild-sidebar-toggle"` CustomEvent.

---

## 2. Postie AI Panel (`postie-panel.tsx`)

### Presentation Views & Dimensions
The panel operates in three distinct presentation views via `PostieView`:
1. **`"sidebar"` (Docked Right Pane)**:
   - Width: `360px` (`min-width: 360px`, `max-width: 360px`, `flex: 0 0 360px`).
   - Height: `calc(100vh - 40px)` (matches the 20px top/bottom margin of the shell).
   - Position: `relative`, sticky to `top-0`, in-flow flex child on the right.
   - Border: `1px solid #E9EAEB`, radius: `12px`.
   - Shadow: `0px 4px 20px -2px rgba(0, 0, 0, 0.06)`.
2. **`"floating"` (Overlay Modal)**:
   - Width: `360px` (on mobile/sm) to `400px` (desktop), max-width `calc(100vw - 24px)`.
   - Height: `460px` fixed.
   - Position: `fixed`, anchored to `bottom-6 right-5`, `z-index: 40`.
   - Border: `1px solid #E9EAEB`, radius: `12px`.
   - Shadow: `0px 10px 25px -5px rgba(0,0,0,0.10), 0px 8px 10px -6px rgba(0,0,0,0.05)`.
3. **`"collapsed"` (Floating Launcher)**:
   - Button size: `40px x 40px`.
   - Position: `fixed`, anchored to `bottom-5 right-5` (mobile: `bottom-3 right-3`), `z-index: 50`.
   - Appearance: `bg-[#FFF9E8] border border-[#FFCC33] rounded-[8.57px]`.
   - Icon: Animated rotating Postie brand mark (`PostieAnimatedIcon`, size 40) with subtle ambient glow and hover scale `hover:scale-105`.
   - Shadow: `0px 20px 24px -4px rgba(0,0,0,0.08), 0px 8px 8px -4px rgba(0,0,0,0.03)`.

### View Transition Animation
- Transitions between `"sidebar"` and `"floating"` using CSS hardware-accelerated properties:
  `transition-[height,width,box-shadow,border-radius,right,top,bottom] duration-220 ease-out`
- Anchor point: `transform-origin: bottom right`, creating a natural expand-up / collapse-down feel.

### Top Controls Bar
- Height: `72px`, padding: `16px 12px 16px 16px`, border bottom: `1px solid #F0F0F0`.
- **Chats Dropdown (`w-[96px] h-[40px]`)**:
  - Button text: "Chats" with chevron down.
  - Popover dropdown (`210px` wide, radius `8px`, shadow `0 12px 16px -4px rgba(0,0,0,0.08)`):
    - **"New chat"** item with plus icon.
    - Divider line (`#E5E5E5`).
    - "RECENT" uppercase label.
    - List of recent threads (e.g., "Prepare board update", "Kresge application", "Workforce story").
    - Clicking a thread loads its historical messages and grounded contexts immediately.
- **Plus Icon Button (`40x40`)**: Shortcut to trigger `handleNewChat()` directly.
- **Presentation Selector (Right-Aligned)**:
  - Icon reflects current view mode (`postie-sidebar` icon or `postie-floating` icon).
  - Clicking opens a 3-item menu (`177px x 122px`):
    1. **Sidebar** (dock to right edge)
    2. **Floating** (pop out to bottom-right modal)
    3. **Hide chat** (collapse down to launcher button)

### Conversation Area
- Scroll container: `flex-1 min-h-0 p-[16px] overflow-y-auto scroll-smooth`.
- **Empty State (Large Intro)**:
  - 40x40 animated rotating Postie icon + "Postie" title in Fraunces serif (24px semibold) + green "BETA" badge (`#F0FDF4`, border `#BBF7D0`, green dot).
  - Contextual Starter Prompt Buttons: 2 pills tailored to current page (e.g., on Home: "What should I do first today?", "Help me prepare for tomorrow"). Clicking populates the composer and focuses input.
- **Active State (Compact Header)**:
  - Header collapses to a minimal `28px` bar: 20x20 Postie icon + "Postie" (14px medium) + micro BETA badge.
- **User Message Bubbles**:
  - Aligned to right. Name: "You" + timestamp ("Just now").
  - Bubble: `bg-[#FFFDF5] border border-[#FFCC33] rounded-[8px 0px 8px 8px]`, text `#8F6500` (15px regular).
- **Assistant Message Bubbles**:
  - Aligned to left. Header: 20x20 Postie icon + "Postie" + timestamp + hoverable "Copy" button.
  - Bubble: `bg-[#FAFAFA] border border-[#E5E5E5] rounded-[0px 12px 12px 12px]`, text `#171717` (14px regular, leading 21px).
  - **Grounded Context Row**: "Used" label + context chips (`bg-[#FFFFFF] border border-[#E5E5E5] rounded-[6px]`, 11px medium text).
  - **Inline Action Buttons**: Tertiary rounded buttons below response (e.g. `[-> Review opportunity]` to navigate, `[pencil Prepare update]` to send prompt).
- **Streaming & Typing Simulation**:
  - Step 1: User message added (120ms).
  - Step 2: Contextual typing indicator with bouncing dots and smart status (350ms):
    - Status dynamically computes based on query: e.g. "Reviewing Kresge application priorities...", "Checking upcoming events...", "Searching your assets...".
  - Step 3: Progressive streaming (600ms): Reveals 1-2 words every ~35ms with auto-scroll.

### Context Bar & Context Picker Popover
- Positioned directly above composer: `border-t border-[#F0F0F0]/80`, `pt-2 pb-1 px-4`.
- **Automatic Current Page Chip**:
  - Automatically senses active route (`Home`, `Tell`, `Raise`, `Manage`, `Assets`) with route-specific colored SVG icon.
- **Manually Attached Context Chips**:
  - Up to 3 user-attached chips (e.g. "Kresge Foundation", "Youth Career Pathways").
  - Each chip has an `x` remove button.
- **"+ Add" Context Button & Upward Popover**:
  - Opens upward modal: `w-[320px]`, `bottom-[calc(100%+8px)]`, rounded `12px`, elevated shadow.
  - Search input with autofocus: "Search anything...".
  - "Recent" items with category icons.
  - "Browse" categories with counts (Stories: 48, Funding opportunities: 14, People: 32, Assets: 394, Organization: 6).
  - Toggling an item attaches/detaches it to the prompt context.

### Composer
- Container: `h-[110px] p-3 border border-[#D4D4D4] rounded-[8px] bg-[#FFFFFF] shadow-[0_1px_2px_rgba(0,0,0,0.05)]`.
- Input: `textarea` with placeholder "Ask Postie anything, or add context with +".
- Key handling: `Enter` sends message, `Shift + Enter` inserts a newline.
- Left actions: `+` button (opens Context Picker), settings button.
- Right actions: Microphone button, gold send button (`#F4B400`, rounded 12px, disabled when input is empty or streaming is active).

---

## 3. App Shell Layout & Horizontal Space Distribution (`app-shell.tsx`)

### Layout Coordination
```
[Viewport: 100vw x 100vh, bg: #FFFDF5, overflow: hidden]
  |-- Left: Sidebar (width: 280px or 84px, flex-shrink: 0)
  |-- Center: Main Workspace (flex: 1 1 0%, min-width: 0, overflow-y: auto)
  |-- Right: Postie Panel (when docked: width: 360px, flex: 0 0 360px; when floating: 0px in flow)
```

### Dynamic Resizing Behavior
1. **When Sidebar Collapses (280px -> 84px)**:
   - Sidebar smoothly shrinks over 200ms.
   - Center main workspace expands by `+196px`.
   - Grid and table elements inside center main re-evaluate their container queries and adjust columns.
2. **When Postie Panel Closes or Floats (360px -> 0px in flow)**:
   - Postie smoothly un-docks and either docks into the floating bottom-right position or disappears to the launcher.
   - Center main workspace expands by `+360px`.
   - Center content immediately receives generous breathing room.
3. **When Both are Collapsed**:
   - Sidebar = `84px`, Postie = `0px` in flow.
   - Center main workspace occupies `calc(100vw - 84px - 40px)` of expansive space.

---

## 4. Home Screen Primitives (`home/`)

### Attention Metrics (`attention-metrics.tsx`)
- Container: `h-[102px] flex gap-4 w-full`.
- 3 cards with equal flex (`flex: 1 min-w-0`):
  1. **NEW TESTIMONIALS**: Value `24`, green folder icon badge (`#F0FDF4`, border `#BBF7D0`).
  2. **RELEVANT FOUNDERS**: Value `7`, blue file icon badge (`#EFF6FF`, border `#B2DDFF`).
  3. **PROGRAM MATCH**: Value `3` in orange (`#EA580C`), orange alert triangle badge (`#FFF7ED`, border `#FED7AA`).
- Typography: Label uppercase `DM Sans 14px 500`, Number `Fraunces 30px semibold`.

### PosterChild Noticed Card (`posterchild-noticed.tsx`)
- Container: `min-h-[137px] rounded-[12px] border border-[#FFCC33] p-5 relative overflow-hidden`.
- Background: Luxury gold gradient `linear-gradient(100deg, #FFFDF5 0%, #FFFDF5 42%, #FFF9E8 78%, #FFF2C7 100%)`.
- Layering:
  - Radial mesh gold glow in top right.
  - Abstract AI SVG graphic: 2 harmonic sinusoidal wave lines, orbital arcs, constellation nodes, and micro-sparkles.
  - 28px gold stars icon on the left (`#F4B400`).
  - Text: Title "You haven’t shared a workforce development story in 6 weeks." (`#8F6500`, 16px semibold) + body (`#525252`, 14px regular).
  - CTA: "See why this matters" + arrow-right link to `/tell`.

### Needs Your Attention Table (`needs-attention.tsx` & `.css`)
- Header: "Needs your attention" + "View all" button.
- Container: Uses `@container attention-table (inline-size)`.
- Responsive Breakpoints:
  - **Desktop ($\ge 740\text{px}$)**: Full grid table (`grid-template-columns: 224px 110px minmax(0, 1fr)`). Height: 40px header, 64px data rows.
  - **Medium ($640\text{px} - 739\text{px}$)**: Proportional columns (`grid-template-columns: minmax(190px, 0.9fr) 110px minmax(260px, 1.6fr)`).
  - **Narrow ($< 640\text{px}$)**: Header hidden. Rows collapse into stacked card-like list (`flex-direction: column`, min-height 96px).
- Priority Badges:
  - **Immediate**: Red `#FEF2F2`, border `#FECACA`, text `#B91C1C` with red dot.
  - **Upcoming**: Yellow `#FEFCE8`, border `#FEF08A`, text `#A16207` with yellow dot.
  - **Ready**: Green `#F0FDF4`, border `#BBF7D0`, text `#15803D` with green dot.
