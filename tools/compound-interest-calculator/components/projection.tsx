import { Card, CardContent, CardHeader } from "@workspace/ui/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import { ChevronDown } from "@workspace/ui/icons"
import { useId } from "react"

import type { YearProjection } from "../core/compound-interest"
import type { CalculatorMessages } from "../types"

function Projection({
  lang,
  messages,
  rows,
  final,
  showBreakdown,
  onToggleBreakdown,
}: {
  lang: string
  messages: CalculatorMessages
  rows: YearProjection[]
  final: YearProjection
  showBreakdown: boolean
  onToggleBreakdown: (open: boolean) => void
}) {
  const id = useId()
  const amount = new Intl.NumberFormat(lang, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const scientific = new Intl.NumberFormat(lang, {
    notation: "scientific",
    maximumFractionDigits: 2,
  })
  const compact = new Intl.NumberFormat(lang, {
    notation: "compact",
    maximumFractionDigits: 1,
  })
  const integer = new Intl.NumberFormat(lang, { maximumFractionDigits: 0 })

  function format(value: number) {
    if (Math.abs(value) >= 1e15) return scientific.format(value)
    return amount.format(Math.abs(value) < 0.005 ? 0 : value)
  }

  const scale =
    Math.max(...rows.flatMap((row) => [row.balance, row.contributed])) || 1

  function tick(value: number) {
    if (value >= 1e15 || value < 0.01) return scientific.format(value)
    if (value < 1) return amount.format(value)
    return compact.format(value)
  }

  return (
    <Card>
      <CardHeader>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div className="col-span-2 flex flex-col gap-1">
            <dt className="text-sm font-medium text-muted-foreground">
              {messages.endingBalance}
            </dt>
            <dd
              className="font-heading text-3xl font-semibold tracking-tight break-all tabular-nums sm:text-4xl"
              aria-live="polite"
            >
              <bdi>{format(final.balance)}</bdi>
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-sm text-muted-foreground">
              {messages.totalContributed}
            </dt>
            <dd className="font-semibold break-all tabular-nums">
              <bdi>{format(final.contributed)}</bdi>
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-sm text-muted-foreground">
              {messages.interestEarned}
            </dt>
            <dd className="font-semibold break-all tabular-nums">
              <bdi>{format(final.interest)}</bdi>
            </dd>
          </div>
        </dl>
      </CardHeader>
      <CardContent className="flex min-w-0 flex-col gap-4">
        <section
          className="flex flex-col gap-3 border-t pt-4"
          aria-labelledby={id}
        >
          <h2 className="text-sm font-medium" id={id}>
            {messages.growth}
          </h2>
          <div
            aria-hidden="true"
            className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-xs bg-primary" />
              {messages.endingBalance}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-xs bg-muted-foreground" />
              {messages.totalContributed}
            </span>
          </div>
          <div
            dir="ltr"
            aria-hidden="true"
            className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 text-xs text-muted-foreground tabular-nums"
          >
            <div className="relative mb-5 grid h-32 grid-rows-[0_minmax(0,1fr)_0] items-center text-end">
              <bdi>{tick(scale)}</bdi>
              <bdi>{tick(scale / 2)}</bdi>
              <bdi>{integer.format(0)}</bdi>
            </div>
            <div className="relative flex h-32 items-end border-y bg-muted/20">
              <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t" />
              {rows.map(({ year, balance, contributed }) => (
                <div
                  key={year}
                  className="relative flex h-full min-w-0 flex-1 items-end justify-center"
                >
                  <div
                    className="w-[44%] max-w-3 rounded-t-xs bg-primary"
                    style={{ height: `${(balance / scale) * 100}%` }}
                  />
                  <div
                    className="w-[44%] max-w-3 rounded-t-xs bg-muted-foreground"
                    style={{ height: `${(contributed / scale) * 100}%` }}
                  />
                  {(year === 0 ||
                    year === final.year ||
                    (final.year >= 4 &&
                      year === Math.floor(final.year / 2))) && (
                    <span className="absolute top-full left-1/2 -translate-x-1/2 pt-1">
                      <bdi>{integer.format(year)}</bdi>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        <details
          className="group min-w-0 border-t"
          open={showBreakdown}
          onToggle={(event) => onToggleBreakdown(event.currentTarget.open)}
        >
          <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 rounded-sm pt-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
            {messages.breakdown}
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground group-open:rotate-180"
            />
          </summary>
          <Table className="tabular-nums">
            <TableCaption className="sr-only">
              {messages.breakdown}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col" className="text-start">
                  {messages.year}
                </TableHead>
                <TableHead scope="col" className="text-end whitespace-normal">
                  {messages.endingBalance}
                </TableHead>
                <TableHead scope="col" className="text-end whitespace-normal">
                  {messages.totalContributed}
                </TableHead>
                <TableHead scope="col" className="text-end whitespace-normal">
                  {messages.interestEarned}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ year, balance, contributed, interest }) => (
                <TableRow key={year}>
                  <TableHead scope="row" className="text-start">
                    {integer.format(year)}
                  </TableHead>
                  <TableCell className="text-end">
                    <bdi>{format(balance)}</bdi>
                  </TableCell>
                  <TableCell className="text-end">
                    <bdi>{format(contributed)}</bdi>
                  </TableCell>
                  <TableCell className="text-end">
                    <bdi>{format(interest)}</bdi>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </details>
      </CardContent>
    </Card>
  )
}

export { Projection }
