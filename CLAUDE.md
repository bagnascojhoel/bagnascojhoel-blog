# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog (`blog.bagnascojhoel.com.br`) built on **Next.js 14** using **Notion as the CMS**. All blog content is managed in Notion and rendered via `react-notion-x`. The sole developer uses AI agents extensively — consult the `.ai/` directory for project-specific standards before making any changes.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run all checks (lint + format)
npm run test:lint    # ESLint only
npm run test:prettier # Prettier check only
npm run analyze      # Bundle size analysis
```

There are no unit tests — `npm test` only runs ESLint and Prettier.

## Architecture

### Notion as Data Source

Content flows from Notion → `lib/notion-api.ts` → `lib/resolve-notion-page.ts` → rendered in `components/NotionPage.tsx`. The root Notion page ID is defined in `site.config.ts`. Pages are resolved by Notion page ID; `lib/map-page-url.ts` handles URL generation, and `pageUrlOverrides` in `site.config.ts` maps specific Notion IDs to custom URL paths.

### Key Files

- `site.config.ts` — All site configuration (Notion IDs, domain, analytics, feature flags)
- `lib/config.ts` — Merges `site.config.ts` with environment variables into exported constants
- `pages/[pageId].tsx` — Dynamic route that serves all Notion-backed pages
- `pages/api/` — Two endpoints: `search-notion.ts` and `notion-page-info.tsx`
- `components/NotionPage.tsx` — Main rendering component with dynamic code language imports

### TypeScript Path Aliases

```
@/components/* → components/*
@/lib/*        → lib/*
@/styles/*     → styles/*
```

### Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_FATHOM_ID` | Fathom analytics (disabled in dev) |
| `NEXT_PUBLIC_POSTHOG_ID` | PostHog analytics |
| `REDIS_HOST`, `REDIS_PASSWORD` | Optional Redis caching for preview images |
| `REDIS_URL`, `REDIS_NAMESPACE` | Alternative Redis config |

## Agent Library (`.ai/` Directory)

Before implementing any feature, consult:

- `.ai/ui-ux-rules.md` — Mobile-first (320px min), WCAG 2.1 accessibility, performance targets
- `.ai/style-guide.md` — Design tokens, color system (primary orange `#f97316`), component patterns
- `.ai/atomic-design-standards.md` — BEM naming, component hierarchy (atoms → molecules → organisms)
- `.ai/features/` — ADRs and implementation plans for in-progress features

### Design System

- **Primary color**: `#f97316` (orange) for accents, borders, interactive elements
- **Breakpoints**: 768px (tablet), 1024px (desktop)
- **Dark mode**: toggled via `.dark` class on `<body>`, persisted in `localStorage`
- **CSS naming**: BEM (`Block__Element--Modifier`)
- **Spacing tokens**: `--spacing-xs` through `--spacing-xl` (0.5rem–3rem)

## Deployment

Deployed to Vercel (`vercel deploy`). In production, `apiHost` resolves via `VERCEL_URL` env var. Redis is optional for caching LQIP preview images.
