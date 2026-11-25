import { useId, useMemo, useRef, useState } from "react"
import type { ScoreImageFormat } from "@workspace/score-export"
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
import { TuneSelection } from "./tune-selection"
import { useAbcBook, useAbcArtwork } from "./use-abc"
import example from "./tune-book.abc?raw"

type Messages = Record<
  | "source"
  | "placeholder"
  | "open"
  | "example"
  | "fileError"
  | "tunes"
  | "selectAll"
  | "clearSelection"
  | "untitled"
  | "preview"
  | "page"
  | "previous"
  | "next"
  | "empty"
  | "loading"
  | "noSelection"
  | "noNotes"
  | "invalid"
  | "download"
  | "downloadBusy"
  | "downloadError",
  string
>
type Props = { language: string } & (
  | {
      mode: "pdf"
      messages: Messages & Record<"paper" | "a4" | "letter", string>
    }
  | {
      mode: "image"
      messages: Messages & Record<"format" | "downloadZip", string>
    }
)

export function AbcScoreConverter(props: Props) {
  const { messages: m, language } = props
  const id = useId()
  const editor = useRef<HTMLTextAreaElement>(null)
  const [source, setSource] = useState("")
  const [filename, setFilename] = useState("")
  const [paper, setPaper] = useState<ScorePaper>("a4")
  const [format, setFormat] = useState<ScoreImageFormat>("png")
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
  const artwork = useAbcArtwork(
    included,
    props.mode === "pdf" ? paper : undefined
  )

  function edit(value: string, name?: string) {
    importer.cancel()
    reset()
    setFileError(false)
    setSource(value.replace(/\r\n?/g, "\n"))
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

  function downloadScore() {
    if (!artwork?.length) return
    void save(async () => {
      const scoreExport = await import("@workspace/score-export")
      const basename = filename.replace(/\.(?:abc|txt)$/i, "") || "abc-score"
      if (props.mode === "image")
        return scoreExport.exportScoreImages(artwork, format, basename)
      const title = included?.length === 1 ? included[0]?.title : undefined
      return scoreExport.exportScore(
        artwork.map(({ page }) => page),
        "pdf",
        title || basename,
        language
      )
    })
  }

  const previewError = book === null || artwork === null
  let notice: string | undefined
  if (!source.trim()) notice = m.empty
  else if (!book || (included?.length && !artwork)) notice = m.loading
  else if (!book.length || artwork?.length === 0) notice = m.noNotes
  else if (included?.length === 0) notice = m.noSelection
  const settingLabel =
    props.mode === "pdf" ? props.messages.paper : props.messages.format
  const downloadLabel =
    props.mode === "image" && (artwork?.length ?? 0) > 1
      ? props.messages.downloadZip
      : m.download
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
              <Label htmlFor={`${id}-setting`}>{settingLabel}</Label>
              <select
                id={`${id}-setting`}
                value={props.mode === "pdf" ? paper : format}
                onChange={(event) => {
                  reset()
                  const value = event.currentTarget.value
                  if (props.mode === "pdf") setPaper(value as ScorePaper)
                  else setFormat(value as ScoreImageFormat)
                }}
                className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9"
              >
                {props.mode === "pdf" ? (
                  <>
                    <option value="a4">{props.messages.a4}</option>
                    <option value="letter">{props.messages.letter}</option>
                  </>
                ) : (
                  <>
                    <option value="png">PNG</option>
                    <option value="svg">SVG</option>
                  </>
                )}
              </select>
            </div>
            {book && book.length > 1 && (
              <TuneSelection
                book={book}
                selected={selected}
                messages={m}
                language={language}
                onToggle={toggle}
                onToggleAll={() => {
                  reset()
                  setSelected(allSelected ? new Set() : undefined)
                }}
                allSelected={allSelected}
              />
            )}
            <Button
              type="button"
              className="min-h-11 w-full"
              disabled={!artwork?.length || download === "busy"}
              onClick={downloadScore}
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
              {download === "busy" ? m.downloadBusy : downloadLabel}
            </Button>
            {download === "error" && (
              <p role="alert" className="text-sm text-destructive">
                {m.downloadError}
              </p>
            )}
          </>
        }
      >
        {artwork?.length ? (
          <ScorePagePreview
            pages={artwork}
            makePreview={previewBlob}
            language={language}
            messages={m}
          />
        ) : null}
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

function previewBlob(image: { page: SVGSVGElement }) {
  return scorePagePreviewBlob(image.page)
}
