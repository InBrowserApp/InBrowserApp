import { useEffect, useEffectEvent } from "react"
import type { Editor } from "./use-editor"

export function useShortcuts(editor: Editor) {
  const load = useEffectEvent((file: File) => {
    void editor.load(file)
  })
  useEffect(() => {
    function paste(event: ClipboardEvent) {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest("input,textarea,[contenteditable=true]")
      )
        return
      const file = Array.from(event.clipboardData?.files ?? []).find((f) =>
        f.type.startsWith("image/")
      )
      if (file) {
        event.preventDefault()
        load(file)
      }
    }
    window.addEventListener("paste", paste)
    return () => window.removeEventListener("paste", paste)
  }, [])
}

export function editorKeyDown(event: React.KeyboardEvent, editor: Editor) {
  if (
    event.defaultPrevented ||
    (event.target instanceof Element &&
      event.target.closest(
        "input,textarea,select,[role=combobox],[role=listbox],[role=option],[role=slider],[role=spinbutton],[role=textbox],[role=searchbox],[contenteditable]:not([contenteditable=false])"
      ))
  )
    return
  const key = event.key.toLowerCase()
  const modifier = event.ctrlKey || event.metaKey
  if (modifier && (key === "z" || key === "y")) {
    event.preventDefault()
    if (key === "y" || event.shiftKey) editor.redo()
    else editor.undo()
  } else if (key === "delete" || key === "backspace") {
    event.preventDefault()
    editor.remove()
  } else if (key === "escape") {
    editor.cancel()
    editor.setSelectedId(null)
    editor.chooseTool("select")
  } else if (!modifier && !event.altKey) {
    const tools = {
      v: "select",
      r: "rectangle",
      e: "ellipse",
      b: "brush",
      h: "pan",
    } as const
    if (key in tools) {
      event.preventDefault()
      editor.chooseTool(tools[key as keyof typeof tools])
    } else if (
      key === "enter" &&
      event.target instanceof Element &&
      event.target.matches("svg[role=application]")
    ) {
      event.preventDefault()
      editor.addRegion()
    } else if (key === "[" || key === "]") {
      event.preventDefault()
      editor.cycleRegion(key === "]" ? 1 : -1)
    }
    const step = event.shiftKey ? 10 : 1
    const deltas: Record<string, readonly [number, number]> = {
      arrowleft: [-step, 0],
      arrowright: [step, 0],
      arrowup: [0, -step],
      arrowdown: [0, step],
    }
    const delta = deltas[key]
    if (delta && editor.selected) {
      event.preventDefault()
      editor.updateSelected({
        x: editor.selected.x + delta[0],
        y: editor.selected.y + delta[1],
      })
    }
  }
}
