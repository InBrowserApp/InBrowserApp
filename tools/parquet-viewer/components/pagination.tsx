import { useId } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { Input } from "@workspace/ui/components/ui/input"
import { ChevronLeft, ChevronRight } from "@workspace/ui/icons"
import type { Messages } from "../types"

export function Pagination({
  page,
  size,
  total,
  busy,
  onPage,
  onSize,
  messages: m,
  lang,
}: {
  page: number
  size: number
  total: number
  busy: boolean
  onPage: (page: number) => void
  onSize: (size: number) => void
  messages: Messages
  lang: string
}) {
  const id = useId()
  const pages = Math.max(1, Math.ceil(total / size))
  const number = new Intl.NumberFormat(lang)
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t p-3 text-xs">
      <label className="flex items-center gap-2" htmlFor={`${id}-size`}>
        {m.rowsPerPage}
        <select
          id={`${id}-size`}
          name="rowsPerPage"
          className="h-8 rounded-md border bg-background px-2 text-foreground"
          value={size}
          disabled={busy}
          onChange={(event) => onSize(Number(event.target.value))}
        >
          {[25, 50, 100].map((count) => (
            <option key={count} value={count}>
              {number.format(count)}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-center gap-2">
        <DocumentIconButton
          label={m.previous}
          disabled={busy || page === 0}
          onClick={() => onPage(page - 1)}
        >
          <ChevronLeft className="rtl:rotate-180" aria-hidden="true" />
        </DocumentIconButton>
        <label htmlFor={`${id}-page`}>{m.page}</label>
        <Input
          key={page}
          id={`${id}-page`}
          name="page"
          type="number"
          inputMode="numeric"
          min={1}
          max={pages}
          defaultValue={page + 1}
          disabled={busy}
          className="h-8 w-20 text-center tabular-nums"
          onBlur={(event) => {
            const value = Number(event.target.value)
            if (Number.isInteger(value) && value >= 1 && value <= pages)
              onPage(value - 1)
            else event.target.value = String(page + 1)
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur()
          }}
        />
        <span>{m.pageOf.replace("{pages}", number.format(pages))}</span>
        <DocumentIconButton
          label={m.next}
          disabled={busy || page + 1 >= pages}
          onClick={() => onPage(page + 1)}
        >
          <ChevronRight className="rtl:rotate-180" aria-hidden="true" />
        </DocumentIconButton>
      </div>
    </div>
  )
}
