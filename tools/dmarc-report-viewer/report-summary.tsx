import type { ReactNode } from "react"

import { Card, CardContent } from "@workspace/ui/components/ui/card"

import type { Report } from "./core/report"
import type english from "./messages/en.json"

type Messages = typeof english

const OUTCOME_COLOR = {
  passed: "bg-emerald-500",
  failed: "bg-destructive",
  unknown: "bg-muted-foreground",
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm wrap-anywhere">{children}</dd>
    </div>
  )
}

function ReportSummary({
  report,
  messages,
  language,
}: {
  report: Report
  messages: Messages
  language: string
}) {
  const date = new Intl.DateTimeFormat(language, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  })
  const format = new Intl.NumberFormat(language)
  const { totals } = report
  const outcomes =
    totals.unknown > 0n
      ? (["passed", "failed", "unknown"] as const)
      : (["passed", "failed"] as const)
  const metrics = ["total", ...outcomes] as const

  return (
    <Card>
      <CardContent className="grid min-w-0 gap-4">
        <div className="grid gap-1">
          <h2 className="font-semibold">{messages.summary}</h2>
          <bdi
            dir="ltr"
            className="justify-self-start font-mono text-sm wrap-anywhere text-muted-foreground"
          >
            {report.domain}
          </bdi>
        </div>
        <dl
          className={`grid gap-3 ${metrics.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}
        >
          {metrics.map((metric) => (
            <div
              key={metric}
              className="flex min-w-0 flex-col justify-between gap-1 rounded-md bg-muted/50 p-3"
            >
              <dt className="text-xs text-muted-foreground">
                {messages[metric]}
              </dt>
              <dd className="text-lg font-semibold wrap-anywhere tabular-nums">
                {format.format(totals[metric])}
              </dd>
            </div>
          ))}
        </dl>
        {totals.total > 0n && (
          <div
            aria-hidden="true"
            className="flex h-2 overflow-hidden rounded-full bg-muted"
          >
            {outcomes.map((outcome) => (
              <span
                key={outcome}
                className={OUTCOME_COLOR[outcome]}
                style={{
                  width: `${Number((totals[outcome] * 10000n) / totals.total) / 100}%`,
                }}
              />
            ))}
          </div>
        )}
        <dl className="grid gap-3 sm:grid-cols-3">
          <Field label={messages.reporter}>{report.reporter || "—"}</Field>
          <Field label={messages.period}>
            {report.period
              ? date.formatRange(report.period.begin, report.period.end)
              : "—"}
          </Field>
          <Field label={messages.id}>
            <bdi>{report.id || "—"}</bdi>
          </Field>
        </dl>
        {report.policy.length > 0 && (
          <div className="grid gap-2">
            <h3 className="text-sm font-medium">{messages.policy}</h3>
            <ul className="flex flex-wrap gap-2">
              {report.policy.map(({ name, value }) => (
                <li
                  key={name}
                  className="max-w-full rounded-md bg-muted px-2 py-1"
                >
                  <code dir="ltr" className="text-xs wrap-anywhere">
                    {name}={value}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { Field, ReportSummary }
