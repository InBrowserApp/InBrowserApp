import { useEffect, useRef, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { Button } from "@workspace/ui/components/ui/button"
import { FileMusic, Upload, ZoomIn, ZoomOut } from "@workspace/ui/icons"
import example from "./fixtures/morning-steps.musicxml?raw"

import type { OpenSheetMusicDisplay } from "opensheetmusicdisplay"
import type english from "./messages/en.json"

const zoomStep = 20
const defaultZoom = 100

export default function MusicXmlViewer({
  messages: m,
  language,
}: {
  messages: typeof english
  language: string
}) {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  )
  const [zoom, setZoom] = useState(defaultZoom)
  const host = useRef<HTMLDivElement>(null)
  const viewer = useRef<OpenSheetMusicDisplay>(null)

  function open(next: File | null) {
    setZoom(defaultZoom)
    setFile(next)
    setStatus(next ? "loading" : "idle")
  }

  useEffect(() => {
    if (!file) return
    let cancelled = false
    async function load(source: File) {
      try {
        const { OpenSheetMusicDisplay } = await import("opensheetmusicdisplay")
        if (cancelled) return
        const display = new OpenSheetMusicDisplay(host.current!, {
          backend: "svg",
          autoResize: true,
          keepWarm: false,
        })
        viewer.current = display
        await display.load(source)
        if (cancelled) return
        display.render()
        setStatus("ready")
      } catch {
        if (!cancelled) setStatus("error")
      }
    }
    void load(file)
    return () => {
      cancelled = true
      viewer.current?.destroy()
      viewer.current = null
    }
  }, [file])

  function updateZoom(next: number) {
    const display = viewer.current!
    display.Zoom = next / 100
    display.render()
    setZoom(next)
  }

  const percent = new Intl.NumberFormat(language, { style: "percent" }).format(
    zoom / 100
  )
  return (
    <DocumentWorkspace
      tool="musicxml-viewer"
      file={file}
      onFile={open}
      accept=".musicxml,.xml,.mxl,application/vnd.recordare.musicxml,application/vnd.recordare.musicxml+xml"
      active={status === "ready"}
      messages={m}
      renderEmpty={(chooseFile) => (
        <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
          <FileMusic
            className="size-8 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{m.dropHint}</p>
            <p>
              <bdi>.musicxml · .xml · .mxl</bdi>
            </p>
          </div>
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            <Button
              data-file-open
              type="button"
              className="min-h-11"
              onClick={chooseFile}
            >
              <Upload data-icon="inline-start" aria-hidden="true" />
              {m.open}
            </Button>
            <Button
              type="button"
              className="min-h-11"
              variant="outline"
              onClick={() =>
                open(new File([example], "Morning Steps.musicxml"))
              }
            >
              {m.example}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{m.privacy}</p>
        </div>
      )}
    >
      {status === "loading" && (
        <p role="status" className="p-4 text-sm text-muted-foreground">
          {m.loading}
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="p-4 text-sm text-destructive">
          {m.invalidScore}
        </p>
      )}
      {status === "ready" && (
        <div className="flex shrink-0 items-center justify-end gap-1 border-b px-2 py-1">
          <DocumentIconButton
            label={m.zoomOut}
            disabled={zoom <= 60}
            onClick={() => updateZoom(zoom - zoomStep)}
          >
            <ZoomOut aria-hidden="true" />
          </DocumentIconButton>
          <Button
            type="button"
            variant="ghost"
            className="min-w-14 tabular-nums"
            aria-label={m.resetZoom}
            title={m.resetZoom}
            onClick={() => updateZoom(defaultZoom)}
          >
            {percent}
          </Button>
          <DocumentIconButton
            label={m.zoomIn}
            disabled={zoom >= 200}
            onClick={() => updateZoom(zoom + zoomStep)}
          >
            <ZoomIn aria-hidden="true" />
          </DocumentIconButton>
        </div>
      )}
      <div
        hidden={status === "idle" || status === "error"}
        className="min-h-0 flex-1 [scrollbar-gutter:stable] overflow-auto bg-white p-2 text-black sm:p-4"
        dir="ltr"
        role="region"
        aria-label={m.preview}
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Enable keyboard scrolling in the score.
        tabIndex={status === "ready" ? 0 : undefined}
      >
        <div
          ref={host}
          style={{ minWidth: Math.round((340 * zoom) / defaultZoom) }}
        />
      </div>
    </DocumentWorkspace>
  )
}
