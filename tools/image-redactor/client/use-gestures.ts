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

export function useGestures(editor: Editor) {
  const gesture = useRef<Gesture | null>(null)
  function point(event: React.PointerEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    return {
      x: Math.max(
        0,
        Math.min(
          editor.source!.width,
          ((event.clientX - bounds.left) / bounds.width) * editor.source!.width
        )
      ),
      y: Math.max(
        0,
        Math.min(
          editor.source!.height,
          ((event.clientY - bounds.top) / bounds.height) * editor.source!.height
        )
      ),
    }
  }
  function down(event: React.PointerEvent<SVGSVGElement>) {
    if (event.button !== 0 || gesture.current || !editor.source) return
    event.preventDefault()
    event.currentTarget.focus()
    const start = point(event)
    const handle = (event.target as Element)
      .closest("[data-handle]")
      ?.getAttribute("data-handle")
    let region = editor.selected
    let mode: Gesture["mode"] = "draw"
    if (handle && region) mode = handle === "resize" ? "resize" : "rotate"
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
    const end = point(event)
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
    const end = point(event)
    if (
      current.mode === "draw" &&
      current.region.shape !== "brush" &&
      Math.hypot(end.x - current.start.x, end.y - current.start.y) < 4
    )
      editor.cancel()
    else editor.commit()
    gesture.current = null
  }
  function cancel() {
    gesture.current = null
    editor.cancel()
  }
  return { down, move, up, cancel }
}
