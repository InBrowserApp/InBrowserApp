import { useId } from "react"

import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Search } from "@workspace/ui/icons"

import type { Report, SourceRecord } from "./core/report"
import { Field, ReportSummary } from "./report-summary"
import type english from "./messages/en.json"

type Messages = typeof english

const ALIGNMENT_STYLE = {
  pass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  fail: "bg-destructive/10 text-destructive",
  unknown: "bg-muted text-muted-foreground",
}
const AUTH_METHODS = ["dkim", "spf"] as const

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
        {AUTH_METHODS.map((method) => (
          <Field key={method} label={messages[`${method}Alignment`]}>
            <span
              className={`inline-block rounded-md px-1.5 py-0.5 text-xs font-medium ${ALIGNMENT_STYLE[record[method]]}`}
            >
              {messages[record[method]]}
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
            <div className="mt-2 space-y-1 text-xs wrap-anywhere">
              {record.auth.length > 0 && (
                <p className="font-medium">{messages.reason}</p>
              )}
              <ul className="space-y-1">
                {record.reasons.map((reason, index) => (
                  <li key={index}>
                    <bdi>{reason}</bdi>
                  </li>
                ))}
              </ul>
            </div>
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
  const visible = filter
    ? report.records.filter(
        (record) =>
          record.ip.toLowerCase().includes(filter) ||
          record.from.toLowerCase().includes(filter)
      )
    : report.records
  const count = messages.count
    .replace("{shown}", format.format(visible.length))
    .replace("{total}", format.format(report.records.length))

  return (
    <>
      <ReportSummary report={report} messages={messages} language={language} />
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
