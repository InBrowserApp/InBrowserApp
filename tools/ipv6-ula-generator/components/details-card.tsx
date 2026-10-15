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
} from "@workspace/ui/components/ui/card"
import { Lock, Network } from "@workspace/ui/icons"

import {
  ULA_GLOBAL_ID_BITS,
  ULA_INTERFACE_ID_BITS,
  ULA_SUBNET_ID_BITS,
} from "../core/ipv6-ula"

import type { Ipv6UlaPrefix } from "../core/ipv6-ula"
import type { Ipv6UlaMessages } from "../types"

type DetailsCardProps = Readonly<{
  messages: Ipv6UlaMessages
  prefix: Ipv6UlaPrefix | null
  formattedSubnetCount: string
}>

type DetailRowProps = Readonly<{
  label: string
  value: string
  direction?: "ltr"
}>

function DetailRow({ label, value, direction }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        dir={direction}
        className="text-end font-medium break-words [unicode-bidi:isolate]"
      >
        {value}
      </dd>
    </div>
  )
}

function bitLabel(messages: Ipv6UlaMessages, count: number) {
  return messages.bitsLabel.replace("{count}", String(count))
}

function DetailsCard({
  messages,
  prefix,
  formattedSubnetCount,
}: DetailsCardProps) {
  const globalId = prefix?.globalId ?? ""

  return (
    <Card>
      <CardHeader className="border-b">
        <h2
          data-slot="card-title"
          className="font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm"
        >
          {messages.detailsTitle}
        </h2>
        <CardDescription>{messages.detailsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <dl className="grid gap-3 text-sm">
          <div className="flex items-start justify-between gap-4">
            <dt className="text-muted-foreground">{messages.globalIdLabel}</dt>
            <dd className="flex min-w-0 items-center gap-2">
              <span
                dir="ltr"
                className="font-mono font-medium break-all [unicode-bidi:isolate]"
              >
                {globalId || "—"}
              </span>
              <ToolCopyButton
                value={globalId}
                copyLabel={messages.copyGlobalIdLabel}
                copiedLabel={messages.copiedLabel}
                variant="ghost"
                disabled={globalId.length === 0}
              />
            </dd>
          </div>
          <DetailRow
            label={messages.ulaSpaceLabel}
            value={messages.ulaSpaceValue}
            direction="ltr"
          />
          <DetailRow
            label={messages.localBitLabel}
            value={messages.localBitValue}
          />
          <DetailRow
            label={messages.prefixLengthLabel}
            value={messages.prefixLengthValue}
            direction="ltr"
          />
          <DetailRow
            label={messages.randomSourceLabel}
            value={messages.randomSourceValue}
          />
          <DetailRow
            label={messages.subnetCapacityLabel}
            value={formattedSubnetCount}
          />
        </dl>

        <section aria-labelledby="ula-layout-title" className="grid gap-3">
          <div className="grid gap-1">
            <h3 id="ula-layout-title" className="font-heading font-medium">
              {messages.layoutTitle}
            </h3>
            <p className="text-sm text-muted-foreground">
              {messages.layoutDescription}
            </p>
          </div>

          <div
            role="group"
            aria-label={messages.layoutTitle}
            dir="ltr"
            className="grid overflow-hidden rounded-xl border sm:grid-cols-[0.7fr_1.35fr_1fr_1.5fr]"
          >
            <div className="flex min-w-0 flex-col gap-2 bg-primary p-3 text-primary-foreground">
              <span dir="auto" className="text-xs font-medium opacity-75">
                {messages.localPrefixSegmentLabel}
              </span>
              <span dir="ltr" className="font-mono text-lg font-semibold">
                fd
              </span>
              <span dir="auto" className="text-xs opacity-75">
                {bitLabel(messages, 8)}
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-2 border-t bg-secondary p-3 text-secondary-foreground sm:border-t-0 sm:border-l">
              <span dir="auto" className="text-xs font-medium opacity-75">
                {messages.globalIdSegmentLabel}
              </span>
              <span
                dir="ltr"
                className="font-mono text-lg font-semibold break-all [unicode-bidi:isolate]"
              >
                {globalId || "——————————"}
              </span>
              <span dir="auto" className="text-xs opacity-75">
                {bitLabel(messages, ULA_GLOBAL_ID_BITS)}
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-2 border-t bg-muted p-3 sm:border-t-0 sm:border-l">
              <span
                dir="auto"
                className="text-xs font-medium text-muted-foreground"
              >
                {messages.subnetIdSegmentLabel}
              </span>
              <span dir="ltr" className="font-mono text-lg font-semibold">
                0000
              </span>
              <span dir="auto" className="text-xs text-muted-foreground">
                {bitLabel(messages, ULA_SUBNET_ID_BITS)}
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-2 border-t bg-background p-3 sm:border-t-0 sm:border-l">
              <span
                dir="auto"
                className="text-xs font-medium text-muted-foreground"
              >
                {messages.interfaceIdSegmentLabel}
              </span>
              <span
                dir="ltr"
                className="font-mono text-sm font-semibold break-all [unicode-bidi:isolate]"
              >
                0000:0000:0000:0000
              </span>
              <span dir="auto" className="text-xs text-muted-foreground">
                {bitLabel(messages, ULA_INTERFACE_ID_BITS)}
              </span>
            </div>
          </div>
        </section>

        <Alert>
          <Lock />
          <AlertTitle>{messages.privacyTitle}</AlertTitle>
          <AlertDescription>{messages.privacyDescription}</AlertDescription>
        </Alert>
        <Alert>
          <Network />
          <AlertTitle>{messages.reuseTitle}</AlertTitle>
          <AlertDescription>{messages.reuseDescription}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

export { DetailsCard }
