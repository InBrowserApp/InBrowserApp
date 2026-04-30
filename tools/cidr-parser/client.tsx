import { useEffect, useId, useMemo, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import { DetailsCard } from "./components/details-card"
import { InputCard } from "./components/input-card"
import { ResultPlaceholderCard } from "./components/result-placeholder-card"
import { parseCidr } from "./core/cidr"

import type { CidrParserClientProps, DetailItem } from "./types"

const STORAGE_KEY = "tools:cidr-parser:input"

type OverviewItem = Readonly<{
  label: string
  value: string
  direction?: "ltr"
}>

function CidrParserClient({ language, messages }: CidrParserClientProps) {
  const inputId = useId()
  const [value, setValue] = useState("")

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)

    if (stored !== null) {
      setValue(stored)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, value)
  }, [value])

  const result = useMemo(() => parseCidr(value), [value])

  if (result.status !== "success") {
    return (
      <div className="grid gap-6">
        <InputCard
          inputId={inputId}
          value={value}
          messages={messages}
          onChange={setValue}
        />
        <ResultPlaceholderCard status={result.status} messages={messages} />
      </div>
    )
  }

  const { details } = result
  const familyLabel =
    details.family === 4 ? messages.ipv4Label : messages.ipv6Label
  const overviewItems: readonly OverviewItem[] = [
    {
      label: messages.familyLabel,
      value: familyLabel,
    },
    {
      label: messages.originalAddressLabel,
      value: details.inputAddress,
      direction: "ltr",
    },
    {
      label: messages.totalAddressesLabel,
      value: formatAddressCount(
        details.addressCount,
        details.hostBits,
        language
      ),
      direction: "ltr",
    },
    {
      label: messages.usableAddressesLabel,
      value: formatAddressCount(
        details.usableAddressCount,
        details.usableAddressCount === details.addressCount
          ? details.hostBits
          : null,
        language
      ),
      direction: "ltr",
    },
    {
      label: messages.hostBitsLabel,
      value: new Intl.NumberFormat(language).format(details.hostBits),
      direction: "ltr",
    },
  ]
  const rangeItems: readonly DetailItem[] = [
    {
      label: messages.networkAddressLabel,
      value: details.networkAddress,
      copyValue: details.networkAddress,
    },
    {
      label: messages.rangeEndLabel,
      value: details.rangeEnd,
      copyValue: details.rangeEnd,
    },
    {
      label: messages.firstUsableLabel,
      value: details.firstUsable,
      copyValue: details.firstUsable,
    },
    {
      label: messages.lastUsableLabel,
      value: details.lastUsable,
      copyValue: details.lastUsable,
    },
    {
      label: messages.broadcastAddressLabel,
      value: details.broadcastAddress ?? messages.notApplicableLabel,
      copyValue: details.broadcastAddress,
    },
  ]
  const routingItems: readonly DetailItem[] = [
    {
      label: messages.canonicalLabel,
      value: details.canonicalCidr,
      copyValue: details.canonicalCidr,
    },
    {
      label: messages.prefixLabel,
      value: `/${details.prefix}`,
      copyValue: String(details.prefix),
    },
    {
      label: messages.netmaskLabel,
      value: details.netmask ?? messages.notApplicableLabel,
      copyValue: details.netmask,
    },
    {
      label: messages.wildcardMaskLabel,
      value: details.wildcardMask ?? messages.notApplicableLabel,
      copyValue: details.wildcardMask,
    },
    {
      label: messages.startIntegerLabel,
      value: details.startInteger,
      copyValue: details.startInteger,
    },
    {
      label: messages.endIntegerLabel,
      value: details.endInteger,
      copyValue: details.endInteger,
    },
  ]

  return (
    <div className="grid gap-6">
      <InputCard
        inputId={inputId}
        value={value}
        messages={messages}
        onChange={setValue}
      />

      <Card className="overflow-hidden border-border/70 shadow-sm">
        <CardHeader className="border-b">
          <div className="grid gap-1">
            <CardTitle>{messages.resultTitle}</CardTitle>
            <CardDescription>{messages.resultDescription}</CardDescription>
          </div>
          <CardAction>
            <ToolCopyButton
              value={details.canonicalCidr}
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
            />
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-5 py-5">
          <div className="flex flex-wrap gap-2">
            <Badge>{familyLabel}</Badge>
            <Badge variant="secondary" dir="ltr">
              {`/${details.prefix}`}
            </Badge>
            <Badge variant="outline">
              <span>{`${messages.rangeStartLabel}:`}</span>
              <span dir="ltr" className="font-mono [unicode-bidi:isolate]">
                {details.rangeStart}
              </span>
            </Badge>
          </div>

          <div className="grid gap-2">
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground/80 uppercase">
              {messages.overviewTitle}
            </p>
            <p
              dir="ltr"
              className="font-mono text-2xl leading-tight font-semibold tracking-tight break-all text-foreground [unicode-bidi:isolate] sm:text-3xl"
            >
              {details.canonicalCidr}
            </p>
            <p className="text-sm text-muted-foreground">
              {messages.overviewDescription}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {overviewItems.map((item) => (
              <div
                key={item.label}
                className="min-w-0 rounded-xl border border-border/70 bg-card p-4 shadow-xs"
              >
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p
                  dir={item.direction}
                  className="mt-2 font-mono text-sm leading-relaxed break-words text-foreground [unicode-bidi:isolate]"
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <DetailsCard
          title={messages.rangeTitle}
          description={messages.rangeDescription}
          items={rangeItems}
          messages={messages}
        />
        <DetailsCard
          title={messages.routingTitle}
          description={messages.routingDescription}
          items={routingItems}
          messages={messages}
        />
      </div>
    </div>
  )
}

function formatAddressCount(
  value: bigint,
  hostBits: number | null,
  language: string
) {
  const formatted = new Intl.NumberFormat(language).format(value)

  if (hostBits === null) {
    return formatted
  }

  return `${formatted} (2^${hostBits})`
}

export default CidrParserClient
