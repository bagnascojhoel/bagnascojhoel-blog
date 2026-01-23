---
applyTo: *
---

# UI/UX Standards for AI Agents

This document defines the rules and guidelines for building web applications with high-quality UI
and UX across all devices.

## Core UI/UX Principles

1. **Mobile-First Design**: Design for the smallest screen first (320px) and scale up using CSS Grid
   and Flexbox. Test at 320px, 768px (tablet), 1024px (desktop), and 1440px (wide).

2. **Touch Targets**: Ensure interactive elements (buttons, links, tap areas) have a minimum size of
   44x44px for comfortable touch interaction on mobile devices.

3. **Fluid Typography**: Use `clamp()` for responsive text scaling to ensure readability across
   devices without breakpoint-specific overrides.

   - Example: `font-size: clamp(1rem, 2.5vw, 1.5rem)`

4. **Accessibility (WCAG 2.1)**:

   - Color contrast: 4.5:1 for normal text, 3:1 for large text (18px+)
   - Full keyboard navigability with visible focus rings (`:focus-visible`)
   - Semantic HTML with proper heading hierarchy
   - ARIA labels for icon-only buttons and decorative elements
   - Alt text for all meaningful images

5. **Performance (Core Web Vitals)**:

   - Lazy-load images below the fold
   - Use modern formats (WebP/AVIF) with fallbacks
   - Minimize layout shifts (CLS) with explicit dimensions
   - System fonts for instant loading (Inter, Fira Code)
   - CSS-based decorations over images (geometric shapes)

6. **Visual Feedback**: Provide immediate, clear feedback for all user actions:
   - Hover states (200ms transition)
   - Active/pressed states
   - Loading states with spinners or skeleton screens
   - Error states with clear messaging
   - Success confirmations

## Implementation Guidelines

### 1. Design Tokens

Always use CSS custom properties for consistency and themability:

- **Breakpoints**:

  - Mobile: 320px (min)
  - Tablet: 768px
  - Desktop: 1024px
  - Wide: 1440px

- **Colors**: Use HSL format with CSS variables for alpha support

  - Format: `hsl(var(--color-name))` or `hsl(var(--color-name) / 0.5)`
  - All colors must work in both light and dark modes

- **Spacing**: Use 8px base grid system

  - All spacing should be multiples of `var(--spacing-unit)` (8px)
  - Use predefined spacing variables (`--space-xs` through `--space-3xl`)

- **Typography**: Use defined type scale
  - Font sizes: `var(--text-xs)` through `var(--text-6xl)`
  - Line heights: 1.1-1.2 for headings, 1.6-1.7 for body

### 2. Component Requirements

#### Buttons

Must have all interactive states implemented:

- `:hover` - Border color change or background shift, warm shadow
- `:focus-visible` - Visible focus ring (keyboard navigation)
- `:active` - Pressed state with slight transform or opacity
- `:disabled` - Reduced opacity (0.5-0.6), cursor: not-allowed

**Specifications**:

- Minimum size: 44x44px (touch target)
- Padding: 12px vertical, 24px horizontal (minimum)
- Border radius: `var(--radius-sm)` (6px)
- Transition: `var(--transition)` (200ms)
- Font: `var(--font-mono)` for consistency

#### Links

- Color: Primary color (`hsl(var(--color-primary))`)
- Hover: Transition to lighter variant
- Underline: Optional, thin border-bottom if used
- Focus: Visible outline
- Visited: Consider styling (optional)

#### Cards

- Background: `hsl(var(--color-card))`
- Border: `1px solid hsl(var(--color-border))`
- Border radius: `var(--radius-lg)` (12px)
- Hover: Border → primary, add warm glow shadow
- Padding: Generous (`--space-lg` to `--space-2xl`)
- Transition: `var(--transition)`

#### Forms

- **Inputs**: Must always include associated `<label>` elements

  - Label above or beside input
  - Error messages below input in error color
  - Focus ring visible on interaction
  - Placeholder text should not replace labels

- **Validation**:

  - Inline validation on blur
  - Clear error messages
  - Success states for completed fields

- **Modals/Dialogs**:
  - Must trap focus within modal
  - Closable via `Esc` key
  - Backdrop click to close (optional)
  - Return focus to trigger element on close

### 3. Responsive Strategy

- **Sizing**: Use `rem` for font sizes and spacing (relative to root)
- **Media Queries**: Use `em` in media queries (more consistent)
- **Layout**:

  - Prefer CSS Grid with `grid-template-areas` for complex layouts
  - Makes reordering for mobile simpler and more semantic
  - Flexbox for one-dimensional layouts (rows/columns)

- **Content Reflow**:
  - Single column on mobile (<768px)
  - Multi-column on tablet and desktop
  - Consider reading order and information hierarchy

### 4. Accessibility Checklist

Before shipping any component:

- [ ] Use semantic HTML (`<main>`, `<nav>`, `<section>`, `<article>`, `<button>`)
- [ ] All images have descriptive `alt` attributes (or `alt=""` if decorative)
- [ ] Interactive elements are keyboard accessible (Tab, Enter, Space)
- [ ] Visible focus indicators on all interactive elements
- [ ] Color is not the only means of conveying information
- [ ] Text contrast meets WCAG 2.1 AA standards (4.5:1 normal, 3:1 large)
- [ ] Headings follow logical hierarchy (h1 → h2 → h3, no skipping)
- [ ] ARIA labels for icon-only buttons (`aria-label="Close"`)
- [ ] `aria-hidden="true"` for decorative elements (geometric shapes)
- [ ] Test with keyboard navigation (no mouse)
- [ ] Test with screen reader (NVDA, JAWS, or VoiceOver)

