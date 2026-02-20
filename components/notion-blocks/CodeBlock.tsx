import * as React from "react";
import type { Block } from "notion-types";

interface CodeBlockProps {
  block: Block;
}

const PRISM_LANGUAGE_MAP: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  "c++": "cpp",
  "c#": "csharp",
  go: "go",
  rust: "rust",
  sql: "sql",
  bash: "bash",
  shell: "bash",
  html: "markup",
  xml: "markup",
  css: "css",
  scss: "scss",
  yaml: "yaml",
  json: "json",
  markdown: "markdown",
  docker: "docker",
  graphql: "graphql",
  swift: "swift",
  kotlin: "kotlin",
};

export function CodeBlock({ block }: CodeBlockProps) {
  const codeRef = React.useRef<HTMLElement>(null);
  const rawCode = block.properties?.title?.[0]?.[0] ?? "";
  const rawLang =
    block.properties?.language?.[0]?.[0]?.toLowerCase() ?? "plaintext";
  const prismLang = PRISM_LANGUAGE_MAP[rawLang] ?? rawLang;
  const caption = block.properties?.caption?.[0]?.[0];

  React.useEffect(() => {
    async function highlight() {
      if (!codeRef.current) return;
      const Prism = (await import("prismjs")).default;

      const langLoaders: Record<string, () => Promise<unknown>> = {
        markup: () => import("prismjs/components/prism-markup.js"),
        css: () => import("prismjs/components/prism-css.js"),
        javascript: () => import("prismjs/components/prism-javascript.js"),
        typescript: () => import("prismjs/components/prism-typescript.js"),
        python: () => import("prismjs/components/prism-python.js"),
        java: () => import("prismjs/components/prism-java.js"),
        cpp: async () => {
          await import("prismjs/components/prism-c.js");
          await import("prismjs/components/prism-cpp.js");
        },
        csharp: async () => {
          await import("prismjs/components/prism-markup-templating.js");
          await import("prismjs/components/prism-csharp.js");
        },
        go: () => import("prismjs/components/prism-go.js"),
        rust: () => import("prismjs/components/prism-rust.js"),
        sql: () => import("prismjs/components/prism-sql.js"),
        bash: () => import("prismjs/components/prism-bash.js"),
        scss: async () => {
          await import("prismjs/components/prism-css.js");
          await import("prismjs/components/prism-scss.js");
        },
        yaml: () => import("prismjs/components/prism-yaml.js"),
        graphql: () => import("prismjs/components/prism-graphql.js"),
        docker: () => import("prismjs/components/prism-docker.js"),
        swift: () => import("prismjs/components/prism-swift.js"),
        markdown: () => import("prismjs/components/prism-markdown.js"),
      };

      try {
        await langLoaders[prismLang]?.();
      } catch {
        // language not found, skip
      }

      Prism.highlightElement(codeRef.current);
    }

    highlight();
  }, [prismLang, rawCode]);

  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-lg border border-[hsl(var(--color-border))]">
        {rawLang && rawLang !== "plaintext" && (
          <div className="flex items-center justify-between border-b border-[hsl(var(--color-border))] bg-[hsl(var(--color-secondary))] px-4 py-1.5">
            <span className="font-mono text-xs text-[hsl(var(--color-muted-foreground))]">
              {rawLang}
            </span>
          </div>
        )}
        <pre className="overflow-x-auto bg-[hsl(var(--color-card))] p-4 text-sm leading-relaxed">
          <code
            ref={codeRef}
            className={prismLang !== "plaintext" ? `language-${prismLang}` : ""}
          >
            {rawCode}
          </code>
        </pre>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-[hsl(var(--color-muted-foreground))]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
