import * as React from "react";
import type { Block } from "notion-types";
import { renderRichText } from "@/lib/notion-rich-text";

interface TextBlockProps {
  block: Block;
  children?: React.ReactNode;
  mapPageUrl: (pageId: string) => string;
}

export function ParagraphBlock({
  block,
  children,
  mapPageUrl,
}: TextBlockProps) {
  return (
    <div className="my-1 leading-relaxed text-[hsl(var(--color-foreground))]">
      <p className="px-0.5 py-1">
        {renderRichText(block.properties?.title, mapPageUrl)}
      </p>
      {children && <div className="ml-4">{children}</div>}
    </div>
  );
}

interface HeadingBlockProps {
  block: Block;
  level: 1 | 2 | 3;
  mapPageUrl: (pageId: string) => string;
}

export function HeadingBlock({ block, level, mapPageUrl }: HeadingBlockProps) {
  const text = renderRichText(block.properties?.title, mapPageUrl);
  const base =
    "font-mono font-bold text-[hsl(var(--color-foreground))] scroll-mt-16";
  if (level === 1) {
    return <h1 className={`mt-10 mb-4 text-3xl ${base}`}>{text}</h1>;
  }
  if (level === 2) {
    return <h2 className={`mt-8 mb-3 text-2xl ${base}`}>{text}</h2>;
  }
  return <h3 className={`mt-6 mb-2 text-xl ${base}`}>{text}</h3>;
}

export function QuoteBlock({ block, children, mapPageUrl }: TextBlockProps) {
  return (
    <blockquote className="my-4 border-l-4 border-[hsl(var(--color-primary))] pl-4 italic text-[hsl(var(--color-muted-foreground))]">
      <p>{renderRichText(block.properties?.title, mapPageUrl)}</p>
      {children && <div>{children}</div>}
    </blockquote>
  );
}

export function CalloutBlock({ block, children, mapPageUrl }: TextBlockProps) {
  const icon = block.format?.page_icon ?? "💡";
  return (
    <div className="my-4 flex gap-3 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-4">
      <span className="shrink-0 text-xl" aria-hidden="true">
        {icon}
      </span>
      <div className="leading-relaxed text-[hsl(var(--color-foreground))]">
        {renderRichText(block.properties?.title, mapPageUrl)}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}

export function DividerBlock() {
  return (
    <hr className="my-8 border-0 border-t border-[hsl(var(--color-border))]" />
  );
}
