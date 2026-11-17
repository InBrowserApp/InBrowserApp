import { Button } from "@workspace/ui/components/ui/button"
import { ChevronLeft, ChevronRight } from "@workspace/ui/icons"
import type { Messages } from "../types"

export function Pagination({
  page,
  total,
  onPage,
  messages: m,
  lang,
}: {
  page: number
  total: number
  onPage: (page: number) => void
  messages: Messages
  lang: string
}) {
  const nf = new Intl.NumberFormat(lang)
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <p className="text-xs text-muted-foreground tabular-nums">
        {m.page
          .replace("{current}", nf.format(page + 1))
          .replace("{total}", nf.format(total))}
      </p>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label={m.previous}
        disabled={page === 0}
        onClick={() => onPage(page - 1)}
      >
        <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label={m.next}
        disabled={page + 1 >= total}
        onClick={() => onPage(page + 1)}
      >
        <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
      </Button>
    </div>
  )
}
