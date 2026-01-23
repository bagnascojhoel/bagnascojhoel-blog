---
applyTo: **/*.{ts,tsx}
description: How Notion is used as the CMS in this project
---

# Notion as Headless CMS

This project uses Notion as a headless CMS, fetching content from public Notion pages and rendering
them with Next.js static site generation.

## Core Dependencies

- **notion-client@6.16.0**: Official Notion API client for fetching page data
- **notion-types@6.16.0**: TypeScript types for Notion data structures
- **notion-utils@6.16.0**: Utilities for parsing page IDs, extracting metadata, and traversing
  record maps
- **react-notion-x@6.16.0**: React renderer for Notion blocks with full support for all block types

## Architecture Overview

### Data Flow

1. **Configuration** (`site.config.ts`): Defines `rootNotionPageId` as the entry point for the
   site's content hierarchy
2. **Page Resolution** (`lib/resolve-notion-page.ts`): Maps URLs to Notion page IDs using
   `getSiteMap()` and optional URL overrides
3. **Data Fetching** (`lib/notion.ts`): Fetches pages via `notion.getPage(pageId)` which returns an
   `ExtendedRecordMap` containing all blocks and metadata
4. **Rendering** (`components/NotionPage.tsx`): Uses `NotionRenderer` from `react-notion-x` to
   render blocks as React components

### Key Files

- **`lib/notion-api.ts`**: Creates the `NotionAPI` instance with optional custom `apiBaseUrl` for
  self-hosted proxies
- **`lib/notion.ts`**: Main API wrapper with preview image support and navigation link resolution
- **`lib/get-site-map.ts`**: Crawls all pages starting from root using `getAllPagesInSpace()` to
  build a site map
- **`lib/resolve-notion-page.ts`**: Resolves friendly URLs (slugs) to Notion page IDs using cache
  and URL mappings
- **`lib/get-canonical-page-id.ts`**: Extracts canonical page ID from record map (with or without
  UUID in URL)
- **`lib/map-page-url.ts`**: Generates user-friendly URLs from page titles (slugs) or uses UUID
  format
- **`lib/map-image-url.ts`**: Proxies Notion image URLs through Next.js API routes for better
  caching
- **`pages/[pageId].tsx`**: Dynamic page route using `getStaticProps` and `getStaticPaths` for SSG

## Configuration

### Required Settings (`site.config.ts`)

```typescript
{
  rootNotionPageId: "676e2b566d4b4e4cb706a06383b74b30", // UUID of root page (required)
  rootNotionSpaceId: null, // Optional: restrict to specific workspace
  name: "Site Name",
  domain: "example.com",
  author: "Author Name",
}
```

### Optional Settings

- **`pageUrlOverrides`**: Map custom URLs to specific page IDs
  ```typescript
  pageUrlOverrides: {
    '/about': '067dd719a912471ea9a3ac10710e7fdf'
  }
  ```
- **`includeNotionIdInUrls`**: If `true`, URLs include Notion UUID (e.g.,
  `/my-page-676e2b566d4b4e4cb706a06383b74b30`); if `false`, uses clean slugs (e.g., `/my-page`)
- **`isPreviewImageSupportEnabled`**: Generates low-quality image placeholders (LQIP) for smooth
  loading
- **`isRedisEnabled`**: Cache preview images in Redis (requires `REDIS_HOST` and `REDIS_PASSWORD`
  env vars)
- **`navigationStyle`**: `"default"` (from Notion) or `"custom"` with `navigationLinks` array

## URL Mapping & Routing

### How URLs Work

1. **Slug Generation**: Page titles are converted to URL-friendly slugs (e.g., "My Blog Post" →
   `/my-blog-post`)
2. **UUID Option**: Can append Notion page ID to prevent collisions (controlled by
   `includeNotionIdInUrls`)
3. **Custom Overrides**: Use `pageUrlOverrides` in config for specific URL mappings
4. **Fallback**: Direct Notion UUID access always works (e.g., `/676e2b566d4b4e4cb706a06383b74b30`)

### Caching Strategy

- **Site Map**: All pages crawled at build time and cached with `p-memoize`
- **URI to Page ID**: Optional Redis cache for resolved URLs (`uri-to-page-id:{domain}:{env}:{uri}`)
- **ISR**: Pages use `revalidate: 10` for Incremental Static Regeneration (revalidate every 10
  seconds)

## Rendering Notion Content

### NotionRenderer Component

The `NotionPage` component uses `react-notion-x`'s `NotionRenderer` with custom configuration:

```tsx
<NotionRenderer
  recordMap={recordMap} // Notion page data
  rootPageId={site.rootNotionPageId} // Site root for navigation
  rootDomain={site.domain} // Domain for canonical URLs
  fullPage={!isLiteMode} // Full page vs embed mode
  darkMode={false} // Dark mode controlled externally
  components={components} // Custom component overrides
  mapPageUrl={siteMapPageUrl} // URL mapping function
  mapImageUrl={mapImageUrl} // Image URL proxy
  searchNotion={searchNotion} // Search functionality
  previewImages={!!recordMap.preview_images} // LQIP support
  showCollectionViewDropdown={false} // Hide view switcher
  showTableOfContents={false} // Hide TOC (can be enabled)
  defaultPageIcon={config.defaultPageIcon} // Fallback icon
  defaultPageCover={config.defaultPageCover} // Fallback cover image
  footer={footer} // Custom footer component
/>
```

### Custom Components

Override default Notion block renderers:

- **`Code`**: Dynamic import for code blocks with Prism syntax highlighting (supports 30+
  languages)
- **`Collection`**: Database/collection views
- **`Equation`**: LaTeX equation rendering
- **`Pdf`**: PDF embed support
- **`Modal`**: Image/media lightbox
- **`Tweet`**: Embedded tweets via `react-tweet-embed`
- **`Header`**: Custom `NotionPageHeader` component
- **Property Formatters**: Custom rendering for page properties (dates, authors, etc.)

## Styling Notion Content

### Custom Styles (`styles/notion.css`)

All Notion block styles can be overridden by targeting `.notion-*` classes:

- **Collections**: `.notion-collection-card` with hover effects matching site design
- **Links**: `.notion-link` uses primary color from design system
- **Callouts**: `.notion-callout` with custom background colors
- **Code Blocks**: Prism theme in `styles/prism-theme.css` with warm color palette
- **Typography**: Notion text inherits global typography from `styles/global.css`

### Design Integration

- Use HSL color variables from `styles/global.css` (e.g., `hsl(var(--color-primary))`)
- Maintain consistent spacing with `var(--space-*)` tokens
- Ensure dark mode support by styling both light and `.dark-mode` variants
- Follow warm color palette: primary orange `#D97744`, browns, and warm grays

## Working with Notion Pages

### Page Requirements

1. **Public Access**: All pages must be publicly accessible via "Share to web" in Notion
2. **Hierarchy**: Organize content under the root page specified in `rootNotionPageId`
3. **Metadata**: Use page properties for custom metadata (author, published date, description)
4. **Covers**: Page covers and icons are automatically fetched and displayed

### Page Properties

Custom properties are accessible via `getPageProperty()` from `notion-utils`:

```typescript
const description = getPageProperty<string>("Description", block, recordMap);
const publishedDate = getPageProperty<string>("Published", block, recordMap);
const author = getPageProperty<string>("Author", block, recordMap);
```

### Collection/Database Pages

Blog posts identified by:

```typescript
const isBlogPost =
  block?.type === "page" && block?.parent_table === "collection";
```

These pages automatically inherit database properties (status, tags, dates, etc.) and render
differently.

## Build & Deployment

### Static Site Generation

- **Dev Mode**: No pages pre-rendered, all dynamic (fallback: true, paths: [])
- **Production**: All pages discovered via `getSiteMap()` and pre-rendered at build time
- **Incremental**: New pages rendered on-demand with 10-second revalidation

### API Rate Limiting

Notion API has rate limits (3 requests/second). During builds with many pages:

- Use environment variable `NOTION_API_BASE_URL` to point to a caching proxy if needed
- Build errors may occur due to 429 (Too Many Requests) responses
- Dev server is better for testing; production builds should be done incrementally

### Environment Variables

- **`NOTION_API_BASE_URL`** (optional): Custom Notion API endpoint for caching/proxy
- **`REDIS_HOST`** (optional): Redis hostname for preview image caching
- **`REDIS_PASSWORD`** (optional): Redis password

## Search Functionality

### Implementation (`lib/search-notion.ts`)

Search is optional and controlled by `isSearchEnabled` in config. When enabled:

- Uses `notion.search(params)` from Notion API
- Returns matching pages with snippets
- Integrated into `NotionRenderer` via `searchNotion` prop

## Preview Images

### LQIP Generation

When `isPreviewImageSupportEnabled` is `true`:

- All images analyzed for dominant color and blur hash
- Low-quality placeholders generated for smooth loading
- Stored in `recordMap.preview_images` map
- Optionally cached in Redis if `isRedisEnabled` is `true`

### Image Proxying

Images proxied through Next.js for:

- Caching and CDN support
- Consistent domain (avoid mixed content warnings)
- Image optimization via `next/image`

## Best Practices

### Content Management

- Keep Notion pages organized in a clear hierarchy
- Use page properties consistently (Description, Published, Author)
- Avoid deeply nested hierarchies (>3 levels) for performance
- Test page slugs for URL conflicts before publishing

### Development

- Always fetch pages with TypeScript types: `ExtendedRecordMap` from `notion-types`
- Use `parsePageId()` from `notion-utils` to extract UUIDs from URLs
- Cache expensive operations with `p-memoize`
- Handle errors gracefully (404s, API failures)

### Styling

- Never override Notion core layout classes (e.g., `.notion-viewport`)
- Use specific selectors (`.notion-link`, `.notion-callout`) not generic ones
- Test styles with various Notion block types (callouts, quotes, toggles, databases)
- Maintain visual consistency with site design system

### Performance

- Enable preview images for better UX (`isPreviewImageSupportEnabled: true`)
- Use Redis caching in production if serving many images
- Monitor Notion API rate limits during builds
- Consider ISR revalidation interval (default: 10s)

## Troubleshooting

### Common Issues

1. **"Page not found" errors**: Verify page is publicly accessible in Notion
2. **Build failures (429 errors)**: Too many pages or API rate limit hit; use caching proxy or build
   incrementally
3. **Images not loading**: Check `mapImageUrl` is configured correctly; ensure Notion image URLs are
   proxied
4. **Styling inconsistencies**: Check `.notion-*` selectors in `styles/notion.css`; ensure HSL
   color variables are defined
5. **Slug conflicts**: Enable `includeNotionIdInUrls` or use `pageUrlOverrides` for specific pages

### Debugging

Access debug objects in browser console (dev mode only):

```javascript
window.pageId; // Current Notion page ID
window.recordMap; // Full Notion page data
window.block; // Root block of current page
```

## References

- [react-notion-x Documentation](https://github.com/NotionX/react-notion-x)
- [notion-utils Documentation](https://github.com/NotionX/react-notion-x/tree/master/packages/notion-utils)
- [Notion API Unofficial](https://github.com/NotionX/react-notion-x/tree/master/packages/notion-client)
