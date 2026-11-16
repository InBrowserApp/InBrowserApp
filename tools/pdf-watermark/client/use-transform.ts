import { useCallback, useEffect, useRef, useState } from "react"
import { beginTransform, transformOptions } from "../core/transform"
import type { PointerEvent as ReactPointerEvent, RefObject } from "react"
import type { Point, TransformStart } from "../core/transform"
import type { Options, PageGeometry } from "../types"

type Drag = {
  start: TransformStart
  rect: DOMRect
  target: HTMLButtonElement
  pointerId: number
}
function useTransform({
  frame,
  geometry,
  aspect,
  options,
  onChange,
  onStart,
  onEnd,
  onSelect,
  disabled,
}: Readonly<{
  frame: RefObject<HTMLDivElement | null>
  geometry: PageGeometry
  aspect: number
  options: Options
  onChange: (options: Options) => void
  onStart: () => void
  onEnd: (cancel?: boolean) => void
  onSelect: () => void
  disabled: boolean
}>) {
  const drag = useRef<Drag | null>(null)
  const [guides, setGuides] = useState({ x: false, y: false })
  const finish = useCallback(
    (cancel = false) => {
      const current = drag.current
      if (!current) return
      drag.current = null
      if (current.target.hasPointerCapture?.(current.pointerId))
        current.target.releasePointerCapture(current.pointerId)
      setGuides({ x: false, y: false })
      onEnd(cancel)
    },
    [onEnd]
  )
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && drag.current) {
        event.preventDefault()
        finish(true)
      }
    }
    window.addEventListener("keydown", escape)
    return () => {
      window.removeEventListener("keydown", escape)
      if (drag.current) onEnd(true)
    }
  }, [finish, onEnd])

  function start(
    event: ReactPointerEvent<HTMLButtonElement>,
    kind: TransformStart["kind"],
    corner?: Point
  ) {
    if (
      disabled ||
      drag.current ||
      event.button !== 0 ||
      event.isPrimary === false ||
      !frame.current
    )
      return
    const rect = frame.current.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const size =
      geometry.rotation % 180
        ? { width: geometry.height, height: geometry.width }
        : geometry
    const pointer = {
      x: ((event.clientX - rect.left) / rect.width) * size.width,
      y: ((event.clientY - rect.top) / rect.height) * size.height,
    }
    event.preventDefault()
    event.currentTarget.focus({ preventScroll: true })
    onSelect()
    onStart()
    drag.current = {
      start: beginTransform(kind, pointer, geometry, aspect, options, corner),
      rect,
      target: event.currentTarget,
      pointerId: event.pointerId,
    }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }
  function move(event: ReactPointerEvent<HTMLButtonElement>) {
    const current = drag.current
    if (!current || event.pointerId !== current.pointerId) return
    const { rect, start: initial } = current
    const pointer = {
      x: ((event.clientX - rect.left) / rect.width) * initial.page.width,
      y: ((event.clientY - rect.top) / rect.height) * initial.page.height,
    }
    const result = transformOptions(initial, pointer, event.shiftKey, {
      x: (6 / rect.width) * initial.page.width,
      y: (6 / rect.height) * initial.page.height,
    })
    setGuides({ x: result.guideX, y: result.guideY })
    onChange(result.options)
  }
  function handlers(kind: TransformStart["kind"], corner?: Point) {
    return {
      onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) =>
        start(event, kind, corner),
      onPointerMove: move,
      onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => {
        if (event.pointerId === drag.current?.pointerId) finish()
      },
      onPointerCancel: (event: ReactPointerEvent<HTMLButtonElement>) => {
        if (event.pointerId === drag.current?.pointerId) finish(true)
      },
      onLostPointerCapture: (event: ReactPointerEvent<HTMLButtonElement>) => {
        if (event.pointerId === drag.current?.pointerId) finish(true)
      },
    }
  }
  return { handlers, guides }
}

export { useTransform }
