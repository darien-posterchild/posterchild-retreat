# PosterChild Scalable Figma-Reference Workflow

This directory structure establishes a standardized, repeatable system for translating Figma screen specifications and the authoritative PosterChild Design System (`🤖 DS – 2026 (v8.0)`) into production React components without manual per-screen icon exporting or ad-hoc style approximation.

---

## 1. Directory Structure

```text
reference/
  README.md                          <-- This repeatable workflow guide
  _shared/
    tokens.md                        <-- Core token definitions (typography, colors, radii, shadows)
    design-system-notes.md           <-- Upstream design system notes & mapping rules
    assets/                          <-- Shared multi-screen reference files
  home/
    layout-spec.txt                  <-- Figma-exported CSS/properties for Home screen (Node 493:5128)
    asset-manifest.json              <-- Inventory of detected visual assets & resolution status
    implementation-notes.md          <-- Frame breakdown, layout shell, dimensions, and mappings
    assets/                          <-- Screen-specific reference assets
  [future-screen]/                   <-- e.g., stories/, donate/, campaigns/
    layout-spec.txt
    asset-manifest.json
    implementation-notes.md
    assets/
```

---

## 2. Authoritative Figma References

- **Figma Design System:**  
  `🤖 DS – 2026 (v8.0)`  
  https://www.figma.com/design/1obJOqckbRrlZ9sfeYtyns/%F0%9F%A4%96-DS-%E2%80%93-2026--v8.0-
- **Product & Screens File:**  
  `🤖 PosterChild - AI`  
  https://www.figma.com/design/hAohbnCHhrnjm2z5v3StIP/%F0%9F%A4%96-PosterChild---AI
- **Current Home Screen Frame:**  
  `Home — QA Exploration 05 / Reference-driven` (Node ID: `493:5128`)

---

## 3. Step-by-Step Workflow for Adding Future Screens

Follow this 5-step automated procedure whenever a new screen is ready to be implemented from Figma:

### Step 1: Create Screen Reference Folder
Create a folder inside `reference/` named after the target feature (e.g., `reference/stories/` or `reference/campaigns/`).

```bash
mkdir -p reference/stories/assets
```

### Step 2: Add Exported Figma CSS
1. In Figma, select the primary frame or node for the screen.
2. Export the frame CSS or inspect code and save it as:
   `reference/[screen-name]/layout-spec.txt`
3. Record the exact Figma frame name and node ID in `implementation-notes.md`.
4. *Important:* Do **NOT** import `layout-spec.txt` directly into the web application, and do **NOT** paste raw CSS wholesale into production files.

### Step 3: Extract Visual Assets & Generate Asset Manifest
Scan `layout-spec.txt` for all named visual assets (icons, logos, illustration badges, user avatars, buttons, and featured containers).

Create `reference/[screen-name]/asset-manifest.json` following the standard schema:

```json
[
  {
    "name": "icon-or-asset-name",
    "type": "icon" | "brand" | "image" | "component",
    "source": "PosterChild DS" | "Screen Specific",
    "status": "resolved" | "needs-export",
    "localPath": "src/assets/posterchild/icons/icon-name.svg" | null,
    "description": "Where and how this asset is used in the layout"
  }
]
```

### Step 4: Resolve Assets from the PosterChild Design System
Cross-reference each icon with the authoritative sources in strict priority order:

1. **Exact Component from `🤖 DS – 2026 (v8.0)` (Untitled UI Icons):**
   - The upstream icon library is Untitled UI line icons (24x24 / 20x20 viewBox, 2px stroke, round cap/join).
   - If the icon exists, save the clean vector SVG into `src/assets/posterchild/icons/` and register it in `src/components/posterchild/Icon.tsx`.
   - Update its manifest entry to `"status": "resolved"`.
2. **Existing Project Asset:**
   - Check `src/assets/posterchild/` or existing primitives.
3. **Unresolved / Inaccessible Assets:**
   - If an asset is a custom raster image (e.g., user avatar photo, custom illustration) that cannot be retrieved programmatically, mark it:
     `"status": "needs-export"` and set `"localPath": null`.
   - **Never** silently replace PosterChild icons with generic alternatives (Lucide, Heroicons, FontAwesome, or emoji).

### Step 5: Build Screen Using Shared PosterChild Primitives
Construct the screen by composing shared primitives from `src/components/posterchild/`:
- `<PosterChildIcon name="..." />` for all UI icons
- `<Button variant="primary" iconLeading="...">` for standard action buttons
- `<Badge variant="success">` for trend and status pills
- `<FeaturedIcon name="..." variant="brand">` for 40px icon containers
- `<NavItem label="..." icon="..." active={...} />` for sidebar items
- Consult `reference/_shared/tokens.md` for exact typography (`Fraunces` / `DM Sans`), border radii, background colors, and box-shadows.

---

## 4. Unresolved Asset Protocol

If an asset has status `"needs-export"`, document it in the final summary report with its exact Figma node ID and component layer name so that team members only ever need to manually export truly custom media assets.
