import * as React from "react";

interface PageContainerProps {
  as: React.ElementType;
  children: React.ReactNode;
  narrow?: boolean;
  className?: string;
}

export function PageContainer({
  as: Tag,
  children,
  narrow = false,
  className,
}: PageContainerProps) {
  return (
    <Tag
      className={["mx-auto w-full px-4 sm:px-6", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        maxWidth: narrow ? "720px" : "var(--max-width)",
        marginInline: "auto",
      }}
    >
      {children}
    </Tag>
  );
}
