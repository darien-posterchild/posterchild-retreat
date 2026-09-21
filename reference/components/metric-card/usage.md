# Metric Card — Usage Guidelines & Examples

The `MetricCard` component is a reusable statistical display tile conforming to the PosterChild mini design system. It presents a single quantitative KPI with an uppercase category label and an icon badge.

---

## Component Import

```tsx
import { MetricCard } from '@/components/posterchild/MetricCard';
// or via barrel export:
import { MetricCard } from '@/components/posterchild';
```

---

## Props Interface

```typescript
export type MetricCardTone = 'success' | 'blue' | 'warning';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Uppercase section/category label displayed at the top */
  label: string;
  /** Primary metric value (number or string) displayed in Fraunces */
  value: string | number;
  /** Name of the icon rendered inside the featured icon box */
  icon: PosterChildIconName;
  /** Color tone determining icon box background and icon foreground color */
  tone?: MetricCardTone;
  /** Optional custom CSS class */
  className?: string;
}
```

---

## Examples

### 1. Stories Card (Authoritative Reference)
This is the production-accurate Stories card implemented from Figma Node ID `493:5128`.

```tsx
<MetricCard
  label="Stories"
  value={3}
  icon="folder"
  tone="success"
/>
```
- **Label:** `STORIES` (DM Sans Medium 14px, tracking 0.04em, uppercase, #171717)
- **Value:** `3` (Fraunces SemiBold 30px, #171717)
- **Icon Container:** 32×32px, radius 8px, top 16px, right 16px, background `#F0FDF4`
- **Icon:** `folder` 16×16px, stroke 1.33333px, color `#16A34A`

---

### 2. Campaigns Card (Pending Reference)
> **Note:** The exact color palette for Campaigns is pending authoritative Figma export. Do not assume or finalize tokens until specs are provided.

```tsx
<MetricCard
  label="Campaigns"
  value={1}
  icon="announcement-02"
  tone="blue" /* pending-reference */
/>
```
- **Status:** `pending-reference`
- **Draft Tone:** `blue` (`#EFF6FF` bg / `#2563EB` fg)

---

### 3. Quotes Card (Pending Reference)
> **Note:** The exact color palette for Quotes is pending authoritative Figma export. Do not assume or finalize tokens until specs are provided.

```tsx
<MetricCard
  label="Quotes"
  value={5}
  icon="alert-triangle"
  tone="warning" /* pending-reference */
/>
```
- **Status:** `pending-reference`
- **Draft Tone:** `warning` (`#FFF7ED` bg / `#EA580C` fg)

---

## Layout Grid Integration

In the Home Workspace, three metric cards reside in a fixed 740px row with 16px gaps:
```css
.pc-ref-metrics-row {
  display: flex;
  flex-direction: row;
  width: 740px;
  gap: 16px;
}
```
Each card occupies `width: 236px` (`(740px - 2 * 16px) / 3 = 236px`) and `height: 102px`.
