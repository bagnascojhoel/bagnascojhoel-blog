import * as React from "react";
import type { Block } from "notion-types";
import { renderRichText } from "@/lib/notion-rich-text";

interface ListBlockProps {
  block: Block;
  children?: React.ReactNode;
  mapPageUrl: (pageId: string) => string;
}

export function BulletedListItemBlock({
  block,
  children,
  mapPageUrl,
}: ListBlockProps) {
  return (
    <li className="my-0.5 leading-relaxed text-[hsl(var(--color-foreground))]">
      {renderRichText(block.properties?.title, mapPageUrl)}
      {children && (
        <ul className="mt-1 ml-5 list-disc space-y-0.5">{children}</ul>
      )}
    </li>
  );
}

export function NumberedListItemBlock({
  block,
  children,
  mapPageUrl,
}: ListBlockProps) {
  return (
    <li className="my-0.5 leading-relaxed text-[hsl(var(--color-foreground))]">
      {renderRichText(block.properties?.title, mapPageUrl)}
      {children && (
        <ol className="mt-1 ml-5 list-decimal space-y-0.5">{children}</ol>
      )}
    </li>
  );
}

export function ToDoBlock({ block, children, mapPageUrl }: ListBlockProps) {
  const checked = block.properties?.checked?.[0]?.[0] === "Yes";
  return (
    <div className="my-1 flex items-start gap-2">
      <input
        type="checkbox"
        checked={checked}
        readOnly
        aria-label={checked ? "Completed task" : "Uncompleted task"}
        className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--color-primary))]"
      />
      <div
        className={`leading-relaxed ${checked ? "text-[hsl(var(--color-muted-foreground))] line-through" : "text-[hsl(var(--color-foreground))]"}`}
      >
        {renderRichText(block.properties?.title, mapPageUrl)}
        {children && <div className="ml-1 mt-1">{children}</div>}
      </div>
    </div>
  );
}

export function ToggleBlock({ block, children, mapPageUrl }: ListBlockProps) {
  return (
    <details className="my-2 rounded-md border border-[hsl(var(--color-border))] open:border-[hsl(var(--color-primary))]">
      <summary className="cursor-pointer select-none p-3 font-medium text-[hsl(var(--color-foreground))] hover:text-[hsl(var(--color-primary))]">
        {renderRichText(block.properties?.title, mapPageUrl)}
      </summary>
      {children && (
        <div className="border-t border-[hsl(var(--color-border))] px-4 py-3">
          {children}
        </div>
      )}
    </details>
  );
}
