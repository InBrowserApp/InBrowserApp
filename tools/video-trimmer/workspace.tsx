import { useEffect, useId, useRef, useState } from "react"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Slider } from "@workspace/ui/components/ui/slider"
import { Download, Play, Scissors } from "@workspace/ui/icons"
import type { inspectVideo } from "./media"
import type { Messages, VideoFormat } from "./types"
import { useClipPreview } from "./use-clip-preview"
import { useClipSelection } from "./use-clip-selection"

const times = ["start", "end"] as const

export function Workspace({
  source,
  messages: m,
  language,
}: {
  source: { file: File; url: string }
  messages: Messages
  language: string
}) {
  const video = useRef<HTMLVideoElement>(null)
  const preview = useClipPreview(video)
  const operation = useRef<AbortController>(null)
  const [info, setInfo] = useState<Awaited<ReturnType<typeof inspectVideo>>>()
  const [videoError, setVideoError] = useState(false)
  const [format, setFormat] = useState<VideoFormat>("mp4")
  const [exportError, setExportError] = useState(false)
  const [progress, setProgress] = useState<number>()
  const [result, setResult] = useState<{ url: string; name: string }>()
  const id = useId()

  const duration = info?.duration ?? 0
  const selection = useClipSelection(duration)
  const { limit, range, slider, error: rangeError } = selection
  const busy = progress !== undefined
  const seconds = new Intl.NumberFormat(language, {
    style: "unit",
    unit: "second",
    maximumFractionDigits: 3,
  })

  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url)
    }
  }, [result])

  useEffect(() => () => operation.current?.abort(), [])

  async function loadMetadata(element: HTMLVideoElement) {
    try {
      if (!element.videoWidth) throw new Error("Missing video track")
      const media = await import("./media")
      const next = await media.inspectVideo(source.file, element.duration)
      setInfo(next)
      setFormat(next.format)
    } catch {
      setVideoError(true)
    }
  }

  function previewClip() {
    selection.validate()
    if (range) preview.play(range)
  }

  function clearResult() {
    setResult(undefined)
    setExportError(false)
  }

  function updateSelection(
    next: typeof selection.fields,
    moved: keyof typeof selection.fields
  ) {
    preview.scrub(selection.change(next, moved))
    clearResult()
  }

  async function exportClip() {
    selection.validate()
    if (!range || result || operation.current) return
    const controller = new AbortController()
    operation.current = controller
    clearResult()
    setProgress(0)
    try {
      const { exportVideo } = await import("./media")
      const trim = range.start > 0 || range.end < duration ? range : undefined
      const blob = await exportVideo(
        source.file,
        format,
        trim,
        controller.signal,
        setProgress
      )
      if (!controller.signal.aborted) {
        const stem = source.file.name.replace(/\.(mp4|webm)$/i, "")
        setResult({
          url: URL.createObjectURL(blob),
          name: `${stem}-trimmed.${format}`,
        })
      }
    } catch {
      if (!controller.signal.aborted) setExportError(true)
    } finally {
      operation.current = null
      setProgress(undefined)
    }
  }

  return (
    <ToolPanelCard>
      <ToolPanelCardContent className="gap-4">
        {/* Local videos can provide their own caption tracks. */}
        {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={video}
          src={source.url}
          controls
          playsInline
          preload="metadata"
          aria-label={m.videoPreview}
          className="max-h-96 w-full rounded-md bg-black"
          hidden={videoError}
          onLoadedMetadata={(event) => void loadMetadata(event.currentTarget)}
          onError={() => setVideoError(true)}
          onTimeUpdate={preview.checkEnd}
          onPause={preview.stop}
          onEnded={preview.stop}
        />
        {videoError && (
          <p role="alert" className="text-sm text-destructive">
            {m.videoError}
          </p>
        )}
        {!info && !videoError && (
          <p role="status" className="text-sm text-muted-foreground">
            {m.loading}
          </p>
        )}
        {info && !videoError && (
          <form
            className="grid gap-4"
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              void exportClip()
            }}
          >
            <fieldset disabled={busy} className="grid min-w-0 gap-3">
              <Slider
                dir="ltr"
                className="min-h-8 [&_[data-slot=slider-thumb]]:size-4"
                value={slider}
                max={limit}
                step={0.001}
                minStepsBetweenThumbs={1}
                disabled={busy}
                thumbLabels={[m.start, m.end]}
                onValueChange={([newStart = 0, newEnd = limit]) =>
                  updateSelection(
                    { start: String(newStart), end: String(newEnd) },
                    newStart !== slider[0] ? "start" : "end"
                  )
                }
              />
              <div dir="ltr" className="grid grid-cols-2 gap-3">
                {times.map((field) => (
                  <div key={field} className="grid min-w-0 content-start gap-2">
                    <Label dir="auto" htmlFor={id + field}>
                      {m[field]}
                    </Label>
                    <Input
                      id={id + field}
                      inputMode="decimal"
                      dir="ltr"
                      className="min-h-11 tabular-nums sm:min-h-9"
                      aria-invalid={rangeError}
                      aria-describedby={rangeError ? id + "error" : undefined}
                      value={selection.fields[field]}
                      onBlur={selection.validate}
                      onChange={(event) => {
                        updateSelection(
                          {
                            ...selection.fields,
                            [field]: event.currentTarget.value,
                          },
                          field
                        )
                      }}
                    />
                  </div>
                ))}
              </div>
              {rangeError && (
                <p
                  id={id + "error"}
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {m.rangeError}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto min-h-11 whitespace-normal sm:min-h-9"
                  onClick={previewClip}
                >
                  <Play aria-hidden="true" />
                  {m.previewClip}
                </Button>
                {range && (
                  <p className="text-sm text-muted-foreground">
                    {m.clipDuration} ·{" "}
                    <bdi>{seconds.format(range.end - range.start)}</bdi>
                  </p>
                )}
              </div>
              <div className="grid w-fit gap-2">
                <Label htmlFor={id + "format"}>{m.format}</Label>
                <select
                  id={id + "format"}
                  className="min-h-11 rounded-md border border-input bg-background px-2.5 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:min-h-9"
                  value={format}
                  onChange={(event) => {
                    setFormat(event.currentTarget.value as VideoFormat)
                    clearResult()
                  }}
                >
                  <option value="mp4">MP4</option>
                  <option value="webm">WebM</option>
                </select>
              </div>
            </fieldset>
            <div className="flex flex-wrap items-center gap-2">
              {!result && (
                <Button
                  type="submit"
                  disabled={busy}
                  className="h-auto min-h-11 whitespace-normal sm:min-h-9"
                >
                  <Scissors aria-hidden="true" />
                  {m.exportClip}
                </Button>
              )}
              {busy && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => operation.current?.abort()}
                >
                  {m.cancel}
                </Button>
              )}
              {result && (
                <Button
                  asChild
                  className="h-auto min-h-11 whitespace-normal sm:min-h-9"
                >
                  <a href={result.url} download={result.name}>
                    <Download aria-hidden="true" />
                    {m.downloadClip}
                  </a>
                </Button>
              )}
            </div>
            <div
              role="status"
              className={
                busy || result ? "text-sm text-muted-foreground" : "sr-only"
              }
            >
              {busy ? m.exporting : result ? m.ready : ""}
            </div>
            {busy && (
              <progress
                aria-label={m.exporting}
                className="h-2 w-full accent-primary"
                max={1}
                value={progress}
              />
            )}
            {exportError && (
              <p role="alert" className="text-sm text-destructive">
                {m.exportError}
              </p>
            )}
          </form>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
