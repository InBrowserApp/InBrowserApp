import { useId } from "react"
import type { ReactNode } from "react"

import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Search } from "@workspace/ui/icons"

import type { Report, SourceRecord } from "./core/report"
import type english from "./messages/en.json"

type Messages = typeof english

const ALIGNMENT_STYLE = {
  pass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  fail: "bg-destructive/10 text-destructive",
  unknown: "bg-muted text-muted-foreground",
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm wrap-anywhere">{children}</dd>
    </div>
  )
}

function Summary({
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
  const metrics = [
    { label: messages.total, value: totals.total },
    { label: messages.passed, value: totals.passed, color: "bg-emerald-500" },
    { label: messages.failed, value: totals.failed, color: "bg-destructive" },
    ...(totals.unknown > 0n
      ? [
          {
            label: messages.unknown,
            value: totals.unknown,
            color: "bg-muted-foreground",
          },
        ]
      : []),
  ]

  return (
    <Card>
      <CardContent className="grid min-w-0 gap-4">
        <div className="grid gap-1">
          <h2 className="font-semibold">{messages.summary}</h2>
          <bdi
            dir="ltr"
            className="font-mono text-sm wrap-anywhere text-muted-foreground"
          >
            {report.domain}
          </bdi>
        </div>
        <dl
          className={`grid gap-3 ${totals.unknown > 0n ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}
        >
          {metrics.map(({ label, value }) => (
            <div key={label} className="min-w-0 rounded-md bg-muted/50 p-3">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-lg font-semibold wrap-anywhere tabular-nums">
                {format.format(value)}
              </dd>
            </div>
          ))}
        </dl>
        {totals.total > 0n && (
          <div
            aria-hidden="true"
            className="flex h-2 overflow-hidden rounded-full bg-muted"
          >
            {metrics.slice(1).map(({ label, value, color }) => (
              <span
                key={label}
                className={color}
                style={{
                  width: `${Number((value * 10000n) / totals.total) / 100}%`,
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

function RecordRow({
  record,
  messages,
  format,
}: {
  record: SourceRecord
  messages: Messages
  format: Intl.NumberFormat
}) {
  const rawDisposition = record.disposition.toLowerCase()
  const disposition =
    rawDisposition === "none" ||
    rawDisposition === "pass" ||
    rawDisposition === "quarantine" ||
    rawDisposition === "reject"
      ? messages[rawDisposition]
      : record.disposition || messages.unknown
  const auth = [
    { label: messages.dkimAlignment, status: record.dkim },
    { label: messages.spfAlignment, status: record.spf },
  ]
  return (
    <li className="grid min-w-0 gap-3 p-3">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(3,minmax(0,1fr))] xl:grid-cols-[1.1fr_0.8fr_1.2fr_1fr_1fr_1fr]">
        <Field label={messages.source}>
          <bdi dir="ltr" className="font-mono font-medium">
            {record.ip}
          </bdi>
        </Field>
        <Field label={messages.messages}>
          <bdi className="font-medium tabular-nums">
            {format.format(record.count)}
          </bdi>
        </Field>
        <Field label={messages.from}>
          <bdi dir="ltr" className="font-mono">
            {record.from || "—"}
          </bdi>
        </Field>
        {auth.map(({ label, status }) => (
          <Field key={label} label={label}>
            <span
              className={`inline-block rounded-md px-1.5 py-0.5 text-xs font-medium ${ALIGNMENT_STYLE[status]}`}
            >
              {messages[status]}
            </span>
          </Field>
        ))}
        <Field label={messages.disposition}>{disposition}</Field>
      </dl>
      {(record.auth.length > 0 || record.reasons.length > 0) && (
        <details className="rounded-md bg-muted/45 px-3 py-2 text-sm">
          <summary className="cursor-pointer font-medium">
            {record.auth.length ? messages.rawAuth : messages.reason}
          </summary>
          {record.auth.length > 0 && (
            <ul className="mt-2 grid gap-2">
              {record.auth.map(
                ({ kind, domain, result, selector, scope }, index) => (
                  <li
                    key={index}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs wrap-anywhere"
                  >
                    <strong>{kind.toUpperCase()}</strong>
                    <bdi dir="ltr" className="font-mono">
                      {domain || "—"}
                    </bdi>
                    <code>{result || "—"}</code>
                    {selector && (
                      <span>
                        {messages.selector}{" "}
                        <bdi className="font-mono">{selector}</bdi>
                      </span>
                    )}
                    {scope && (
                      <span>
                        {messages.scope}{" "}
                        <bdi className="font-mono">{scope}</bdi>
                      </span>
                    )}
                  </li>
                )
              )}
            </ul>
          )}
          {record.reasons.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs wrap-anywhere">
              {record.reasons.map((reason, index) => (
                <li key={index}>
                  <bdi>{reason}</bdi>
                </li>
              ))}
            </ul>
          )}
        </details>
      )}
    </li>
  )
}

function ReportView({
  report,
  messages,
  language,
  query,
  onQueryChange,
}: {
  report: Report
  messages: Messages
  language: string
  query: string
  onQueryChange: (query: string) => void
}) {
  const id = useId()
  const format = new Intl.NumberFormat(language)
  const filter = query.trim().toLowerCase()
  const visible = report.records.filter(
    (record) =>
      record.ip.toLowerCase().includes(filter) ||
      record.from.toLowerCase().includes(filter)
  )
  const count = messages.count
    .replace("{shown}", format.format(visible.length))
    .replace("{total}", format.format(report.records.length))

  return (
    <>
      <Summary report={report} messages={messages} language={language} />
      <Card>
        <CardContent className="grid min-w-0 gap-4">
          <div>
            <h2 className="font-semibold">{messages.records}</h2>
            <p className="text-sm text-muted-foreground">{count}</p>
          </div>
          {report.records.length > 0 && (
            <div className="grid max-w-sm gap-1.5">
              <label htmlFor={id} className="text-sm font-medium">
                {messages.filter}
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute start-2.5 top-2 size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id={id}
                  className="ps-8"
                  placeholder="192.0.2.55"
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                />
              </div>
            </div>
          )}
          {visible.length > 0 ? (
            <ol className="divide-y rounded-md border">
              {visible.map((record) => (
                <RecordRow
                  key={record.index}
                  record={record}
                  messages={messages}
                  format={format}
                />
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">
              {report.records.length ? messages.noMatches : messages.noRecords}
            </p>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export { ReportView }
