import * as React from "react";

import { NotionPage } from "@/components/NotionPage";
import { domain } from "@/lib/config";
import { resolveNotionPage } from "@/lib/resolve-notion-page";

export const getStaticProps = async () => {
  try {
    const props = await resolveNotionPage(domain);

    return { props, revalidate: 10 };
  } catch (err) {
    console.error("page error", domain, err);

    // return 404 for pages that fail to load rather than breaking the build
    return { notFound: true };
  }
};

export default function NotionDomainPage(props) {
  return <NotionPage {...props} />;
}
