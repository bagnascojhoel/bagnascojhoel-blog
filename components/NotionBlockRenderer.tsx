import * as React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";

import {
  ParagraphBlock,
  HeadingBlock,
  QuoteBlock,
  CalloutBlock,
  DividerBlock,
} from "./notion-blocks/TextBlocks";
import {
  BulletedListItemBlock,
  NumberedListItemBlock,
  ToDoBlock,
  ToggleBlock,
} from "./notion-blocks/ListBlocks";
import {
  ImageBlock,
  VideoBlock,
  EmbedBlock,
  BookmarkBlock,
} from "./notion-blocks/MediaBlocks";
import { CodeBlock } from "./notion-blocks/CodeBlock";
import {
  ColumnListBlock,
  ColumnBlock,
  PageLinkBlock,
  AliasBlock,
} from "./notion-blocks/StructureBlocks";
import { TableBlock } from "./notion-blocks/TableBlocks";
import { CollectionViewBlock } from "./notion-blocks/CollectionViewBlock";

export interface NotionBlockRendererProps {
  blockId: string;
  recordMap: ExtendedRecordMap;
  mapPageUrl: (pageId: string) => string;
  mapImageUrl: (url: string, block: Block) => string;
  /** Internal use — level of nesting */
  level?: number;
}

/**
 * Groups consecutive list items into wrapped <ul>/<ol> elements.
 * Non-list items are returned as-is.
 */
function groupListItems(
  childIds: string[],
  recordMap: ExtendedRecordMap,
  renderBlock: (id: string) => React.ReactNode,
): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let i = 0;

  while (i < childIds.length) {
    const id = childIds[i];
    const block = recordMap.block[id]?.value;
    const type = block?.type;

    if (type === "bulleted_list") {
      const items: React.ReactNode[] = [];
      while (
        i < childIds.length &&
        recordMap.block[childIds[i]]?.value?.type === "bulleted_list"
      ) {
        items.push(renderBlock(childIds[i]));
        i++;
      }
      result.push(
        <ul key={`ul-${id}`} className="my-2 ml-5 list-disc space-y-0.5">
          {items}
        </ul>,
      );
    } else if (type === "numbered_list") {
      const items: React.ReactNode[] = [];
      while (
        i < childIds.length &&
        recordMap.block[childIds[i]]?.value?.type === "numbered_list"
      ) {
        items.push(renderBlock(childIds[i]));
        i++;
      }
      result.push(
        <ol key={`ol-${id}`} className="my-2 ml-5 list-decimal space-y-0.5">
          {items}
        </ol>,
      );
    } else {
      result.push(renderBlock(id));
      i++;
    }
  }

  return result;
}

