/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Scrollable table regions need keyboard access. */
import { useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { X } from "@workspace/ui/icons"
import { cellText } from "../values"
import type { Info, Messages, Row } from "../types"

const head =
  "sticky top-0 z-10 border-b bg-muted px-3 py-2 text-start font-medium whitespace-nowrap"

export function SchemaTable({
  info,
  messages: m,
}: {
  info: Info
  messages: Messages
}) {
  return (
    <div
      className="min-h-0 flex-1 overflow-auto overscroll-contain"
      tabIndex={0}
      role="region"
      aria-label={m.schema}
    >
      <table className="w-full text-sm">
        <thead>
          <tr>
            {[m.field, m.physical, m.logical, m.repetition].map((label) => (
              <th key={label} scope="col" className={head}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {info.fields.map((field) => (
            <tr key={field.path} className="border-b hover:bg-muted/40">
              <th
                scope="row"
                className="px-3 py-2 text-start font-mono font-normal whitespace-nowrap"
                style={{ paddingInlineStart: `${12 + field.depth * 16}px` }}
                dir="ltr"
              >
                {field.name}
              </th>
              <td
                className="px-3 py-2 font-mono whitespace-nowrap"
                translate="no"
              >
                {field.physical || m.group}
              </td>
              <td
                className="px-3 py-2 font-mono whitespace-nowrap"
                translate="no"
              >
                {field.logical || m.none}
              </td>
              <td className="px-3 py-2">
                {field.repetition === "REQUIRED"
                  ? m.required
                  : field.repetition === "OPTIONAL"
                    ? m.optional
                    : field.repetition === "REPEATED"
                      ? m.repeated
                      : m.none}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DataTable({
  info,
  rows,
  start,
  messages: m,
  lang,
}: {
  info: Info
  rows: Row[]
  start: number
  messages: Messages
  lang: string
}) {
  const [selected, setSelected] = useState<{
    column: string
    text: string
  } | null>(null)
  const number = new Intl.NumberFormat(lang)
  return (
    <>
      <div
        className="min-h-0 flex-1 overflow-auto overscroll-contain"
        tabIndex={0}
        role="region"
        aria-label={m.data}
      >
        <table className="w-full text-sm" dir="ltr">
          <thead>
            <tr>
              <th className={`${head} text-end`} scope="col">
                #
              </th>
              {info.columns.map((column) => (
                <th key={column} scope="col" className={head} dir="auto">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={start + index} className="border-b hover:bg-muted/40">
                <th
                  scope="row"
                  className="px-3 py-2 text-end font-normal text-muted-foreground tabular-nums"
                >
                  {number.format(start + index + 1)}
                </th>
                {info.columns.map((column) => {
                  const value = row[column]
                  const text = value == null ? m.null : cellText(value)
                  return (
                    <td key={column} className="p-0">
                      <button
                        type="button"
                        className={`block w-full max-w-72 min-w-24 truncate px-3 py-2 text-start font-mono text-xs tabular-nums hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring ${value == null ? "text-muted-foreground italic" : ""}`}
                        dir="auto"
                        aria-label={`${column}: ${text}`}
                        onClick={() => setSelected({ column, text })}
                      >
                        {text || "\u00a0"}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected ? (
        <section
          aria-label={m.cellDetails}
          className="max-h-40 shrink-0 overflow-auto border-t bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="min-w-0 truncate font-medium" dir="auto">
              {m.cellDetails} · {selected.column}
            </span>
            <DocumentIconButton
              label={m.closeDetails}
              onClick={() => setSelected(null)}
            >
              <X aria-hidden="true" />
            </DocumentIconButton>
          </div>
          <pre
            className="mt-1 text-xs wrap-anywhere whitespace-pre-wrap"
            dir="auto"
          >
            {selected.text}
          </pre>
        </section>
      ) : null}
    </>
  )
}
