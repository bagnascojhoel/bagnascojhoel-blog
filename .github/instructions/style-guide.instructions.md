---
applyTo: *.html, *.css, *.js, *.ts, *.tsx
name: Project Style Guide
---

# Project Style Guide

This document defines the visual language and design tokens for the blog with warm, minimalist
aesthetics. It aligns with the
[Atomic Design Standards](atomic-design-standards.md) and [UI/UX Rules](ui-ux-rules.md).

## Design Philosophy

The design system emphasizes:

1. **Typography First**: Strong hierarchy through font sizes and weights
2. **Minimal Borders**: Subtle borders instead of heavy shadows
3. **Generous Whitespace**: Content has room to breathe
4. **Subtle Interactions**: Simple, predictable hover states (200ms transitions)
5. **Clean Color Palette**: Warm neutral grays with orange accent
6. **System Fonts**: Fast loading with Inter and Fira Code

## 1. Design Tokens

### Colors

Colors are defined using HSL values for better alpha channel support and dark mode flexibility.
Use the format: `hsl(var(--color-name))` or `hsl(var(--color-name) / 0.5)` for transparency.

#### Light Mode

| Name                       | HSL Value    | Hex Equivalent | Usage                                 |
| :------------------------- | :----------- | :------------- | :------------------------------------ |
| `--color-primary`          | `18 65% 55%` | `#D97744`      | Primary actions, links, highlights    |
| `--color-primary-glow`     | `18 70% 65%` | `#e89461`      | Lighter variant for glows, gradients  |
| `--color-background`       | `45 30% 96%` | `#f8f6f2`      | Main page background (warm off-white) |
| `--color-card`             | `40 25% 98%` | `#faf9f7`      | Cards, sections, elevated surfaces    |
| `--color-foreground`       | `25 20% 20%` | `#382f2a`      | Primary text content                  |
| `--color-muted`            | `35 20% 85%` | `#dcd8d2`      | Muted backgrounds, disabled states    |
| `--color-muted-foreground` | `25 15% 45%` | `#776f69`      | Secondary text, labels, captions      |
| `--color-border`           | `35 20% 85%` | `#dcd8d2`      | Borders, dividers                     |
| `--color-accent`           | `25 55% 50%` | `#c6784d`      | Brown accent for decorative elements  |
| `--color-secondary`        | `35 30% 90%` | `#e8e4de`      | Secondary backgrounds, tags           |

#### Dark Mode

| Name                       | HSL Value    | Hex Equivalent | Usage                            |
| :------------------------- | :----------- | :------------- | :------------------------------- |
| `--color-primary`          | `18 70% 60%` | `#e89461`      | Primary actions (lighter orange) |
| `--color-background`       | `25 20% 10%` | `#1f1915`      | Main dark background             |
| `--color-card`             | `25 18% 14%` | `#2a241f`      | Elevated dark surfaces           |
| `--color-foreground`       | `40 20% 90%` | `#e8e5e0`      | Light text on dark               |
| `--color-muted`            | `25 15% 25%` | `#463f3a`      | Dark muted backgrounds           |
| `--color-muted-foreground` | `35 15% 60%` | `#a09891`      | Secondary dark text              |
| `--color-border`           | `25 15% 25%` | `#463f3a`      | Dark borders                     |

### Typography

- **Font Families**:
  - **Sans-serif**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
  - **Monospace**: `'Fira Code', 'JetBrains Mono', monospace`
- **Type Scale**:
  - `--text-xs`: `0.75rem` (12px) - Small labels, meta info
  - `--text-sm`: `0.875rem` (14px) - Body text (small), tags
  - `--text-base`: `1rem` (16px) - Body text (default)
  - `--text-lg`: `1.125rem` (18px) - Subheadings, emphasis
  - `--text-xl`: `1.25rem` (20px) - Section titles
  - `--text-2xl`: `1.5rem` (24px) - Card titles
  - `--text-3xl`: `1.875rem` (30px) - Section headings
  - `--text-4xl`: `2.25rem` (36px) - Page titles
  - `--text-5xl`: `3rem` (48px) - Hero headings
  - `--text-6xl`: `3.75rem` (60px) - Display text
- **Line Heights**:
  - Headings: `1.1-1.2`
  - Body: `1.6-1.7`
- **Fluid Typography**: Use `clamp()` for responsive scaling:
  - Example: `font-size: clamp(var(--text-2xl), 4vw, var(--text-4xl))`

### Spacing

Based on an 8px grid system for consistent rhythm.

- `--space-xs`: `0.25rem` (4px)
- `--space-sm`: `0.5rem` (8px)
- `--space-md`: `1rem` (16px)
- `--space-lg`: `1.5rem` (24px)
- `--space-xl`: `2rem` (32px)
- `--space-2xl`: `3rem` (48px)
- `--space-3xl`: `4rem` (64px)
- `--spacing-unit`: `8px` (base unit)

### Border Radius

- `--radius-sm`: `0.375rem` (6px) - Small elements
- `--radius-md`: `0.5rem` (8px) - Buttons, inputs
- `--radius-lg`: `0.75rem` (12px) - Cards
- `--radius-xl`: `1rem` (16px) - Large cards

