import { useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { PREVIEW_LIMIT } from "../core/content"
import type { FormParameter, Messages } from "../types"

const PAGE_SIZE = 50

export function Pairs({
  title,
  values,
  messages: m,
  lang,
}: {
  title: string
  values: readonly FormParameter[]
  messages: Messages
  lang: string
}) {
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(values.length / PAGE_SIZE))
  const currentPage = Math.min(page, pages - 1)
  const shown = values.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  )
  const truncated = shown.some((pair) =>
    [pair.name, pair.value, pair.fileName ?? "", pair.contentType ?? ""].some(
      (value) => value.length > PREVIEW_LIMIT
    )
  )
  const number = new Intl.NumberFormat(lang)
  return (
    <section className="flex min-w-0 flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-medium">{title}</h3>
        {values.length ? (
          <p className="text-xs text-muted-foreground">
            {m.entries}: {number.format(values.length)}
          </p>
        ) : null}
      </div>
      {values.length ? (
        <dl className="divide-y rounded-lg border text-xs">
          {shown.map((pair, i) => (
            <div
              key={currentPage * PAGE_SIZE + i}
              className="grid gap-1 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-4"
            >
              <dt className="font-mono break-all" dir="auto">
                {pair.name.slice(0, PREVIEW_LIMIT)}
              </dt>
              <dd
                className="flex min-w-0 flex-col gap-1 break-all whitespace-pre-wrap"
                dir="auto"
              >
                <p>
                  {pair.fileName && pair.fileName === pair.value
                    ? `${m.fileName}: `
                    : ""}
                  {pair.value.slice(0, PREVIEW_LIMIT)}
                </p>
                {pair.fileName && pair.fileName !== pair.value ? (
                  <p>
                    {m.fileName}: {pair.fileName.slice(0, PREVIEW_LIMIT)}
                  </p>
                ) : null}
                {pair.contentType ? (
                  <p>
                    {m.contentType}: {pair.contentType.slice(0, PREVIEW_LIMIT)}
                  </p>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-xs text-muted-foreground">{m.none}</p>
      )}
      {truncated ? (
        <p className="text-xs text-muted-foreground">{m.valueTruncated}</p>
      ) : null}
      {pages > 1 ? (
        <nav
          aria-label={`${title}: ${m.page}`}
          className="flex flex-wrap items-center justify-between gap-2"
        >
          <p aria-live="polite" className="text-xs text-muted-foreground">
            {m.page} {number.format(currentPage + 1)} / {number.format(pages)}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => setPage(currentPage - 1)}
            >
              {m.previous}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage + 1 === pages}
              onClick={() => setPage(currentPage + 1)}
            >
              {m.next}
            </Button>
          </div>
        </nav>
      ) : null}
    </section>
  )
}
