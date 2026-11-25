import { useId, useMemo, useState } from "react"
import type { ScoreImageFormat } from "@workspace/score-export"
import {
  scorePagePreviewBlob,
  type ScorePaper,
} from "@workspace/score-export/pages"
import { ScoreConverterLayout } from "@workspace/ui/components/tool/score-converter-layout"
import { ScorePagePreview } from "@workspace/ui/components/tool/score-page-preview"
import { Button } from "@workspace/ui/components/ui/button"
import { Label } from "@workspace/ui/components/ui/label"
import { Download, LoaderCircle } from "@workspace/ui/icons"
import { useScoreDownload } from "@workspace/ui/lib/use-score-download"
import { AbcSourceEditor } from "./source-editor"
import {
  MidiListen,
  type ListenMessages,
} from "@workspace/ui/components/tool/midi-listen"
import { TuneSelection } from "./tune-selection"
import { useAbcBook, useAbcArtwork } from "./use-abc"

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
  | {
      mode: "midi"
      messages: Messages & ListenMessages & Record<"downloadZip", string>
    }
)

export function AbcScoreConverter(props: Props) {
  const { messages: m, language } = props
  const id = useId()
  const [source, setSource] = useState("")
  const [filename, setFilename] = useState("")
  const [paper, setPaper] = useState<ScorePaper>("a4")
  const [format, setFormat] = useState<ScoreImageFormat>("png")
  const [previewIndex, setPreviewIndex] = useState(0)
  const [selected, setSelected] = useState<Set<string>>()
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
  const activeIndex = Math.min(previewIndex, (artwork?.length ?? 1) - 1)
  const activeTune = artwork?.[activeIndex]?.tune

  function edit(value: string, name?: string) {
    reset()
    setSource(value.replace(/\r\n?/g, "\n"))
    setPreviewIndex(0)
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
      const basename = filename.replace(/\.(?:abc|txt)$/i, "") || "abc-score"
      if (props.mode === "midi") {
        const { exportAbcMidi } =
          await import("@workspace/score-export/abc-midi")
        return exportAbcMidi(
          artwork.flatMap((image) => (image.tune ? [image.tune] : [])),
          basename
        )
      }
      const scoreExport = await import("@workspace/score-export")
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
  const downloadLabel =
    props.mode !== "pdf" && (artwork?.length ?? 0) > 1
      ? props.messages.downloadZip
      : m.download
  const allSelected = book?.length === included?.length

  return (
    <div className="space-y-4">
      <AbcSourceEditor
        source={source}
        filename={filename}
        messages={m}
        onEdit={edit}
      />
      <ScoreConverterLayout
        settings={
          <>
            {props.mode !== "midi" && (
              <div className="grid gap-2">
                <Label htmlFor={`${id}-setting`}>
                  {props.mode === "pdf"
                    ? props.messages.paper
                    : props.messages.format}
                </Label>
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
            )}
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
            {props.mode === "midi" && activeTune && (
              <MidiListen
                key={activeIndex}
                readMidi={async () => {
                  const { compileAbcMidi } =
                    await import("@workspace/score-export/abc-midi")
                  return compileAbcMidi(activeTune)
                }}
                messages={props.messages}
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
            activePage={props.mode === "midi" ? activeIndex : undefined}
            onPageChange={props.mode === "midi" ? setPreviewIndex : undefined}
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
