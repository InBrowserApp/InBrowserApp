import { useEffect, useRef, useState } from "react"
import type { RtfDocument } from "rtf-viewer"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { TextLayer } from "./text-layer"
import type { Match } from "./page-text"
import type { Messages } from "./types"

export function PageView({
  document: rtf,
  page,
  zoom,
  match,
  messages: m,
}: {
  document: RtfDocument
  page: number
  zoom: number
  match?: Match
  messages: Messages
}) {
  const container = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState("loading")
  const layout = rtf.getPageLayout(page - 1)
  const scale = ((zoom / 100) * 4) / 3
  useEffect(() => {
    const root = container.current!
    const canvas = document.createElement("canvas")
    canvas.setAttribute("aria-hidden", "true")
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    root.replaceChildren(canvas)
    setStatus("loading")
    const controller = new AbortController()
    const task = rtf.renderPage(canvas, page - 1, {
      scale: zoom / 100,
      pixelRatio: window.devicePixelRatio,
      signal: controller.signal,
    })
    void task.then(
      () => {
        if (!controller.signal.aborted) setStatus("")
      },
      (error: unknown) => {
        if (controller.signal.aborted) return
        canvas.width = canvas.height = 0
        setStatus(
          error instanceof Error &&
            /canvas|dimension limit|Output scale/.test(error.message)
            ? m.canvasLimit
            : m.pageError
        )
      }
    )
    return () => {
      controller.abort()
      root.replaceChildren()
      void task
        .finally(() => {
          canvas.width = canvas.height = 0
        })
        .catch(() => {})
    }
  }, [rtf, page, zoom, m])
  const error = status && status !== "loading"
  return (
    <div
      className="relative shrink-0"
      aria-busy={status === "loading"}
      style={{
        width: error
          ? Math.min(400, layout.width * scale)
          : layout.width * scale,
        height: error ? 160 : layout.height * scale,
      }}
    >
      <div ref={container} className="absolute inset-0" />
      {!error ? (
        <div
          style={{
            width: layout.width,
            height: layout.height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <TextLayer page={layout} match={match} messages={m} />
        </div>
      ) : null}
      {status ? (
        <p
          role={error ? "alert" : "status"}
          className="absolute inset-0 flex items-center justify-center gap-2 bg-background p-3 text-center text-sm text-foreground"
        >
          {!error ? <Spinner /> : null}
          {error ? status : m.rendering}
        </p>
      ) : null}
    </div>
  )
}
