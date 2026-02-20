import * as React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";
import { renderRichText } from "@/lib/notion-rich-text";

interface TableBlockProps {
  block: Block;
  recordMap: ExtendedRecordMap;
  mapPageUrl: (pageId: string) => string;
}

export function TableBlock({ block, recordMap, mapPageUrl }: TableBlockProps) {
  const hasColumnHeader = block.format?.table_block_column_header ?? false;
  const columnOrder: string[] = block.format?.table_block_column_order ?? [];
  const rowIds: string[] = block.content ?? [];

  const rows = rowIds
    .map((id) => recordMap.block[id]?.value)
    .filter(Boolean) as Block[];

  if (rows.length === 0) return null;

  const headerRow = hasColumnHeader ? rows[0] : null;
  const bodyRows = hasColumnHeader ? rows.slice(1) : rows;

  function renderCell(row: Block, colId: string, isHeader: boolean) {
    const cellContent = (
      row.properties as Record<string, typeof row.properties.title>
    )?.[colId];
    const content = renderRichText(cellContent, mapPageUrl);
    const cls =
      "border border-[hsl(var(--color-border))] px-3 py-2 text-left text-sm text-[hsl(var(--color-foreground))]";
    if (isHeader) {
      return (
        <th
          key={colId}
          className={`${cls} bg-[hsl(var(--color-secondary))] font-semibold`}
        >
          {content}
        </th>
      );
    }
    return (
      <td key={colId} className={cls}>
        {content}
      </td>
    );
  }

  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-[hsl(var(--color-border))]">
      <table className="w-full border-collapse">
        {headerRow && (
          <thead>
            <tr>
              {columnOrder.map((colId) => renderCell(headerRow, colId, true))}
            </tr>
          </thead>
        )}
        <tbody>
          {bodyRows.map((row) => (
            <tr
              key={row.id}
              className="even:bg-[hsl(var(--color-card))] hover:bg-[hsl(var(--color-secondary))]"
            >
              {columnOrder.map((colId) => renderCell(row, colId, false))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
