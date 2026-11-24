import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { ChartNoAxesColumnIncreasing, ChevronDown } from "@workspace/ui/icons"
import {
  channels,
  levels,
  visibleChannels,
  type BinChannel,
  type Channel,
  type Histogram,
  type Scale,
} from "./core/histogram"
import type { Messages } from "./types"

const binWidth = 3
const width = levels * binWidth
const height = 256
const last = levels - 1
const colors: Record<BinChannel, string> = {
  brightness: "#e2e8f0",
  red: "#f87171",
  green: "#4ade80",
  blue: "#60a5fa",
}
const overlayColors = {
  brightness: colors.brightness,
  red: "#fb4f56",
  green: "#2bd85f",
  blue: "#4389fb",
}

function drawChart(
  context: CanvasRenderingContext2D,
  { bins }: Histogram,
  channel: Channel,
  scale: Scale
) {
  context.clearRect(0, 0, width, height)

  const visible = visibleChannels(channel)
  const peak = Math.max(...visible.map((key) => Math.max(...bins[key])))
  const scaleCount = (count: number) =>
    scale === "linear" ? count : Math.log1p(count)
  const heightPerCount = (height - 12) / scaleCount(peak)
  const overlay = channel === "rgb"
  const palette = overlay ? overlayColors : colors
  const fillAlpha = overlay ? "42" : "66"

  context.globalCompositeOperation = overlay ? "lighter" : "source-over"
  context.lineWidth = 1.5
  for (const key of visible) {
    const channelBins = bins[key]
    context.beginPath()
    context.moveTo(0, height)
    for (let index = 0; index < levels; index++) {
      const x = index * binWidth
      const y = height - scaleCount(channelBins[index]!) * heightPerCount
      context.lineTo(x, y)
      context.lineTo(x + binWidth, y)
    }
    context.lineTo(width, height)
    context.fillStyle = palette[key] + fillAlpha
    context.fill()
    context.strokeStyle = palette[key]
    context.stroke()
  }

  // Put the grid behind the plot so it doesn't contribute to RGB blending.
  context.globalCompositeOperation = "destination-over"
  context.beginPath()
  for (const fraction of [0.25, 0.5, 0.75]) {
    context.moveTo(width * fraction, 0)
    context.lineTo(width * fraction, height)
    context.moveTo(0, height * fraction)
    context.lineTo(width, height * fraction)
  }
  context.strokeStyle = "#334155"
  context.lineWidth = 1
  context.stroke()
}

