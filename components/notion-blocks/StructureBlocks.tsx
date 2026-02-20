import * as React from "react";
import Link from "next/link";
import type { Block, ExtendedRecordMap } from "notion-types";
import { getBlockTitle } from "notion-utils";

interface StructureBlockProps {
  block: Block;
  children?: React.ReactNode;
  mapPageUrl: (pageId: string) => string;
  recordMap?: ExtendedRecordMap;
}

export function ColumnListBlock({ children }: StructureBlockProps) {
  return <div className="my-4 flex gap-4 max-md:flex-col">{children}</div>;
}

export function ColumnBlock({ children }: StructureBlockProps) {
  return <div className="flex-1 min-w-0">{children}</div>;
}

export function PageLinkBlock({
  block,
  mapPageUrl,
  recordMap,
}: StructureBlockProps) {
  const title = recordMap ? getBlockTitle(block, recordMap) : block.id;
  const href = mapPageUrl(block.id);

  return (
    <Link
      href={href}
      className="my-2 flex items-center gap-2 rounded-md border border-[hsl(var(--color-border))] p-3 text-[hsl(var(--color-foreground))] transition-colors hover:border-[hsl(var(--color-primary))] hover:text-[hsl(var(--color-primary))]"
    >
      <span className="text-lg" aria-hidden="true">
        {block.format?.page_icon ?? "📄"}
      </span>
      <span className="font-medium">{title}</span>
    </Link>
  );
}

export function AliasBlock({
  block,
  mapPageUrl,
  recordMap,
}: StructureBlockProps) {
  const aliasId = block.format?.alias_pointer?.id ?? block.id;
  const aliasBlock = recordMap?.block?.[aliasId]?.value;
  const title =
    aliasBlock && recordMap ? getBlockTitle(aliasBlock, recordMap) : aliasId;
  const href = mapPageUrl(aliasId);

  return (
    <Link
      href={href}
      className="text-[hsl(var(--color-primary))] underline decoration-dotted hover:decoration-solid"
    >
      {title}
    </Link>
  );
}
