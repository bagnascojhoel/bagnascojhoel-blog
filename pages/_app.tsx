// global styles shared across the entire site
import * as React from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import * as Fathom from "fathom-client";
import posthog from "posthog-js";
// used for code syntax highlighting
import "prismjs/themes/prism-coy.css";
import "styles/global.css";
// custom prism theme overrides
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
import { ThemeToggle } from "@/components/ThemeToggle";

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
      <ThemeToggle />
      {isLoading && <Loading />}
      <Component {...pageProps} />
    </>
  );
}
