import { useEffect, useId, useRef, useState } from "react"
import {
  scoreFilename,
  scorePagePreviewBlob,
} from "@workspace/score-export/pages"
import { FileDropPicker } from "@workspace/ui/components/tool/file-drop-picker"
import { ScoreConverterLayout } from "@workspace/ui/components/tool/score-converter-layout"
import { ScorePagePreview } from "@workspace/ui/components/tool/score-page-preview"
import { Button } from "@workspace/ui/components/ui/button"
import { Label } from "@workspace/ui/components/ui/label"
import { Download, FileMusic, LoaderCircle, Piano } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { useScoreDownload } from "@workspace/ui/lib/use-score-download"
import { midiExample } from "./example"
import type { Grid, MidiNotationError } from "@workspace/midi-notation"
import type english from "./messages/en.json"

type ConvertedScore =
  | { error: MidiNotationError }
  | { xml: File; pages?: SVGSVGElement[] | null }
type Conversion = { file: File; grid: Grid } & ConvertedScore

export default function MidiToSheetMusic({
  messages: m,
  language,
}: {
  messages: typeof english
  language: string
}) {
  const gridId = useId()
  const gridControl = useRef<HTMLSelectElement>(null)
  const [file, setFile] = useState<File>()
  const [grid, setGrid] = useState<Grid>(16)
  const [conversion, setConversion] = useState<Conversion>()
  const { status: download, reset, save } = useScoreDownload()
  const current =
    conversion?.file === file && conversion?.grid === grid
      ? conversion
      : undefined
  const score = current && "xml" in current ? current : undefined
  const previewError =
    current && "error" in current
      ? m[current.error]
      : score?.pages === null
        ? m.layoutError
        : undefined

  useEffect(() => {
    if (!file) return
    let cancelled = false
    async function convert(source: File) {
      function finish(result: ConvertedScore) {
        if (!cancelled) setConversion({ file: source, grid, ...result })
      }
      let xml: File
      try {
        const { midiToMusicXml } = await import("@workspace/midi-notation")
        const input = new Uint8Array(await source.arrayBuffer())
        if (cancelled) return
        const title = source.name.replace(/\.(?:mid|midi)$/i, "")
        const result = midiToMusicXml(input, grid, title, m.part)
        if ("error" in result) {
          finish({ error: result.error })
          return
        }
        xml = new File([result.xml], `${scoreFilename(title)}.musicxml`, {
          type: "application/vnd.recordare.musicxml+xml",
        })
      } catch {
        finish({ error: "invalidMidi" })
        return
      }
      finish({ xml })
      try {
        const { renderMusicXmlPages } =
          await import("@workspace/score-export/musicxml")
        if (cancelled) return
        const pages = await renderMusicXmlPages(xml)
        finish({ xml, pages })
      } catch {
        finish({ xml, pages: null })
      }
    }
    void convert(file)
    return () => {
      cancelled = true
    }
  }, [file, grid, m.part])

  useEffect(() => {
    if (file && document.activeElement === document.body) {
      gridControl.current?.focus({ preventScroll: true })
    }
  }, [file])

  function chooseFile(next: File) {
    reset()
    setFile(next)
  }

  function downloadPdf() {
    if (!score?.pages) return
    const { pages, xml } = score
    void save(async () => {
      const { exportScore } = await import("@workspace/score-export")
      return exportScore(
        pages,
        "pdf",
        xml.name.replace(/\.musicxml$/, ""),
        language
      )
    })
  }

  return (
    <div className="space-y-4">
      <FileDropPicker
        name={file?.name ?? ""}
        accept=".mid,.midi,audio/midi,audio/x-midi"
        formats=".mid · .midi"
        labels={m}
        icon={Piano}
        onFile={chooseFile}
        example={{ label: m.example, onClick: () => chooseFile(midiExample()) }}
      />
      {file && (
        <ScoreConverterLayout
          settings={
            <>
              <div className="grid gap-2">
                <Label htmlFor={gridId}>{m.quantization}</Label>
                <select
                  id={gridId}
                  ref={gridControl}
                  value={grid}
                  aria-describedby={`${gridId}-hint`}
                  onChange={(event) => {
                    setGrid(Number(event.currentTarget.value) as Grid)
                    reset()
                  }}
                  className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9"
                >
                  <option value="8">{m.eighth}</option>
                  <option value="16">{m.sixteenth}</option>
                  <option value="32">{m.thirtySecond}</option>
                </select>
                <p
                  id={`${gridId}-hint`}
                  className="text-sm text-muted-foreground"
                >
                  {m.quantizationHint}
                </p>
              </div>
              <Button
                type="button"
                className="min-h-11 w-full"
                disabled={!score?.pages || download === "busy"}
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
                {download === "busy" ? m.downloadBusy : m.downloadPdf}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="min-h-11 w-full"
                disabled={!score}
                onClick={() => score && downloadBlob(score.xml, score.xml.name)}
              >
                <FileMusic data-icon="inline-start" aria-hidden="true" />
                {m.downloadMusicXml}
              </Button>
              {download === "error" && (
                <p role="alert" className="text-sm text-destructive">
                  {m.downloadError}
                </p>
              )}
            </>
          }
        >
          {score?.pages && (
            <ScorePagePreview
              pages={score.pages}
              makePreview={scorePagePreviewBlob}
              language={language}
              messages={m}
            />
          )}
          {(!current || (score && score.pages === undefined)) && (
            <p
              role="status"
              className="rounded-xl border p-4 text-sm text-muted-foreground"
            >
              {m.loading}
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
