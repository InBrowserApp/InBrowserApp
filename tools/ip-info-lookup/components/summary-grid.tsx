import { Badge } from "@workspace/ui/components/ui/badge"

import type { LookupResult } from "../core/ip-info-lookup"
import type { IpInfoLookupMessages } from "../types"

function SummaryGrid({
  result,
  messages,
}: Readonly<{
  result: LookupResult
  messages: IpInfoLookupMessages
}>) {
  const isDomainResult = result.target.kind === "domain"
  const formattedAddressCount = new Intl.NumberFormat().format(
    result.addresses.length
  )

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <Badge>
          {result.target.kind === "ip"
            ? messages.ipTarget
            : messages.domainTarget}
        </Badge>
        {isDomainResult ? (
          <Badge variant="secondary">
            {messages.addressCount}: {formattedAddressCount}
          </Badge>
        ) : null}
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <SummaryItem label={messages.target} value={result.target.input} />
        <SummaryItem
          label={messages.normalizedTarget}
          value={result.target.normalized}
        />
        {isDomainResult ? (
          <>
            <SummaryItem label={messages.resolver} value={result.resolverUrl} />
            <SummaryItem
              label={messages.addressCount}
              value={formattedAddressCount}
            />
          </>
        ) : null}
      </dl>
    </div>
  )
}

function SummaryItem({
  label,
  value,
}: Readonly<{
  label: string
  value: string
}>) {
  return (
    <div className="min-w-0 rounded-lg border border-border/70 bg-card p-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd
        dir="ltr"
        className="mt-1 font-mono text-sm break-all [unicode-bidi:isolate]"
      >
        {value}
      </dd>
    </div>
  )
}

export { SummaryGrid }
