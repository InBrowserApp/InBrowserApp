import { useEffect, useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { TriangleAlert } from "@workspace/ui/icons"

import { convertMacToIpv6LinkLocal } from "./core/mac-to-ipv6-link-local"

type MacToIpv6LinkLocalMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  macLabel: string
  macPlaceholder: string
  networkInterfaceLabel: string
  networkInterfacePlaceholder: string
  invalidAddress: string
  resultLabel: string
  copyLabel: string
  copiedLabel: string
}>

type MacToIpv6LinkLocalClientProps = Readonly<{
  messages: MacToIpv6LinkLocalMessages
}>

const DEFAULT_MAC = "aa:bb:cc:dd:ee:ff"
const MAC_STORAGE_KEY =
  "tools:mac-address-to-ipv6-link-local-address-converter:mac"
const NETWORK_INTERFACE_STORAGE_KEY =
  "tools:mac-address-to-ipv6-link-local-address-converter:network-interface"
const LEGACY_MAC_STORAGE_KEY = "tools:mac-to-ipv6-link-local:mac"
const LEGACY_NETWORK_INTERFACE_STORAGE_KEY =
  "tools:mac-to-ipv6-link-local:network-interface"

function MacToIpv6LinkLocalClient({ messages }: MacToIpv6LinkLocalClientProps) {
  const macInputId = useId()
  const networkInterfaceInputId = useId()
  const [mac, setMac] = useState(DEFAULT_MAC)
  const [networkInterface, setNetworkInterface] = useState("")

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedMac =
      window.localStorage.getItem(MAC_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_MAC_STORAGE_KEY)
    if (storedMac !== null) {
      setMac(storedMac)
    }

    const storedNetworkInterface =
      window.localStorage.getItem(NETWORK_INTERFACE_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_NETWORK_INTERFACE_STORAGE_KEY)
    if (storedNetworkInterface !== null) {
      setNetworkInterface(storedNetworkInterface)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(MAC_STORAGE_KEY, mac)
  }, [mac])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(NETWORK_INTERFACE_STORAGE_KEY, networkInterface)
  }, [networkInterface])

  const result = convertMacToIpv6LinkLocal(mac, networkInterface)
  const displayValue = result.status === "success" ? result.ipv6 : ""

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.macLabel}</CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={result.status === "invalid" || undefined}>
              <FieldContent>
                <FieldLabel htmlFor={macInputId}>
                  {messages.macLabel}
                </FieldLabel>
                <Input
                  id={macInputId}
                  name="mac"
                  autoComplete="off"
                  spellCheck={false}
                  value={mac}
                  aria-invalid={result.status === "invalid"}
                  placeholder={messages.macPlaceholder}
                  className="h-11 font-mono text-base"
                  onChange={(event) => {
                    setMac(event.target.value)
                  }}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldLabel htmlFor={networkInterfaceInputId}>
                  {messages.networkInterfaceLabel}
                </FieldLabel>
                <Input
                  id={networkInterfaceInputId}
                  name="network-interface"
                  autoComplete="off"
                  spellCheck={false}
                  value={networkInterface}
                  placeholder={messages.networkInterfacePlaceholder}
                  className="h-11 font-mono text-base"
                  onChange={(event) => {
                    setNetworkInterface(event.target.value)
                  }}
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          {result.status === "invalid" ? (
            <div aria-live="polite">
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>{messages.invalidAddress}</AlertTitle>
                <AlertDescription>{messages.invalidAddress}</AlertDescription>
              </Alert>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.resultLabel}</CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">
                  {messages.resultLabel}
                </p>
                <p className="mt-2 font-mono text-lg font-medium break-all">
                  {displayValue || "—"}
                </p>
              </div>

              <ToolCopyButton
                value={result.status === "success" ? result.ipv6 : ""}
                copyLabel={messages.copyLabel}
                copiedLabel={messages.copiedLabel}
                disabled={result.status !== "success"}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MacToIpv6LinkLocalClient