### Shadows

Minimal shadow usage, preferring borders. When shadows are used:

- `--shadow-sm`: `0 1px 2px 0 hsl(25 20% 20% / 0.05)` - Subtle depth
- `--shadow-md`: `0 4px 6px -1px hsl(25 20% 20% / 0.1)` - Moderate elevation
- `--shadow-warm`: `0 10px 30px -10px hsl(18 65% 55% / 0.15)` - Warm glow for hover states

### Transitions

- `--transition-fast`: `150ms ease` - Quick interactions
- `--transition-base`: `300ms ease` - Standard transitions
- `--transition-slow`: `500ms ease` - Deliberate animations
- `--transition`: `all 0.2s ease` - Default for hover states

## 2. Component Patterns

### Buttons

Must have all interactive states:

- **States**: `:hover`, `:focus-visible`, `:active`, `:disabled`
- **Primary Button**:
  - Background: `hsl(var(--color-primary))`
  - Text: `hsl(var(--color-primary-foreground))`
  - Hover: Warm glow shadow + slight opacity reduction
  - Padding: `12px 24px`
  - Border radius: `var(--radius-sm)` (6px)
- **Secondary Button**:
  - Background: `transparent`
  - Border: `1px solid hsl(var(--color-border))`
  - Hover: Background `hsl(var(--color-muted))`

### Cards

- **Default Card**:
  - Background: `hsl(var(--color-card))`
  - Border: `1px solid hsl(var(--color-border))`
  - Border radius: `var(--radius-lg)` (12px)
  - Padding: `var(--space-lg)` to `var(--space-2xl)`
  - Hover: Border changes to `hsl(var(--color-primary))`, add `--shadow-warm`
  - Transition: `var(--transition)`

### Links

- Color: `hsl(var(--color-primary))`
- Hover: Transition to `hsl(var(--color-primary-glow))`
- Underline: Optional thin border-bottom (0.1rem)
- Transition: `var(--transition)`

### Tags

- Background: `hsl(var(--color-secondary))`
- Text: `hsl(var(--color-secondary-foreground))`
- Font: `var(--font-mono)`, `var(--text-xs)`
- Padding: `4px 12px`
- Border radius: `6px`

### Code Blocks

- Background: `hsl(var(--color-card))`
- Border: `1px solid hsl(var(--color-border))`
- Border radius: `var(--radius-md)`
- Font: `var(--font-mono)`
- Shadow: `var(--shadow-sm)`

### Inline Code

- Background: `hsl(var(--color-secondary))`
- Color: `hsl(var(--color-primary))`
- Font: `var(--font-mono)`
- Padding: `0.2em 0.4em`
- Border radius: `4px`
- Font size: `0.9em`

## 3. Layout Patterns

### Container Widths

- `--max-width`: `1200px` - Main content container
- `--large-container-width`: `1100px` - Alternative container

### Geometric Background

Decorative floating shapes for visual interest:

- **Shape Variants**:
  - Large: 150px squares with 3px border
  - Medium: 100px squares with 2px border
  - Small: 50px solid squares
- **Animation**: 20s floating effect with rotation
- **Opacity**: 0.1-0.15 for subtle background effect
- **Colors**: Primary and accent colors

### Scrollbar Styling

Custom minimal scrollbar (6px thin):

- Track: Transparent or background color
- Thumb: `hsl(var(--color-border))`
- Thumb hover: `hsl(var(--color-muted-foreground) / 0.5)`

## 4. Interaction Guidelines

### Hover States

- **Duration**: 200ms (fast interactions)
- **Effect**: Border color change to primary, not heavy shadows
- **Cards**: Border → primary color, add warm glow
- **Links**: Color → primary-glow
- **Buttons**: Opacity or background change + warm shadow

### Focus States

- Visible focus ring using `--color-ring` (primary color)
- Must be visible on all interactive elements
- Use `:focus-visible` to show only for keyboard navigation

### Transitions

- All transitions should use `var(--transition)` (200ms ease)
- Smooth, predictable, not jarring
- Avoid overly complex animations

## 5. Accessibility & Best Practices

### Color Contrast

- Ensure 4.5:1 ratio for normal text
- Ensure 3:1 ratio for large text (18px+)
- Test both light and dark modes

### Semantic HTML

- Use `<main>`, `<nav>`, `<section>`, `<article>`, `<aside>`
- Headings in logical order (h1 → h2 → h3)
- Proper ARIA labels for icons and decorative elements

### Responsive Design

- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Use `rem` for sizing, `em` for media queries
- Fluid typography with `clamp()`

### Performance

- System fonts load instantly
- Minimize CSS bundle size
- Use CSS variables for theme switching
- Geometric shapes use CSS (no images)

## 6. Dark Mode

Dark mode is fully supported with automatic variable overrides using the `.dark-mode` class.
All components automatically adapt when this class is present on the body element.

### Theme Toggle

- Stored in localStorage
- Applied before page render to prevent flash
- Syncs with system preference if no saved value
