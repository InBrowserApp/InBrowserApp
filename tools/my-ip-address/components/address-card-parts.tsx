import type { ReactNode } from "react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"

import {
  buildGoogleMapsUrl,
  formatIpCoordinates,
  type IpInfo,
} from "../core/my-ip"

type InfoListMessages = Readonly<{
  hostname: string
  isp: string
  ipOrganization: string
  asn: string
  asnOrganization: string
  location: string
  country: string
  timezone: string
}>

function StatusEmptyState({
  description,
  icon,
  title,
}: Readonly<{
  description: string
  icon: ReactNode
  title: string
}>) {
  return (
    <Empty className="min-h-56 px-0 py-2">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function AddressSummary({
  address,
  info,
}: Readonly<{
  address: string
  info: IpInfo
}>) {
  const mapsUrl = buildGoogleMapsUrl(info)
  const location = formatIpCoordinates(info)

  return (
    <div className="flex flex-col gap-1">
      <p className="font-mono text-xl font-semibold tracking-tight break-all sm:text-2xl">
        {address}
      </p>
      {location && mapsUrl ? (
        <a
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          href={mapsUrl}
          rel="noreferrer"
          target="_blank"
        >
          {location}
        </a>
      ) : null}
    </div>
  )
}

function InfoList({
  info,
  messages,
}: Readonly<{
  info: IpInfo
  messages: InfoListMessages
}>) {
  const location = formatIpCoordinates(info)
  const rows = [
    [messages.hostname, info.hostname],
    [messages.isp, info.isp],
    [messages.ipOrganization, info.organization],
    [messages.asn, info.asn === null ? null : String(info.asn)],
    [messages.asnOrganization, info.asnOrganization],
    [messages.location, location],
    [messages.country, info.country],
    [messages.timezone, info.timezone],
  ] as const

  return (
    <dl className="grid gap-3 border-t pt-4 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="text-sm break-words text-foreground">
            {value ?? "—"}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export { AddressSummary, InfoList, StatusEmptyState }
