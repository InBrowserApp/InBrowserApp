import { useEffect, useRef, useState } from "react"
import type { OFDPage } from "@ofdjs/viewer"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import type { Messages } from "./types"

export function PageCanvas({
  page,
  scale,
  rotation,
  thumbnail = false,
  messages: m,
  onRendered,
}: {
  page: OFDPage
  scale: number
  rotation: number
  thumbnail?: boolean
  messages: Messages
  onRendered: () => void
}) {
  const container = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState("loading")
  const viewport = page.getViewport({ scale, rotation })
  useEffect(() => {
    const root = container.current!
    const canvas = document.createElement("canvas")
    canvas.setAttribute("role", "img")
    canvas.setAttribute("aria-label", `${m.page} ${page.pageNumber}`)
    canvas.style.display = "block"
    root.replaceChildren(canvas)
    setStatus("loading")
    const controller = new AbortController()
    const task = page.render({
      canvasContext: canvas.getContext("2d")!,
      viewport: page.getViewport({ scale, rotation }),
      pixelRatio: thumbnail ? 1 : window.devicePixelRatio,
      signal: controller.signal,
    })
    void task.promise.then(
      () => {
        if (controller.signal.aborted) return
        setStatus("")
        onRendered()
      },
      (error: unknown) => {
        if (controller.signal.aborted) return
        canvas.width = canvas.height = 0
        setStatus(
          error instanceof Error && error.message.includes("Canvas")
            ? m.canvasLimit
            : m.pageError
        )
        onRendered()
      }
    )
    return () => {
      controller.abort()
      task.cancel()
      root.replaceChildren()
      void task.promise
        .finally(() => {
          canvas.width = canvas.height = 0
        })
        .catch(() => {})
    }
  }, [page, scale, rotation, thumbnail, m, onRendered])
  return (
    <div
      className="relative shrink-0"
      style={
        status && status !== "loading"
          ? {
              width: Math.min(viewport.width, 400),
              height: thumbnail ? 80 : 160,
            }
          : { width: viewport.width, height: viewport.height }
      }
      aria-busy={status === "loading"}
    >
      <div ref={container} />
      {status ? (
        <p
          role={status === "loading" ? "status" : "alert"}
          className="absolute inset-0 flex items-center justify-center gap-2 overflow-auto bg-background p-3 text-center text-sm text-foreground"
        >
          {status === "loading" ? (
            <>
              <Spinner />
              {thumbnail ? "" : m.rendering}
            </>
          ) : thumbnail ? (
            m.thumbnailError
          ) : (
            status
          )}
        </p>
      ) : null}
    </div>
  )
}
