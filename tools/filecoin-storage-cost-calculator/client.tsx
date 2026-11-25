import { useEffect, useId, useRef, useState } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { ChevronDown, RefreshCcw } from "@workspace/ui/icons"

import {
  estimateCost,
  referenceRates,
  sizes,
  suggestedPieces,
  type SizeUnit,
} from "./core/cost"
import { fetchMainnetRates } from "./core/pricing"
import type EnglishMessages from "./messages/en.json"

const details = ["pieces", "batches"] as const
const planFields = ["days", "copies"] as const
const referenceDate = new Date("2026-11-25T00:00:00Z")

export default function StorageCostCalculator({
  language,
  messages,
}: {
  language: string
  messages: typeof EnglishMessages
}) {
  const id = useId()
  const active = useRef<AbortController | null>(null)
  const [plan, setPlan] = useState({
    size: "1",
    unit: "TiB" as SizeUnit,
    days: "30",
    copies: "2",
    pieces: "",
    batches: "1",
  })
  const [live, setLive] = useState<Awaited<
    ReturnType<typeof fetchMainnetRates>
  > | null>(null)
  const [status, setStatus] = useState<"refreshing" | "refreshFailed" | null>(
    null
  )
  const size = Number(plan.size)
  const suggested = suggestedPieces(size, plan.unit)
  const pieces = Number(plan.pieces || suggested)
  const batches = Number(plan.batches)
  const validPieces = Number.isSafeInteger(pieces) && pieces > 0
  const invalidPieces = plan.pieces !== "" && !validPieces
  const invalidBatches =
    !Number.isSafeInteger(batches) ||
    batches < 1 ||
    (validPieces && batches > pieces)
  const uploadError = invalidPieces || invalidBatches
  const estimate = estimateCost(
    {
      size,
      unit: plan.unit,
      days: Number(plan.days),
      copies: Number(plan.copies),
      pieces,
      batches,
    },
    live?.rates ?? referenceRates
  )
  const numbers = new Intl.NumberFormat(language, { maximumFractionDigits: 6 })
  const date = new Intl.DateTimeFormat(language, {
    dateStyle: "medium",
    timeZone: "UTC",
  })

  useEffect(() => () => active.current?.abort(), [])

  async function refresh() {
    if (active.current) return
    const controller = new AbortController()
    active.current = controller
    setStatus("refreshing")
    try {
      const prices = await fetchMainnetRates(
        AbortSignal.any([controller.signal, AbortSignal.timeout(8000)])
      )
      if (!controller.signal.aborted) {
        setLive(prices)
        setStatus(null)
      }
    } catch {
      if (!controller.signal.aborted) setStatus("refreshFailed")
    } finally {
      active.current = null
    }
  }

  function numberField(
    field: (typeof planFields)[number] | (typeof details)[number]
  ) {
    const fieldId = `${id}-${field}`
    const invalid =
      field === "pieces" ? invalidPieces : field === "batches" && invalidBatches
    const description = [
      field === "pieces" ? `${id}-auto-pieces` : null,
      invalid ? `${id}-batch-error` : null,
    ]
      .filter(Boolean)
      .join(" ")
    return (
      <Field key={field} data-invalid={invalid}>
        <FieldLabel htmlFor={fieldId}>{messages[field]}</FieldLabel>
        <Input
          id={fieldId}
          dir="ltr"
          min={field === "days" ? 0 : 1}
          step={field === "days" ? "any" : 1}
          type="number"
          value={plan[field]}
          placeholder={
            field === "pieces" &&
            Number.isSafeInteger(suggested) &&
            suggested > 0
              ? numbers.format(suggested)
              : undefined
          }
          aria-invalid={invalid}
          aria-describedby={description || undefined}
          onChange={(event) =>
            setPlan({ ...plan, [field]: event.target.value })
          }
        />
      </Field>
    )
  }

  const money = (value: number) => (
    <bdi dir="ltr" className="tabular-nums">
      {numbers.format(value)} USDFC
    </bdi>
  )
  return (
    <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
      <ToolPanelCard className="h-auto">
        <CardHeader>
          <CardTitle>{messages.plan}</CardTitle>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <Field>
            <FieldLabel htmlFor={`${id}-size`}>{messages.size}</FieldLabel>
            <div className="flex gap-2">
              <Input
                id={`${id}-size`}
                dir="ltr"
                min={0}
                step="any"
                type="number"
                value={plan.size}
                onChange={(event) =>
                  setPlan({ ...plan, size: event.target.value })
                }
              />
              <select
                dir="ltr"
                aria-label={messages.sizeUnit}
                className="h-9 shrink-0 rounded-md border border-input bg-background px-2.5 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                value={plan.unit}
                onChange={(event) =>
                  setPlan({ ...plan, unit: event.target.value as SizeUnit })
                }
              >
                {Object.keys(sizes).map((unit) => (
                  <option key={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </Field>
          <div className="grid grid-cols-2 items-end gap-3">
            {planFields.map(numberField)}
          </div>
          <details className="group rounded-lg border">
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-2 p-3 text-sm font-medium hover:bg-muted/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden"
              aria-labelledby={`${id}-upload-details`}
              aria-describedby={uploadError ? `${id}-batch-error` : undefined}
            >
              <span className="grid gap-1">
                <span id={`${id}-upload-details`}>
                  {messages.uploadDetails}
                </span>
                {uploadError && (
                  <span
                    id={`${id}-batch-error`}
                    role="alert"
                    className="text-xs font-normal text-destructive"
                  >
                    {messages.batchError}
                  </span>
                )}
              </span>
              <ChevronDown
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground group-open:rotate-180"
              />
            </summary>
            <div className="grid grid-cols-2 items-end gap-3 border-t p-3">
              {details.map(numberField)}
              <p
                id={`${id}-auto-pieces`}
                className="col-span-2 text-xs text-muted-foreground"
              >
                {messages.autoPieces}
              </p>
            </div>
          </details>
        </ToolPanelCardContent>
      </ToolPanelCard>
      <ToolPanelCard className="h-auto">
        <CardHeader>
          <CardTitle>{messages.result}</CardTitle>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          {estimate ? (
            <>
              <p
                className="text-2xl font-semibold wrap-anywhere sm:text-3xl"
                aria-live="polite"
              >
                {money(estimate.spending)}
              </p>
              <dl className="grid gap-2 text-sm">
                {(["monthly", "term", "operations"] as const).map((item) => (
                  <div
                    className="flex flex-wrap justify-between gap-x-3 gap-y-1"
                    key={item}
                  >
                    <dt className="text-muted-foreground">{messages[item]}</dt>
                    <dd>{money(estimate[item])}</dd>
                  </div>
                ))}
              </dl>
              <div className="grid gap-1 rounded-lg bg-muted/50 p-3 text-sm">
                <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
                  <p className="font-medium">{messages.reserve}</p>
                  <p>{money(estimate.reserve)}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {messages.reserveHelp}
                </p>
              </div>
            </>
          ) : (
            <p className="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
              {messages.empty}
            </p>
          )}
          <div className="grid gap-2 border-t pt-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="grid gap-1">
                <span className="font-medium">
                  {live ? messages.mainnet : messages.reference}
                </span>
                <span className="text-xs text-muted-foreground">
                  {live ? (
                    <>
                      {messages.block} <bdi>{numbers.format(live.block)}</bdi>
                    </>
                  ) : (
                    date.format(referenceDate)
                  )}
                </span>
              </p>
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={refresh}
                disabled={status === "refreshing"}
              >
                <RefreshCcw data-icon="inline-start" aria-hidden="true" />
                {messages.refresh}
              </Button>
            </div>
            <p
              role="status"
              className="text-xs text-muted-foreground empty:hidden"
            >
              {status && messages[status]}
            </p>
          </div>
        </ToolPanelCardContent>
      </ToolPanelCard>
    </div>
  )
}
