import { useEffect, useRef } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import type { Messages, Reader, ReaderState } from "../types"

export function Thumbnails({
  reader,
  state,
  messages: m,
}: {
  reader: Reader
  state: ReaderState
  messages: Messages
}) {
  const rail = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = rail.current!
    let disposed = false
    const visible = new Set<HTMLCanvasElement>()
    // Serialize thumbnail work and release canvases as they leave the rail.
    let pending = Promise.resolve()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const canvas = entry.target as HTMLCanvasElement
          if (!entry.isIntersecting) {
            visible.delete(canvas)
            canvas.width = canvas.height = 0
            continue
          }
          visible.add(canvas)
          pending = pending.then(async () => {
            if (disposed || !visible.has(canvas)) return
            try {
              await reader.thumbnail(canvas, Number(canvas.dataset.page))
            } catch {
              // Navigation remains available when an optional preview fails.
            }
            if (disposed || !visible.has(canvas))
              canvas.width = canvas.height = 0
          })
        }
      },
      { root: element }
    )
    const canvases = element.querySelectorAll("canvas")
    canvases.forEach((canvas) => observer.observe(canvas))
    return () => {
      disposed = true
      observer.disconnect()
      visible.clear()
      canvases.forEach((canvas) => {
        canvas.width = canvas.height = 0
      })
    }
  }, [reader, state.total])
  return (
    <nav
      ref={rail}
      aria-label={m.thumbnails}
      className="flex h-36 shrink-0 gap-2 overflow-auto border-b bg-muted/50 p-2 sm:h-[70vh] sm:w-40 sm:flex-col sm:border-e sm:border-b-0"
    >
      {Array.from({ length: state.total }, (_, index) => (
        <Button
          key={index}
          variant="ghost"
          aria-label={`${m.page} ${index + 1}`}
          aria-current={state.page === index + 1 ? "page" : undefined}
          onClick={() => reader.page(index + 1)}
          className="h-auto w-32 shrink-0 flex-col gap-1 border border-transparent p-2 aria-[current=page]:border-primary aria-[current=page]:bg-background"
        >
          <span className="flex h-20 w-full items-center justify-center">
            <canvas
              width={0}
              height={0}
              data-page={index + 1}
              aria-hidden="true"
              className="max-h-full max-w-full"
            />
          </span>
          <span className="text-xs tabular-nums">{index + 1}</span>
        </Button>
      ))}
    </nav>
  )
}
