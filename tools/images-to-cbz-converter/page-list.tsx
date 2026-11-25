import { useEffect, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  ImageIcon,
  Trash2,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { ComicImage, Messages } from "./types"

export type Page = ComicImage & { id: number }

function Thumbnail({ page }: { page: Page }) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    const source = URL.createObjectURL(page.blob)
    setUrl(source)
    return () => URL.revokeObjectURL(source)
  }, [page])
  return (
    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
      {url ? (
        <img
          src={url}
          alt=""
          loading="lazy"
          draggable={false}
          className="size-full object-contain"
          onError={() => setUrl("")}
        />
      ) : (
        <ImageIcon
          className="size-5 text-muted-foreground"
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export function PageList({
  pages,
  disabled,
  messages: m,
  onMove,
  onRemove,
}: {
  pages: Page[]
  disabled: boolean
  messages: Messages
  onMove: (id: number, target: number, control?: HTMLButtonElement) => void
  onRemove: (id: number, control: HTMLButtonElement) => void
}) {
  const [dragged, setDragged] = useState<number | null>(null)
  return (
    <ol className="grid max-h-[32rem] gap-2 overflow-y-auto p-1">
      {pages.map((page, index) => (
        <li
          key={page.id}
          draggable={!disabled}
          className={cn(
            "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 rounded-lg border bg-background p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]",
            dragged === page.id && "border-primary bg-primary/5"
          )}
          onDragStart={(event) => {
            event.dataTransfer.setData("text/plain", String(page.id))
            event.dataTransfer.effectAllowed = "move"
            setDragged(page.id)
          }}
          onDragEnd={() => setDragged(null)}
          onDragOver={(event) => {
            if (disabled || dragged === null) return
            event.preventDefault()
            event.dataTransfer.dropEffect = "move"
          }}
          onDrop={(event) => {
            if (disabled || dragged === null) return
            event.preventDefault()
            event.stopPropagation()
            onMove(dragged, index)
            setDragged(null)
          }}
        >
          <div className="flex items-center gap-2">
            <GripVertical
              aria-hidden="true"
              className="hidden size-4 cursor-grab text-muted-foreground sm:block"
            />
            <Thumbnail page={page} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium wrap-anywhere">
              <bdi>{page.path}</bdi>
            </p>
            {index === 0 ? (
              <p className="mt-1 text-xs text-muted-foreground">{m.cover}</p>
            ) : null}
          </div>
          <div className="col-span-2 flex flex-wrap items-center justify-end gap-1 sm:col-span-1">
            {index > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="min-h-11 max-w-full whitespace-normal sm:min-h-8"
                disabled={disabled}
                aria-label={m.coverAction.replace("{name}", () => page.path)}
                onClick={(event) => onMove(page.id, 0, event.currentTarget)}
              >
                {m.makeCover}
              </Button>
            ) : null}
            <DocumentIconButton
              type="button"
              className="max-sm:size-11 sm:size-8"
              disabled={disabled || index === 0}
              label={m.moveUp.replace("{name}", () => page.path)}
              onClick={(event) =>
                onMove(page.id, index - 1, event.currentTarget)
              }
            >
              <ArrowUp aria-hidden="true" />
            </DocumentIconButton>
            <DocumentIconButton
              type="button"
              className="max-sm:size-11 sm:size-8"
              disabled={disabled || index === pages.length - 1}
              label={m.moveDown.replace("{name}", () => page.path)}
              onClick={(event) =>
                onMove(page.id, index + 1, event.currentTarget)
              }
            >
              <ArrowDown aria-hidden="true" />
            </DocumentIconButton>
            <DocumentIconButton
              type="button"
              className="max-sm:size-11 sm:size-8"
              disabled={disabled}
              label={m.remove.replace("{name}", () => page.path)}
              onClick={(event) => onRemove(page.id, event.currentTarget)}
            >
              <Trash2 aria-hidden="true" />
            </DocumentIconButton>
          </div>
        </li>
      ))}
    </ol>
  )
}
