import { useRef } from "react"
import {
  contains,
  createRegion,
  resizeRegion,
  rotationAt,
} from "../core/geometry"
import type { Point, Region, Shape } from "../types"
import type { Editor } from "./use-editor"

type Gesture = {
  mode: "draw" | "move" | "resize" | "rotate"
  start: Point
  region: Region
  before: readonly Region[]
  points: Point[]
  pointer: number
}
type Pan = {
  pointer: number
  start: Point
  scroll: Point
}

export function useGestures(editor: Editor) {
  const gesture = useRef<Gesture | null>(null)
  const pan = useRef<Pan | null>(null)
  function point(event: React.PointerEvent<SVGSVGElement>, clamp = false) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x =
      ((event.clientX - bounds.left) / bounds.width) * editor.source!.width
    const y =
      ((event.clientY - bounds.top) / bounds.height) * editor.source!.height
    return {
      x: clamp ? Math.max(0, Math.min(editor.source!.width, x)) : x,
      y: clamp ? Math.max(0, Math.min(editor.source!.height, y)) : y,
    }
  }
  function down(event: React.PointerEvent<SVGSVGElement>) {
    if (
      event.button !== 0 ||
      gesture.current ||
      !editor.source ||
      editor.tool === "pan"
    )
      return
    event.preventDefault()
    event.currentTarget.focus({ preventScroll: true })
    const start = point(event, editor.tool !== "select")
    const handle = (event.target as Element)
      .closest("[data-handle]")
      ?.getAttribute("data-handle")
    let region = editor.selected
    let mode: Gesture["mode"] = "draw"
    if (handle && region && editor.tool === "select")
      mode = handle === "resize" ? "resize" : "rotate"
    else if (editor.tool === "select") {
      const ordered = [
        ...editor.regions.filter((r) => r.effect !== "solid"),
        ...editor.regions.filter((r) => r.effect === "solid"),
      ]
      region = ordered.reverse().find((r) => contains(r, start)) ?? null
      mode = "move"
      editor.setSelectedId(region?.id ?? null)
      if (!region) return
    } else {
      region = createRegion(
        crypto.randomUUID(),
        editor.tool as Shape,
        start,
        start,
        editor.style,
        [start]
      )
      editor.setSelectedId(region.id)
    }
    gesture.current = {
      mode,
      start,
      region: region!,
      before: editor.regions,
      points: [start],
      pointer: event.pointerId,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    if (mode === "draw") editor.preview([...editor.regions, region!])
  }
  function move(event: React.PointerEvent<SVGSVGElement>) {
    const current = gesture.current
    if (!current || current.pointer !== event.pointerId) return
    const end = point(event, current.mode === "draw")
    let next = current.region
    if (current.mode === "draw") {
      current.points.push(end)
      next = createRegion(
        next.id,
        next.shape,
        current.start,
        end,
        next,
        current.points
      )
    } else if (current.mode === "move") {
      next = {
        ...next,
        x: next.x + end.x - current.start.x,
        y: next.y + end.y - current.start.y,
      }
    } else if (current.mode === "resize") next = resizeRegion(next, end)
    else next = { ...next, rotation: rotationAt(next, end, event.shiftKey) }
    editor.preview(
      current.mode === "draw"
        ? [...current.before, next]
        : current.before.map((r) => (r.id === next.id ? next : r))
    )
  }
  function up(event: React.PointerEvent<SVGSVGElement>) {
    const current = gesture.current
    if (!current || current.pointer !== event.pointerId) return
    const end = point(event, current.mode === "draw")
    if (
      current.mode === "draw" &&
      current.region.shape !== "brush" &&
      Math.hypot(end.x - current.start.x, end.y - current.start.y) < 4
    )
      editor.cancel()
    else editor.commit()
    gesture.current = null
  }
  function panDown(event: React.PointerEvent<HTMLDivElement>) {
    if (editor.tool !== "pan" || event.button !== 0 || pan.current) return
    event.preventDefault()
    event.currentTarget.querySelector("svg")?.focus({ preventScroll: true })
    pan.current = {
      pointer: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      scroll: {
        x: event.currentTarget.scrollLeft,
        y: event.currentTarget.scrollTop,
      },
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  function panMove(event: React.PointerEvent<HTMLDivElement>) {
    const current = pan.current
    if (!current || current.pointer !== event.pointerId) return
    event.currentTarget.scrollLeft =
      current.scroll.x + current.start.x - event.clientX
    event.currentTarget.scrollTop =
      current.scroll.y + current.start.y - event.clientY
  }
  function panUp(event: React.PointerEvent<HTMLDivElement>) {
    if (pan.current?.pointer === event.pointerId) pan.current = null
  }
  function cancel() {
    if (gesture.current) editor.cancel()
    gesture.current = null
    pan.current = null
  }
  return { down, move, up, cancel, panDown, panMove, panUp }
}
