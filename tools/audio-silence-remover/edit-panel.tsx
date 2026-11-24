import { useEffect, useId, useMemo, useState } from "react"
import { AudioPreviewDownload } from "@workspace/ui/components/tool/audio-preview-download"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Label } from "@workspace/ui/components/ui/label"
import { LoaderCircle, Scissors, TriangleAlert } from "@workspace/ui/icons"

import { findCuts, removedFrames, SAMPLE_RATE } from "./core/silence"
import { Waveform } from "./waveform"
import type englishMessages from "./messages/en.json"
import type { Request, Response } from "./workers/remove"

type Messages = typeof englishMessages
type Audio = Extract<Response, { type: "analyzed" }>["audio"]
type Edit =
  | { status: "detected" | "rendering" | "error" }
  | { status: "ready"; wav: ArrayBuffer }

export function EditPanel({
  worker,
  audio,
  name,
  lang,
  messages: m,
}: {
  worker: Worker
  audio: Audio
  name: string
  lang: string
  messages: Messages
}) {
  const id = useId()
  const [threshold, setThreshold] = useState(-42)
  const [minimum, setMinimum] = useState(0.8)
  const [edit, setEdit] = useState<Edit>({ status: "detected" })
  const processing = edit.status === "rendering"
  const { cuts, allQuiet } = useMemo(
    () => findCuts(audio, threshold, minimum),
    [audio, threshold, minimum]
  )
  const removed = removedFrames(cuts)
  const number = new Intl.NumberFormat(lang, { maximumFractionDigits: 2 })
  const seconds = new Intl.NumberFormat(lang, {
    style: "unit",
    unit: "second",
    unitDisplay: "short",
    maximumFractionDigits: 2,
  })

  useEffect(() => {
    function receive({ data }: MessageEvent<Response>) {
      if (data.type === "edited") setEdit({ status: "ready", wav: data.wav })
      if (data.type === "error") setEdit({ status: "error" })
    }
    worker.addEventListener("message", receive)
    return () => worker.removeEventListener("message", receive)
  }, [worker])

  function apply() {
    setEdit({ status: "rendering" })
    const request: Request = { type: "edit", cuts }
    worker.postMessage(request)
  }

  return (
    <ToolPanelCard>
      <ToolPanelCardContent className="gap-5">
        <Waveform audio={audio} cuts={cuts} />
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span
              className="size-3 rounded-sm border border-amber-600/60 bg-amber-500/25"
              aria-hidden="true"
            />
            {m.cuts}
            <span className="font-medium text-foreground tabular-nums">
              {number.format(cuts.length)}
            </span>
          </span>
          <span>{m.keepPause}</span>
        </div>

        <fieldset
          className="grid gap-4 border-y py-4 sm:grid-cols-2"
          disabled={processing}
        >
          <div className="grid gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <Label htmlFor={id + "-threshold"}>{m.threshold}</Label>
              <output
                htmlFor={id + "-threshold"}
                className="text-sm tabular-nums"
              >
                <bdi>{number.format(threshold)} dBFS</bdi>
              </output>
            </div>
            <input
              id={id + "-threshold"}
              className="w-full accent-primary"
              type="range"
              dir="ltr"
              min={-70}
              max={-20}
              step={1}
              value={threshold}
              aria-valuetext={number.format(threshold) + " dBFS"}
              onChange={(event) => {
                setThreshold(event.currentTarget.valueAsNumber)
                setEdit({ status: "detected" })
              }}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <Label htmlFor={id + "-duration"}>{m.minimum}</Label>
              <output
                htmlFor={id + "-duration"}
                className="text-sm tabular-nums"
              >
                <bdi>{seconds.format(minimum)}</bdi>
              </output>
            </div>
            <input
              id={id + "-duration"}
              className="w-full accent-primary"
              type="range"
              dir="ltr"
              min={0.2}
              max={5}
              step={0.1}
              value={minimum}
              aria-valuetext={seconds.format(minimum)}
              onChange={(event) => {
                setMinimum(event.currentTarget.valueAsNumber)
                setEdit({ status: "detected" })
              }}
            />
          </div>
        </fieldset>

        <dl className="grid grid-cols-3 gap-2 tabular-nums">
          {[
            [m.original, audio.length],
            [m.edited, audio.length - removed],
            [m.removed, removed],
          ].map(([label, frames]) => (
            <div
              key={label}
              className="rounded-md bg-muted/45 px-2 py-2 sm:px-3"
            >
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-sm font-semibold sm:text-base">
                <bdi>{seconds.format(Number(frames) / SAMPLE_RATE)}</bdi>
              </dd>
            </div>
          ))}
        </dl>

        {cuts.length === 0 ? (
          <p className="text-sm text-muted-foreground" role="status">
            {allQuiet ? m.allQuiet : m.noCuts}
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={apply}
              disabled={processing || edit.status === "ready"}
              className="min-h-11 w-full whitespace-normal sm:w-auto"
            >
              <Scissors data-icon="inline-start" aria-hidden="true" />
              {m.cut}
            </Button>
            <div
              role="status"
              className={
                processing ? "flex items-center gap-2 text-sm" : "sr-only"
              }
            >
              {processing ? (
                <>
                  <LoaderCircle
                    className="size-4 shrink-0 motion-safe:animate-spin"
                    aria-hidden="true"
                  />
                  {m.rendering}
                </>
              ) : edit.status === "ready" ? (
                m.ready
              ) : null}
            </div>
          </div>
        )}
        {edit.status === "error" && (
          <Alert variant="destructive">
            <TriangleAlert aria-hidden="true" />
            <AlertDescription>{m.exportError}</AlertDescription>
          </Alert>
        )}
        {edit.status === "ready" && (
          <AudioPreviewDownload
            wav={edit.wav}
            filename={name.replace(/\.[^.]+$/, "") + "-trimmed.wav"}
            previewLabel={m.preview}
            downloadLabel={m.download}
          />
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