export function HistogramChart({
  histogram,
  lang,
  messages: m,
}: {
  histogram: Histogram
  lang: string
  messages: Messages
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [channel, setChannel] = useState<Channel>("brightness")
  const [scale, setScale] = useState<Scale>("linear")
  const [level, setLevel] = useState(128)
  const number = useMemo(() => new Intl.NumberFormat(lang), [lang])
  const percent = useMemo(
    () =>
      new Intl.NumberFormat(lang, {
        style: "percent",
        maximumSignificantDigits: 3,
      }),
    [lang]
  )
  const levelLabel = number.format(level)
  const series = visibleChannels(channel).map((key) => {
    const bins = histogram.bins[key]
    return { key, bins, label: m[key], count: number.format(bins[level]!) }
  })
  const levelReadout = [
    levelLabel,
    ...series.map(({ label, count }) => `${label} ${count}`),
  ].join(" · ")
  const extremes = [
    { level: 0, label: m.shadows, description: m.atBlack },
    { level: last, label: m.highlights, description: m.atWhite },
  ]

  useEffect(() => {
    const context = canvas.current?.getContext("2d")
    if (context) drawChart(context, histogram, channel, scale)
  }, [histogram, channel, scale])

  function inspect(event: PointerEvent<HTMLCanvasElement>) {
    const { left, width } = event.currentTarget.getBoundingClientRect()
    const index = Math.floor(((event.clientX - left) / width) * levels)
    setLevel(Math.max(0, Math.min(last, index)))
  }

  return (
    <section
      aria-label={m.histogram}
      className="grid min-w-0 gap-4 rounded-lg border bg-card p-3 sm:p-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="flex items-center gap-2 font-medium">
          <ChartNoAxesColumnIncreasing aria-hidden="true" className="size-4" />
          {m.histogram}
        </h2>
        <div className="flex flex-wrap items-baseline gap-x-2 text-xs text-muted-foreground">
          <span>{m.pixelsAnalyzed}</span>
          <bdi className="tabular-nums">{number.format(histogram.pixels)}</bdi>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          role="group"
          aria-label={m.channel}
          className="flex flex-wrap gap-1"
        >
          {channels.map((key) => (
            <Button
              key={key}
              type="button"
              variant={channel === key ? "secondary" : "ghost"}
              size="sm"
              aria-pressed={channel === key}
              className="h-auto min-h-9 px-2 whitespace-normal sm:px-3"
              onClick={() => setChannel(key)}
            >
              {m[key]}
            </Button>
          ))}
        </div>
        <label className="relative inline-flex max-w-full items-center gap-2 text-sm">
          <span className="sr-only">{m.scale}</span>
          <select
            value={scale}
            onChange={(event) => setScale(event.currentTarget.value as Scale)}
            className="h-9 max-w-full appearance-none rounded-md border border-input bg-background ps-2 pe-7 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="linear">{m.linear}</option>
            <option value="logarithmic">{m.logarithmic}</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute end-2 size-4 text-muted-foreground"
            aria-hidden="true"
          />
        </label>
      </div>
      <div className="grid gap-2" dir="ltr">
        <div className="relative overflow-hidden rounded-md border border-slate-800 bg-slate-950">
          <canvas
            ref={canvas}
            width={width}
            height={height}
            aria-hidden="true"
            className="block h-40 w-full cursor-crosshair sm:h-48"
            onPointerMove={(event) => {
              if (event.pointerType === "mouse") inspect(event)
            }}
            onPointerDown={inspect}
          />
          <div
            className="pointer-events-none absolute inset-y-0 border-l border-dashed border-slate-200/70"
            style={{ left: `${((level + 0.5) / levels) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
          {[0, 64, 128, 192, last].map((value) => (
            <span key={value}>{number.format(value)}</span>
          ))}
        </div>
        <input
          aria-label={m.level}
          aria-valuetext={levelReadout}
          type="range"
          min={0}
          max={last}
          value={level}
          onChange={(event) => setLevel(event.currentTarget.valueAsNumber)}
          className="h-6 w-full cursor-pointer accent-primary"
        />
      </div>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
        <span className="font-medium">
          {m.level} <bdi className="tabular-nums">{levelLabel}</bdi>
        </span>
        <dl className="flex flex-wrap gap-x-3 gap-y-1">
          {series.map(({ key, label, count }) => (
            <div key={key} className="flex items-baseline gap-1.5">
              <dt className="inline-flex items-center gap-1.5 text-muted-foreground">
                {channel === "rgb" && (
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full ring-1 ring-foreground/20"
                    style={{ backgroundColor: overlayColors[key] }}
                  />
                )}
                {label}
              </dt>
              <dd className="tabular-nums">{count}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {extremes.map(({ level: edge, label, description }) => (
          <div key={edge} className="min-w-0 rounded-md bg-muted/55 p-3">
            <h3 className="text-sm font-medium">{label}</h3>
            <p className="mb-1 text-xs text-muted-foreground">{description}</p>
            <dl className="grid gap-1">
              {series.map(({ key, bins, label }) => (
                <div
                  key={key}
                  className="flex flex-wrap items-baseline gap-x-2"
                >
                  <dt
                    className={
                      channel === "rgb"
                        ? "text-xs text-muted-foreground"
                        : "sr-only"
                    }
                  >
                    {label}
                  </dt>
                  <dd className="text-sm font-medium tabular-nums">
                    <bdi>{percent.format(bins[edge]! / histogram.pixels)}</bdi>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  )
}
