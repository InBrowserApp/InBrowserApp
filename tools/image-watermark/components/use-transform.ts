import {
  useRef,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from "react"
import {
  clamp,
  normalizeRotation,
  type Point,
  type WatermarkGeometry,
} from "../core/geometry"
import {
  changeAroundCenter,
  transformOptions,
  type TransformAction,
} from "../core/transform"
import type { Options } from "../types"

type Session = {
  action: TransformAction
  options: Options
  geometry: WatermarkGeometry
  rect: DOMRect
  start: Point
  pointerId: number
  target: HTMLButtonElement
}

function imagePoint(
  point: { clientX: number; clientY: number },
  rect: DOMRect,
  geometry: WatermarkGeometry
): Point {
  return {
    x: ((point.clientX - rect.left) / rect.width) * geometry.imageWidth,
    y: ((point.clientY - rect.top) / rect.height) * geometry.imageHeight,
  }
}

export function useTransform(
  canvas: RefObject<HTMLCanvasElement | null>,
  geometry: WatermarkGeometry,
  options: Options,
  onChange: (options: Options) => void
) {
  const session = useRef<Session | null>(null)
  function end(cancel: boolean) {
    const current = session.current
    if (!current) return
    session.current = null
    if (cancel) onChange(current.options)
    if (current.target.hasPointerCapture(current.pointerId))
      current.target.releasePointerCapture(current.pointerId)
  }
  function pointerDown(
    action: TransformAction,
    event: PointerEvent<HTMLButtonElement>
  ) {
    if (event.button !== 0 || session.current) return
    const rect = canvas.current!.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    event.preventDefault()
    event.currentTarget.focus({ preventScroll: true })
    event.currentTarget.setPointerCapture(event.pointerId)
    session.current = {
      action,
      options,
      geometry,
      rect,
      start: imagePoint(event, rect, geometry),
      pointerId: event.pointerId,
      target: event.currentTarget,
    }
  }
  function pointerMove(event: PointerEvent<HTMLButtonElement>) {
    const current = session.current
    if (!current || event.pointerId !== current.pointerId) return
    onChange(
      transformOptions(
        current.options,
        current.geometry,
        current.action,
        current.start,
        imagePoint(event, current.rect, current.geometry),
        event.shiftKey
      )
    )
  }
  function pointerUp(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerId === session.current?.pointerId) end(false)
  }
  function pointerCancel(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerId === session.current?.pointerId) end(true)
  }
  function keyDown(
    action: TransformAction,
    event: KeyboardEvent<HTMLButtonElement>
  ) {
    if (event.key === "Escape") {
      end(true)
      return
    }
    const directions: Record<string, Point> = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
    }
    const direction = directions[event.key]
    if (!direction || session.current) return
    event.preventDefault()
    if (action === "move") {
      const step = event.shiftKey ? 10 : 1
      onChange(
        transformOptions(
          options,
          geometry,
          action,
          { x: 0, y: 0 },
          { x: direction.x * step, y: direction.y * step }
        )
      )
    } else if (action === "rotate") {
      const step = event.shiftKey ? 15 : 1
      onChange(
        changeAroundCenter(options, geometry, {
          rotation: normalizeRotation(
            options.rotation + (direction.x || -direction.y) * step
          ),
        })
      )
    } else {
      const step = event.shiftKey ? 5 : 1
      onChange(
        changeAroundCenter(options, geometry, {
          size: clamp(
            options.size + (direction.x || direction.y) * step,
            5,
            80
          ),
        })
      )
    }
  }
  return (action: TransformAction) => ({
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) =>
      pointerDown(action, event),
    onPointerMove: pointerMove,
    onPointerUp: pointerUp,
    onPointerCancel: pointerCancel,
    onLostPointerCapture: pointerCancel,
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) =>
      keyDown(action, event),
  })
}
