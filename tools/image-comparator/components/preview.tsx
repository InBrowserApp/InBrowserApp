import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { ArrowLeftRight } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { Messages } from "../types"

const checkerboard =
  "bg-[repeating-conic-gradient(var(--muted)_0%_25%,var(--background)_0%_50%)] bg-[length:20px_20px]"

export function BitmapCanvas({
  bitmap,
  className,
  style,
}: {
  bitmap: ImageBitmap
  className?: string
  style?: CSSProperties
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  useEffect(() => {
    const context = canvas.current?.getContext("2d")
    context?.clearRect(0, 0, width, height)
    context?.drawImage(bitmap, 0, 0, width, height)
  }, [bitmap, width, height])

  return (
    <canvas
      ref={canvas}
      width={width}
      height={height}
      className={className}
      style={style}
      aria-hidden="true"
    />
  )
}

export function PreviewFrame({
  width,
  height,
  caption,
  children,
}: {
  width: number
  height: number
  caption?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex justify-center rounded-md bg-muted/45 p-3 sm:p-4">
      <div
        dir="ltr"
        className="w-full min-w-0"
        style={{ maxWidth: `${(520 * width) / height}px` }}
      >
        {caption}
        <div
          className={cn("relative rounded-sm shadow-sm", checkerboard)}
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export function ComparisonPreview({
  before,
  after,
  isSlider,
  value,
  setDivider,
  messages: m,
  percent,
}: {
  before: ImageBitmap
  after: ImageBitmap
  isSlider: boolean
  value: number
  setDivider: (value: number) => void
  messages: Messages
  percent: Intl.NumberFormat
}) {
  const width = Math.max(before.width, after.width)
  const height = Math.max(before.height, after.height)
  const layerClass = "absolute inset-0"
  const canvasClass = "absolute left-0 top-0"
  const valuePercent = `${value}%`
  return (
    <PreviewFrame
      width={width}
      height={height}
      caption={
        isSlider && (
          <div
            className="mb-2 flex justify-between gap-2 text-xs font-medium text-muted-foreground"
            aria-hidden="true"
          >
            <bdi className="min-w-0 truncate">{m.before}</bdi>
            <bdi className="min-w-0 truncate">{m.after}</bdi>
          </div>
        )
      }
    >
      <div
        role="img"
        aria-label={`${m.before} / ${m.after}`}
        className="absolute inset-0 isolate overflow-hidden rounded-[inherit]"
      >
        <div
          className={layerClass}
          style={
            isSlider
              ? { clipPath: `inset(0 ${100 - value}% 0 0)` }
              : { opacity: 1 - value / 100 }
          }
        >
          <BitmapCanvas
            bitmap={before}
            className={canvasClass}
            style={{
              width: `${(before.width / width) * 100}%`,
              height: `${(before.height / height) * 100}%`,
            }}
          />
        </div>
        <div
          className={cn(layerClass, !isSlider && "mix-blend-plus-lighter")}
          style={
            isSlider
              ? { clipPath: `inset(0 0 0 ${valuePercent})` }
              : { opacity: value / 100 }
          }
        >
          <BitmapCanvas
            bitmap={after}
            className={canvasClass}
            style={{
              width: `${(after.width / width) * 100}%`,
              height: `${(after.height / height) * 100}%`,
            }}
          />
        </div>
      </div>
      {isSlider && (
        <>
          <input
            aria-label={m.divider}
            aria-valuetext={percent.format(value / 100)}
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(event) => setDivider(event.currentTarget.valueAsNumber)}
            className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-ew-resize touch-pan-y appearance-none bg-transparent opacity-0 [&::-moz-range-thumb]:w-0 [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:appearance-none"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ring"
          >
            <span
              className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_3px_#000]"
              style={{ left: valuePercent }}
            />
            <span
              className="absolute top-1/2 grid size-10 -translate-1/2 place-items-center rounded-full border border-black/20 bg-white text-zinc-900 shadow-md"
              style={{ left: `clamp(16px, ${valuePercent}, 100% - 16px)` }}
            >
              <ArrowLeftRight className="size-5" />
            </span>
          </div>
        </>
      )}
    </PreviewFrame>
  )
}
