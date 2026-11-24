import { useId, useMemo, useState } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolOpenTextFile,
  useTextFileImport,
} from "@workspace/ui/components/tool/tool-open-text-file"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Label } from "@workspace/ui/components/ui/label"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { ArrowLeftRight, Table2 } from "@workspace/ui/icons"

type RecordConversion = {
  headers: readonly string[]
  rows: string[][]
  output: string
}

type ConversionDirection = {
  label: string
  download: string
  accept: string
  example: string
  extension: string
  mimeType: string
  convert: (input: string) => RecordConversion
}

type Messages = Record<
  | "openFile"
  | "sample"
  | "input"
  | "paste"
  | "result"
  | "empty"
  | "convert"
  | "preview"
  | "copy"
  | "copied"
  | "copyFailed"
  | "readError"
  | "invalid"
  | "noRows"
  | "rowError"
  | "count",
  string
> & { columns: Record<string, string> }

type Draft = {
  source: string
  filename: string
  result?: RecordConversion
  error?: string
}

const empty: Draft = { source: "", filename: "" }

export function RecordConverter({
  directions,
  messages: m,
  language,
  getErrorRow,
}: {
  directions: readonly [ConversionDirection, ConversionDirection]
  messages: Messages
  language: string
  getErrorRow: (error: unknown) => number | undefined
}) {
  const id = useId()
  const importer = useTextFileImport()
  const [direction, setDirection] = useState(0)
  const [drafts, setDrafts] = useState([empty, empty])
  const config = directions[direction]!
  const draft = drafts[direction]!
  const output = draft.result?.output ?? ""
  const file = useMemo(
    () =>
      new Blob([config.extension === "csv" ? "\uFEFF" : "", output], {
        type: config.mimeType,
      }),
    [output, config.extension, config.mimeType]
  )
  const basename = draft.filename.replace(/\.[^.]+$/, "") || "converted"

  function update(draft: Draft) {
    setDrafts((previous) =>
      previous.map((value, index) => (index === direction ? draft : value))
    )
  }

  function convert() {
    try {
      const result = config.convert(draft.source)
      update(
        result.rows.length
          ? { ...draft, result, error: undefined }
          : { ...draft, result: undefined, error: m.noRows }
      )
    } catch (error) {
      const row = getErrorRow(error)
      update({
        ...draft,
        result: undefined,
        error:
          row === undefined
            ? m.invalid
            : m.rowError.replace(
                "{row}",
                new Intl.NumberFormat(language).format(row)
              ),
      })
    }
  }

  return (
    <div className="grid min-w-0 gap-4">
      <div className="flex w-fit flex-wrap gap-1 self-start rounded-lg bg-muted p-1">
        {directions.map((item, index) => (
          <Button
            key={item.extension}
            type="button"
            variant={index === direction ? "outline" : "ghost"}
            size="sm"
            aria-pressed={index === direction}
            onClick={() => {
              if (index !== direction) {
                importer.cancel()
                setDirection(index)
              }
            }}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>
              <Label htmlFor={id}>{m.input}</Label>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <ToolOpenTextFile
                accept={config.accept}
                label={m.openFile}
                onFile={(file) =>
                  void importer.read(
                    file,
                    (source) => update({ source, filename: file.name }),
                    () => update({ ...draft, error: m.readError })
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  importer.cancel()
                  update({ source: config.example, filename: "" })
                }}
              >
                {m.sample}
              </Button>
              {draft.filename && (
                <span
                  dir="auto"
                  className="min-w-0 text-sm wrap-anywhere text-muted-foreground"
                >
                  {draft.filename}
                </span>
              )}
            </div>
            <Textarea
              id={id}
              dir="ltr"
              className="min-h-40 font-mono text-sm"
              placeholder={m.paste}
              value={draft.source}
              onChange={(event) => {
                importer.cancel()
                update({
                  source: event.currentTarget.value,
                  filename: draft.filename,
                })
              }}
            />
            {draft.error && (
              <p role="alert" className="text-sm text-destructive">
                {draft.error}
              </p>
            )}
            <Button
              type="button"
              className="w-fit"
              disabled={!draft.source.trim()}
              onClick={() => {
                importer.cancel()
                convert()
              }}
            >
              <ArrowLeftRight data-icon="inline-start" aria-hidden="true" />
              {m.convert}
            </Button>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>{m.result}</CardTitle>
          </CardHeader>
          <CardContent>
            {draft.result ? (
              <div className="grid min-w-0 gap-3">
                <p role="status" className="text-sm text-muted-foreground">
                  {m.count.replace(
                    "{count}",
                    new Intl.NumberFormat(language).format(
                      draft.result.rows.length
                    )
                  )}
                </p>
                <div
                  className="overflow-x-auto rounded-lg border focus-visible:outline-2 focus-visible:outline-ring"
                  // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Allow keyboard scrolling in the preview.
                  tabIndex={0}
                  role="region"
                  aria-label={m.preview}
                >
                  <table className="w-full text-sm">
                    <caption className="sr-only">{m.preview}</caption>
                    <thead className="bg-muted/50">
                      <tr>
                        {draft.result.headers.map((header) => (
                          <th
                            key={header}
                            scope="col"
                            className="px-3 py-2 text-start font-medium whitespace-nowrap"
                          >
                            {m.columns[header]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {draft.result.rows.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-t">
                          {row.map((value, cell) => (
                            <td
                              key={cell}
                              className="max-w-64 px-3 py-2 align-top"
                            >
                              <span
                                dir="auto"
                                className="line-clamp-2 wrap-anywhere"
                              >
                                {value || "—"}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap gap-2">
                  <DocumentDownload
                    file={file}
                    filename={basename + "." + config.extension}
                    label={config.download}
                  />
                  <ToolCopyButton
                    value={output}
                    copyLabel={m.copy}
                    copiedLabel={m.copied}
                    failedLabel={m.copyFailed}
                    size="default"
                  />
                </div>
              </div>
            ) : (
              <div className="grid min-h-40 place-content-center justify-items-center gap-3 rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
                <Table2 className="size-7" aria-hidden="true" />
                {m.empty}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
