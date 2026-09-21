# Manage Overview — Implementation Notes & Engineering Strategy

This document outlines the engineering architecture, component reusability guidelines, and constraints for implementing the **Manage Overview** screen (`/present/:sessionId/manage`).

---

## 1. Core Architecture Strategy

When the live implementation phase begins, follow this structured execution strategy:

1. **Persistent App Shell**:
   - Reuse the established 3-column layout provided in `src/pages/Present.tsx`.
   - Never create duplicate shell containers or root body wrappers.

2. **Sidebar Navigation**:
   - Reuse `src/components/Sidebar.tsx` and `src/components/posterchild/NavItem.tsx`.
   - Manage is active at route `/present/:sessionId/manage` with `settings-01` icon.

3. **Postie Panel**:
   - Keep the persistent `PostiePanel` docked/floating via `PostieProvider`.

4. **ProductPage Header**:
   - Wrap the main workspace in `src/components/posterchild/ProductPage.tsx`.
   - Title: `"Your organization, all in one place."` (Fraunces font).
   - Description: `"Everything PosterChild knows about your organization. Keep your information up to date, organized, and ready to use."`
   - Primary Action: `<Button variant="secondary" size="md" iconLeading="plus">Add to organization</Button>`.

5. **Composite Category Card (`ManageCategoryCard`)**:
   - Build or compose `ManageCategoryCard` using existing DS primitives.
   - Support the six categories: `Knowledge`, `Assets`, `Organization`, `People`, `Connections`, `Admin`.
   - Support navigation click targets: clicking `Assets` navigates to `/present/:sessionId/manage/assets`.

6. **Tonal FeaturedIcons**:
   - Use `FeaturedIcon` with exact category colors:
     - Knowledge: Yellow (`#FFF9E8` / `#FFF2C7`) + `folder`
     - Assets: Green (`#F0FDF4` / `#BBF7D0`) + `file-06`
     - Organization: Purple (`#FAF5FF` / `#E9D5FF`) + `home-line`
     - People: Blue (`#EFF6FF` / `#BFDBFE`) + `users-02`
     - Connections: Pink (`#FDF2F8` / `#FBCFE8`) + `settings-04`
     - Admin: Gray (`#F5F5F5` / `#E5E5E5`) + `settings-01`

7. **Geometry & CSS Alignment**:
   - Use `source/index.css` strictly for geometric verification (padding `24px`, card radius `16px`, gap `24px`).
   - Implement styles exclusively using PosterChild Vanilla CSS tokens (`src/styles.css`).

8. **Responsive Fluidity**:
   - Use CSS Grid `repeat(3, minmax(0, 1fr))` on desktop.
   - Gracefully wrap to 2 columns and 1 column at tablet and mobile breakpoints while preserving desktop pixel fidelity.

---

## 2. Hard Constraints & Prohibitions

> [!CAUTION]
> **STRICT COMPLIANCE RULES:**
> 1. **DO NOT** paste Figma raw HTML directly into React JSX.
> 2. **DO NOT** import `source/index.css` or `source/global.css` into production CSS or JavaScript bundles.
> 3. **DO NOT** duplicate or re-invent Design System primitives (e.g. creating ad-hoc buttons or badges).
> 4. **DO NOT** use browser-default HTML buttons, select dropdowns, or unstyled divs for DS controls.
> 5. **DO NOT** use approximate or substituted icons—always use the verified SVGs in `src/assets/posterchild/icons/`.
