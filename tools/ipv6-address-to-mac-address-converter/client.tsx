import { useEffect, useId, useMemo, useState } from "react"

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

import { convertIpv6ToMac } from "./core/ipv6-to-mac"

type Ipv6ToMacMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  placeholder: string
  invalidAddress: string
  notConvertible: string
  copyLabel: string
  copiedLabel: string
}>

type Ipv6ToMacClientProps = Readonly<{
  messages: Ipv6ToMacMessages
}>

const DEFAULT_IPV6 = "fe80::a8bb:ccff:fedd:eeff"
const STORAGE_KEY = "tools:ipv6-address-to-mac-address-converter:ipv6"
const LEGACY_STORAGE_KEY = "tools:ipv6-to-mac:ipv6"

function Ipv6ToMacClient({ messages }: Ipv6ToMacClientProps) {
  const inputId = useId()
  const [ipv6, setIpv6] = useState(DEFAULT_IPV6)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedValue =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (storedValue !== null) {
      setIpv6(storedValue)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEY, ipv6)
  }, [ipv6])

  const result = useMemo(() => convertIpv6ToMac(ipv6), [ipv6])
  const displayValue =
    result.status === "success"
      ? result.mac
      : result.status === "not-convertible"
        ? messages.notConvertible
        : result.status === "invalid"
          ? messages.invalidAddress
          : ""

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>IPv6</CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={result.status === "invalid" || undefined}>
              <FieldContent>
                <FieldLabel htmlFor={inputId}>IPv6</FieldLabel>
                <Input
                  id={inputId}
                  name="ipv6"
                  autoComplete="off"
                  spellCheck={false}
                  value={ipv6}
                  aria-invalid={result.status === "invalid"}
                  placeholder={messages.placeholder}
                  className="h-11 font-mono text-base"
                  onChange={(event) => {
                    setIpv6(event.target.value)
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
          <CardTitle>{messages.meta.name}</CardTitle>
          <CardDescription>{messages.meta.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">MAC</p>
                <p className="mt-2 font-mono text-lg font-medium break-all">
                  {displayValue || "—"}
                </p>
              </div>

              <ToolCopyButton
                value={result.status === "success" ? result.mac : ""}
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

export default Ipv6ToMacClient
