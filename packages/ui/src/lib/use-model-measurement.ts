import { useRef, useState } from "react"
import type { PointerEvent } from "react"
import type { Vector3 } from "three"

type MeasurementViewport = {
  pick(x: number, y: number): Vector3 | undefined
  showMeasurement(points: Vector3[]): void
}

export function useModelMeasurement(viewport?: MeasurementViewport) {
  const [active, setActive] = useState(false)
  const [points, setPoints] = useState<Vector3[]>([])
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null)
  const [first, second] = points

  function show(next: Vector3[]) {
    setPoints(next)
    viewport?.showMeasurement(next)
  }

  function select(x: number, y: number) {
    if (!active) return
    const point = viewport?.pick(x, y)
    if (point) show(first && !second ? [first, point] : [point])
  }

  function moved(event: PointerEvent<HTMLDivElement>) {
    const start = pointer.current
    return (
      !start ||
      start.id !== event.pointerId ||
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 5
    )
  }

  return {
    active,
    count: points.length,
    distance: first && second ? first.distanceTo(second) : undefined,
    toggle() {
      if (active && points.length === 1) show([])
      setActive(!active)
    },
    clear() {
      show([])
    },
    reset() {
      setActive(false)
      show([])
    },
    selectCenter(element: HTMLElement) {
      const { left, top, width, height } = element.getBoundingClientRect()
      select(left + width / 2, top + height / 2)
    },
    pointerHandlers: {
      onPointerDown(event: PointerEvent<HTMLDivElement>) {
        pointer.current =
          active && event.button === 0 && event.isPrimary
            ? { id: event.pointerId, x: event.clientX, y: event.clientY }
            : null
      },
      onPointerMove(event: PointerEvent<HTMLDivElement>) {
        if (moved(event)) pointer.current = null
      },
      onPointerUp(event: PointerEvent<HTMLDivElement>) {
        if (!moved(event)) select(event.clientX, event.clientY)
        pointer.current = null
      },
      onPointerCancel() {
        pointer.current = null
      },
    },
  }
}
