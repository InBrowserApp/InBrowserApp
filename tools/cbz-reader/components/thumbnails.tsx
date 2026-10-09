import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  TriangleAlert,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { usePageImage } from "../use-page-image"
import type { OpenedComic } from "../use-comic"
import type { Messages, PageStatus } from "../types"

type Props = OpenedComic & {
  m: Messages
  page: number
  go: (index: number) => void
  report: (index: number, status: PageStatus) => void
}

function Thumbnail({
  comic,
  initial,
  m,
  page,
  index,
  go,
  report,
}: Props & { index: number }) {
  const image = usePageImage(comic, index, initial, report)
  const entry = comic.pages[index]!
  const problem = entry.status !== "ready" && entry.status !== "unchecked"
  return (
    <Button
      variant="outline"
      className={cn(
        "h-24 w-16 shrink-0 flex-col gap-1 overflow-hidden p-1",
        page === index && "ring-2 ring-ring ring-inset"
      )}
      title={entry.name}
      aria-label={`${m.pagePosition.replace("{page}", String(index + 1)).replace("{total}", String(comic.pages.length))}${problem ? ` — ${m.unreadable}` : ""}`}
      aria-current={page === index ? "page" : undefined}
      onClick={() => go(index)}
    >
      {image ? (
        <img src={image.url} alt="" className="h-16 w-full object-contain" />
      ) : problem ? (
        <TriangleAlert aria-hidden="true" />
      ) : (
        <ImageIcon aria-hidden="true" />
      )}
      <span className="text-xs tabular-nums">{index + 1}</span>
    </Button>
  )
}

export function Thumbnails(props: Props) {
  const { comic, page, m } = props
  const [offset, setOffset] = useState(Math.floor(page / 9) * 9)
  useEffect(() => {
    setOffset(Math.floor(page / 9) * 9)
  }, [page])
  const end = Math.min(offset + 9, comic.pages.length)
  return (
    <nav
      aria-label={m.thumbnails}
      className="flex max-h-40 shrink-0 flex-col gap-1 overflow-y-auto border-t p-2"
      dir="ltr"
    >
      <div className="flex items-center justify-between gap-2">
        <DocumentIconButton
          label={m.previousThumbnails}
          disabled={!offset}
          onClick={() => setOffset(Math.max(0, offset - 9))}
        >
          <ChevronLeft aria-hidden="true" />
        </DocumentIconButton>
        <span className="text-xs text-muted-foreground">
          {m.thumbnailRange
            .replace("{start}", String(offset + 1))
            .replace("{end}", String(end))
            .replace("{total}", String(comic.pages.length))}
        </span>
        <DocumentIconButton
          label={m.nextThumbnails}
          disabled={end === comic.pages.length}
          onClick={() => setOffset(offset + 9)}
        >
          <ChevronRight aria-hidden="true" />
        </DocumentIconButton>
      </div>
      <div className="flex gap-2 overflow-x-auto p-1">
        {Array.from({ length: end - offset }, (_, i) => (
          <Thumbnail key={offset + i} {...props} index={offset + i} />
        ))}
      </div>
    </nav>
  )
}
