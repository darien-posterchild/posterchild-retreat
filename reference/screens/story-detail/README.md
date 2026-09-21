# Story Detail Reference Package — "Youth Career Pathways"

This directory contains the visual and layout references for the Story Detail workspace.

## Tabs Status

| Tab | Status | Notes |
| :--- | :--- | :--- |
| **Social Media** (`tab=social`) | **Reference Supplied** | Carousel / Single Poster controls, Instagram carousel preview, brand color tokens, download and publish actions. |
| **Article** (`tab=article`) | **Reference Supplied** | Formatted draft reading view, HTML editor slot, sharing actions, and editorial tuning. |
| **Content Source** (`tab=content-source`) | **Visual Design Pending** | Raw transcripts, interview audio notes, and participant attribution records. |

---

## Production Integration Rules

- Do NOT copy exported Figma HTML/CSS blindly into production components.
- The exported reference specifies visual geometry and hierarchy.
- The application runtime uses the standard PosterChild Design System components (`ProductPage`, `Button`, `Badge`, `PosterChildIcon`), session state hooks, and presenter controls.
