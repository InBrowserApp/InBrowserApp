import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { Separator } from "@workspace/ui/components/ui/separator"
import { Globe } from "@workspace/ui/icons"

import { buildMapUrl, formatIpCoordinates } from "../core/ip-info-lookup"

import type { AddressResult } from "../core/ip-info-lookup"
import type { IpInfoLookupMessages } from "../types"

function AddressCard({
  entry,
  messages,
}: Readonly<{
  entry: AddressResult
  messages: IpInfoLookupMessages
}>) {
  const mapUrl = buildMapUrl(entry.info)
  const rows = createInfoRows(entry, messages)

  return (
    <div className="overflow-hidden rounded-lg border border-border/70">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge variant="outline">
              {entry.version === "ipv4" ? messages.ipv4 : messages.ipv6}
            </Badge>
          </div>
          <p
            dir="ltr"
            className="font-mono text-xl font-semibold break-all [unicode-bidi:isolate]"
          >
            {entry.address}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ToolCopyButton
            value={entry.address}
            copyLabel={messages.copyAddress}
            copiedLabel={messages.copied}
          />
          {mapUrl ? (
            <Button asChild variant="outline" size="sm">
              <a href={mapUrl} target="_blank" rel="noreferrer">
                <Globe data-icon="inline-start" />
                {messages.openMap}
              </a>
            </Button>
          ) : null}
        </div>
      </div>
      <dl className="grid gap-0 sm:grid-cols-2">
        {rows.map((row, index) => (
          <InfoRow
            key={row.label}
            label={row.label}
            value={row.value}
            withSeparator={index < rows.length - 1}
            unavailable={messages.unavailable}
          />
        ))}
      </dl>
    </div>
  )
}

function createInfoRows(entry: AddressResult, messages: IpInfoLookupMessages) {
  const rows: Array<readonly [string, string | null]> = [
    [messages.hostname, entry.info.hostname],
    [messages.isp, entry.info.isp],
    [messages.organization, entry.info.organization],
    [messages.asn, entry.info.asn === null ? null : String(entry.info.asn)],
    [messages.asnOrganization, entry.info.asnOrganization],
    [messages.location, formatLocation(entry)],
    [messages.country, formatCountry(entry)],
    [messages.region, entry.info.region],
    [messages.city, entry.info.city],
    [messages.postalCode, entry.info.postalCode],
    [messages.timezone, entry.info.timezone],
    [messages.coordinates, formatIpCoordinates(entry.info)],
  ]

  return rows.map(([label, value]) => ({
    label,
    value: value === "" ? null : value,
  }))
}

function formatCountry(entry: AddressResult) {
  const { country, countryCode } = entry.info

  if (!country) {
    return countryCode
  }

  return countryCode ? `${country} (${countryCode})` : country
}

function formatLocation(entry: AddressResult) {
  return [entry.info.city, entry.info.region, entry.info.country]
    .filter(Boolean)
    .join(", ")
}

function InfoRow({
  label,
  value,
  withSeparator,
  unavailable,
}: Readonly<{
  label: string
  value: string | null
  withSeparator: boolean
  unavailable: string
}>) {
  return (
    <div className="min-w-0 p-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd
        dir="ltr"
        className={
          value === null
            ? "mt-1 text-sm text-muted-foreground"
            : "mt-1 text-sm break-words text-foreground [unicode-bidi:isolate]"
        }
      >
        {value ?? unavailable}
      </dd>
      {withSeparator ? <Separator className="mt-4 sm:hidden" /> : null}
    </div>
  )
}

export { AddressCard }
