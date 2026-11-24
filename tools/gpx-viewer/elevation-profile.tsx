import { useId, useMemo, type PointerEvent } from "react"
import type { Sample } from "./core/gpx"

const width = 800
const height = 200
const inset = 10

function closestSample(samples: Sample[], distance: number) {
  let start = 0
  let end = samples.length - 1
  while (start < end) {
    const mid = Math.floor((start + end) / 2)
    if (samples[mid]!.distance < distance) start = mid + 1
    else end = mid
  }
  return start > 0 &&
    distance - samples[start - 1]!.distance <=
      samples[start]!.distance - distance
    ? start - 1
    : start
}

function plotProfile(profile: Sample[][], distance: number) {
  let min = Infinity
  let max = -Infinity
  for (const segment of profile) {
    for (const { elevation } of segment) {
      min = Math.min(min, elevation)
      max = Math.max(max, elevation)
    }
  }

  const x = (value: number) =>
    inset + (value / (distance || 1)) * (width - inset * 2)
  const y = (value: number) =>
    max === min
      ? height / 2
      : height - inset - ((value - min) / (max - min)) * (height - inset * 2)
  const traces = profile.map((segment) => ({
    line: segment
      .map((point) => `${x(point.distance)},${y(point.elevation)}`)
      .join(" "),
    first: segment[0]!,
    last: segment.at(-1)!,
  }))
  return { min, max, x, y, traces }
}

function ElevationProfile({
  profile,
  samples,
  distance,
  active,
  onActive,
  label,
  formatDistance,
  formatElevation,
}: Readonly<{
  profile: Sample[][]
  samples: Sample[]
  distance: number
  active: number
  onActive: (index: number) => void
  label: string
  formatDistance: (meters: number) => string
  formatElevation: (meters: number) => string
}>) {
  const id = useId()
  const { min, max, x, y, traces } = useMemo(
    () => plotProfile(profile, distance),
    [profile, distance]
  )
  const sample = samples[active]!
  const info = `${formatDistance(sample.distance)} · ${formatElevation(sample.elevation)}`

  function seek(event: PointerEvent<SVGSVGElement>) {
    if (event.type === "pointermove" && event.pointerType === "touch") return
    const bounds = event.currentTarget.getBoundingClientRect()
    const px = ((event.clientX - bounds.left) / bounds.width) * width
    onActive(
      closestSample(samples, ((px - inset) / (width - inset * 2)) * distance)
    )
  }

  return (
    <div className="grid gap-2">
      <div className="flex justify-between gap-2 text-sm">
        <label htmlFor={id} className="font-semibold">
          {label}
        </label>
        <span className="text-muted-foreground tabular-nums" dir="auto">
          {info}
        </span>
      </div>
      <div dir="ltr" className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2">
        <div
          className="flex flex-col justify-between py-1 text-xs text-muted-foreground tabular-nums"
          aria-hidden="true"
        >
          <span>{formatElevation(max)}</span>
          <span>{formatElevation(min)}</span>
        </div>
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="h-36 w-full rounded-md border bg-muted/30 sm:h-48"
          onPointerMove={seek}
          onPointerDown={seek}
        >
          {[0.25, 0.5, 0.75].map((fraction) => (
            <line
              key={fraction}
              x1="0"
              y1={height * fraction}
              x2={width}
              y2={height * fraction}
              className="stroke-border"
            />
          ))}
          {traces.map(({ line, first, last }, index) => {
            if (first === last)
              return (
                <circle
                  key={index}
                  cx={x(first.distance)}
                  cy={y(first.elevation)}
                  r="3"
                  className="fill-teal-700 dark:fill-teal-300"
                />
              )
            return (
              <g key={index}>
                <polygon
                  points={`${x(first.distance)},${height} ${line} ${x(last.distance)},${height}`}
                  className="fill-teal-600/15 dark:fill-teal-400/20"
                />
                <polyline
                  points={line}
                  vectorEffect="non-scaling-stroke"
                  className="fill-none stroke-teal-700 stroke-2 dark:stroke-teal-300"
                />
              </g>
            )
          })}
          <line
            x1={x(sample.distance)}
            x2={x(sample.distance)}
            y1="0"
            y2={height}
            vectorEffect="non-scaling-stroke"
            className="stroke-orange-600 stroke-2 dark:stroke-orange-300"
          />
        </svg>
        <div />
        <div
          className="flex justify-between pt-1 text-xs text-muted-foreground tabular-nums"
          aria-hidden="true"
        >
          <span>{formatDistance(0)}</span>
          <span>{formatDistance(distance)}</span>
        </div>
      </div>
      <input
        id={id}
        dir="ltr"
        type="range"
        min="0"
        max={samples.length - 1}
        value={active}
        onChange={(event) => onActive(Number(event.target.value))}
        aria-valuetext={info}
        className="w-full accent-teal-700 dark:accent-teal-300"
        disabled={samples.length === 1}
      />
    </div>
  )
}

export { ElevationProfile }
