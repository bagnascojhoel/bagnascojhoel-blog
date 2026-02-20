import * as React from "react";
import Link from "next/link";
import type { Decoration } from "notion-types";

/**
 * Renders a Notion `Decoration[]` (rich text) array into React nodes.
 * Handles inline formatting: bold, italic, strikethrough, underline, code, links, page references.
 */
export function renderRichText(
  title: Decoration[] | undefined,
  mapPageUrl?: (pageId: string) => string,
): React.ReactNode {
  if (!title) return null;

  return title.map((decoration, i) => {
    const [text, decorations] = decoration;

    if (!decorations || decorations.length === 0) {
      return <React.Fragment key={i}>{text}</React.Fragment>;
    }

    let node: React.ReactNode = text;

    for (const dec of decorations) {
      const [modifier] = dec;

      switch (modifier) {
        case "b":
          node = <strong key={i}>{node}</strong>;
          break;
        case "i":
          node = <em key={i}>{node}</em>;
          break;
        case "s":
          node = <s key={i}>{node}</s>;
          break;
        case "_":
          node = <u key={i}>{node}</u>;
          break;
        case "c":
          node = (
            <code
              key={i}
              className="rounded bg-[hsl(var(--color-secondary))] px-1 py-0.5 font-mono text-sm text-[hsl(var(--color-primary))]"
            >
              {node}
            </code>
          );
          break;
        case "a": {
          const href = dec[1] as string | undefined;
          node = (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[hsl(var(--color-primary))] underline decoration-dotted hover:decoration-solid"
            >
              {node}
            </a>
          );
          break;
        }
        case "p": {
          const pageId = dec[1] as string | undefined;
          if (pageId && mapPageUrl) {
            node = (
              <Link
                key={i}
                href={mapPageUrl(pageId)}
                className="text-[hsl(var(--color-primary))] underline decoration-dotted hover:decoration-solid"
              >
                {node}
              </Link>
            );
          }
          break;
        }
        // color/highlight — apply as inline style
        case "h": {
          const color = dec[1] as string | undefined;
          if (color) {
            const isBackground = color.endsWith("_background");
            node = (
              <span
                key={i}
                style={
                  isBackground
                    ? { backgroundColor: notionColorToCSS(color) }
                    : { color: notionColorToCSS(color) }
                }
              >
                {node}
              </span>
            );
          }
          break;
        }
        // skip user mentions, dates, math, etc.
        default:
          break;
      }
    }

    return <React.Fragment key={i}>{node}</React.Fragment>;
  });
}

/** Maps Notion named colors to CSS color values */
function notionColorToCSS(color: string): string {
  const map: Record<string, string> = {
    gray: "#9b9a97",
    brown: "#64473a",
    orange: "#d9730d",
    yellow: "#dfab01",
    green: "#0f7b6c",
    blue: "#0b6e99",
    purple: "#6940a5",
    pink: "#ad1a72",
    red: "#e03e3e",
    gray_background: "#ebeced",
    brown_background: "#e9e5e3",
    orange_background: "#faebdd",
    yellow_background: "#fbf3db",
    green_background: "#ddedea",
    blue_background: "#ddebf1",
    purple_background: "#eae4f2",
    pink_background: "#f4dfeb",
    red_background: "#fbe4e4",
  };
  return map[color] ?? "inherit";
}
