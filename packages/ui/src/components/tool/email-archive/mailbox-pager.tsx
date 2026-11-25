import { Button } from "@workspace/ui/components/ui/button"
import { ChevronLeft, ChevronRight } from "@workspace/ui/icons"
import type { ArchiveMessages } from "./copy"

export function MailboxPager({
  lang,
  count,
  page,
  pageSize,
  messages: m,
  movePage,
}: {
  lang: string
  count: number
  page: number
  pageSize: number
  messages: ArchiveMessages
  movePage: (page: number) => void
}) {
  const start = page * pageSize
  const end = Math.min(start + pageSize, count)
  const number = new Intl.NumberFormat(lang)
  return (
    <div className="flex min-h-12 shrink-0 items-center justify-between gap-1 border-t px-3 py-1 text-xs text-muted-foreground">
      <span role="status">
        {m.range
          .replace("{start}", number.format(start + 1))
          .replace("{end}", number.format(end))
          .replace("{total}", number.format(count))}
      </span>
      {count > pageSize && (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={m.previous}
            title={m.previous}
            disabled={!page}
            onClick={() => movePage(page - 1)}
          >
            <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={m.next}
            title={m.next}
            disabled={end === count}
            onClick={() => movePage(page + 1)}
          >
            <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
          </Button>
        </div>
      )}
    </div>
  )
}
