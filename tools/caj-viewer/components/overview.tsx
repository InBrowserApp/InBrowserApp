import { useEffect, useState } from "react"
import type { OutlineItem, Reader } from "@workspace/pdf-reader"
import { Button } from "@workspace/ui/components/ui/button"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { ChevronLeft, ChevronRight, X } from "@workspace/ui/icons"
import { Thumbnail } from "./thumbnail"
import type { Messages } from "../types"

function Contents({
  items,
  onDestination,
}: {
  items: OutlineItem[]
  onDestination: (destination: string | unknown[]) => void
}) {
  return (
    <ul className="flex flex-col gap-1 ps-3">
      {items.map((item, index) => (
        <li key={index}>
          <Button
            variant="ghost"
            className="h-auto w-full justify-start text-start whitespace-normal"
            disabled={!item.destination}
            onClick={() => item.destination && onDestination(item.destination)}
          >
            <span dir="auto" className="min-w-0 break-words">
              {item.title}
            </span>
          </Button>
          {item.children.length ? (
            <Contents items={item.children} onDestination={onDestination} />
          ) : null}
        </li>
      ))}
    </ul>
  )
}

export function Overview({
  id,
  reader,
  current,
  total,
  onPage,
  onDestination,
  onClose,
  messages: m,
}: {
  id: string
  reader: Reader
  current: number
  total: number
  onPage: (page: number) => void
  onDestination: (destination: string | unknown[]) => void
  onClose: () => void
  messages: Messages
}) {
  const [start, setStart] = useState(Math.floor((current - 1) / 6) * 6 + 1)
  const [outline, setOutline] = useState<OutlineItem[]>([])
  useEffect(() => {
    let active = true
    void reader
      .outline()
      .then((items) => {
        if (active) setOutline(items)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [reader])
  useEffect(() => setStart(Math.floor((current - 1) / 6) * 6 + 1), [current])
  const end = Math.min(start + 5, total)
  return (
    <aside
      id={id}
      aria-label={m.overview}
      className="flex min-h-0 flex-1 shrink-0 flex-col overflow-auto border-e p-3 sm:w-64 sm:flex-none"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">{m.overview}</h2>
        <DocumentIconButton label={m.closeOverview} onClick={onClose}>
          <X aria-hidden="true" />
        </DocumentIconButton>
      </div>
      <details className="mb-3 border-b pb-2">
        <summary className="cursor-pointer rounded-sm py-2 text-sm focus-visible:outline-2 focus-visible:outline-ring">
          {m.bookmarks}
        </summary>
        {outline.length ? (
          <Contents items={outline} onDestination={onDestination} />
        ) : (
          <p className="text-xs text-muted-foreground">{m.noBookmarks}</p>
        )}
      </details>
      <div className="mb-2 flex items-center justify-between gap-1">
        <DocumentIconButton
          label={m.previousPreviews}
          disabled={start === 1}
          onClick={() => setStart(Math.max(1, start - 6))}
        >
          <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
        </DocumentIconButton>
        <p
          className="text-center text-xs text-muted-foreground"
          aria-live="polite"
        >
          {m.previewRange
            .replace("{start}", String(start))
            .replace("{end}", String(end))
            .replace("{total}", String(total))}
        </p>
        <DocumentIconButton
          label={m.nextPreviews}
          disabled={end === total}
          onClick={() => setStart(start + 6)}
        >
          <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
        </DocumentIconButton>
      </div>
      <div
        className="grid grid-cols-2 items-start gap-3"
        aria-label={m.thumbnails}
      >
        {Array.from(
          { length: end - start + 1 },
          (_, index) => start + index
        ).map((page) => (
          <Thumbnail
            key={page}
            reader={reader}
            page={page}
            current={current}
            onPage={onPage}
            messages={m}
          />
        ))}
      </div>
    </aside>
  )
}
