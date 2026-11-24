import { useState } from "react"

type PreviewProps = {
  original: string
  upscaled?: string
  originalLabel: string
  upscaledLabel: string
  comparisonLabel: string
  width: number
  height: number
}

export function Preview({
  original,
  upscaled,
  originalLabel,
  upscaledLabel,
  comparisonLabel,
  width,
  height,
}: PreviewProps) {
  const [position, setPosition] = useState(50)
  const fittedWidth = `min(100%, ${(400 * width) / height}px)`

  return (
    <figure className="min-w-0">
      <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
        <div
          className="relative bg-[repeating-conic-gradient(var(--muted)_0%_25%,var(--background)_0%_50%)] bg-size-[16px_16px]"
          style={{
            aspectRatio: `${width} / ${height}`,
            width: fittedWidth,
          }}
        >
          {upscaled && (
            <img
              className="absolute inset-0 size-full"
              src={upscaled}
              alt={upscaledLabel}
              style={{ clipPath: `inset(0 0 0 ${position}%)` }}
            />
          )}
          <img
            className="absolute inset-0 size-full"
            src={original}
            alt={originalLabel}
            style={
              upscaled
                ? { clipPath: `inset(0 ${100 - position}% 0 0)` }
                : undefined
            }
          />
          {upscaled && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_#0006]"
              style={{ left: `${position}%` }}
            />
          )}
        </div>
      </div>
      {upscaled && (
        <figcaption
          dir="ltr"
          className="mx-auto mt-3 max-w-full min-w-32"
          style={{ width: fittedWidth }}
        >
          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(event) => setPosition(event.currentTarget.valueAsNumber)}
            aria-label={comparisonLabel}
            className="h-6 w-full cursor-ew-resize accent-primary"
          />
          <div className="flex justify-between gap-3 text-xs font-medium">
            <span dir="auto">{originalLabel}</span>
            <span dir="auto">{upscaledLabel}</span>
          </div>
        </figcaption>
      )}
    </figure>
  )
}
