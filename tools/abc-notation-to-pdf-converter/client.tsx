import { useId, useMemo, useRef, useState } from "react"
import {
  scorePagePreviewBlob,
  type ScorePaper,
} from "@workspace/score-export/pages"
import { ScoreConverterLayout } from "@workspace/ui/components/tool/score-converter-layout"
import { ScorePagePreview } from "@workspace/ui/components/tool/score-page-preview"
import {
  ToolOpenTextFile,
  useTextFileImport,
} from "@workspace/ui/components/tool/tool-open-text-file"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { Label } from "@workspace/ui/components/ui/label"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, LoaderCircle } from "@workspace/ui/icons"
import { useScoreDownload } from "@workspace/ui/lib/use-score-download"
import { useAbcBook, useAbcPages } from "./use-abc"
import example from "./fixtures/tune-book.abc?raw"
import type english from "./messages/en.json"

export default function AbcNotationToPdf({
  messages: m,
  language,
}: {
  messages: typeof english
  language: string
}) {
  const id = useId()
  const editor = useRef<HTMLTextAreaElement>(null)
  const [source, setSource] = useState("")
  const [filename, setFilename] = useState("")
  const [paper, setPaper] = useState<ScorePaper>("a4")
  const [selected, setSelected] = useState<Set<string>>()
  const [fileError, setFileError] = useState(false)
  const importer = useTextFileImport()
  const { status: download, reset, save } = useScoreDownload()

  const book = useAbcBook(source)
  const included = useMemo(() => {
    if (!book) return undefined
    const entries =
      selected && book.length > 1
        ? book.filter(({ key }) => selected.has(key))
        : book
    return entries.map(({ tune }) => tune)
  }, [book, selected])
  const pages = useAbcPages(included, paper)
  const hasPages = Boolean(pages?.length)
  const numeric = new Intl.NumberFormat(language)

  function edit(value: string, name?: string) {
    importer.cancel()
    reset()
    setFileError(false)
    setSource(value)
    if (!value.trim() || name !== undefined) {
      setFilename(name ?? "")
      setSelected(undefined)
    }
  }

  function toggle(key: string, include: boolean) {
    reset()
    setSelected((previous) => {
      const next = new Set(previous ?? book?.map(({ key }) => key))
      if (include) next.add(key)
      else next.delete(key)
      return next
    })
  }

  function downloadPdf() {
    if (!pages?.length) return
    void save(async () => {
      const { exportScore } = await import("@workspace/score-export")
      const title = included?.length === 1 ? included[0]?.title : undefined
      const name =
        title || filename.replace(/\.(?:abc|txt)$/i, "") || "abc-score"
      return exportScore(pages, "pdf", name, language)
    })
  }

  const previewError = book === null || pages === null
  let notice: string | undefined
  if (!source.trim()) notice = m.empty
  else if (!book || (included?.length && !pages)) notice = m.loading
  else if (!book.length || pages?.length === 0) notice = m.noNotes
  else if (included?.length === 0) notice = m.noSelection
  const allSelected = book?.length === included?.length

  return (
    <div className="space-y-4">
      <ToolPanelCard>
        <ToolPanelCardContent className="gap-3">
          <Label htmlFor={`${id}-source`} className="text-base">
            {m.source}
          </Label>
          <div className="flex flex-wrap items-center gap-2 [&_button]:min-h-11 sm:[&_button]:min-h-8">
            <ToolOpenTextFile
              accept=".abc,.txt,text/plain"
              label={m.open}
              onFile={(file) =>
                void importer.read(
                  file,
                  (text) => edit(text, file.name),
                  () => setFileError(true)
                )
              }
            />
            {!source.trim() && (
              <Button
                type="button"
                variant="outline"
                onClick={(event) => {
                  edit(example)
                  if (event.detail === 0)
                    editor.current?.focus({ preventScroll: true })
                }}
              >
                {m.example}
              </Button>
            )}
            {filename && (
              <bdi
                className="max-w-full min-w-0 truncate text-sm text-muted-foreground"
                title={filename}
              >
                {filename}
              </bdi>
            )}
          </div>
          <Textarea
            ref={editor}
            id={`${id}-source`}
            value={source}
            onChange={(event) => edit(event.currentTarget.value)}
            placeholder={m.placeholder}
            dir="ltr"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            wrap="off"
            className="![field-sizing:fixed] min-h-40 resize-y font-mono text-sm"
          />
          {fileError && (
            <p role="alert" className="text-sm text-destructive">
              {m.fileError}
            </p>
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>
      <ScoreConverterLayout
        settings={
          <>
            <div className="grid gap-2">
              <Label htmlFor={`${id}-paper`}>{m.paper}</Label>
              <select
                id={`${id}-paper`}
                value={paper}
                onChange={(event) => {
                  reset()
                  setPaper(event.currentTarget.value as ScorePaper)
                }}
                className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9"
              >
                <option value="a4">{m.a4}</option>
                <option value="letter">{m.letter}</option>
              </select>
            </div>
            {book && book.length > 1 && (
              <fieldset className="grid min-w-0 gap-1.5">
                <legend className="text-sm font-medium">{m.tunes}</legend>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-11 justify-self-start sm:min-h-8"
                  onClick={() => {
                    reset()
                    setSelected(allSelected ? new Set() : undefined)
                  }}
                >
                  {allSelected ? m.clearSelection : m.selectAll}
                </Button>
                <div className="max-h-56 overflow-y-auto rounded-md border">
                  {book.map(({ key, tune }, index) => (
                    <label
                      key={key}
                      className="flex min-h-11 cursor-pointer items-center gap-2 px-2.5 py-1.5 text-sm hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        className="size-4 shrink-0 accent-primary"
                        checked={!selected || selected.has(key)}
                        onChange={(event) =>
                          toggle(key, event.currentTarget.checked)
                        }
                      />
                      <bdi className="min-w-0 wrap-anywhere">
                        {tune.title ||
                          m.untitled.replace(
                            "{number}",
                            numeric.format(index + 1)
                          )}
                      </bdi>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <Button
              type="button"
              className="min-h-11 w-full"
              disabled={!hasPages || download === "busy"}
              onClick={downloadPdf}
            >
              {download === "busy" ? (
                <LoaderCircle
                  data-icon="inline-start"
                  aria-hidden="true"
                  className="motion-safe:animate-spin"
                />
              ) : (
                <Download data-icon="inline-start" aria-hidden="true" />
              )}
              {download === "busy" ? m.downloadBusy : m.download}
            </Button>
            {download === "error" && (
              <p role="alert" className="text-sm text-destructive">
                {m.downloadError}
              </p>
            )}
          </>
        }
      >
        {pages && hasPages && (
          <ScorePagePreview
            pages={pages}
            makePreview={scorePagePreviewBlob}
            language={language}
            messages={m}
          />
        )}
        {previewError ? (
          <p
            role="alert"
            className="rounded-xl border p-4 text-sm text-destructive"
          >
            {m.invalid}
          </p>
        ) : (
          notice && (
            <p
              role="status"
              className="rounded-xl border p-4 text-sm text-muted-foreground"
            >
              {notice}
            </p>
          )
        )}
      </ScoreConverterLayout>
    </div>
  )
}
