import { useEffect, useRef, useState } from "react"
import type { OFDDocument } from "@ofdjs/viewer"
import { Button } from "@workspace/ui/components/ui/button"
import { PageCanvas } from "./page-canvas"
import { usePage } from "./use-page"
import type { Messages } from "./types"

function Thumbnail({
  document,
  number,
  visible,
  messages,
  onRendered,
}: {
  document: OFDDocument
  number: number
  visible: boolean
  messages: Messages
  onRendered: () => void
}) {
  const result = usePage(document, visible ? number : null)
  const viewport = result?.page?.getViewport()
  if (result?.error)
    return <span className="text-xs">{messages.thumbnailError}</span>
  return viewport && result?.page ? (
    <PageCanvas
      page={result.page}
      scale={Math.min(96 / viewport.width, 90 / viewport.height)}
      rotation={0}
      thumbnail
      messages={messages}
      onRendered={onRendered}
    />
  ) : null
}

export function Overview({
  id,
  document,
  current,
  onPage,
  onRendered,
  onClose,
  messages: m,
}: {
  id: string
  document: OFDDocument
  current: number
  onPage: (page: number) => void
  onClose: () => void
  onRendered: () => void
  messages: Messages
}) {
  const rail = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(new Set<number>())
  useEffect(() => {
    const root = rail.current!
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((previous) => {
          const next = new Set(previous)
          for (const entry of entries) {
            const number = Number((entry.target as HTMLElement).dataset.page)
            if (entry.isIntersecting) next.add(number)
            else next.delete(number)
          }
          return next
        })
      },
      { root }
    )
    root
      .querySelectorAll("[data-page]")
      .forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [document])
  useEffect(() => {
    const root = rail.current!
    const selected = root.querySelector<HTMLElement>('[aria-current="page"]')!
    const outer = root.getBoundingClientRect(),
      inner = selected.getBoundingClientRect()
    root.scrollBy({
      top:
        inner.top < outer.top
          ? inner.top - outer.top
          : inner.bottom > outer.bottom
            ? inner.bottom - outer.bottom
            : 0,
      left:
        inner.left < outer.left
          ? inner.left - outer.left
          : inner.right > outer.right
            ? inner.right - outer.right
            : 0,
    })
  }, [current])
  return (
    <nav
      ref={rail}
      id={id}
      aria-label={m.thumbnails}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault()
          onClose()
        }
      }}
      className="flex min-h-0 flex-1 flex-wrap content-start gap-2 overflow-auto bg-muted/50 p-2 sm:w-36 sm:flex-none sm:flex-col sm:flex-nowrap sm:border-e"
    >
      {Array.from({ length: document.numPages }, (_, index) => (
        <Button
          key={index}
          variant="ghost"
          data-page={index + 1}
          aria-label={`${m.page} ${index + 1}`}
          aria-current={current === index + 1 ? "page" : undefined}
          onClick={() => onPage(index + 1)}
          className="h-28 w-28 shrink-0 flex-col gap-1 border border-transparent p-2 aria-[current=page]:border-primary aria-[current=page]:bg-background"
        >
          <span
            className="flex h-20 w-full items-center justify-center"
            aria-hidden="true"
          >
            <Thumbnail
              document={document}
              number={index + 1}
              visible={visible.has(index + 1)}
              messages={m}
              onRendered={onRendered}
            />
          </span>
          <span className="text-xs tabular-nums">{index + 1}</span>
        </Button>
      ))}
    </nav>
  )
}
