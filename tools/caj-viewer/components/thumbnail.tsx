import { useEffect, useRef, useState } from "react"
import type { Reader } from "@workspace/pdf-reader"
import { Button } from "@workspace/ui/components/ui/button"
import { cn } from "@workspace/ui/lib/utils"
import type { Messages } from "../types"

export function Thumbnail({
  reader,
  page,
  current,
  onPage,
  messages: m,
}: {
  reader: Reader
  page: number
  current: number
  onPage: (page: number) => void
  messages: Messages
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    const element = canvas.current!
    setError(false)
    void reader.thumbnail(page, element, controller.signal).catch(() => {
      if (!controller.signal.aborted) setError(true)
    })
    return () => {
      controller.abort()
      element.width = 0
      element.height = 0
    }
  }, [reader, page])
  return (
    <Button
      variant="outline"
      className={cn(
        "h-auto min-w-0 flex-col gap-1 p-2",
        current === page && "ring-2 ring-ring"
      )}
      aria-label={m.thumbnail.replace("{page}", String(page))}
      aria-current={current === page ? "page" : undefined}
      onClick={() => onPage(page)}
    >
      <canvas ref={canvas} className="max-h-40 max-w-full" aria-hidden="true" />
      {error ? (
        <span className="text-xs text-wrap">{m.thumbnailError}</span>
      ) : null}
      <span className="text-xs tabular-nums">{page}</span>
    </Button>
  )
}
