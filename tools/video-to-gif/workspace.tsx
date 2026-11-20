import { useEffect, useMemo, useRef, useState } from "react"
import { animationSize } from "@workspace/raster-image/animation-size"
import type { AnimationResult } from "@workspace/raster-image/animation-worker"
import { Preview } from "@workspace/ui/components/tool/animation-maker/preview"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { Film } from "@workspace/ui/icons"
import { convertVideo } from "./convert"
import { planGif } from "./core/plan"
import type { GifPlan, Settings, VideoInfo } from "./core/plan"
import { GifSettings } from "./settings"
import type { Messages, PreviewMessages } from "./types"

export function Workspace({
  source,
  messages: m,
  previewMessages,
  language,
}: {
  source: { file: File; url: string }
  messages: Messages
  previewMessages: PreviewMessages
  language: string
}) {
  const video = useRef<HTMLVideoElement>(null)
  const operation = useRef<AbortController>(null)
  const resultRegion = useRef<HTMLDivElement>(null)
  const [info, setInfo] = useState<VideoInfo>()
  const [videoError, setVideoError] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    start: "0",
    end: "",
    fps: 10,
    width: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number }>()
  const [result, setResult] = useState<{
    animation: AnimationResult
    plan: GifPlan
  }>()
  const plan = useMemo(() => info && planGif(settings, info), [info, settings])
  const error = submitted && plan && "error" in plan ? plan.error : undefined
  const number = new Intl.NumberFormat(language, { maximumFractionDigits: 3 })
  const seconds = new Intl.NumberFormat(language, {
    style: "unit",
    unit: "second",
    maximumFractionDigits: 3,
  })

  useEffect(() => () => operation.current?.abort(), [])
  useEffect(() => {
    if (result) resultRegion.current?.scrollIntoView({ block: "nearest" })
  }, [result])

  function loadMetadata(element: HTMLVideoElement) {
    const { videoWidth: width, videoHeight: height } = element
    const duration = Math.floor(element.duration * 1000)
    if (
      !(Number.isFinite(duration) && duration > 0 && width > 0 && height > 0)
    ) {
      setVideoError(true)
      return
    }
    const maxWidth = animationSize([{ width, height }]).width
    setInfo({ duration, width, height, maxWidth })
    setSettings({
      start: "0",
      end: String(Math.min(3000, duration) / 1000),
      fps: 10,
      width: String(Math.min(480, maxWidth)),
    })
  }

  async function makeGif() {
    setSubmitted(true)
    setFailed(false)
    if (!plan || "error" in plan || operation.current) return

    const controller = new AbortController()
    operation.current = controller
    const { signal } = controller
    const total = plan.frames.length
    setProgress({ done: 0, total })
    try {
      const animation = await convertVideo(source.url, plan, signal, (done) =>
        setProgress({ done, total })
      )
      if (!signal.aborted) setResult({ animation, plan })
    } catch {
      if (!signal.aborted) setFailed(true)
    } finally {
      operation.current = null
      setProgress(undefined)
    }
  }

  return (
    <>
      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <ToolPanelCard>
          <ToolPanelCardContent className="gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="font-semibold">{m.sourceVideo}</h2>
              {info && !videoError && (
                <p className="text-sm text-muted-foreground tabular-nums">
                  <bdi>
                    {number.format(info.width)} × {number.format(info.height)}
                  </bdi>
                  {" · "}
                  <bdi>{seconds.format(info.duration / 1000)}</bdi>
                </p>
              )}
            </div>
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
            {/* The player previews a locally selected file with its own tracks. */}
            {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={video}
              src={source.url}
              preload="metadata"
              playsInline
              controls
              aria-label={m.sourceVideo}
              className="max-h-80 w-full rounded-md bg-black"
              hidden={videoError}
              onLoadedMetadata={(event) => loadMetadata(event.currentTarget)}
              onError={() => setVideoError(true)}
            />
          </ToolPanelCardContent>
        </ToolPanelCard>
        {info && !videoError && (
          <ToolPanelCard>
            <ToolPanelCardContent>
              <form
                className="grid gap-4"
                noValidate
                onSubmit={(event) => {
                  event.preventDefault()
                  void makeGif()
                }}
              >
                <fieldset
                  disabled={Boolean(progress)}
                  className="grid min-w-0 gap-4"
                >
                  <GifSettings
                    messages={m}
                    settings={settings}
                    info={info}
                    error={error}
                    onChange={(update) => {
                      setSettings((current) => ({ ...current, ...update }))
                      setSubmitted(false)
                      setResult(undefined)
                      setFailed(false)
                    }}
                    scrubTo={(time) => {
                      const element = video.current!
                      element.pause()
                      element.currentTime = time
                    }}
                  />
                </fieldset>
                {error && (
                  <p
                    id="gif-settings-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {m[error]
                      .replace(
                        "{duration}",
                        number.format(info.duration / 1000)
                      )
                      .replace("{max}", number.format(info.maxWidth))}
                  </p>
                )}
                {failed && (
                  <p role="alert" className="text-sm text-destructive">
                    {m.convertError}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="submit"
                    disabled={Boolean(progress)}
                    className="h-auto min-h-11 whitespace-normal sm:min-h-9"
                  >
                    <Film aria-hidden="true" />
                    {m.convert}
                  </Button>
                  {progress ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto min-h-11 whitespace-normal sm:min-h-9"
                      onClick={() => operation.current?.abort()}
                    >
                      {m.cancel}
                    </Button>
                  ) : (
                    plan &&
                    "frames" in plan && (
                      <p className="text-sm text-muted-foreground tabular-nums">
                        <bdi>
                          {number.format(plan.width)} ×{" "}
                          {number.format(plan.height)}
                        </bdi>
                        {" · "}
                        <bdi>{seconds.format(plan.duration / 1000)}</bdi>
                      </p>
                    )
                  )}
                </div>
                {progress && (
                  <div className="grid gap-1">
                    <p
                      id="gif-progress"
                      className="text-sm text-muted-foreground"
                    >
                      {m.progress
                        .replace("{done}", number.format(progress.done))
                        .replace("{total}", number.format(progress.total))}
                    </p>
                    <progress
                      aria-labelledby="gif-progress"
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
        {result && m.ready}
      </p>
      {result && (
        <div ref={resultRegion}>
          <Preview
            result={result.animation}
            downloadName={`${source.file.name.replace(/\.[^.]+$/, "") || "video"}.gif`}
            width={result.plan.width}
            height={result.plan.height}
            language={language}
            messages={previewMessages}
          />
        </div>
      )}
    </>
  )
}
