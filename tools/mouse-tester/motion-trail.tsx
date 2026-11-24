import { useEffect, useRef } from "react"

import type { Point } from "./core/measure"

export function MotionTrail({ points }: { points: readonly (Point | null)[] }) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const element = canvas.current
    const context = element?.getContext("2d")
    if (!element || !context) return

    const ratio = window.devicePixelRatio
    const { clientWidth: width, clientHeight: height } = element
    const pixelWidth = Math.round(width * ratio)
    const pixelHeight = Math.round(height * ratio)
    if (element.width !== pixelWidth) element.width = pixelWidth
    if (element.height !== pixelHeight) element.height = pixelHeight
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, width, height)

    const color = getComputedStyle(element).color
    context.strokeStyle = color
    context.lineWidth = 2
    context.lineJoin = "round"
    context.lineCap = "round"

    context.beginPath()
    let last: Point | null = null
    let newSegment = true
    for (const point of points) {
      if (!point) {
        newSegment = true
        continue
      }
      last = point
      const x = point.x * width
      const y = point.y * height
      if (newSegment) context.moveTo(x, y)
      else context.lineTo(x, y)
      newSegment = false
    }
    if (!last) return
    context.stroke()

    context.fillStyle = color
    context.beginPath()
    context.arc(last.x * width, last.y * height, 5, 0, 2 * Math.PI)
    context.fill()
  }, [points])

  return (
    <canvas
      ref={canvas}
      width={960}
      height={320}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full text-primary"
    />
  )
}
