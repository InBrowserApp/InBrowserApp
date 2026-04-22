import { Fragment } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"

import type { DiffRow, DiffToken } from "../core/text-diff"
import type { TextDiffViewMode } from "../types"

type DiffRowListProps = Readonly<{
  rows: readonly DiffRow[]
  viewMode: TextDiffViewMode
  originalLegendLabel: string
  modifiedLegendLabel: string
}>

type UnifiedEntry = Readonly<{
  kind: "equal" | "add" | "remove"
  prefix: " " | "+" | "-"
  lineNumber: number | null
  companionLineNumber: number | null
  tokens: readonly DiffToken[]
}>

function renderTokens(tokens: readonly DiffToken[]) {
  if (tokens.length === 0) {
    return <span className="text-transparent select-none">.</span>
  }

  return tokens.map((token, index) => (
    <span
      key={`${token.kind}-${index}-${token.value}`}
      className={
        token.kind === "add"
          ? "rounded bg-emerald-500/20 text-emerald-900 dark:text-emerald-100"
          : token.kind === "remove"
            ? "rounded bg-rose-500/20 text-rose-900 dark:text-rose-100"
            : undefined
      }
    >
      {token.value}
    </span>
  ))
}

function getSideClasses(row: DiffRow, side: "original" | "modified") {
  if (row.kind === "equal") {
    return "bg-background"
  }

  if (row.kind === "replace") {
    return side === "original" ? "bg-rose-500/8" : "bg-emerald-500/8"
  }

  if (row.kind === "remove") {
    return side === "original" ? "bg-rose-500/10" : "bg-muted/30"
  }

  return side === "modified" ? "bg-emerald-500/10" : "bg-muted/30"
}

function buildUnifiedEntries(
  rows: readonly DiffRow[]
): readonly UnifiedEntry[] {
  const entries: UnifiedEntry[] = []

  for (const row of rows) {
    if (row.kind === "equal") {
      entries.push({
        kind: "equal",
        prefix: " ",
        lineNumber: row.original.lineNumber,
        companionLineNumber: row.modified.lineNumber,
        tokens: row.original.tokens,
      })
      continue
    }

    if (row.kind === "remove") {
      entries.push({
        kind: "remove",
        prefix: "-",
        lineNumber: row.original.lineNumber,
        companionLineNumber: null,
        tokens: row.original.tokens,
      })
      continue
    }

    if (row.kind === "add") {
      entries.push({
        kind: "add",
        prefix: "+",
        lineNumber: null,
        companionLineNumber: row.modified.lineNumber,
        tokens: row.modified.tokens,
      })
      continue
    }

    entries.push(
      {
        kind: "remove",
        prefix: "-",
        lineNumber: row.original.lineNumber,
        companionLineNumber: null,
        tokens: row.original.tokens,
      },
      {
        kind: "add",
        prefix: "+",
        lineNumber: null,
        companionLineNumber: row.modified.lineNumber,
        tokens: row.modified.tokens,
      }
    )
  }

  return entries
}

function DiffRowList({
  rows,
  viewMode,
  originalLegendLabel,
  modifiedLegendLabel,
}: DiffRowListProps) {
  const unifiedEntries = buildUnifiedEntries(rows)

  return (
    <ScrollArea className="h-[34rem] rounded-xl border border-border/70 bg-muted/10 shadow-inner">
      <div className="min-w-[46rem] p-2.5">
        <div className="mb-2 flex flex-wrap items-center gap-1.5 border-b border-border/60 pb-2">
          <Badge
            variant="outline"
            className="rounded-md px-2 py-0.5 text-[11px]"
          >
            {originalLegendLabel}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-md px-2 py-0.5 text-[11px]"
          >
            {modifiedLegendLabel}
          </Badge>
        </div>

        {viewMode === "side-by-side" ? (
          <div className="grid grid-cols-[3rem_minmax(0,1fr)_3rem_minmax(0,1fr)] gap-px overflow-hidden rounded-lg bg-border/60">
            <div className="col-span-2 bg-muted/90 px-2.5 py-1.5 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {originalLegendLabel}
            </div>
            <div className="col-span-2 bg-muted/90 px-2.5 py-1.5 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {modifiedLegendLabel}
            </div>

            {rows.map((row, index) => (
              <Fragment
                key={`${row.kind}-${row.original.lineNumber}-${row.modified.lineNumber}-${index}`}
              >
                <div
                  className={`px-2 py-1.5 text-right font-mono text-[11px] text-muted-foreground ${getSideClasses(row, "original")}`}
                >
                  {row.original.lineNumber ?? ""}
                </div>
                <div
                  className={`px-2.5 py-1.5 font-mono text-[13px] leading-5 break-words whitespace-pre-wrap ${getSideClasses(row, "original")}`}
                >
                  {renderTokens(row.original.tokens)}
                </div>
                <div
                  className={`px-2 py-1.5 text-right font-mono text-[11px] text-muted-foreground ${getSideClasses(row, "modified")}`}
                >
                  {row.modified.lineNumber ?? ""}
                </div>
                <div
                  className={`px-2.5 py-1.5 font-mono text-[13px] leading-5 break-words whitespace-pre-wrap ${getSideClasses(row, "modified")}`}
                >
                  {renderTokens(row.modified.tokens)}
                </div>
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-[2rem_3rem_3rem_minmax(0,1fr)] gap-px overflow-hidden rounded-lg bg-border/60">
            <div className="bg-muted/90 px-2 py-1.5 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              #
            </div>
            <div className="bg-muted/90 px-2 py-1.5 text-right text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {originalLegendLabel}
            </div>
            <div className="bg-muted/90 px-2 py-1.5 text-right text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {modifiedLegendLabel}
            </div>
            <div className="bg-muted/90 px-2.5 py-1.5 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Content
            </div>

            {unifiedEntries.map((entry, index) => (
              <Fragment
                key={`${entry.kind}-${entry.lineNumber}-${entry.companionLineNumber}-${index}`}
              >
                <div
                  className={`px-2 py-1.5 text-center font-mono text-[13px] ${
                    entry.kind === "add"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
                      : entry.kind === "remove"
                        ? "bg-rose-500/10 text-rose-700 dark:text-rose-200"
                        : "bg-background text-muted-foreground"
                  }`}
                >
                  {entry.prefix}
                </div>
                <div className="bg-background px-2 py-1.5 text-right font-mono text-[11px] text-muted-foreground">
                  {entry.lineNumber ?? ""}
                </div>
                <div className="bg-background px-2 py-1.5 text-right font-mono text-[11px] text-muted-foreground">
                  {entry.companionLineNumber ?? ""}
                </div>
                <div
                  className={`px-2.5 py-1.5 font-mono text-[13px] leading-5 break-words whitespace-pre-wrap ${
                    entry.kind === "add"
                      ? "bg-emerald-500/8"
                      : entry.kind === "remove"
                        ? "bg-rose-500/8"
                        : "bg-background"
                  }`}
                >
                  {renderTokens(entry.tokens)}
                </div>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

export { DiffRowList }
