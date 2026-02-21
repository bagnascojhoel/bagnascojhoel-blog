import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cs from "classnames";

import { navigationLinks } from "@/lib/config";

import styles from "./styles.module.css";
import { PageContainer } from "./PageContainer";
import { ReturnIcon } from "./ReturnIcon";

interface NotionPageHeaderProps {
  mapPageUrl: (pageId: string) => string;
}

export function NotionPageHeader({ mapPageUrl }: NotionPageHeaderProps) {
  const router = useRouter();

  function isRootPath(): boolean {
    return router.pathname === "/" || router.basePath === router.pathname;
  }

  return (
    <PageContainer as="header" className="notion-header">
      <nav className="notion-nav-header" aria-label="Site navigation">
        <div className="notion-nav-header-rhs">
          {!isRootPath() && (
            <button
              type="button"
              className={cs(styles.goBackButton, "button")}
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ReturnIcon />
            </button>
          )}

          {navigationLinks
            ?.map((link, index) => {
              if (!link.pageId && !link.url) {
                return null;
              }

              if (link.pageId) {
                return (
                  <Link
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cs(styles.navLink, "breadcrumb", "button")}
                  >
                    {link.title}
                  </Link>
                );
              } else {
                return (
                  <a
                    href={link.url}
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cs(styles.navLink, "breadcrumb", "button")}
                  >
                    {link.title}
                  </a>
                );
              }
            })
            .filter(Boolean)}
        </div>
      </nav>
    </PageContainer>
  );
}
