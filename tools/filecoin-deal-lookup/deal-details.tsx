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
    timeStyle: "short",
    timeZone: "UTC",
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
  const fields = {
    provider: deal.provider,
    client: deal.client,
    pieceSize: `${number.format(deal.size / divisor)} ${suffix}`,
    verified: deal.verified ? messages.yes : messages.no,
  }
  const dates = {
    starts: { seconds: deal.startsAt, epoch: deal.start },
    ends: { seconds: deal.endsAt, epoch: deal.end },
  }

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
          {(["starts", "ends"] as const).map((key) => (
            <div key={key} className="grid min-w-0 gap-1 rounded-lg border p-3">
              <dt className="text-xs text-muted-foreground">{messages[key]}</dt>
              <dd className="grid gap-1 text-sm font-medium wrap-anywhere">
                <span>
                  {date.format(dates[key].seconds * 1000)} <bdi>UTC</bdi>
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {messages.epoch} <bdi>{number.format(dates[key].epoch)}</bdi>
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["provider", "client", "pieceSize", "verified"] as const).map(
            (key) => (
              <div key={key} className="grid min-w-0 content-start gap-1">
                <dt className="text-xs text-muted-foreground">
                  {messages[key]}
                </dt>
                <dd className="text-sm wrap-anywhere">
                  <bdi>{fields[key]}</bdi>
                </dd>
              </div>
            )
          )}
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
          <Button asChild size="sm" variant="outline">
            <a
              href={`https://filfox.info/en/deal/${deal.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <Link2 data-icon="inline-start" aria-hidden="true" />
              {messages.explorer}
            </a>
          </Button>
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
