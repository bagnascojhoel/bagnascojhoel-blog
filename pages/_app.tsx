// global styles shared across the entire site
import * as React from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import * as Fathom from "fathom-client";
// used for rendering equations (optional)
import "katex/dist/katex.min.css";
import posthog from "posthog-js";
// used for code syntax highlighting (optional)
import "prismjs/themes/prism-coy.css";
// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css";
import "styles/global.css";
// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// global style overrides for notion
import "styles/notion.css";
// global style overrides for prism theme (optional)
import "styles/prism-theme.css";

import { bootstrap } from "@/lib/bootstrap-client";
import {
  fathomConfig,
  fathomId,
  isServer,
  posthogConfig,
  posthogId,
} from "@/lib/config";
import { BackgroundShapes } from "@/components/BackgroundShapes";
import { Loading } from "@/components/Loading";

if (!isServer) {
  bootstrap();
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    function onRouteChangeStart() {
      setIsLoading(true);
    }

    function onRouteChangeComplete() {
      setIsLoading(false);
      if (fathomId) {
        Fathom.trackPageview();
      }

      if (posthogId) {
        posthog.capture("$pageview");
      }
    }

    function onRouteChangeError() {
      setIsLoading(false);
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig);
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig);
    }

    router.events.on("routeChangeStart", onRouteChangeStart);
    router.events.on("routeChangeComplete", onRouteChangeComplete);
    router.events.on("routeChangeError", onRouteChangeError);

    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart);
      router.events.off("routeChangeComplete", onRouteChangeComplete);
      router.events.off("routeChangeError", onRouteChangeError);
    };
  }, [router.events]);

  return (
    <>
      <BackgroundShapes />
      {isLoading && <Loading />}
      <Component {...pageProps} />
    </>
  );
}
