import { useEffect, useId, useRef, useState } from "react"
import { musicXmlExample } from "@workspace/score-export/musicxml-example"
import {
  scorePagePreviewBlob,
  type ScorePaper,
} from "@workspace/score-export/pages"
import { FileDropPicker } from "@workspace/ui/components/tool/file-drop-picker"
import { ScorePagePreview } from "@workspace/ui/components/tool/score-page-preview"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { Label } from "@workspace/ui/components/ui/label"
import { Download, FileMusic, LoaderCircle } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import type english from "./messages/en.json"

type Score = { file: File; paper: ScorePaper; pages: SVGSVGElement[] | null }

export default function MusicXmlToPdf({
  messages: m,
  language,
}: {
  messages: typeof english
  language: string
}) {
  const paperId = useId()
  const paperControl = useRef<HTMLSelectElement>(null)
  const [file, setFile] = useState<File>()
  const [paper, setPaper] = useState<ScorePaper>("a4")
  const [score, setScore] = useState<Score>()
  const [download, setDownload] = useState<"busy" | "error">()
  const exportRevision = useRef(0)
  const current =
    score?.file === file && score?.paper === paper ? score : undefined
  const pages = current?.pages

  useEffect(() => {
    if (!file) return
    let cancelled = false
    async function layOut(source: File) {
      try {
        const { renderMusicXmlPages } =
          await import("@workspace/score-export/musicxml")
        if (cancelled) return
        const pages = await renderMusicXmlPages(source, paper)
        if (!cancelled) setScore({ file: source, paper, pages })
      } catch {
        if (!cancelled) setScore({ file: source, paper, pages: null })
      }
    }
    void layOut(file)
    return () => {
      cancelled = true
    }
  }, [file, paper])

  useEffect(() => {
    if (file && document.activeElement === document.body) {
      paperControl.current?.focus({ preventScroll: true })
    }
  }, [file])

  function resetDownload() {
    exportRevision.current++
    setDownload(undefined)
  }

  function chooseFile(next: File) {
    resetDownload()
    setFile(next)
  }

  async function save() {
    if (!pages || !file || download === "busy") return
    const revision = ++exportRevision.current
    setDownload("busy")
    try {
      const [{ exportScore }, { musicXmlBasename }] = await Promise.all([
        import("@workspace/score-export"),
        import("@workspace/score-export/musicxml"),
      ])
      const result = await exportScore(
        pages,
        "pdf",
        musicXmlBasename(file.name),
        language
      )
      if (revision !== exportRevision.current) return
      downloadBlob(result.blob, result.filename)
      setDownload(undefined)
    } catch {
      if (revision === exportRevision.current) setDownload("error")
    }
  }

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
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <ToolPanelCard className="h-auto lg:col-start-2 lg:row-start-1">
            <ToolPanelCardContent className="gap-3">
              <div className="grid gap-2">
                <Label htmlFor={paperId}>{m.paper}</Label>
                <select
                  ref={paperControl}
                  id={paperId}
                  value={paper}
                  onChange={(event) => {
                    setPaper(event.currentTarget.value as ScorePaper)
                    resetDownload()
                  }}
                  className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9"
                >
                  <option value="a4">{m.a4}</option>
                  <option value="letter">{m.letter}</option>
                </select>
              </div>
              <Button
                type="button"
                className="min-h-11 w-full"
                disabled={!pages || download === "busy"}
                onClick={() => void save()}
              >
                {download === "busy" ? (
                  <LoaderCircle
                    aria-hidden="true"
                    data-icon="inline-start"
                    className="motion-safe:animate-spin"
                  />
                ) : (
                  <Download aria-hidden="true" data-icon="inline-start" />
                )}
                {download === "busy" ? m.downloadBusy : m.download}
              </Button>
              {download === "error" && (
                <p role="alert" className="text-sm text-destructive">
                  {m.downloadError}
                </p>
              )}
            </ToolPanelCardContent>
          </ToolPanelCard>
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            {pages && (
              <ScorePagePreview
                pages={pages}
                makePreview={scorePagePreviewBlob}
                language={language}
                messages={m}
              />
            )}
            {!current && (
              <p
                role="status"
                className="rounded-xl border p-4 text-sm text-muted-foreground"
              >
                {m.loading}
              </p>
            )}
            {pages === null && (
              <p
                role="alert"
                className="rounded-xl border p-4 text-sm text-destructive"
              >
                {m.invalidScore}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
