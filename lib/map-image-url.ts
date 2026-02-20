import { Block } from "notion-types";

import { defaultPageCover, defaultPageIcon } from "./config";

/**
 * Maps a Notion image URL to a publicly accessible URL.
 * Notion-hosted images are proxied through Notion's image CDN which handles
 * re-signing of expiring S3 URLs.
 */
export const mapImageUrl = (url: string, block: Block): string => {
  if (!url) return "";

  // Pass through default assets unchanged
  if (url === defaultPageCover || url === defaultPageIcon) {
    return url;
  }

  // Data URLs are already inline — return as-is
  if (url.startsWith("data:")) return url;

  // Already proxied through Notion's image CDN
  if (url.startsWith("https://www.notion.so/image/")) return url;

  // Relative Notion image paths
  if (url.startsWith("/images/")) {
    return `https://www.notion.so${url}`;
  }

  // S3 and other Notion-hosted URLs — proxy through Notion's image CDN
  return `https://www.notion.so/image/${encodeURIComponent(url)}?table=block&id=${block.id}`;
};
