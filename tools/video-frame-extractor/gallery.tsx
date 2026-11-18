import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Download, FileArchive } from "@workspace/ui/icons"
import { formatTime } from "./core/timeline"
import { createZip } from "./zip"
import type { Frame, Messages } from "./types"

export function Gallery({
  frames,
  basename,
  messages: m,
  language,
}: {
  frames: Frame[]
  basename: string
  messages: Messages
  language: string
}) {
  const [resources, setResources] = useState<{
    frames: Frame[]
    entries: { frame: Frame; image: string; preview: string }[]
  }>()
  const [packing, setPacking] = useState(false)
  const [zipError, setZipError] = useState(false)

  useEffect(() => {
    const entries = frames.map((frame) => ({
      frame,
      image: URL.createObjectURL(frame.blob),
      preview: URL.createObjectURL(frame.preview),
    }))
    setResources({ frames, entries })
    return () => {
      for (const { image, preview } of entries) {
        URL.revokeObjectURL(image)
        URL.revokeObjectURL(preview)
      }
    }
  }, [frames])

  async function downloadZip() {
    setPacking(true)
    setZipError(false)
    try {
      const blob = await createZip(frames)
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${basename}-frames.zip`
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 10_000)
    } catch {
      setZipError(true)
    } finally {
      setPacking(false)
    }
  }

  return (
    <ToolPanelCard>
      <ToolPanelCardContent className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 aria-live="polite" className="font-semibold">
            {m.results}{" "}
            <span className="ms-1 text-sm font-normal text-muted-foreground">
              ({new Intl.NumberFormat(language).format(frames.length)})
            </span>
          </h2>
          <Button
            type="button"
            variant="outline"
            disabled={packing}
            className="min-h-11 sm:min-h-0"
            onClick={() => void downloadZip()}
          >
            <FileArchive aria-hidden="true" />
            {packing ? m.preparingZip : m.downloadZip}
          </Button>
        </div>
        {zipError && (
          <p role="alert" className="text-sm text-destructive">
            {m.zipError}
          </p>
        )}
        {resources?.frames === frames && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {resources.entries.map(({ frame, image, preview }) => {
              const time = formatTime(frame.time)
              return (
                <li
                  key={frame.time}
                  className="min-w-0 overflow-hidden rounded-lg border"
                >
                  <img
                    src={preview}
                    alt={m.frameAlt.replace("{time}", time)}
                    loading="lazy"
                    decoding="async"
                    className="aspect-video w-full bg-muted object-contain"
                  />
                  <div className="flex min-w-0 items-center justify-between gap-1 px-2 py-1">
                    <bdi className="font-mono text-xs tabular-nums">{time}</bdi>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="size-11 shrink-0 sm:size-8"
                    >
                      <a
                        href={image}
                        download={frame.name}
                        aria-label={m.downloadFrame.replace("{time}", time)}
                      >
                        <Download aria-hidden="true" />
                      </a>
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
