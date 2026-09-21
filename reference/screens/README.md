# PosterChild Standard Screen Fidelity Workflow

This directory structure establishes the authoritative, standardized, and repeatable protocol for ingesting Figma frame exports into pixel-accurate PosterChild production screens.

---

## 1. Directory Structure

Each screen reference package must follow this exact specification:

```text
reference/screens/<screen-name>/
  source/
    index.html               <-- Raw Figma HTML export (never imported into production code)
    index.css                <-- Raw Figma frame CSS rules (geometry reference only)
    global.css               <-- Raw Figma token variables export
  assets/
    icons/                   <-- Screen-specific and shared category SVGs
    images/                  <-- High-resolution bitmap images, avatars, or previews
  screenshot/
    README.md                <-- Instructions for placing visual QA baseline screenshot
    <screen>-reference.png   <-- Exported Figma frame PNG for visual regression testing
  asset-manifest.json        <-- Inventory of all <img> tags, icons, and local path resolution status
  component-map.md           <-- Mapping between Figma DOM elements and DS React primitives
  layout-spec.md             <-- Extracted dimensions, paddings, typography scales, and token cross-references
  implementation-notes.md    <-- Engineering strategy, reuse checklist, and strict constraints
  README.md                  <-- Screen metadata, route, source Figma frame IDs, and guiding rules
```

---

## 2. Standard 5-Step Ingestion Procedure

### Step 1: Export Raw Assets & Code from Figma
- Export the raw HTML, screen CSS, and global CSS variables from the target Figma frame.
- Save them unmodified into `reference/screens/<screen-name>/source/`.

### Step 2: Generate Visual & Component Specifications
- Create `layout-spec.md`: extract exact geometric values, paddings, grid settings, and token mappings against `reference/design-system/token-map.md`.
- Create `component-map.md`: map each semantic element to existing PosterChild DS primitives (`ProductPage`, `Button`, `Badge`, `FeaturedIcon`, `NavItem`, `PosterChildIcon`).

### Step 3: Audit & Resolve Assets
- Create `asset-manifest.json`: inventory every icon, brand logo, and image required by the screen.
- Match all assets against local repositories (`src/assets/posterchild/icons/`, `src/assets/posterchild/brand/`).
- Mark any missing items as `needs-export`.

### Step 4: Author Implementation Guidelines
- Create `implementation-notes.md`: document architectural boundaries, persistent shell reuse, interactive states, and strict rules against direct Figma HTML pasting.

### Step 5: Visual QA Comparison
- Place a 1x/2x PNG export in `screenshot/<screen>-reference.png`.
- Implement production code in `src/pages/product/<ScreenName>.tsx` using DS primitives and Vanilla CSS tokens.
- Perform visual QA verification until 100% fidelity is achieved.

---

## 3. Master Layout Rule for Future Screens

> **RULE:** Every new screen inherits the **Home master rhythm** (`reference/screens/home/` and `reference/_shared/screen-layout.md`) unless its own Figma reference explicitly overrides it.

### Inheritance includes:
- **Page Spacing:** `24px` inline gutter, `24px` top / `40px` bottom block padding
- **Common Header Rhythm:** Fraunces 36px/48px display title + DM Sans 16px/24px subtitle + 40px primary action
- **Standard Section Gap:** `24px` vertical block spacing between major sections
- **Section Title Gap:** `12px` between section header row and content card/table
- **Common Card/List Gap:** `24px` grid gaps (or 16px micro-gaps where specified)
- **Typography Hierarchy:** Dual-font pairing (`Fraunces` display + `DM Sans` interface)
- **Common Surfaces:** `12px` standard card radius, `16px` shell rail radius, `0px 1px 2px rgba(0,0,0,0.05)` subtle shadow
- **AppShell Geometry:** `100%` viewport width, sticky rails, `1040px` max center content

*A screen-specific Figma value always overrides the master default.*

