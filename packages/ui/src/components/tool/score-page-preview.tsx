import { useEffect, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { ChevronLeft, ChevronRight } from "@workspace/ui/icons"

type Messages = Record<"preview" | "page" | "previous" | "next", string>

export function ScorePagePreview<T>({
  pages,
  makePreview,
  activePage,
  onPageChange,
  language,
  messages: m,
}: {
  pages: readonly T[]
  makePreview: (page: T) => Blob
  activePage?: number
  onPageChange?: (page: number) => void
  language: string
  messages: Messages
}) {
  const [page, setPage] = useState(0)
  const count = pages.length
  const index = Math.min(activePage ?? page, count - 1)
  const selected = pages[index]!
  const [url, setUrl] = useState("")
  useEffect(() => {
    const next = URL.createObjectURL(makePreview(selected))
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [selected, makePreview])
  function changePage(next: number) {
    if (activePage === undefined) setPage(next)
    onPageChange?.(next)
  }
  const format = new Intl.NumberFormat(language)
  const label = m.page
    .replace("{page}", format.format(index + 1))
    .replace("{total}", format.format(count))
  return (
    <section
      aria-label={m.preview}
      className="min-w-0 overflow-hidden rounded-xl border bg-card"
    >
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-x-3 border-b px-3 py-1 sm:px-4">
        <h2 className="text-sm font-medium">{m.preview}</h2>
        <div className="flex items-center gap-1">
          {count > 1 && (
            <DocumentIconButton
              label={m.previous}
              disabled={index === 0}
              onClick={() => changePage(index - 1)}
            >
              <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
            </DocumentIconButton>
          )}
          <p
            className="text-sm text-muted-foreground tabular-nums"
            aria-live="polite"
          >
            {label}
          </p>
          {count > 1 && (
            <DocumentIconButton
              label={m.next}
              disabled={index + 1 === count}
              onClick={() => changePage(index + 1)}
            >
              <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
            </DocumentIconButton>
          )}
        </div>
      </div>
      <div className="bg-muted/50 p-3 sm:p-5">
        {url && (
          <img
            src={url}
            alt={label}
            className="mx-auto block w-full max-w-[32rem] bg-white shadow-sm"
          />
        )}
      </div>
    </section>
  )
}
