import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import {
  buildGoogleMapsUrl,
  discoverWebRtcAddresses,
  formatIpCoordinates,
  lookupIpInfo,
  lookupPublicIp,
  type IpInfo,
} from "./core/my-ip"

type MyIpAddressLocaleMessages = Readonly<{
  webrtcLeak: string
  unableToGetIp: string
  hostname: string
  isp: string
  ipOrganization: string
  asn: string
  asnOrganization: string
  location: string
  country: string
  timezone: string
}>

type MyIpAddressMessages = MyIpAddressLocaleMessages &
  Readonly<{
    meta: {
      name: string
      description: string
    }
  }>

type AddressCardState =
  | Readonly<{
      status: "loading"
    }>
  | Readonly<{
      status: "error"
    }>
  | Readonly<{
      status: "ready"
      address: string
      info: IpInfo
    }>

type WebRtcAddressState = Readonly<{
  address: string
  info: IpInfo
}>

type MyIpAddressClientProps = Readonly<{
  messages: MyIpAddressMessages
}>

const LOADING_STATE: AddressCardState = { status: "loading" }

function MyIpAddressClient({ messages }: MyIpAddressClientProps) {
  const [ipv4, setIpv4] = useState<AddressCardState>(LOADING_STATE)
  const [ipv6, setIpv6] = useState<AddressCardState>(LOADING_STATE)
  const [webrtcAddresses, setWebrtcAddresses] = useState<
    readonly WebRtcAddressState[]
  >([])

  useEffect(() => {
    let active = true

    async function loadPublicAddress(
      version: "ipv4" | "ipv6",
      setState: (value: AddressCardState) => void
    ) {
      try {
        const address = await lookupPublicIp(version)
        const info = await lookupIpInfo(address)

        if (!active) {
          return
        }

        setState({
          status: "ready",
          address,
          info,
        })
      } catch {
        if (!active) {
          return
        }

        setState({ status: "error" })
      }
    }

    async function loadWebRtcAddresses() {
      try {
        const { getIPs } = await import("webrtc-ips")
        const addresses = await discoverWebRtcAddresses(getIPs)

        if (!active || addresses.length === 0) {
          return
        }

        const details = await Promise.all(
          addresses.map(async (address) => ({
            address,
            info: await lookupIpInfo(address),
          }))
        )

        if (!active) {
          return
        }

        setWebrtcAddresses(details)
      } catch {
        if (!active) {
          return
        }

        setWebrtcAddresses([])
      }
    }

    void Promise.all([
      loadPublicAddress("ipv4", setIpv4),
      loadPublicAddress("ipv6", setIpv6),
      loadWebRtcAddresses(),
    ])

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <AddressCard title="IPv4" state={ipv4} messages={messages} />
        <AddressCard title="IPv6" state={ipv6} messages={messages} />
      </div>

      {webrtcAddresses.length > 0 ? (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.webrtcLeak}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-4 md:grid-cols-2">
            {webrtcAddresses.map((entry) => (
              <div
                key={entry.address}
                className="rounded-lg border bg-background p-4"
              >
                <AddressSummary address={entry.address} info={entry.info} />
                <InfoList info={entry.info} messages={messages} />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function AddressCard({
  title,
  state,
  messages,
}: Readonly<{
  title: string
  state: AddressCardState
  messages: MyIpAddressMessages
}>) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {state.status === "ready" ? (
          <>
            <AddressSummary address={state.address} info={state.info} />
            <InfoList info={state.info} messages={messages} />
          </>
        ) : (
          <p className="font-mono text-lg text-muted-foreground">
            {state.status === "error" ? messages.unableToGetIp : "\u2014"}
          </p>
        )}
      </CardContent>
    </Card>
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
    <div className="space-y-2">
      <p className="font-mono text-2xl font-semibold tracking-tight break-all">
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
  messages: MyIpAddressMessages
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
            {value ?? "\u2014"}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default MyIpAddressClient
export type { MyIpAddressLocaleMessages }
