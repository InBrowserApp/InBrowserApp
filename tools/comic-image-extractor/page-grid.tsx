import { useEffect, useState } from "react"
import type { Comic, ComicPage } from "@workspace/comic/types"
import { Check, ImageIcon } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { canRead } from "./types"
import type { Messages } from "./types"

export const pageGroupSize = 12

export function PageGrid({
  comic,
  start,
  selected,
  busy,
  onToggle,
  messages: m,
  number,
}: {
  comic: Comic
  start: number
  selected: ReadonlySet<number>
  busy: boolean
  onToggle: (index: number) => void
  messages: Messages
  number: Intl.NumberFormat
}) {
  const [previews, setPreviews] = useState<
    Partial<Record<number, string | false>>
  >({})

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const urls: string[] = []
    setPreviews({})
    const end = Math.min(start + pageGroupSize, comic.pages.length)
    for (let index = start; index < end; index++) {
      if (!canRead(comic.pages[index]!)) continue
      void comic.read(index, signal).then(
        (blob) => {
          if (signal.aborted) return
          const url = URL.createObjectURL(blob)
          urls.push(url)
          setPreviews((current) => ({ ...current, [index]: url }))
        },
        () => {
          if (!signal.aborted)
            setPreviews((current) => ({ ...current, [index]: false }))
        }
      )
    }
    return () => {
      controller.abort()
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [comic, start])

  return (
    <ul className="grid grid-cols-2 gap-3 px-4 pb-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {comic.pages.slice(start, start + pageGroupSize).map((page, offset) => {
        const index = start + offset
        const label = m.page.replace("{page}", number.format(index + 1))
        return (
          <li key={index} className="min-w-0">
            <PageTile
              page={page}
              label={label}
              preview={previews[index]}
              selected={selected.has(index)}
              busy={busy}
              onToggle={() => onToggle(index)}
              messages={m}
            />
          </li>
        )
      })}
    </ul>
  )
}

function PageTile({
  page,
  label,
  preview,
  selected,
  busy,
  onToggle,
  messages: m,
}: {
  page: ComicPage
  label: string
  preview?: string | false
  selected: boolean
  busy: boolean
  onToggle: () => void
  messages: Messages
}) {
  const [broken, setBroken] = useState(false)
  const status = page.status
  const unavailable = status !== "unchecked" && status !== "ready"
  const problem = unavailable
    ? m[status]
    : preview === false || broken
      ? m.previewUnavailable
      : undefined

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={[label, page.name, problem].filter(Boolean).join(" · ")}
      title={page.name}
      onClick={onToggle}
      disabled={busy || unavailable}
      className={cn(
        "group flex w-full min-w-0 flex-col rounded-lg border text-start transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        selected
          ? "border-primary/60 bg-primary/5"
          : "bg-card hover:bg-muted/45"
      )}
    >
      <span className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-t-[inherit] bg-muted/60 p-2">
        {preview && !broken ? (
          <img
            src={preview}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain"
            onError={() => setBroken(true)}
          />
        ) : (
          <span className="flex flex-col items-center gap-2 px-1 text-center text-xs text-muted-foreground">
            <ImageIcon className="size-5" aria-hidden="true" />
            {problem}
          </span>
        )}
      </span>
      <span className="flex w-full min-w-0 items-center justify-between gap-2 px-2.5 pt-2 text-xs font-medium">
        {label}
        <span
          className={cn(
            "grid size-5 shrink-0 place-items-center rounded border",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background"
          )}
          aria-hidden="true"
        >
          {selected ? <Check className="size-3.5" /> : null}
        </span>
      </span>
      <bdi className="block max-w-full truncate px-2.5 pt-1 pb-2.5 text-xs text-muted-foreground">
        {page.name.split("/").at(-1)}
      </bdi>
    </button>
  )
}
