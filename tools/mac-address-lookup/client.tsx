import { useDeferredValue, useId, useMemo, useState } from "react"
import { lookupMac, makeToolHref, readQuery } from "@workspace/mac-address"
import { loadDatabase } from "@workspace/mac-address/load"
import { MacAddressDataStatus } from "@workspace/ui/components/tool/mac-address-data-status"
import { MacAddressNavigation } from "@workspace/ui/components/tool/mac-address-navigation"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { useToolQuery } from "@workspace/ui/lib/use-tool-query"
import { useToolResource } from "@workspace/ui/lib/use-tool-resource"
import { LookupResult } from "./lookup-result"
import type EnglishMessages from "./messages/en.json"

type Props = Readonly<{ language: string; messages: typeof EnglishMessages }>

function MacAddressLookupClient({ language, messages }: Props) {
  const inputId = useId()
  const hintId = useId()
  const [blurred, setBlurred] = useState(false)
  const { query, update, shareUrl } = useToolQuery(readQuery, (next) =>
    makeToolHref(language, "mac-address-lookup", next)
  )
  const { data, loading, error, retry } = useToolResource(loadDatabase)
  const deferredQuery = useDeferredValue(query.q)
  const result = useMemo(
    () => lookupMac(data?.records ?? [], deferredQuery),
    [data, deferredQuery]
  )
  const organizations = useMemo(
    () =>
      data
        ? new Set(data.records.map((record) => record.organization)).size
        : 0,
    [data]
  )
  const invalid = blurred && query.q.trim() !== "" && result.parsed === null
  const number = new Intl.NumberFormat(language).format

  function change(value: string) {
    setBlurred(false)
    update({ ...query, q: value, page: 1 })
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <MacAddressNavigation
        active="lookup"
        items={[
          {
            key: "lookup",
            label: messages.lookup,
            href: makeToolHref(language, "mac-address-lookup", { q: query.q }),
          },
          {
            key: "blocks",
            label: messages.blocks,
            href: makeToolHref(language, "mac-address-block-lookup", {
              q: query.q,
            }),
          },
          {
            key: "vendors",
            label: messages.vendors,
            href: makeToolHref(language, "mac-address-vendor-lookup"),
          },
        ]}
      />
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>{messages.lookup}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <FieldGroup>
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={inputId}>{messages.queryLabel}</FieldLabel>
                <Input
                  id={inputId}
                  name="q"
                  dir="ltr"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-describedby={hintId}
                  aria-invalid={invalid}
                  placeholder={messages.lookupPlaceholder}
                  value={query.q}
                  onChange={(event) => change(event.target.value)}
                  onBlur={() => setBlurred(true)}
                />
                <FieldDescription id={hintId}>
                  {invalid ? messages.invalidAddress : messages.lookupHint}
                </FieldDescription>
              </Field>
            </FieldGroup>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                {messages.examples}
              </p>
              <div className="flex flex-wrap gap-2">
                {["00:1B:63:84:45:E6", "8C:1F:64", "02:00:00:12:34:56"].map(
                  (example) => (
                    <Button
                      key={example}
                      variant="outline"
                      size="sm"
                      onClick={() => change(example)}
                    >
                      <span className="font-mono" dir="ltr" translate="no">
                        {example}
                      </span>
                    </Button>
                  )
                )}
              </div>
            </div>
            <ToolCopyButton
              value={shareUrl}
              copyLabel={messages.share}
              copiedLabel={messages.copied}
            />
          </CardContent>
        </Card>
        <LookupResult
          result={result}
          hasQuery={query.q.trim() !== ""}
          ready={data !== null}
          language={language}
          messages={messages}
        />
      </div>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {result.parsed
          ? [
              messages.types[result.parsed.kind],
              ...result.matches.map((record) => record.organization),
            ].join(" · ")
          : ""}
      </p>
      <MacAddressDataStatus
        loading={loading}
        error={error}
        onRetry={retry}
        labels={messages}
        updatedLabel={
          data
            ? messages.updated.replace(
                "{date}",
                new Intl.DateTimeFormat(language, {
                  dateStyle: "medium",
                  timeZone: "UTC",
                }).format(new Date(data.updatedAt))
              )
            : undefined
        }
        summary={
          data
            ? messages.dataSummary
                .replace("{assignments}", number(data.records.length))
                .replace("{organizations}", number(organizations))
            : undefined
        }
      />
    </div>
  )
}

export default MacAddressLookupClient
