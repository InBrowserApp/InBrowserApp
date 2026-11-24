import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"

import type { Plan } from "./core/plan"
import type english from "./messages/en.json"

type ResultMessages = Pick<
  typeof english,
  | "result"
  | "assigned"
  | "remaining"
  | "freeBlocks"
  | "mask"
  | "range"
  | "broadcast"
  | "usable"
  | "none"
  | "copy"
  | "copied"
>

export function PlanResults({
  plan,
  messages,
  language,
}: {
  plan: Plan
  messages: ResultMessages
  language: string
}) {
  const format = new Intl.NumberFormat(language)
  const rows = plan.allocations.map((allocation) => ({
    name: allocation.name,
    cidr: allocation.cidr,
    fields: [
      { key: "mask", label: messages.mask, value: allocation.mask },
      {
        key: "range",
        label: messages.range,
        value:
          allocation.first === allocation.last
            ? allocation.first
            : `${allocation.first} – ${allocation.last}`,
        className: "col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto",
      },
      {
        key: "broadcast",
        label: messages.broadcast,
        value: allocation.broadcast ?? "—",
      },
      {
        key: "usable",
        label: messages.usable,
        value: format.format(allocation.usable),
      },
    ],
  }))
  const clipboard = [
    `${messages.result} (${plan.parent})`,
    ...rows.map(({ name, cidr, fields }) =>
      [
        `${name} (${cidr})`,
        ...fields.map(({ label, value }) => `${label}: ${value}`),
      ].join("\n")
    ),
    `${messages.freeBlocks}: ${plan.freeBlocks.join(", ") || messages.none}`,
  ].join("\n\n")

  return (
    <Card>
      <CardContent className="grid min-w-0 gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">{messages.result}</h2>
            <bdi className="font-mono text-sm text-muted-foreground">
              {plan.parent}
            </bdi>
          </div>
          <ToolCopyButton
            value={clipboard}
            copyLabel={messages.copy}
            copiedLabel={messages.copied}
          />
        </div>
        <dl className="flex flex-wrap gap-x-8 gap-y-3 rounded-md bg-muted/45 p-3 text-sm">
          <div>
            <dt className="text-muted-foreground">{messages.assigned}</dt>
            <dd className="font-semibold tabular-nums">
              {format.format(plan.allocated)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{messages.remaining}</dt>
            <dd className="font-semibold tabular-nums">
              {format.format(plan.unallocated)}
            </dd>
          </div>
        </dl>
        <ol className="divide-y rounded-md border">
          {rows.map(({ name, cidr, fields }) => (
            <li key={cidr} className="grid gap-3 p-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-medium wrap-anywhere">{name}</span>
                <bdi className="font-mono text-sm text-muted-foreground">
                  {cidr}
                </bdi>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-[1fr_1.6fr_1fr_0.75fr]">
                {fields.map(({ key, label, value, className }) => (
                  <div key={key} className={className}>
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd>
                      <bdi className="font-mono wrap-anywhere">{value}</bdi>
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ol>
        <div className="grid gap-2 text-sm">
          <h3 className="font-medium">{messages.freeBlocks}</h3>
          {plan.freeBlocks.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {plan.freeBlocks.map((cidr) => (
                <li
                  key={cidr}
                  className="rounded-md bg-muted px-2 py-1"
                  dir="ltr"
                >
                  <code className="font-mono text-xs">{cidr}</code>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">{messages.none}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
