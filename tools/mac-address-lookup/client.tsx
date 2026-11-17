import { useDeferredValue, useId, useMemo, useState } from "react"
import {
  lookupMac,
  makeToolHref,
  parseMacInput,
  readQuery,
} from "@workspace/mac-address"
import { loadDatabase } from "@workspace/mac-address/load"
import { MacAddressDataStatus } from "@workspace/ui/components/tool/mac-address-data-status"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
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
  const invalid = blurred && query.q.trim() !== "" && !parseMacInput(query.q)

  function change(value: string) {
    setBlurred(false)
    update({ ...query, q: value, page: 1 })
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <Card className="min-w-0">
          <CardContent className="flex flex-col gap-4">
            <FieldGroup>
              <Field data-invalid={invalid}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <FieldLabel htmlFor={inputId}>
                    {messages.queryLabel}
                  </FieldLabel>
                  <ToolCopyButton
                    value={shareUrl}
                    copyLabel={messages.share}
                    copiedLabel={messages.copied}
                  />
                </div>
                <Input
                  id={inputId}
                  name="q"
                  dir="ltr"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-describedby={invalid ? hintId : undefined}
                  aria-invalid={invalid}
                  placeholder={messages.lookupPlaceholder}
                  value={query.q}
                  onChange={(event) => change(event.target.value)}
                  onBlur={() => setBlurred(true)}
                />
                {invalid ? (
                  <FieldDescription id={hintId}>
                    {messages.invalidAddress}
                  </FieldDescription>
                ) : null}
              </Field>
            </FieldGroup>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
              <span>{messages.examples}</span>
              {["00:1B:63:84:45:E6", "8C:1F:64:00:1"].map((example) => (
                <Button
                  key={example}
                  variant="link"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => change(example)}
                >
                  <span className="font-mono" dir="ltr" translate="no">
                    {example}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <LookupResult
          result={result}
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
      />
    </div>
  )
}

export default MacAddressLookupClient
