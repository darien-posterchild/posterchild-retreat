# Screen Reference Package Template

> **Instructions:** For every new PosterChild screen, copy this folder (`reference/screens/_template/`) into `reference/screens/<screen-name>/` and replace the raw source/reference files.

---

## Package Structure

```
reference/screens/<screen-name>/
  source/
    index.html         # Exact exported Figma HTML
    index.css          # Exact exported Figma screen CSS
    global.css         # Global tokens & CSS variables export
  assets/
    raw/               # User-provided raw Figma SVG/PNG exports
    icons/             # Normalized/verified Design System icons
    images/            # Screen-specific photographic/graphic assets
  screenshot/
    README.md          # Guide for placing screen-reference.png
  asset-manifest.json  # Comprehensive inventory of all required assets
  component-map.md     # Mapping to existing DS components (REUSE/ADAPT/MISSING)
  layout-spec.md       # Exact dimensional and structural specification
  implementation-notes.md # Implementation strategy & behavior notes
  README.md            # Screen-specific overview
```

---

## Master Layout Rule

Every new screen inherits the **Home master rhythm** (`reference/screens/home/` and `reference/_shared/screen-layout.md`) unless its own Figma reference explicitly overrides it:
- Default page block rhythm: `24px`
- Section header → content gap: `12px`
- Outer page padding: `24px` inline / `24px` block
- Container max-width: `1040px` centered inside SaaS workspace
- Rail geometry: `280px` expanded / `64px` collapsed sidebar, `360px` docked Postie
