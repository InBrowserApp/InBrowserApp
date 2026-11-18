import { useEffect, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Label } from "@workspace/ui/components/ui/label"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Film } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { FRAME_LIMIT, formatTime, planFrames } from "./core/timeline"
import { extractFrames, videoBasename } from "./extract"
import { Gallery } from "./gallery"
import { TimingFields } from "./settings"
import type { Timing } from "./core/timeline"
import type { Frame, ImageFormat, Messages } from "./types"

const initialTiming: Timing = {
  mode: "timestamps",
  timestamps: "0",
  interval: "1",
  start: "0",
  end: "",
}

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
  const operation = useRef<AbortController | null>(null)
  const [metadata, setMetadata] = useState<{
    duration: number
    width: number
    height: number
  }>()
  const duration = metadata?.duration
  const portrait = Boolean(metadata && metadata.height > metadata.width)
  const [videoError, setVideoError] = useState(false)
  const [timing, setTiming] = useState(initialTiming)
  const [format, setFormat] = useState<ImageFormat>("image/jpeg")
  const [submitted, setSubmitted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number }>()
  const [frames, setFrames] = useState<Frame[]>([])
  const basename = videoBasename(source.file.name)
  const number = new Intl.NumberFormat(language)
  const plan = duration === undefined ? undefined : planFrames(timing, duration)
  const validTimes = plan && "times" in plan ? plan.times : undefined
  const durationLabel =
    duration === undefined ? "" : formatTime(Math.floor(duration * 1000))
  const planError =
    submitted && plan && "error" in plan
      ? m[plan.error]
          .replace("{duration}", durationLabel)
          .replace("{limit}", number.format(FRAME_LIMIT))
      : ""

  useEffect(() => () => operation.current?.abort(), [])

  function changeTiming(update: Partial<Timing>) {
    setTiming((previous) => ({ ...previous, ...update }))
    setSubmitted(false)
    setFailed(false)
  }

  async function extract() {
    setSubmitted(true)
    setFailed(false)
    const element = video.current
    if (!element || !validTimes || operation.current) return

    const controller = new AbortController()
    const originalTime = element.currentTime
    operation.current = controller
    element.pause()
    setProgress({ done: 0, total: validTimes.length })
    try {
      const result = await extractFrames(
        element,
        validTimes,
        format,
        basename,
        controller.signal,
        (done) => setProgress({ done, total: validTimes.length })
      )
      setFrames(result)
    } catch {
      if (!controller.signal.aborted) setFailed(true)
    } finally {
      operation.current = null
      if (video.current === element) {
        element.currentTime = originalTime
        setProgress(undefined)
      }
    }
  }

  return (
    <>
      <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          {/* Local videos can provide their own embedded caption tracks. */}
          {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={video}
            src={source.url}
            controls={!progress}
            playsInline
            preload="auto"
            aria-label={source.file.name}
            className={cn(
              "max-h-[55vh] w-full rounded-xl bg-black object-contain",
              portrait ? "aspect-[4/3]" : "aspect-video",
              videoError && "hidden"
            )}
            onLoadedData={(event) => {
              const element = event.currentTarget
              if (
                !Number.isFinite(element.duration) ||
                element.duration <= 0 ||
                !element.videoWidth
              ) {
                setVideoError(true)
                return
              }
              setMetadata({
                duration: element.duration,
                width: element.videoWidth,
                height: element.videoHeight,
              })
            }}
            onError={() => setVideoError(true)}
          />
          {videoError ? (
            <p role="alert" className="text-sm text-destructive">
              {m.videoError}
            </p>
          ) : !metadata ? (
            <p role="status" className="mt-2 text-sm text-muted-foreground">
              {m.loading}
            </p>
          ) : (
            <p
              dir="ltr"
              className="mt-2 text-sm text-muted-foreground rtl:text-right"
            >
              {metadata.width} × {metadata.height} · {durationLabel}
            </p>
          )}
        </div>
        {duration !== undefined && !videoError && (
          <ToolPanelCard>
            <ToolPanelCardContent className="gap-4">
              <h2 className="font-semibold">{m.settings}</h2>
              <form
                className="grid gap-4"
                noValidate
                onSubmit={(event) => {
                  event.preventDefault()
                  void extract()
                }}
              >
                <fieldset
                  disabled={Boolean(progress)}
                  className="grid min-w-0 gap-4"
                >
                  <TimingFields
                    messages={m}
                    timing={timing}
                    onChange={changeTiming}
                    error={Boolean(planError)}
                    onAddTime={() => {
                      const currentTime =
                        Math.floor(video.current!.currentTime * 1000) / 1000
                      changeTiming({
                        timestamps: [timing.timestamps.trim(), currentTime]
                          .filter((value) => value !== "")
                          .join(", "),
                      })
                    }}
                  />
                  <div className="grid gap-2">
                    <Label htmlFor="frame-format">{m.format}</Label>
                    <select
                      id="frame-format"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      value={format}
                      onChange={(event) =>
                        setFormat(
                          event.currentTarget.value === "image/png"
                            ? "image/png"
                            : "image/jpeg"
                        )
                      }
                    >
                      <option value="image/jpeg">JPG</option>
                      <option value="image/png">PNG</option>
                    </select>
                  </div>
                </fieldset>
                {planError && (
                  <p
                    id="frame-settings-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {planError}
                  </p>
                )}
                {failed && (
                  <p role="alert" className="text-sm text-destructive">
                    {m.extractError}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="submit"
                    disabled={Boolean(progress)}
                    className="min-h-11 sm:min-h-0"
                  >
                    <Film aria-hidden="true" />
                    {m.extract}
                  </Button>
                  {progress ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => operation.current?.abort()}
                      className="min-h-11 sm:min-h-0"
                    >
                      {m.cancel}
                    </Button>
                  ) : (
                    validTimes && (
                      <p className="text-sm text-muted-foreground">
                        {m.frameCount.replace(
                          "{count}",
                          number.format(validTimes.length)
                        )}
                      </p>
                    )
                  )}
                </div>
                {progress && (
                  <div className="grid gap-1">
                    <p
                      id="frame-progress"
                      className="text-sm text-muted-foreground"
                    >
                      {m.progress
                        .replace("{done}", number.format(progress.done))
                        .replace("{total}", number.format(progress.total))}
                    </p>
                    <progress
                      aria-labelledby="frame-progress"
                      className="h-2 w-full accent-primary"
                      max={progress.total}
                      value={progress.done}
                    />
                  </div>
                )}
              </form>
            </ToolPanelCardContent>
          </ToolPanelCard>
        )}
      </div>
      <p role="status" className="sr-only">
        {frames.length > 0 && `${m.results} (${number.format(frames.length)})`}
      </p>
      {frames.length > 0 && (
        <Gallery
          frames={frames}
          basename={basename}
          portrait={portrait}
          messages={m}
          language={language}
        />
      )}
    </>
  )
}
