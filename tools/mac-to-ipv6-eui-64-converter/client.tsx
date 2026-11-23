import { useId, useState } from "react"

import { macToModifiedEui64 } from "@workspace/mac-address"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import { combineIpv6Address, parseIpv6Prefix } from "./core/ipv6-prefix"

type Messages = typeof import("./messages/en.json")

const EXAMPLE_MAC = "00:11:22:33:44:55"
const EXAMPLE_PREFIX = "2001:db8:1:2::/64"

function MacToIpv6Client({ messages }: Readonly<{ messages: Messages }>) {
  const id = useId()
  const macId = `${id}-mac`
  const prefixId = `${id}-prefix`
  const resultId = `${id}-result`
  const [mac, setMac] = useState("")
  const [prefix, setPrefix] = useState("")
  const [macVisited, setMacVisited] = useState(false)
  const [prefixVisited, setPrefixVisited] = useState(false)

  const interfaceId = macToModifiedEui64(mac)
  const subnet = parseIpv6Prefix(prefix)
  const invalidMac = macVisited && mac.trim() !== "" && interfaceId === null
  const invalidPrefix = prefixVisited && subnet.status === "invalid"
  const result =
    interfaceId !== null && subnet.status === "valid"
      ? combineIpv6Address(subnet.network, interfaceId)
      : ""

  return (
    <Card>
      <CardContent className="grid min-w-0 gap-5">
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <Field data-invalid={invalidMac || undefined}>
            <FieldLabel htmlFor={macId}>{messages.macLabel}</FieldLabel>
            <Input
              id={macId}
              name="mac"
              dir="ltr"
              className="font-mono"
              autoComplete="off"
              spellCheck={false}
              placeholder={EXAMPLE_MAC}
              value={mac}
              aria-invalid={invalidMac}
              aria-describedby={invalidMac ? `${macId}-error` : undefined}
              onChange={(event) => setMac(event.target.value)}
              onBlur={() => setMacVisited(true)}
            />
            {invalidMac && (
              <FieldError id={`${macId}-error`}>
                {messages.invalidMac}
              </FieldError>
            )}
          </Field>
          <Field data-invalid={invalidPrefix || undefined}>
            <FieldLabel htmlFor={prefixId}>{messages.prefixLabel}</FieldLabel>
            <Input
              id={prefixId}
              name="prefix"
              dir="ltr"
              className="font-mono"
              autoComplete="off"
              spellCheck={false}
              placeholder={EXAMPLE_PREFIX}
              value={prefix}
              aria-invalid={invalidPrefix}
              aria-describedby={invalidPrefix ? `${prefixId}-error` : undefined}
              onChange={(event) => setPrefix(event.target.value)}
              onBlur={() => setPrefixVisited(true)}
            />
            {invalidPrefix && (
              <FieldError id={`${prefixId}-error`}>
                {messages.invalidPrefix}
              </FieldError>
            )}
          </Field>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => {
            setMac(EXAMPLE_MAC)
            setPrefix(EXAMPLE_PREFIX)
          }}
        >
          {messages.exampleLabel}
        </Button>
        <div className="grid min-w-0 gap-2 rounded-lg border bg-muted/40 p-4">
          <p id={resultId} className="text-sm font-medium">
            {messages.resultLabel}
          </p>
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <output
              aria-labelledby={resultId}
              htmlFor={`${macId} ${prefixId}`}
              dir="ltr"
              className="min-w-0 font-mono text-base [overflow-wrap:anywhere]"
            >
              {result || "—"}
            </output>
            <ToolCopyButton
              key={result}
              value={result}
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
              failedLabel={messages.copyFailedLabel}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MacToIpv6Client
export type { Messages }
