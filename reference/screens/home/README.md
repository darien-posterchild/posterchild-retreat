# PosterChild Master Screen Reference: Home

**Figma Source Reference:** `Home — QA Exploration 05 / Reference-driven` (Node ID: `493:5128`)  
**Design System Canon:** `🤖 DS – 2026 (v8.0)` + Canonical SaaS Desktop Layout

---

## 1. Role as Master Reference

The **Home** screen reference package is the **MASTER** visual, layout, and rhythm reference for the entire PosterChild application.

Home establishes the baseline system rules for:
1. **Page Padding:** `24px` inline / `24px` top, `40px` bottom block
2. **Section Rhythm:** `24px` vertical block gap between major cards/sections
3. **Section Header Spacing:** `12px` between section title row and child content
4. **Card / Grid Gap:** `24px` for 3-column metric cards and multi-column grids
5. **Content Max Width:** `1040px` centered horizontally in the fluid SaaS workspace
6. **Typography Hierarchy:** Dual-font pairing (`Fraunces` editorial headers + `DM Sans` interface body)
7. **Common Surfaces & Elevation:** `12px` standard card radius, `16px` shell rail radius, subtle `0px 1px 2px rgba(0,0,0,0.05)` borders and shadows

> **Master Layout Rule:** All new screens inherit the Home master rhythm unless their own Figma source explicitly overrides it.

---

## 2. Reference Package Structure

```
reference/screens/home/
  source/
    index.html         # Exact semantic HTML representation of Home
    index.css          # Exact screen CSS export
    global.css         # Shared design tokens export
  assets/
    raw/               # Folder for user raw exports (e.g. elena-mentorship.png)
    icons/             # Normalized Design System icons
    images/            # Photographic/illustration assets
  screenshot/
    README.md          # Guide for placing home-reference.png
  asset-manifest.json  # Comprehensive asset inventory & status
  component-map.md     # Component evaluation (REUSE/ADAPT/MISSING)
  layout-spec.md       # Exact dimensional and structural specification
  implementation-notes.md # Preservation & runtime integration notes
  README.md            # This document
```
