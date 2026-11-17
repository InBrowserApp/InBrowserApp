/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Scrollable result regions need keyboard access. */
import { useEffect, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Download } from "@workspace/ui/icons"
import { cellText, exportResult } from "../core/export"
import { Pagination } from "./pagination"
import type { Messages, QueryResult } from "../types"

export function ResultTable({
  result,
  title,
  filename,
  messages: m,
  lang,
}: {
  result: QueryResult
  title: string
  filename?: string
  messages: Messages
  lang: string
}) {
  const [page, setPage] = useState(0)
  const [value, setValue] = useState<string | null>(null)
  const [exportError, setExportError] = useState(false)
  const root = useRef<HTMLElement>(null)
  const lastCell = useRef<HTMLButtonElement | null>(null)
  const [portal, setPortal] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setPortal(root.current!.closest("dialog"))
  }, [])
  const nf = new Intl.NumberFormat(lang)
  const total = Math.max(1, Math.ceil(result.rows.length / 50))

  function download(format: "csv" | "json") {
    setExportError(false)
    try {
      const blob = new Blob([exportResult(result, format)], {
        type:
          format === "csv"
            ? "text/csv;charset=utf-8"
            : "application/json;charset=utf-8",
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${filename?.replace(/\.[^.]+$/, "") || "sqlite"}-results.${format}`
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      setExportError(true)
    }
  }

  return (
    <section
      ref={root}
      className="flex min-w-0 flex-col gap-3"
      aria-label={title}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium">{title}</h2>
          <p
            role="status"
            className="text-xs text-muted-foreground tabular-nums"
          >
            {m.resultSummary
              .replace("{rows}", nf.format(result.rows.length))
              .replace("{columns}", nf.format(result.columns.length))
              .replace("{time}", nf.format(Math.round(result.elapsed)))}
          </p>
        </div>
        {filename ? (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => download("csv")}>
              <Download aria-hidden="true" data-icon="inline-start" />
              {m.csv}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => download("json")}
            >
              <Download aria-hidden="true" data-icon="inline-start" />
              {m.json}
            </Button>
          </div>
        ) : null}
      </div>
      {result.truncated ? (
        <Alert>
          <AlertDescription>{m.truncated}</AlertDescription>
        </Alert>
      ) : null}
      {exportError ? (
        <p role="alert" className="text-sm text-destructive">
          {m.exportError}
        </p>
      ) : null}
      <div
        dir="ltr"
        className="max-h-[32rem] min-w-0 overflow-auto rounded-lg border"
        tabIndex={0}
        role="region"
        aria-label={title}
      >
        <Table dir="ltr">
          <TableHeader>
            <TableRow>
              {result.columns.map((column, index) => (
                <TableHead key={index} scope="col">
                  <span className="block max-w-64 truncate" title={column}>
                    {column}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.rows
              .slice(page * 50, (page + 1) * 50)
              .map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, columnIndex) => {
                    const text =
                      cell instanceof Uint8Array
                        ? m.blob.replace("{bytes}", nf.format(cell.byteLength))
                        : cellText(cell)
                    return (
                      <TableCell
                        key={columnIndex}
                        className="font-mono text-xs tabular-nums"
                      >
                        <button
                          type="button"
                          aria-label={`${m.inspectValue}: ${result.columns[columnIndex]}`}
                          onClick={(event) => {
                            lastCell.current = event.currentTarget
                            setValue(cellText(cell))
                          }}
                          className="block max-w-64 truncate rounded-sm text-start focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                          title={text.slice(0, 240)}
                        >
                          {cell === null ? (
                            <span className="text-muted-foreground">NULL</span>
                          ) : (
                            text.slice(0, 240) || "\u00a0"
                          )}
                        </button>
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            {!result.rows.length ? (
              <TableRow>
                <TableCell
                  colSpan={Math.max(1, result.columns.length)}
                  className="h-24 text-center text-muted-foreground"
                >
                  {m.noResults}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
      {total > 1 ? (
        <Pagination
          page={page}
          total={total}
          onPage={setPage}
          messages={m}
          lang={lang}
        />
      ) : null}
      {filename ? (
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer">
            {m.csv} / {m.json}
          </summary>
          <p className="mt-2">{m.exportNote}</p>
        </details>
      ) : null}
      <Dialog
        open={value !== null}
        onOpenChange={(open) => {
          if (!open) setValue(null)
        }}
      >
        <DialogContent
          container={portal}
          closeLabel={m.cancel}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            lastCell.current?.focus()
          }}
        >
          <DialogHeader>
            <DialogTitle>{m.value}</DialogTitle>
            <DialogDescription>{m.inspectValue}</DialogDescription>
          </DialogHeader>
          <Textarea
            dir="ltr"
            readOnly
            aria-label={m.value}
            value={value ?? ""}
            className="[field-sizing:fixed] max-h-96 min-h-40 font-mono text-sm"
          />
          <ToolCopyButton
            value={value ?? ""}
            copyLabel={m.copy}
            copiedLabel={m.copied}
          />
        </DialogContent>
      </Dialog>
    </section>
  )
}
