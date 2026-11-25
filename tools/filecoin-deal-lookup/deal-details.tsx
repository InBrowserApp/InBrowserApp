import { useId } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Link2 } from "@workspace/ui/icons"

import type { Deal } from "./core/deal"
import type EnglishMessages from "./messages/en.json"

export function DealExplorerLink({ id, label }: { id: number; label: string }) {
  return (
    <Button asChild size="sm" variant="outline">
      <a
        href={`https://filfox.info/en/deal/${id}`}
        target="_blank"
        rel="noreferrer"
      >
        <Link2 data-icon="inline-start" aria-hidden="true" />
        {label}
      </a>
    </Button>
  )
}

export default function DealDetails({
  deal,
  language,
  messages,
}: {
  deal: Deal
  language: string
  messages: typeof EnglishMessages
}) {
  const heading = useId()
  const number = new Intl.NumberFormat(language, { maximumFractionDigits: 3 })
  const date = new Intl.DateTimeFormat(language, {
    dateStyle: "medium",
    timeZone: "UTC",
  })
  const time = new Intl.DateTimeFormat(language, {
    timeStyle: "short",
    timeZone: "UTC",
    hourCycle: "h23",
  })
  const unit = [
    [2 ** 40, "TiB"],
    [2 ** 30, "GiB"],
    [2 ** 20, "MiB"],
    [2 ** 10, "KiB"],
    [1, "B"],
  ] as const
  const [divisor, suffix] =
    unit.find(([bytes]) => deal.size >= bytes) ?? unit[4]
  const fields = [
    ["provider", deal.provider],
    ["client", deal.client],
    ["pieceSize", `${number.format(deal.size / divisor)} ${suffix}`],
    ["verified", deal.verified ? messages.yes : messages.no],
  ] as const
  const dates = [
    ["starts", deal.startsAt, deal.start],
    ["ends", deal.endsAt, deal.end],
  ] as const

  return (
    <ToolPanelCard role="region" aria-labelledby={heading}>
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle>
          <h2 id={heading}>
            {messages.details} <bdi dir="ltr">#{deal.id}</bdi>
          </h2>
        </CardTitle>
        <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
          {messages[deal.status]}
        </span>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <dl className="grid grid-cols-2 gap-2">
          {dates.map(([key, seconds, epoch]) => {
            const timestamp = new Date(seconds * 1000)
            return (
              <div
                key={key}
                className="grid min-w-0 gap-1 rounded-lg border p-3"
              >
                <dt className="text-xs text-muted-foreground">
                  {messages[key]}
                </dt>
                <dd className="grid gap-1 text-sm font-medium wrap-anywhere">
                  <time
                    dateTime={timestamp.toISOString()}
                    className="flex flex-wrap items-baseline gap-x-1"
                  >
                    <span>{date.format(timestamp)}</span>
                    <bdi dir="ltr" className="whitespace-nowrap">
                      {time.format(timestamp)} UTC
                    </bdi>
                  </time>
                  <span className="text-xs font-normal text-muted-foreground">
                    {messages.epoch} <bdi>{number.format(epoch)}</bdi>
                  </span>
                </dd>
              </div>
            )
          })}
        </dl>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {fields.map(([key, value]) => (
            <div key={key} className="grid min-w-0 content-start gap-1">
              <dt className="text-xs text-muted-foreground">{messages[key]}</dt>
              <dd className="text-sm wrap-anywhere">
                <bdi>{value}</bdi>
              </dd>
            </div>
          ))}
        </dl>
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">{messages.pieceCid}</p>
            <ToolCopyButton
              value={deal.cid}
              copyLabel={messages.copy}
              copiedLabel={messages.copied}
              ariaLabel={`${messages.copy} · ${messages.pieceCid}`}
            />
          </div>
          <code
            dir="ltr"
            className="rounded-lg bg-muted p-2.5 text-sm wrap-anywhere"
          >
            {deal.cid}
          </code>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <p className="text-xs text-muted-foreground">
            {deal.epoch === undefined ? (
              messages.archive
            ) : (
              <>
                {messages.mainnet} · {messages.epoch}{" "}
                <bdi>{number.format(deal.epoch)}</bdi>
              </>
            )}
          </p>
          <DealExplorerLink id={deal.id} label={messages.explorer} />
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
