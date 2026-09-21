> [!IMPORTANT]
> **Files under `source/` are raw Figma exports and must never be imported directly into production UI.**

# Manage Overview — Screen Reference Package

This directory contains the formal design specifications, component mappings, layout parameters, and asset manifests for the **Manage Overview** screen.

---

## 1. Screen Metadata

- **SCREEN**: Manage Overview
- **ROUTE**: `/present/:sessionId/manage`
- **VISUAL SOURCE**: Figma export (`🤖 PosterChild - AI`, Node `512:6840`)
- **IMPLEMENTATION SOURCE**: PosterChild Design System (`🤖 DS – 2026 (v8.0)`)
- **PRODUCT BEHAVIOR SOURCE**: Postie prototype where applicable

---

## 2. Guiding Rules

1. **Visual Geometry**: Figma export defines exact layout geometry, dimensions, paddings, and alignment rules.
2. **Component Architecture**: PosterChild Design System (`src/components/posterchild/`) defines authoritative, reusable primitives.
3. **Application Behavior**: The retreat session model and routing define live interactive behavior and participant convergence.

---

## 3. Package Contents

- **`source/`**:
  - `index.html`: Raw Figma HTML semantic tree export.
  - `index.css`: Raw Figma screen CSS rules and layout classes.
  - `global.css`: Raw Figma design token variables.
- **`assets/`**:
  - `icons/`: Manage-specific and shared category icons.
  - `images/`: Photographic or illustrative assets.
- **`screenshot/`**:
  - Placeholder for the reference PNG export (`manage-reference.png`).
- **`asset-manifest.json`**: Complete audit of all icons and brand marks required by this screen with local resolution status.
- **`component-map.md`**: Granular semantic mapping between Figma DOM elements and Design System React components.
- **`layout-spec.md`**: Extracted dimensional specs, padding, grid parameters, typography scales, and token cross-references.
- **`implementation-notes.md`**: Implementation guidelines, architectural boundaries, and migration checklist.
