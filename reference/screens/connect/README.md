# Connect Reference Package — Community Voices & Testimonials

This directory documents the reference source and status for the **Tell → Connect** workspace (`/present/:sessionId/tell/connect`).

## Screen Status

| Item | Status | Notes |
| :--- | :--- | :--- |
| **HTML Reference** | **Supplied** | Definitive visual hierarchy, copy, and layout structure. |
| **CSS Reference** | **Supplied** | Color tokens, card styling, and table definitions. |
| **Retreat Architecture** | **Implemented** | Mission `new-testimonials-connect`, decision `connect-next-action`, in-screen action states, and convergence into `youth-career-story`. |
| **Final React Visual Implementation** | **Pending** | Pending subsequent pixel-perfect styling pass from the supplied reference assets. |

---

## Reference Content Specifications

- **Header Title**: Hear from your community.
- **Supporting text**: Collect experiences, voices, and perspectives that can become stories.
- **Primary CTA**: Ask your community
- **PosterChild noticed**:
  - *Callout*: Transportation keeps coming up. Is there more to understand?
  - *Insight*: PosterChild found transportation mentioned across 7 recent Youth Career Pathways responses. It may be worth asking a follow-up before turning the theme into a story.
- **Active Conversations**:
  1. *Youth Career Pathways Check-in* (Program check-in • 23 responses • Active • Next step: Review transportation theme)
  2. *Spring Alumni Stories* (Story collection • 14 responses • Active • Next step: Review 3 strong responses)
  3. *Program Experience* (Community feedback • 42 responses • Analysis ready • Next step: Review themes and signals)
  4. *Community Leadership Follow-up* (Follow-up request • 0 responses • Draft • Next step: Send the request)
- **Postie Context**:
  - *Prompt*: What are we hearing from our community?
  - *Postie Response*: Transportation is the clearest recurring theme in Youth Career Pathways. I also found 3 Spring Alumni responses detailed enough to review as possible story sources.

---

## Production Integration Rules

- Do NOT import the exported HTML wholesale into production.
- Use the standard PosterChild Design System components (`ProductPage`, `Button`, `Badge`, `PosterChildIcon`), session state hooks, and presenter controls.
