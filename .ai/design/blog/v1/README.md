# Blog Gallery Design - v1

## Overview

Responsive blog post gallery with mobile-first design. **Image-free design** focusing on content, typography, and clean visual hierarchy.

**Status:** ✅ Applied to project (`styles/notion.css`)

## Design Features

### Mobile (<768px)

- **Layout**: Vertical list (single column)
- **Card Structure**: Content-only with gradient top border
  - Min-height: 140px
  - Padding: 2.5 spacing units
  - Title: Full display, base font size
  - Meta: Date + read time, extra small font
  - Tags: Wrapped with hover animations

### Tablet (768px - 1023px)

- **Layout**: 2-column grid
- **Card Structure**: Same as mobile with larger spacing
  - Image: Top (16:9 aspect ratio)
  - Content: Below
  - Title: 2-line clamp, large font size

### Desktop (1024px+)

- **Layout**: 3-column grid
- **Card Structure**: Same as tablet
  - Title: 2-line clamp, extra large font size

## UI/UX Standards Applied

### Accessibility

- ✅ Semantic HTML (`<article>`, `<time>`, `<header>`)
- ✅ Alt text on all images
- ✅ Keyboard accessible (hover/focus states)
- ✅ Proper heading hierarchy
- ✅ ARIA labels where needed

### Performance

- ✅ Lazy loading on images (`loading="lazy"`)
- ✅ Modern image format URLs (Unsplash with optimized params)
- ✅ Explicit aspect ratios (no CLS)
- ✅ System fonts (instant load)
- ✅ Minimal CSS (single file)

### Design System

- ✅ Mobile-first breakpoints (768px, 1024px)
- ✅ Touch targets >44px (entire card clickable)
- ✅ HSL color format with alpha support
- ✅ 8px spacing grid system
- ✅ Fluid typography with clamp()
- ✅ Borders over shadows (minimal design)
- ✅ Warm glow on hover (--shadow-warm)
- ✅ 200ms transitions (fast, responsive)

### Interaction States

- ✅ Hover: Border → primary, warm shadow
- ✅ Image zoom: scale(1.05) on hover
- ✅ Focus: Visible focus rings
- ✅ Dark mode: Full support via `[data-theme="dark"]`

## Component Structure

```
.post-card
├── .post-card__link (entire card is clickable)
│   ├── .post-card__image-wrapper
│   │   └── .post-card__image
│   └── .post-card__content
│       ├── .post-card__title
│       └── .post-card__meta
│           ├── <time>
│           ├── .post-card__dot
│           └── <span> (read time)
```

## Color Palette

### Light Mode

- Background: `hsl(45 30% 96%)` - Warm off-white
- Card: `hsl(40 25% 98%)` - Lighter card background
- Primary: `hsl(18 65% 55%)` - Orange accent
- Border: `hsl(35 20% 85%)` - Subtle border
- Text: `hsl(25 20% 20%)` - Dark text

### Dark Mode

- Background: `hsl(25 20% 10%)` - Dark brown-black
- Card: `hsl(25 18% 14%)` - Slightly lighter card
- Primary: `hsl(18 70% 60%)` - Brighter orange
- Border: `hsl(25 15% 25%)` - Subtle dark border
- Text: `hsl(40 20% 90%)` - Light text

## Responsive Behavior

| Breakpoint | Columns | Layout | Min Height | Title Size |
| ---------- | ------- | ------ | ---------- | ---------- |
| <768px     | 1       | Vertical list | 140px     | Base      |
| 768-1023px | 2       | Grid         | 180px     | Large     |
| 1024px+    | 3       | Grid         | 180px     | Extra Large |

## Browser Support

- Chrome/Edge: ✅ (latest 2 versions)
- Firefox: ✅ (latest 2 versions)
- Safari: ✅ (latest 2 versions)
- Mobile Safari: ✅
- Samsung Internet: ✅

## Testing Checklist

### Visual

- [x] Tested at 320px width (mobile)
- [x] Tested at 768px width (tablet)
- [x] Tested at 1024px+ width (desktop)
- [x] Light mode
- [x] Dark mode

### Interaction

- [x] Hover states on cards
- [x] Image zoom on hover
- [x] Theme toggle works
- [x] Smooth transitions

### Accessibility

- [x] Keyboard navigation (Tab through cards)
- [x] All images have alt text
- [x] Proper semantic HTML
- [x] Time elements use datetime attribute

### Performance

- [x] Images lazy load
- [x] No layout shift during load
- [x] Transitions are smooth (60fps)

## Files

- `index.html` - Main HTML structure
- `style.css` - All styles (mobile-first)
- `script.js` - Theme toggle logic
- `README.md` - This file

## Usage

Open `index.html` in a browser. Resize the window to see responsive behavior:

1. **Mobile**: Vertical list with image on left
2. **Tablet**: 2-column grid with image on top
3. **Desktop**: 3-column grid with image on top

Click the theme toggle in the top-right to switch between light and dark modes.
