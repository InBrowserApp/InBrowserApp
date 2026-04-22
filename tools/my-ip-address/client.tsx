import { useEffect, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Check, Copy, TriangleAlert } from "@workspace/ui/icons"

import {
  discoverWebRtcAddresses,
  lookupIpInfo,
  lookupPublicIp,
  type IpInfo,
} from "./core/my-ip"
import {
  AddressSummary,
  InfoList,
  StatusEmptyState,
} from "./components/address-card-parts"

type MyIpAddressLocaleMessages = Readonly<{
  webrtcLeak: string
  webrtcDescription: string
  unableToGetIp: string
  unableToGetIpDescription: string
  fetchingIp: string
  fetchingIpDescription: string
  copyIp: string
  copied: string
  ipv4Description: string
  ipv6Description: string
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
        <AddressCard
          title="IPv4"
          description={messages.ipv4Description}
          state={ipv4}
          messages={messages}
        />
        <AddressCard
          title="IPv6"
          description={messages.ipv6Description}
          state={ipv6}
          messages={messages}
        />
      </div>

      {webrtcAddresses.length > 0 ? (
        <Card className="gap-0">
          <CardHeader className="border-b">
            <CardTitle>{messages.webrtcLeak}</CardTitle>
            <CardDescription>{messages.webrtcDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4 md:grid-cols-2">
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
  description,
  state,
  messages,
}: Readonly<{
  title: string
  description: string
  state: AddressCardState
  messages: MyIpAddressMessages
}>) {
  const [copied, setCopied] = useState(false)
  const readyAddress = state.status === "ready" ? state.address : null

  useEffect(() => {
    setCopied(false)
  }, [readyAddress, state.status])

  async function handleCopy() {
    if (state.status !== "ready") {
      return
    }

    try {
      await navigator.clipboard.writeText(state.address)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Card className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {state.status === "ready" ? (
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleCopy()}
            >
              {copied ? (
                <Check data-icon="inline-start" />
              ) : (
                <Copy data-icon="inline-start" />
              )}
              {copied ? messages.copied : messages.copyIp}
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="pt-4">
        {state.status === "ready" ? (
          <div className="flex flex-col gap-4">
            <AddressSummary address={state.address} info={state.info} />
            <InfoList info={state.info} messages={messages} />
          </div>
        ) : state.status === "loading" ? (
          <StatusEmptyState
            description={messages.fetchingIpDescription}
            icon={<Spinner />}
            title={messages.fetchingIp}
          />
        ) : (
          <StatusEmptyState
            description={messages.unableToGetIpDescription}
            icon={<TriangleAlert />}
            title={messages.unableToGetIp}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default MyIpAddressClient
export type { MyIpAddressLocaleMessages }
