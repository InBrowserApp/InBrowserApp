import { useEffect, useId, useRef, useState } from "react"
import { musicXmlExample } from "@workspace/score-export/musicxml-example"
import { scorePagePreviewBlob } from "@workspace/score-export/pages"
import { FileDropPicker } from "@workspace/ui/components/tool/file-drop-picker"
import { ScoreConverterLayout } from "@workspace/ui/components/tool/score-converter-layout"
import { ScorePagePreview } from "@workspace/ui/components/tool/score-page-preview"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Download, FileMusic, LoaderCircle } from "@workspace/ui/icons"
import { useScoreDownload } from "@workspace/ui/lib/use-score-download"
import { parseMeasureRange } from "./range"
import { useMusicXmlLayout } from "./use-layout"
import type { MeasureRange } from "@workspace/score-export/musicxml"
import type english from "./messages/en.json"

type Format = "png" | "svg"
type Area = "whole" | "single" | "excerpt"
const selectClass =
  "min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9"

export default function MusicXmlToImage({
  messages: m,
  language,
}: {
  messages: typeof english
  language: string
}) {
  const id = useId()
  const formatControl = useRef<HTMLSelectElement>(null)
  const [file, setFile] = useState<File>()
  const [format, setFormat] = useState<Format>("png")
  const [area, setArea] = useState<Area>("whole")
  const [page, setPage] = useState(0)
  const [first, setFirst] = useState("1")
  const [last, setLast] = useState<string>()
  const [range, setRange] = useState<MeasureRange | "invalid">()
  const invalidRange = range === "invalid"
  const requested = invalidRange ? undefined : range
  const { status: download, reset, save } = useScoreDownload()
  const full = useMusicXmlLayout(file)
  const excerpt = useMusicXmlLayout(requested ? file : undefined, requested)
  const measureCount = full?.measureCount ?? 0
  const total = new Intl.NumberFormat(language).format(measureCount)
  const lastValue = last ?? String(Math.min(4, measureCount))
  const layout = area === "excerpt" ? excerpt : full
  const pages = layout?.pages
  const activePage = pages ? Math.min(page, pages.length - 1) : 0
  const outputPages =
    pages && (area === "single" ? [pages[activePage]!] : pages)

  useEffect(() => {
    if (file && document.activeElement === document.body) {
      formatControl.current?.focus({ preventScroll: true })
    }
  }, [file])

  function clearRange() {
    reset()
    setRange(undefined)
  }

  function chooseFile(next: File) {
    clearRange()
    setPage(0)
    setArea("whole")
    setFirst("1")
    setLast(undefined)
    setFile(next)
  }

  function chooseArea(next: Area) {
    clearRange()
    if (area === "excerpt" || next === "excerpt") setPage(0)
    setArea(next)
  }

  function previewRange() {
    const selection = parseMeasureRange(
      first,
      lastValue,
      measureCount,
      language
    )
    if (!selection) {
      setRange("invalid")
      return
    }
    reset()
    setPage(0)
    setRange(selection)
  }

  function downloadImages() {
    if (!outputPages || !file) return
    void save(async () => {
      const [{ exportScore }, { musicXmlBasename }] = await Promise.all([
        import("@workspace/score-export"),
        import("@workspace/score-export/musicxml"),
      ])
      const suffix =
        area === "single"
          ? `-page-${activePage + 1}`
          : requested
            ? `-measures-${requested.join("-")}`
            : ""
      return exportScore(
        outputPages,
        format,
        musicXmlBasename(file.name) + suffix,
        language
      )
    })
  }

  const pending =
    full === undefined ||
    (area === "excerpt" && requested && excerpt === undefined)
  const previewError =
    full === null
      ? m.invalidScore
      : excerpt === null
        ? m.rangeFailed
        : undefined

  return (
    <div className="space-y-4">
      <FileDropPicker
        name={file?.name ?? ""}
        accept=".musicxml,.xml,.mxl,application/vnd.recordare.musicxml,application/vnd.recordare.musicxml+xml"
        formats=".musicxml · .mxl · .xml"
        labels={m}
        icon={FileMusic}
        onFile={chooseFile}
        example={{
          label: m.example,
          onClick: () => chooseFile(musicXmlExample()),
        }}
      />
      {file && (
        <ScoreConverterLayout
          settings={
            <>
              <div className="grid gap-2">
                <Label htmlFor={`${id}-format`}>{m.format}</Label>
                <select
                  id={`${id}-format`}
                  ref={formatControl}
                  value={format}
                  className={selectClass}
                  onChange={(event) => {
                    reset()
                    setFormat(event.currentTarget.value as Format)
                  }}
                >
                  <option value="png">PNG</option>
                  <option value="svg">SVG</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${id}-area`}>{m.area}</Label>
                <select
                  id={`${id}-area`}
                  value={area}
                  className={selectClass}
                  onChange={(event) =>
                    chooseArea(event.currentTarget.value as Area)
                  }
                  disabled={!full}
                >
                  <option value="whole">{m.whole}</option>
                  <option value="single">{m.single}</option>
                  <option value="excerpt">{m.excerpt}</option>
                </select>
              </div>
              {area === "excerpt" && full && (
                <form
                  noValidate
                  className="grid gap-3"
                  onSubmit={(event) => {
                    event.preventDefault()
                    previewRange()
                  }}
                >
                  <div className="grid grid-cols-2 items-end gap-2">
                    {[
                      {
                        field: "first",
                        label: m.firstMeasure,
                        value: first,
                        set: setFirst,
                      },
                      {
                        field: "last",
                        label: m.lastMeasure,
                        value: lastValue,
                        set: setLast,
                      },
                    ].map(({ field, label, value, set }) => (
                      <div key={field} className="grid min-w-0 gap-2">
                        <Label htmlFor={`${id}-${field}`}>{label}</Label>
                        <Input
                          id={`${id}-${field}`}
                          className="min-h-11 sm:min-h-9"
                          dir="ltr"
                          inputMode="numeric"
                          value={value}
                          aria-describedby={`${id}-hint`}
                          aria-invalid={invalidRange}
                          onChange={(event) => {
                            clearRange()
                            set(event.currentTarget.value)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <p
                    id={`${id}-hint`}
                    className="text-sm text-muted-foreground"
                  >
                    {m.rangeHint.replace("{total}", total)}
                  </p>
                  {invalidRange && (
                    <p role="alert" className="text-sm text-destructive">
                      {m.invalidRange.replace("{total}", total)}
                    </p>
                  )}
                  <Button
                    type="submit"
                    variant="outline"
                    className="min-h-11 w-full"
                  >
                    {m.previewRange}
                  </Button>
                </form>
              )}
              <Button
                type="button"
                className="min-h-11 w-full"
                disabled={!outputPages || download === "busy"}
                onClick={downloadImages}
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
                {download === "busy"
                  ? m.downloadBusy
                  : (outputPages?.length ?? 0) > 1
                    ? m.downloadZip
                    : m.download}
              </Button>
              {download === "error" && (
                <p role="alert" className="text-sm text-destructive">
                  {m.downloadError}
                </p>
              )}
            </>
          }
        >
          {pages && (
            <ScorePagePreview
              pages={pages}
              activePage={activePage}
              onPageChange={(next) => {
                if (area === "single") reset()
                setPage(next)
              }}
              makePreview={scorePagePreviewBlob}
              language={language}
              messages={m}
            />
          )}
          {pending && (
            <p
              role="status"
              className="rounded-xl border p-4 text-sm text-muted-foreground"
            >
              {m.loading}
            </p>
          )}
          {area === "excerpt" && full && !requested && (
            <p className="rounded-xl border p-4 text-sm text-muted-foreground">
              {m.chooseRange}
            </p>
          )}
          {previewError && (
            <p
              role="alert"
              className="rounded-xl border p-4 text-sm text-destructive"
            >
              {previewError}
            </p>
          )}
        </ScoreConverterLayout>
      )}
    </div>
  )
}