export function NotionBlockRenderer({
  blockId,
  recordMap,
  mapPageUrl,
  mapImageUrl,
  level = 0,
}: NotionBlockRendererProps) {
  const block = recordMap.block[blockId]?.value;
  if (!block) return null;

  const { type } = block;

  // Helper to render a child block
  function renderChild(childId: string) {
    return (
      <NotionBlockRenderer
        key={childId}
        blockId={childId}
        recordMap={recordMap}
        mapPageUrl={mapPageUrl}
        mapImageUrl={mapImageUrl}
        level={level + 1}
      />
    );
  }

  // Helper to render children with list grouping
  function renderChildren(ids?: string[]): React.ReactNode {
    if (!ids || ids.length === 0) return null;
    const nodes = groupListItems(ids, recordMap, (id) => renderChild(id));
    return <>{nodes}</>;
  }

  // Table blocks handle their own children
  if (type === "table") {
    return (
      <TableBlock block={block} recordMap={recordMap} mapPageUrl={mapPageUrl} />
    );
  }
  // Skip table_row — rendered by TableBlock directly
  if (type === "table_row") return null;

  // Collection views handle their own data
  if (type === "collection_view" || type === "collection_view_page") {
    return (
      <CollectionViewBlock
        block={block}
        recordMap={recordMap}
        mapPageUrl={mapPageUrl}
        mapImageUrl={mapImageUrl}
      />
    );
  }

  // Root page block — render its children
  if (type === "page") {
    // If we're at root level, render the page children
    return <>{renderChildren(block.content)}</>;
  }

  switch (type) {
    case "text":
      return (
        <ParagraphBlock block={block} mapPageUrl={mapPageUrl}>
          {renderChildren(block.content)}
        </ParagraphBlock>
      );

    case "header":
      return <HeadingBlock block={block} level={1} mapPageUrl={mapPageUrl} />;

    case "sub_header":
      return <HeadingBlock block={block} level={2} mapPageUrl={mapPageUrl} />;

    case "sub_sub_header":
      return <HeadingBlock block={block} level={3} mapPageUrl={mapPageUrl} />;

    case "quote":
      return (
        <QuoteBlock block={block} mapPageUrl={mapPageUrl}>
          {renderChildren(block.content)}
        </QuoteBlock>
      );

    case "callout":
      return (
        <CalloutBlock block={block} mapPageUrl={mapPageUrl}>
          {renderChildren(block.content)}
        </CalloutBlock>
      );

    case "divider":
      return <DividerBlock />;

    case "bulleted_list":
      return (
        <BulletedListItemBlock block={block} mapPageUrl={mapPageUrl}>
          {renderChildren(block.content)}
        </BulletedListItemBlock>
      );

    case "numbered_list":
      return (
        <NumberedListItemBlock block={block} mapPageUrl={mapPageUrl}>
          {renderChildren(block.content)}
        </NumberedListItemBlock>
      );

    case "to_do":
      return (
        <ToDoBlock block={block} mapPageUrl={mapPageUrl}>
          {renderChildren(block.content)}
        </ToDoBlock>
      );

    case "toggle":
      return (
        <ToggleBlock block={block} mapPageUrl={mapPageUrl}>
          {renderChildren(block.content)}
        </ToggleBlock>
      );

    case "image":
      return (
        <ImageBlock
          block={block}
          mapImageUrl={mapImageUrl}
          mapPageUrl={mapPageUrl}
        />
      );

    case "video":
      return (
        <VideoBlock
          block={block}
          mapImageUrl={mapImageUrl}
          mapPageUrl={mapPageUrl}
        />
      );

    case "embed":
      return (
        <EmbedBlock
          block={block}
          mapImageUrl={mapImageUrl}
          mapPageUrl={mapPageUrl}
        />
      );

    case "bookmark":
      return (
        <BookmarkBlock
          block={block}
          mapImageUrl={mapImageUrl}
          mapPageUrl={mapPageUrl}
        />
      );

    case "code":
      return <CodeBlock block={block} />;

    case "equation":
      // Plain text fallback
      return (
        <code className="my-2 block rounded bg-[hsl(var(--color-secondary))] p-2 font-mono text-sm">
          {block.properties?.title?.[0]?.[0]}
        </code>
      );

    case "column_list":
      return (
        <ColumnListBlock block={block} mapPageUrl={mapPageUrl}>
          {renderChildren(block.content)}
        </ColumnListBlock>
      );

    case "column":
      return (
        <ColumnBlock block={block} mapPageUrl={mapPageUrl}>
          {renderChildren(block.content)}
        </ColumnBlock>
      );

    case "alias": {
      return (
        <AliasBlock
          block={block}
          mapPageUrl={mapPageUrl}
          recordMap={recordMap}
        />
      );
    }

    case "pdf":
      // Rendered as a download link
      return (() => {
        const src =
          block.properties?.source?.[0]?.[0] ??
          block.format?.display_source ??
          "";
        return src ? (
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="my-4 flex items-center gap-2 rounded-md border border-[hsl(var(--color-border))] p-3 text-sm text-[hsl(var(--color-primary))] hover:border-[hsl(var(--color-primary))]"
          >
            📄 {src.split("/").pop() ?? "Download PDF"}
          </a>
        ) : null;
      })();

    case "table_of_contents":
      // Intentionally skipped
      return null;

    default:
      return null;
  }
}
