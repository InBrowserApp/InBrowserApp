import { useState } from "react"
import { WorksheetExportOptions } from "@workspace/ui/components/tool/worksheet-export-options"
import { DocumentTextExport } from "@workspace/ui/components/tool/document-text-export"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { parseRange } from "@workspace/spreadsheet-export/range"
import type { Options, Session } from "@workspace/spreadsheet-export/types"
import { WorkbookControls } from "./workbook-controls"
import { useExport } from "./use-export"
import type { Messages } from "./types"

export function ExportPanel({
  session,
  messages: m,
}: {
  session: Session
  messages: Messages
}) {
  const [options, setOptions] = useState<Options>({
    sheet: Math.max(
      0,
      session.sheets.findIndex((sheet) => !sheet.hidden)
    ),
    range: "",
    format: "csv",
    values: "formatted",
    firstRowHeader: true,
  })
  const [draft, setDraft] = useState("")
  const [invalid, setInvalid] = useState(false)
  const { output, blob, error, loading } = useExport(
    session,
    options,
    draft === options.range && !invalid,
    m
  )
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <div className="shrink-0 space-y-3 border-b p-3">
        <WorkbookControls
          sheets={session.sheets}
          sheet={options.sheet}
          draft={draft}
          invalid={invalid}
          messages={m}
          onSheet={(sheet) => {
            setDraft("")
            setInvalid(false)
            setOptions({ ...options, sheet, range: "" })
          }}
          onDraft={(value) => {
            setDraft(value)
            setInvalid(false)
          }}
          onApply={() => {
            try {
              parseRange(draft)
              setInvalid(false)
              setOptions({ ...options, range: draft })
            } catch {
              setInvalid(true)
            }
          }}
        />
        <WorksheetExportOptions
          value={options}
          onChange={(value) => setOptions({ ...options, ...value })}
          messages={m}
        />
      </div>
      {loading ? (
        <p role="status" className="flex items-center justify-center gap-2 p-6">
          <Spinner aria-hidden="true" />
          {m.converting}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="p-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {output && blob ? (
        <>
          <p
            role="status"
            className="shrink-0 px-3 py-2 text-sm text-muted-foreground"
          >
            {m.summary
              .replace("{rows}", String(output.rows))
              .replace("{columns}", String(output.columns))}
          </p>
          {output.empty ? (
            <p className="px-3 pb-2 text-sm text-muted-foreground">{m.empty}</p>
          ) : null}
          {output.missingCached ? (
            <p className="px-3 pb-2 text-sm text-muted-foreground">
              {m.missingCached.replace("{count}", String(output.missingCached))}
            </p>
          ) : null}
          <div className="flex h-96 min-h-80 shrink-0 flex-col group-data-[focus]/workspace:flex-1">
            <DocumentTextExport
              key={JSON.stringify(options)}
              text={output.text}
              blob={blob}
              filename={output.filename}
              messages={m}
            />
          </div>
        </>
      ) : null}
      <details className="shrink-0 border-t p-3 text-sm">
        <summary className="cursor-pointer font-medium">{m.notes}</summary>
        <div className="mt-2 space-y-2 text-muted-foreground">
          <p>{m.formatNote}</p>
          <p>{m.valuesNote}</p>
          <p>{m.scopeNote}</p>
        </div>
      </details>
    </div>
  )
}
