import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { getBlockTitle, getPageProperty } from "notion-utils";
import { useSearchParam } from "react-use";

import * as config from "@/lib/config";
import * as types from "@/lib/types";
import { mapImageUrl } from "@/lib/map-image-url";
import { getCanonicalPageUrl, mapPageUrl } from "@/lib/map-page-url";

import { Footer } from "./Footer";
import { Loading } from "./Loading";
import { NotionBlockRenderer } from "./NotionBlockRenderer";
import { NotionPageHeader } from "./NotionPageHeader";
import { Page404 } from "./Page404";
import { PageContainer } from "./PageContainer";
import { PageHead } from "./PageHead";

export const NotionPage: React.FC<types.PageProps> = ({
  site,
  recordMap,
  error,
  pageId,
}) => {
  const router = useRouter();
  const lite = useSearchParam("lite");

  const isLiteMode = lite === "true";

  const siteMapPageUrl = React.useMemo(() => {
    const params: Record<string, string> = {};
    if (lite) params.lite = lite;
    const searchParams = new URLSearchParams(params);
    return mapPageUrl(site, recordMap, searchParams);
  }, [site, recordMap, lite]);

  const keys = Object.keys(recordMap?.block || {});
  const block = recordMap?.block?.[keys[0]]?.value;

  if (router.isFallback) {
    return <Loading />;
  }

  if (error || !site || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />;
  }

  const title = getBlockTitle(block, recordMap) || site.name;

  if (!config.isServer) {
    const g = window as typeof window & {
      pageId?: string;
      recordMap?: typeof recordMap;
      block?: typeof block;
    };
    g.pageId = pageId;
    g.recordMap = recordMap;
    g.block = block;
  }

  const canonicalPageUrl =
    !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId);

  const socialDescription =
    getPageProperty<string>("Description", block, recordMap) ||
    config.description;

  // Page cover image
  const coverRaw = block.format?.page_cover;
  const coverSrc = coverRaw ? mapImageUrl(coverRaw, block) : null;
  const coverPosition =
    block.format?.page_cover_position ?? config.defaultPageCoverPosition;

  // Page icon / emoji
  const pageIcon = block.format?.page_icon;

  const isBlogPost =
    block.type === "page" && block.parent_table === "collection";

  const rootBlockId = keys[0];

  return (
    <>
      <PageHead
        pageId={pageId}
        site={site}
        title={title}
        description={socialDescription}
        url={canonicalPageUrl}
      />

      <div
        className={
          pageId === site.rootNotionPageId
            ? "notion-page-root"
            : "notion-page-post"
        }
      >
        {!isLiteMode && <NotionPageHeader mapPageUrl={siteMapPageUrl} />}

        {coverSrc && (
          <div
            className="relative h-48 w-full overflow-hidden sm:h-64 md:h-80"
            style={{
              backgroundImage: `url(${coverSrc})`,
              backgroundSize: "cover",
              backgroundPosition: `center ${Math.round(
                (1 - coverPosition) * 100,
              )}%`,
            }}
            role="img"
            aria-label={`Cover image for ${title}`}
          />
        )}

        <PageContainer
          as="article"
          narrow={isBlogPost || pageId !== site.rootNotionPageId}
          className="pb-20"
        >
          {/* Page title — shown for blog posts, hidden for root/index page */}
          {isBlogPost && (
            <header className="mb-8 pt-12">
              {pageIcon && (
                <div className="mb-4 text-5xl" aria-hidden="true">
                  {pageIcon}
                </div>
              )}
              <h1 className="font-mono text-3xl font-bold text-[hsl(var(--color-primary))] sm:text-4xl">
                {title}
              </h1>
            </header>
          )}

          {!isBlogPost && pageId !== site.rootNotionPageId && (
            <header className="mb-8 pt-12">
              <h1 className="font-mono text-3xl font-bold text-[hsl(var(--color-primary))] sm:text-4xl">
                {title}
              </h1>
            </header>
          )}

          <NotionBlockRenderer
            blockId={rootBlockId}
            recordMap={recordMap}
            mapPageUrl={siteMapPageUrl}
            mapImageUrl={mapImageUrl}
          />
        </PageContainer>

        {!isLiteMode && <Footer />}
      </div>
    </>
  );
};
