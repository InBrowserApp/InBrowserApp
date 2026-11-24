import { useEffect, useRef } from "react"
import type { PointerEvent } from "react"

import {
  BIN_HZ,
  fractionAtFrequency,
  frequencyAtFraction,
  MIN_DB,
  SAMPLE_RATE,
} from "./core/spectrum"

const inset = { left: 45, right: 25, top: 25, bottom: 26 }
const maximumHz = SAMPLE_RATE / 2

export function SpectrumChart({
  levels,
  log,
  bin,
  lang,
  onBin,
}: {
  levels: Float32Array
  log: boolean
  bin: number
  lang: string
  onBin: (bin: number) => void
}) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const element = canvas.current!
    const drawing = element.getContext("2d")
    if (!drawing) return
    const ctx = drawing
    const number = new Intl.NumberFormat(lang, {
      notation: "compact",
      maximumFractionDigits: 1,
    })

    function draw() {
      const { width, height } = element.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      element.width = Math.round(width * ratio)
      element.height = Math.round(height * ratio)
      ctx.scale(ratio, ratio)
      const plotWidth = width - inset.left - inset.right
      const plotHeight = height - inset.top - inset.bottom
      const left = inset.left
      const top = inset.top
      const x = (frequency: number) =>
        left + fractionAtFrequency(frequency, log) * plotWidth
      const y = (level: number) =>
        top + Math.min(1, Math.max(0, level / MIN_DB)) * plotHeight
      const color = getComputedStyle(element).color
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.lineWidth = 1
      ctx.font = "12px system-ui"
      ctx.textBaseline = "middle"
      ctx.textAlign = "left"
      ctx.globalAlpha = 0.8
      ctx.fillText("dBFS", 7, 10)
      ctx.textAlign = "right"
      for (const level of [0, -20, -40, -60, -80, MIN_DB]) {
        ctx.globalAlpha = 0.8
        ctx.fillText(number.format(level), left - 8, y(level))
        ctx.globalAlpha = 0.2
        ctx.beginPath()
        ctx.moveTo(left, y(level))
        ctx.lineTo(left + plotWidth, y(level))
        ctx.stroke()
      }
      ctx.textAlign = "center"
      const ticks = log
        ? [20, 100, 1000, 10_000, maximumHz]
        : [0, 6000, 12_000, 18_000, maximumHz]
      for (const frequency of ticks) {
        ctx.globalAlpha = 0.8
        ctx.fillText(
          number.format(frequency),
          x(frequency),
          top + plotHeight + 15
        )
        ctx.beginPath()
        ctx.globalAlpha = 0.2
        ctx.moveTo(x(frequency), top)
        ctx.lineTo(x(frequency), top + plotHeight)
        ctx.stroke()
      }

      ctx.globalAlpha = 1
      ctx.lineWidth = 1.5
      const first = log ? 1 : 0
      ctx.beginPath()
      ctx.moveTo(x(first * BIN_HZ), y(levels[first]!))
      for (let index = first + 1; index < levels.length; index++) {
        ctx.lineTo(x(index * BIN_HZ), y(levels[index]!))
      }
      ctx.stroke()

      const cursorX = x(bin * BIN_HZ)
      const cursorY = y(levels[bin]!)
      ctx.globalAlpha = 0.55
      ctx.beginPath()
      ctx.moveTo(cursorX, top)
      ctx.lineTo(cursorX, top + plotHeight)
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(cursorX, cursorY, 4, 0, 2 * Math.PI)
      ctx.fill()
    }

    draw()
    const resize = new ResizeObserver(draw)
    resize.observe(element)
    const theme = new MutationObserver(draw)
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => {
      resize.disconnect()
      theme.disconnect()
    }
  }, [bin, lang, levels, log])

  function inspect(event: PointerEvent<HTMLCanvasElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const fraction =
      (event.clientX - bounds.left - inset.left) /
      (bounds.width - inset.left - inset.right)
    onBin(Math.round(frequencyAtFraction(fraction, log) / BIN_HZ))
  }

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="block h-56 w-full rounded-lg border bg-teal-50/30 text-teal-800 sm:h-72 dark:bg-teal-950/20 dark:text-teal-300"
      onPointerMove={(event) => {
        if (event.pointerType === "mouse") inspect(event)
      }}
      onPointerDown={inspect}
    />
  )
}
