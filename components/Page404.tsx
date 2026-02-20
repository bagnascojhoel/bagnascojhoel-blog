import * as React from "react";
import type { ExtendedRecordMap } from "notion-types";

import * as types from "@/lib/types";
import { mapPageUrl } from "@/lib/map-page-url";

import { NotionPageHeader } from "./NotionPageHeader";
import { PageHead } from "./PageHead";
import styles from "./styles.module.css";

export const Page404: React.FC<types.PageProps> = ({
  site,
  recordMap,
  pageId,
}) => {
  const title = site?.name || "Page Not Found";

  const mapPageUrlFn = React.useMemo(() => {
    if (!site) return (_id: string) => "/";
    return mapPageUrl(
      site,
      (recordMap ?? {}) as ExtendedRecordMap,
      new URLSearchParams(),
    );
  }, [site, recordMap]);

  return (
    <>
      <PageHead site={site} title={title} />
      <NotionPageHeader mapPageUrl={mapPageUrlFn} />

      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className="text-color text-2xl font-bold">
            Notion Page Not Found
          </h1>
          <p className="mt-2 text-[hsl(var(--color-foreground))]">
            This page is not available,{" "}
            <a
              href="/"
              className="text-[hsl(var(--color-primary))] underline hover:no-underline"
            >
              click here to go home.
            </a>
          </p>

          <img
            src="/404.png"
            alt="404 Not Found"
            className={styles.errorImage}
          />
        </main>
      </div>
    </>
  );
};
