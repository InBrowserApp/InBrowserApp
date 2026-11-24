import { useEffect, useId, useRef, useState } from "react"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Download, LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import type { Request, Response } from "./workers/normalize"
import type englishMessages from "./messages/en.json"

type Messages = typeof englishMessages
type Rendered = Extract<Response, { type: "rendered" }>
type Result = Rendered | Extract<Response, { type: "renderError" }>
type Metric = { loudness: number; peak: number }

function AudioDownload({
  name,
  wav,
  messages: m,
}: {
  name: string
  wav: ArrayBuffer
  messages: Messages
}) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    const url = URL.createObjectURL(new Blob([wav], { type: "audio/wav" }))
    setUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [wav])
  return (
    <div className="flex flex-wrap items-center gap-3 border-t pt-4">
      {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- Preview plays user-supplied audio. */}
      <audio
        className="h-11 min-w-0 grow basis-52"
        controls
        src={url || undefined}
        aria-label={m.preview}
      />
      <Button asChild className="min-h-11 w-full sm:w-auto">
        <a
          href={url || undefined}
          download={name.replace(/\.[^.]+$/, "") + "-normalized.wav"}
        >
          <Download data-icon="inline-start" aria-hidden="true" />
          {m.download}
        </a>
      </Button>
    </div>
  )
}

export function LoudnessResult({
  worker,
  original,
  name,
  messages: m,
  lang,
}: {
  worker: Worker
  original: Metric
  name: string
  messages: Messages
  lang: string
}) {
  const id = useId()
  const [preset, setPreset] = useState("-16")
  const [custom, setCustom] = useState("-18")
  const [result, setResult] = useState<Result>()
  const [retry, setRetry] = useState(0)
  const requestId = useRef(0)
  const target = Number(preset === "custom" ? custom : preset)
  const valid = target >= -30 && target <= -5

  useEffect(() => {
    if (!valid) return
    const id = ++requestId.current
    function receive({ data }: MessageEvent<Response>) {
      if ("id" in data && data.id === id) setResult(data)
    }
    worker.addEventListener("message", receive)
    const timer = window.setTimeout(
      () => {
        const message: Request = { type: "render", target, id }
        worker.postMessage(message)
      },
      preset === "custom" && !retry ? 250 : 0
    )
    return () => {
      window.clearTimeout(timer)
      worker.removeEventListener("message", receive)
    }
  }, [worker, valid, target, preset, retry])

  function reset() {
    setResult(undefined)
    setRetry(0)
  }

  const metrics = result?.type === "rendered" ? result.metrics : undefined
  const format = new Intl.NumberFormat(lang, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  const formatGain = new Intl.NumberFormat(lang, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
  })
  const rows = [
    {
      label: m.loudness,
      before: original.loudness,
      after: metrics?.loudness,
      unit: "LUFS",
    },
    {
      label: m.peak,
      before: original.peak,
      after: metrics?.peak,
      unit: "dBTP",
    },
  ]

  function reading(value: number | undefined, unit: string) {
    return value === undefined || !Number.isFinite(value) ? (
      "–"
    ) : (
      <bdi>
        {format.format(value)} {unit}
      </bdi>
    )
  }

  return (
    <ToolPanelCard>
      <ToolPanelCardContent className="gap-5">
        <div className="grid gap-5 md:grid-cols-[minmax(12rem,1fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold">{m.settings}</h2>
            <div className="grid gap-2">
              <Label htmlFor={id}>{m.target}</Label>
              <select
                id={id}
                className="h-10 w-full rounded-md border border-input bg-background px-2 text-sm shadow-xs focus-visible:outline-2 focus-visible:outline-ring"
                value={preset}
                onChange={(event) => {
                  reset()
                  setPreset(event.currentTarget.value)
                }}
              >
                <option value="-14">{m.music}</option>
                <option value="-16">{m.podcast}</option>
                <option value="-23">{m.broadcast}</option>
                <option value="custom">{m.custom}</option>
              </select>
            </div>
            {preset === "custom" && (
              <div className="grid gap-2">
                <Label htmlFor={id + "-custom"}>{m.customTarget}</Label>
                <Input
                  id={id + "-custom"}
                  type="number"
                  dir="ltr"
                  min={-30}
                  max={-5}
                  step="any"
                  value={custom}
                  aria-invalid={!valid}
                  aria-describedby={id + "-range"}
                  onChange={(event) => {
                    const value = event.currentTarget.value
                    if (Number(value) !== target) reset()
                    setCustom(value)
                  }}
                />
                <bdi
                  id={id + "-range"}
                  className="text-start text-xs text-muted-foreground"
                >
                  −30 … −5 LUFS
                </bdi>
              </div>
            )}
          </div>
          <table className="w-full table-fixed border-collapse text-start text-sm">
            <caption className="mb-3 text-start text-base font-semibold">
              {m.comparison}
            </caption>
            <thead>
              <tr className="border-b text-muted-foreground">
                <td className="w-2/5" />
                <th
                  className="p-2 text-start font-medium wrap-anywhere"
                  scope="col"
                >
                  {m.original}
                </th>
                <th
                  className="p-2 text-start font-medium wrap-anywhere"
                  scope="col"
                >
                  {m.normalized}
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rows.map(({ label, before, after, unit }) => (
                <tr key={unit} className="border-b">
                  <th
                    className="py-2 text-start font-medium wrap-anywhere"
                    scope="row"
                  >
                    {label}
                  </th>
                  <td className="p-2 text-muted-foreground">
                    {reading(before, unit)}
                  </td>
                  <td className="p-2 font-semibold">{reading(after, unit)}</td>
                </tr>
              ))}
              <tr>
                <th
                  className="pt-2 text-start font-medium wrap-anywhere"
                  scope="row"
                >
                  {m.gain}
                </th>
                <td className="px-2 pt-2">–</td>
                <td className="px-2 pt-2 font-semibold">
                  {metrics ? (
                    <bdi>{formatGain.format(metrics.gain)} dB</bdi>
                  ) : (
                    "–"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {metrics?.limited && (
          <Alert>
            <TriangleAlert aria-hidden="true" />
            <AlertDescription>{m.peakLimited}</AlertDescription>
          </Alert>
        )}
        <div
          role="status"
          className={
            valid && !result ? "flex items-center gap-2 text-sm" : "sr-only"
          }
        >
          {valid && !result && (
            <>
              <LoaderCircle
                className="size-4 shrink-0 motion-safe:animate-spin"
                aria-hidden="true"
              />
              {m.rendering}
            </>
          )}
        </div>
        {result?.type === "renderError" && (
          <Alert variant="destructive">
            <TriangleAlert aria-hidden="true" />
            <AlertDescription className="flex flex-wrap items-center gap-2">
              {m.exportError}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setResult(undefined)
                  setRetry(retry + 1)
                }}
              >
                {m.retry}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        {result?.type === "rendered" && (
          <AudioDownload
            key={result.id}
            name={name}
            wav={result.wav}
            messages={m}
          />
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
