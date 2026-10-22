"use client";

import { memo } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableSkeleton } from "./Skeleton";
import Pagination from "./Pagination";

export function Table({ className, ...props }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full min-w-[640px] border-collapse text-left text-sm", className)} {...props} />
    </div>
  );
}

export function TH({ className, sortable, sorted, onSort, children, ...props }) {
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
  return (
    <th
      scope="col"
      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
      className={cn("whitespace-nowrap border-b border-line bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted dark:bg-slate-900/40", className)}
      {...props}
    >
      {sortable ? (
        <button type="button" onClick={onSort} className="focus-ring inline-flex items-center gap-1.5 rounded-md uppercase hover:text-brand-600">
          {children}
          <Icon className="size-3.5" aria-hidden="true" />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export const TR = memo(function TR({ className, ...props }) {
  return <tr className={cn("border-b border-line last:border-0 hover:bg-slate-50/70 dark:hover:bg-slate-800/30", className)} {...props} />;
});

export function TD({ className, ...props }) {
  return <td className={cn("px-4 py-3 align-middle text-ink", className)} {...props} />;
}

/**
 * Server-driven data table.
 * columns: [{ key, header, render?(row), sortKey?, className? }]
 * sort: { key, dir } with onSortChange(key); pagination via page/pages/onPageChange.
 */
export default function DataTable({
  columns,
  rows,
  loading,
  rowKey = "_id",
  sort,
  onSortChange,
  page,
  pages,
  total,
  onPageChange,
  empty = "Nothing to show yet.",
}) {
  return (
    <div>
      {loading && !rows?.length ? (
        <TableSkeleton columns={Math.min(columns.length, 5)} />
      ) : !rows?.length ? (
        <div className="flex flex-col items-center gap-3 px-4 py-14 text-center text-muted">
          <Inbox className="size-10" aria-hidden="true" />
          <p className="font-medium">{empty}</p>
        </div>
      ) : (
        <div className={cn("transition-opacity", loading && "opacity-60")}>
          <Table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <TH
                    key={column.key}
                    className={column.className}
                    sortable={Boolean(column.sortKey)}
                    sorted={column.sortKey && sort?.key === column.sortKey ? sort.dir : undefined}
                    onSort={() => onSortChange?.(column.sortKey)}
                  >
                    {column.header}
                  </TH>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <TR key={row[rowKey]}>
                  {columns.map((column) => (
                    <TD key={column.key} className={column.className}>
                      {column.render ? column.render(row) : row[column.key]}
                    </TD>
                  ))}
                </TR>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {pages > 1 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-line p-4 sm:flex-row">
          <p className="text-sm text-muted">
            Page {page} of {pages}
            {total !== undefined && ` · ${total} total`}
          </p>
          <Pagination page={page} pages={pages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
