import { Button } from "@workspace/ui/components/ui/button"
import { ChevronLeft, ChevronRight } from "@workspace/ui/icons"

type MacAddressPaginationProps = Readonly<{
  summary: string
  previousLabel: string
  nextLabel: string
  previousHref: string | null
  nextHref: string | null
}>

function MacAddressPagination({
  summary,
  previousLabel,
  nextLabel,
  previousHref,
  nextHref,
}: MacAddressPaginationProps) {
  return (
    <nav
      aria-label={summary}
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-sm text-muted-foreground tabular-nums"
      >
        {summary}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          asChild={previousHref !== null}
          variant="outline"
          className="h-auto min-h-10 max-w-full py-2 whitespace-normal"
          disabled={previousHref === null}
        >
          {previousHref === null ? (
            <>
              <ChevronLeft
                aria-hidden="true"
                data-icon="inline-start"
                className="rtl:rotate-180"
              />
              {previousLabel}
            </>
          ) : (
            <a href={previousHref} rel="prev">
              <ChevronLeft
                aria-hidden="true"
                data-icon="inline-start"
                className="rtl:rotate-180"
              />
              {previousLabel}
            </a>
          )}
        </Button>
        <Button
          asChild={nextHref !== null}
          variant="outline"
          className="h-auto min-h-10 max-w-full py-2 whitespace-normal"
          disabled={nextHref === null}
        >
          {nextHref === null ? (
            <>
              {nextLabel}
              <ChevronRight
                aria-hidden="true"
                data-icon="inline-end"
                className="rtl:rotate-180"
              />
            </>
          ) : (
            <a href={nextHref} rel="next">
              {nextLabel}
              <ChevronRight
                aria-hidden="true"
                data-icon="inline-end"
                className="rtl:rotate-180"
              />
            </a>
          )}
        </Button>
      </div>
    </nav>
  )
}

export { MacAddressPagination }
