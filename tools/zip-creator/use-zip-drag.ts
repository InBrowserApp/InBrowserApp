import { useEffect, useRef, useState } from "react"

import { parentPath } from "./core/collection"
import { canMove } from "./core/edit"
import { captureDrop, readDrop } from "./core/selection"

import type { Creator } from "./use-zip-creator"
import type { DragEvent as ReactDragEvent } from "react"

const entryType = "application/x-inbrowser-zip-entry"

function isFileDrag(event: { dataTransfer: DataTransfer | null }) {
  return event.dataTransfer?.types.includes("Files")
}

export function useZipDrag(creator: Creator) {
  const [source, setSource] = useState<string | null>(null)
  const [target, setTarget] = useState<string | null>(null)
  const depths = useRef(new Map<string, number>())
  const disabled = creator.status !== null

  function clear() {
    depths.current.clear()
    setSource(null)
    setTarget(null)
  }

  useEffect(() => {
    // An OS file dropped outside our targets must not replace the page.
    function preventNavigation(event: DragEvent) {
      if (isFileDrag(event)) {
        event.preventDefault()
        if (event.type === "dragover") event.dataTransfer!.dropEffect = "none"
      }
      if (event.type === "drop") clear()
    }
    document.addEventListener("dragover", preventNavigation)
    document.addEventListener("drop", preventNavigation)
    document.addEventListener("dragend", clear)
    return () => {
      document.removeEventListener("dragover", preventNavigation)
      document.removeEventListener("drop", preventNavigation)
      document.removeEventListener("dragend", clear)
    }
  }, [])

  function dropTarget(directory: string, id: string) {
    function accepts(event: ReactDragEvent) {
      return (
        !disabled &&
        (source !== null
          ? event.dataTransfer.types.includes(entryType) &&
            parentPath(source) !== directory &&
            canMove(source, directory)
          : isFileDrag(event))
      )
    }

    return {
      isOver: !disabled && target === id,
      props: {
        onDragEnter(event: ReactDragEvent) {
          event.preventDefault()
          event.stopPropagation()
          depths.current.set(id, (depths.current.get(id) ?? 0) + 1)
          if (accepts(event)) setTarget(id)
        },
        onDragLeave(event: ReactDragEvent) {
          event.stopPropagation()
          const depth = Math.max(0, (depths.current.get(id) ?? 0) - 1)
          depths.current.set(id, depth)
          if (!depth) setTarget((current) => (current === id ? null : current))
        },
        onDragOver(event: ReactDragEvent) {
          event.preventDefault()
          event.stopPropagation()
          const allowed = accepts(event)
          event.dataTransfer.dropEffect = allowed
            ? source === null
              ? "copy"
              : "move"
            : "none"
          setTarget(allowed ? id : null)
        },
        onDrop(event: ReactDragEvent) {
          event.preventDefault()
          event.stopPropagation()
          const allowed = accepts(event)
          clear()
          if (!allowed) return
          if (source !== null) {
            creator.edit({ kind: "move", path: source, directory }, true)
          } else {
            const entries = captureDrop(event.dataTransfer)
            void creator.add((signal) => readDrop(entries, signal), directory)
          }
        },
      },
    }
  }

  function dragSource(path: string) {
    return {
      draggable: !disabled,
      onDragStart(event: ReactDragEvent) {
        if (disabled) {
          event.preventDefault()
          return
        }
        event.dataTransfer.setData(entryType, path)
        event.dataTransfer.effectAllowed = "move"
        setSource(path)
      },
      onDragEnd: clear,
    }
  }

  return { dropTarget, dragSource }
}

export type ZipDrag = ReturnType<typeof useZipDrag>
