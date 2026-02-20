import * as React from "react";
import type { Block } from "notion-types";
import { renderRichText } from "@/lib/notion-rich-text";

interface MediaBlockProps {
  block: Block;
  mapImageUrl: (url: string, block: Block) => string;
  mapPageUrl: (pageId: string) => string;
}

function getSource(block: Block): string {
  return (
    block.properties?.source?.[0]?.[0] ?? block.format?.display_source ?? ""
  );
}

export function ImageBlock({ block, mapImageUrl }: MediaBlockProps) {
  const rawUrl =
    block.properties?.source?.[0]?.[0] ?? block.format?.display_source ?? "";
  const src = rawUrl ? mapImageUrl(rawUrl, block) : "";
  const caption = block.properties?.caption;

  if (!src) return null;

  return (
    <figure className="my-6">
      <img
        src={src}
        alt={caption ? String(caption?.[0]?.[0] ?? "") : ""}
        loading="lazy"
        className="mx-auto max-w-full rounded-lg"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-[hsl(var(--color-muted-foreground))]">
          {renderRichText(caption)}
        </figcaption>
      )}
    </figure>
  );
}

export function VideoBlock({ block, mapImageUrl }: MediaBlockProps) {
  const src = getSource(block);
  if (!src) return null;

  const isYouTube = src.includes("youtube.com") || src.includes("youtu.be");
  const isVimeo = src.includes("vimeo.com");

  if (isYouTube || isVimeo) {
    const embedUrl = isYouTube ? toYouTubeEmbed(src) : toVimeoEmbed(src);
    return (
      <div className="my-6 aspect-video w-full overflow-hidden rounded-lg">
        <iframe
          src={embedUrl}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video"
        />
      </div>
    );
  }

  const videoSrc = src ? mapImageUrl(src, block) : src;
  return (
    <div className="my-6">
      <video
        src={videoSrc}
        controls
        className="mx-auto max-w-full rounded-lg"
      />
    </div>
  );
}

export function EmbedBlock({ block }: MediaBlockProps) {
  const src = getSource(block);
  if (!src) return null;

  return (
    <div className="my-6 aspect-video w-full overflow-hidden rounded-lg border border-[hsl(var(--color-border))]">
      <iframe
        src={src}
        className="h-full w-full"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        title="Embedded content"
      />
    </div>
  );
}

export function BookmarkBlock({ block, mapPageUrl }: MediaBlockProps) {
  const url =
    block.properties?.link?.[0]?.[0] ?? block.properties?.source?.[0]?.[0];
  const title = block.properties?.title;
  const description = block.properties?.description;
  const caption = block.properties?.caption;

  if (!url) return null;

  let displayTitle = title ? String(title[0]?.[0] ?? "") : url;
  if (caption?.[0]?.[0]) displayTitle = String(caption[0][0]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-4 flex flex-col gap-1 rounded-lg border border-[hsl(var(--color-border))] p-4 transition-colors hover:border-[hsl(var(--color-primary))] hover:shadow-sm"
    >
      <span className="font-medium text-[hsl(var(--color-foreground))] line-clamp-1">
        {displayTitle}
      </span>
      {description && (
        <span className="text-sm text-[hsl(var(--color-muted-foreground))] line-clamp-2">
          {renderRichText(description, mapPageUrl)}
        </span>
      )}
      <span className="mt-1 text-xs text-[hsl(var(--color-primary))] line-clamp-1">
        {url}
      </span>
    </a>
  );
}

export function LinkPreviewBlock({ block }: MediaBlockProps) {
  const url = block.properties?.link?.[0]?.[0] ?? getSource(block);
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-4 inline-flex items-center gap-2 rounded-md border border-[hsl(var(--color-border))] px-3 py-2 text-sm text-[hsl(var(--color-foreground))] transition-colors hover:border-[hsl(var(--color-primary))]"
    >
      <span className="text-[hsl(var(--color-primary))]">🔗</span>
      <span className="truncate">{url}</span>
    </a>
  );
}

function toYouTubeEmbed(url: string): string {
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  const id = match?.[1] ?? "";
  return `https://www.youtube.com/embed/${id}`;
}

function toVimeoEmbed(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/);
  const id = match?.[1] ?? "";
  return `https://player.vimeo.com/video/${id}`;
}
