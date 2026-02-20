import * as React from "react";
import Link from "next/link";
import { formatDate } from "notion-utils";
import type {
  Block,
  ExtendedRecordMap,
  CollectionViewBlock as CollectionViewBlockType,
} from "notion-types";

interface CollectionViewBlockProps {
  block: Block;
  recordMap: ExtendedRecordMap;
  mapPageUrl: (pageId: string) => string;
  mapImageUrl: (url: string, block: Block) => string;
}

function getPageIds(
  recordMap: ExtendedRecordMap,
  collectionId: string,
  viewIds: string[],
): string[] {
  for (const viewId of viewIds) {
    const queryResult = recordMap.collection_query?.[collectionId]?.[viewId];
    if (!queryResult) continue;

    // grouped results (most common)
    const anyResult = queryResult as unknown as Record<string, unknown>;
    const grouped = anyResult?.collection_group_results as
      | { blockIds?: string[] }
      | undefined;
    if (grouped?.blockIds?.length) return grouped.blockIds;

    // flat results
    const flat = anyResult as { blockIds?: string[] };
    if (flat?.blockIds?.length) return flat.blockIds;

    // reducer-style results
    const reduced = anyResult as {
      results?: { value?: { block_ids?: string[] } };
    };
    const blockIds = reduced?.results?.value?.block_ids;
    if (blockIds?.length) return blockIds;
  }
  return [];
}

interface GalleryCardProps {
  pageBlock: Block;
  schema: Record<string, { name: string; type: string }>;
  mapPageUrl: (pageId: string) => string;
  mapImageUrl: (url: string, block: Block) => string;
}

function GalleryCard({
  pageBlock,
  schema,
  mapPageUrl,
  mapImageUrl,
}: GalleryCardProps) {
  const title = pageBlock.properties?.title?.[0]?.[0] ?? "Untitled";
  const href = mapPageUrl(pageBlock.id);

  const coverRaw =
    pageBlock.format?.page_cover ?? pageBlock.format?.social_vector;
  const coverSrc = coverRaw ? mapImageUrl(coverRaw, pageBlock) : null;

  // Find date and tags from schema
  let dateValue: string | null = null;
  let tags: string[] = [];

  for (const [propId, schemaDef] of Object.entries(schema)) {
    if (propId === "title") continue;
    const rawProp = (
      pageBlock.properties as Record<string, [string, unknown[]][]> | undefined
    )?.[propId];

    if (schemaDef.type === "date" && !dateValue) {
      const startDate = (
        rawProp?.[0]?.[1] as [string, { start_date: string }][] | undefined
      )?.[0]?.[1]?.start_date;
      if (startDate) {
        dateValue = formatDate(startDate, { month: "long" });
      }
    }

    if (schemaDef.type === "multi_select" && tags.length === 0) {
      const tagStr = rawProp?.[0]?.[0];
      if (typeof tagStr === "string") {
        tags = tagStr
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }
  }

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] transition-all duration-200 hover:border-[hsl(var(--color-primary))] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[hsl(var(--color-primary))] focus-visible:outline-offset-2"
    >
      {coverSrc && (
        <figure className="aspect-video overflow-hidden">
          <img
            src={coverSrc}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </figure>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="font-mono text-base font-semibold text-[hsl(var(--color-foreground))] group-hover:text-[hsl(var(--color-primary))] transition-colors line-clamp-2">
          {title}
        </h2>

        {(dateValue || tags.length > 0) && (
          <div className="mt-auto flex flex-wrap items-center gap-2">
            {dateValue && (
              <time className="font-mono text-xs text-[hsl(var(--color-muted-foreground))]">
                {dateValue}
              </time>
            )}
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-[hsl(var(--color-secondary))] px-2 py-0.5 font-mono text-xs text-[hsl(var(--color-foreground))]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export function CollectionViewBlock({
  block,
  recordMap,
  mapPageUrl,
  mapImageUrl,
}: CollectionViewBlockProps) {
  const cvBlock = block as unknown as CollectionViewBlockType;
  const collectionId = cvBlock.collection_id;
  if (!collectionId) return null;

  const viewIds: string[] = cvBlock.view_ids ?? [];
  const collection = recordMap.collection?.[collectionId]?.value;
  if (!collection) return null;

  const schema = collection.schema as Record<
    string,
    { name: string; type: string }
  >;
  const pageIds = getPageIds(recordMap, collectionId, viewIds);

  if (pageIds.length === 0) return null;

  const pages = pageIds
    .map((id) => recordMap.block[id]?.value)
    .filter(
      (b): b is Block =>
        !!b && (b.type === "page" || b.type === "collection_view_page"),
    );

  return (
    <section aria-label={collection.name?.[0]?.[0] ?? "Collection"}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <GalleryCard
            key={page.id}
            pageBlock={page}
            schema={schema}
            mapPageUrl={mapPageUrl}
            mapImageUrl={mapImageUrl}
          />
        ))}
      </div>
    </section>
  );
}
