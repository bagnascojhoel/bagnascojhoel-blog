---
applyTo: **/*.{ts,tsx}
description: How Notion is used as the CMS in this project
---

# Notion as Headless CMS

This project uses Notion as a headless CMS, fetching content from public Notion pages and rendering
them with a custom block renderer built on top of `notion-client` and `notion-types`. The
`react-notion-x` renderer has been removed.

## Core Dependencies

- **notion-client@6.16.0**: Official Notion API client for fetching page data
- **notion-types@6.16.0**: TypeScript types for Notion data structures (`ExtendedRecordMap`, `Block`)
- **notion-utils@6.16.0**: Utilities for parsing page IDs, extracting metadata, and traversing
  record maps

> `react-notion-x` is **not used**. Do not add it back or reference `NotionRenderer` from it.

## Architecture Overview

### Data Flow

1. **Configuration** (`site.config.ts`): Defines `rootNotionPageId` as the entry point
2. **Page Resolution** (`lib/resolve-notion-page.ts`): Maps URLs to Notion page IDs using
   `getSiteMap()` and optional URL overrides
3. **Data Fetching** (`lib/notion.ts`): Fetches pages via `notion.getPage(pageId)` returning an
   `ExtendedRecordMap`
4. **Rendering** (`components/NotionPage.tsx`): Passes the record map to `NotionBlockRenderer`

### Key Files

- **`lib/notion-api.ts`**: Creates the `NotionAPI` instance
- **`lib/notion.ts`**: Main API wrapper with preview image support and navigation link resolution
- **`lib/get-site-map.ts`**: Crawls all pages from root using `getAllPagesInSpace()`
- **`lib/resolve-notion-page.ts`**: Resolves friendly URLs to Notion page IDs
- **`lib/get-canonical-page-id.ts`**: Extracts canonical page ID from record map
- **`lib/map-page-url.ts`**: Generates URL slugs from page titles
- **`lib/map-image-url.ts`**: Proxies Notion image URLs through Next.js for caching
- **`lib/notion-rich-text.tsx`**: Converts Notion inline `Decoration[]` arrays to JSX
- **`pages/[pageId].tsx`**: Dynamic page route using `getStaticProps` / `getStaticPaths` for SSG

## Custom Block Renderer

### Entry Point: `NotionBlockRenderer`

`components/NotionBlockRenderer.tsx` is the recursive dispatcher. It takes a `blockId` and the full
`ExtendedRecordMap`, dispatches to the correct block component by `block.type`, and groups
consecutive list items into `<ul>` / `<ol>` wrappers automatically.

```tsx
<NotionBlockRenderer
  blockId={rootBlockId}
  recordMap={recordMap}
  mapPageUrl={mapPageUrl}
  mapImageUrl={mapImageUrl}
/>
```

Props:

| Prop | Type | Description |
|---|---|---|
| `blockId` | `string` | Notion block ID to render |
| `recordMap` | `ExtendedRecordMap` | Full page data from the API |
| `mapPageUrl` | `(pageId: string) => string` | Converts page ID to site URL |
| `mapImageUrl` | `(url: string, block: Block) => string` | Proxies image URLs |
| `level` | `number` (internal) | Nesting depth, passed recursively |

### Block Modules (`components/notion-blocks/`)

| File | Block types handled |
|---|---|
| `TextBlocks.tsx` | `text`, `header`, `sub_header`, `sub_sub_header`, `quote`, `callout`, `divider` |
| `ListBlocks.tsx` | `bulleted_list`, `numbered_list`, `to_do`, `toggle` |
| `MediaBlocks.tsx` | `image`, `video`, `embed`, `bookmark` |
| `CodeBlock.tsx` | `code` (Prism syntax highlighting via `useEffect`) |
| `StructureBlocks.tsx` | `column_list`, `column`, `page` (link), `alias` |
| `TableBlocks.tsx` | `table`, `table_row` |
| `CollectionViewBlock.tsx` | `collection_view`, `collection_view_page` (gallery view) |

### Rich Text: `lib/notion-rich-text.tsx`

Call `renderRichText(decorations, options?)` to convert a Notion `Decoration[]` inline array to
JSX, handling: bold, italic, strikethrough, underline, inline code, links, and Notion text colors.

```tsx
import { renderRichText } from "@/lib/notion-rich-text";

// Inside a block component:
const content = renderRichText(block.properties?.title, { mapPageUrl });
```

## Configuration

### Required Settings (`site.config.ts`)

```typescript
{
  rootNotionPageId: "676e2b566d4b4e4cb706a06383b74b30",
  rootNotionSpaceId: null,
  name: "Site Name",
  domain: "example.com",
  author: "Author Name",
}
```

### Optional Settings

- **`pageUrlOverrides`**: Map custom URLs to specific page IDs
- **`includeNotionIdInUrls`**: Append Notion UUID to slugs to prevent collisions
- **`isPreviewImageSupportEnabled`**: Generate LQIP for smooth image loading
- **`isRedisEnabled`**: Cache preview images in Redis

## URL Mapping & Routing

1. Page titles → slugs (e.g., "My Blog Post" → `/my-blog-post`)
2. `pageUrlOverrides` in config for manual overrides
3. Direct UUID access always works as fallback

### Caching

- **Site map**: Crawled at build time, cached with `p-memoize`
- **URI to page ID**: Optional Redis cache (`uri-to-page-id:{domain}:{env}:{uri}`)
- **ISR**: Pages use `revalidate: 10`

## Styling

Styles live in `styles/global.css` and Tailwind v4 utility classes. There are no `.notion-*` CSS
class overrides — all markup comes from the custom block components, so styles are applied directly
to the rendered HTML elements.

- **Dark mode**: `.dark` class on `<body>`, toggled via `localStorage`
- **Design tokens**: Defined in `@theme {}` in `styles/global.css` (bridged to CSS custom properties)
- **Primary color**: `#f97316` (orange)

## Working with Notion Pages

### Page Requirements

1. Pages must be publicly accessible ("Share to web") in Notion
2. Content must be organized under `rootNotionPageId`
3. Use page properties for metadata (author, published date, description)

### Page Properties

```typescript
import { getPageProperty } from "notion-utils";

const description = getPageProperty<string>("Description", block, recordMap);
const publishedDate = getPageProperty<string>("Published", block, recordMap);
```

### Collection/Database Pages

```typescript
const isBlogPost =
  block?.type === "page" && block?.parent_table === "collection";
```

## Build & Deployment

- **Dev**: All pages rendered dynamically
- **Production**: Pre-rendered at build time via `getSiteMap()`
- **Incremental**: On-demand rendering with 10-second ISR revalidation

### API Rate Limiting

Notion API allows ~3 requests/second. Use `NOTION_API_BASE_URL` to point to a caching proxy if
builds fail with 429 errors.

## Adding New Block Types

1. Identify the `block.type` string from `notion-types`
2. Create a component in the appropriate file under `components/notion-blocks/`
3. Add the case to the `switch` in `components/NotionBlockRenderer.tsx`
4. Use `renderRichText()` for any inline text content
5. Call `<NotionBlockRenderer>` recursively for child blocks via `block.content`

## Troubleshooting

1. **Page not found**: Verify the page is publicly shared in Notion
2. **Build 429 errors**: Too many pages; use `NOTION_API_BASE_URL` caching proxy
3. **Block not rendering**: Check `NotionBlockRenderer.tsx` switch — the type may not have a case yet
4. **Images not loading**: Check `mapImageUrl` configuration
5. **Slug conflicts**: Enable `includeNotionIdInUrls` or use `pageUrlOverrides`