### 5. Performance Checklist

- [ ] Images use modern formats (WebP with JPEG/PNG fallback)
- [ ] Above-the-fold images use `priority` or eager loading
- [ ] Below-the-fold images use lazy loading (`loading="lazy"`)
- [ ] Images have explicit `width` and `height` to prevent CLS
- [ ] System fonts used for instant text rendering
- [ ] CSS bundle is minimal (no unused styles)
- [ ] JavaScript is minimal and deferred when possible
- [ ] Decorative elements use CSS (shapes, gradients) not images
- [ ] No layout shifts during page load (test CLS score)
- [ ] Skeleton screens for data-heavy components

### 6. Visual Design Standards

#### Minimalist Approach

- Borders over shadows (subtle 1px borders)
- Shadows only for elevated states (hover, active)
- Generous whitespace between elements
- Clean, uncluttered layouts
- Focus on content, not decoration

#### Interaction Design

- Transitions: 200ms for hover states (fast, responsive)
- Feedback: Immediate visual response to all actions
- Predictable: Consistent patterns across all components
- Subtle: Not jarring or distracting
- Purpose: Every animation serves a purpose

#### Dark Mode

- Full dark mode support via `.dark-mode` class
- No flash of unstyled content (theme applied before render)
- All colors have dark mode variants
- Reduced contrast in dark mode (less eye strain)
- Test all components in both modes

## Quick Reference

### Color Usage

```css
/* Correct - allows alpha channel */
background-color: hsl(var(--color-primary));
background-color: hsl(var(--color-primary) / 0.5); /* 50% opacity */

/* Incorrect - no alpha support */
background-color: var(--primary);
```

### Spacing Examples

```css
/* Correct - using design system */
padding: var(--space-lg);
margin-bottom: var(--space-2xl);
gap: calc(var(--spacing-unit) * 2); /* 16px */

/* Incorrect - arbitrary values */
padding: 24px;
margin-bottom: 48px;
```

### Typography Examples

```css
/* Correct - using type scale */
font-size: var(--text-lg);
font-size: clamp(var(--text-base), 2.5vw, var(--text-xl)); /* fluid */

/* Incorrect - arbitrary values */
font-size: 18px;
font-size: 1.125rem; /* hardcoded rem */
```

### Interactive State Template

```css
.component {
  /* Base state */
  background: hsl(var(--color-card));
  border: 1px solid hsl(var(--color-border));
  transition: var(--transition);
}

.component:hover {
  /* Hover state */
  border-color: hsl(var(--color-primary));
  box-shadow: var(--shadow-warm);
}

.component:focus-visible {
  /* Focus state for keyboard navigation */
  outline: 2px solid hsl(var(--color-ring));
  outline-offset: 2px;
}

.component:active {
  /* Active/pressed state */
  transform: translateY(1px);
}

.component:disabled {
  /* Disabled state */
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

## Testing Checklist

Before considering any UI component complete:

### Visual Testing

- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test at 320px width (mobile)
- [ ] Test at 768px width (tablet)
- [ ] Test at 1024px+ width (desktop)
- [ ] Test with system fonts disabled
- [ ] Test with images disabled

### Interaction Testing

- [ ] Hover states work on all interactive elements
- [ ] Click/tap feedback is immediate
- [ ] Animations are smooth (60fps)
- [ ] No janky or stuttering transitions
- [ ] Loading states display appropriately

### Accessibility Testing

- [ ] Navigate entire page with keyboard only (Tab, Shift+Tab, Enter, Space, Esc)
- [ ] All focusable elements have visible focus indicator
- [ ] Screen reader announces all content correctly (test with NVDA/JAWS/VoiceOver)
- [ ] Color contrast passes WCAG AA (test with browser tools)
- [ ] No information conveyed by color alone
- [ ] Zoom to 200% - layout doesn't break

### Performance Testing

- [ ] Lighthouse score >90 for Performance, Accessibility, Best Practices
- [ ] No Cumulative Layout Shift (CLS) during page load
- [ ] First Contentful Paint (FCP) <1.8s
- [ ] Largest Contentful Paint (LCP) <2.5s
- [ ] Images load progressively
- [ ] No render-blocking resources

## Common Pitfalls to Avoid

1. **Hardcoded colors**: Always use CSS variables
2. **Arbitrary spacing**: Use the spacing scale
3. **Missing focus states**: Never remove outlines without replacement
4. **Tiny touch targets**: Minimum 44x44px
5. **No loading states**: Always show feedback for async operations
6. **Broken dark mode**: Test every component in dark mode
7. **Layout shifts**: Set explicit dimensions for images/embeds
8. **Missing alt text**: Every `<img>` needs alt attribute
9. **Non-semantic HTML**: Use proper elements (`<button>` not `<div>`)
10. **Heavy animations**: Keep transitions under 300ms, prefer 200ms

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [HSL Color Format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl)
