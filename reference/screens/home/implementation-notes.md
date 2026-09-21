# PosterChild Home Screen Implementation Notes

## 1. Master Reference Status
- **Home is the Master Rhythm Source:** The Home screen established the 24px vertical section gap, 12px subtitle/header gap, 3-column `repeat(3, minmax(0, 1fr))` fill-container metrics row, and 1040px max product workspace width.
- All subsequent screens in PosterChild inherit this baseline layout geometry.

---

## 2. Preservation Architecture (Strict Rules)
When implementing Home in Phase 2, the following runtime contracts must remain 100% intact:
1. **Retreat Branching & Voting:**
   - Active decision `home-focus` (`stories`, `campaigns`, `quotes`).
   - `DecisionChoice` decorator wrapping the 3 `MetricCard` items without altering their visual contract or DOM structure.
   - Live votes, percentages, ties, and winner reveal animations.
2. **Firebase Subscriptions:**
   - Real-time listener for session state, participants, and votes.
3. **Presenter Controls Dock:**
   - Discreet bottom bar (`Space` to advance, `R` to reset).
4. **AppShell Layout Rules:**
   - Viewport-wide SaaS shell with sticky 64px/280px sidebar, sticky 360px Postie, and centered 1040px product content.

---

## 3. Asset & Image Pipeline
- 13 of 14 visual assets (icons, brand marks, and indicators) are already resolved from existing SVG assets in `src/assets/posterchild/`.
- The user will export the suggested story photographic image `elena-mentorship.png` into `reference/screens/home/assets/raw/`.
- A 1x Figma frame screenshot will be placed into `reference/screens/home/screenshot/home-reference.png`.
