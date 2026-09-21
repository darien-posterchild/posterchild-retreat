# PosterChild Reusable Page Shell (`ProductPage`)

This document specifies the `<ProductPage />` shell layout component and its integration within the desktop application frame.

---

## 1. Component Overview

The `<ProductPage />` component (`src/components/posterchild/ProductPage.tsx`) ensures visual consistency across all product destinations without re-implementing layout containers, typography, and spacing on every screen.

```tsx
import ProductPage from '@/components/posterchild/ProductPage';
import { Button } from '@/components/posterchild/Button';

export default function MyScreen() {
  return (
    <ProductPage
      title="Page title"
      description="Supporting descriptive text for this screen."
      primaryAction={
        <Button variant="primary" size="md" iconLeading="plus">
          Primary Action
        </Button>
      }
    >
      {/* Page Content */}
    </ProductPage>
  );
}
```

---

## 2. Standardized Layout & Typography

1. **Page Title**:
   - Font Family: `'Fraunces', Georgia, serif` (`var(--pc-ref-font-display)`)
   - Size / Line Height: `36px` / `44px`
   - Weight: `600` (SemiBold)
   - Tracking: `-0.02em`
   - Color: `#171717` (`var(--pc-ref-text-primary)`)
2. **Page Subtitle / Description**:
   - Font Family: `'DM Sans', sans-serif` (`var(--pc-ref-font-body)`)
   - Size / Line Height: `16px` / `24px`
   - Weight: `400` (Normal)
   - Color: `#525252` (`var(--pc-ref-text-secondary)`)
3. **Container Metrics**:
   - Fluid width expanding up to max width (`740px` for dense workboards, up to `1008px` for multi-column grids).
   - Vertical Gap between Header and Body: `24px` (`var(--pc-spacing-3xl)`).
   - Padding bottom: `40px` (`var(--pc-spacing-5xl)`).

---

## 3. Persistent Shell Composition

Inside `src/pages/Present.tsx`:

```
┌────────────────────────────────────────────────────────────────────────┐
│ pc-ref-app-frame                                                      │
│ ┌─────────────────┬──────────────────────────────────┬───────────────┐ │
│ │                 │ pc-ref-app-content               │               │ │
│ │                 │ ┌──────────────────────────────┐ │               │ │
│ │  <Sidebar />    │ │ <Outlet />                   │ │ <PostiePanel> │ │
│ │  (280px / 84px) │ │ (ProductPage)                │ │ (360px/float) │ │
│ │                 │ └──────────────────────────────┘ │               │ │
│ └─────────────────┴──────────────────────────────────┴───────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

The shell frame maintains layout stability:
- Left sidebar smoothly transitions width between 280px and 84px without triggering route unmounts.
- Center content column automatically expands to fill available viewport space.
- Right Postie panel can transition between docked (360px), floating (400×460px), or collapsed (40×40px launcher) without unmounting or resetting chat history.
- Bottom presenter dock remains anchored at the bottom edge.
