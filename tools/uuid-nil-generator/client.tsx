import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Separator } from "@workspace/ui/components/ui/separator"

import { getNilUuidRepresentations } from "./core/nil-uuid"

import type { UuidNilGeneratorMessages } from "./types"

type UuidNilGeneratorClientProps = Readonly<{
  messages: UuidNilGeneratorMessages
}>

type RepresentationRowProps = Readonly<{
  label: string
  value: string
  copyLabel: string
  copiedLabel: string
}>

type DetailRowProps = Readonly<{
  label: string
  value: string
}>

const REPRESENTATIONS = getNilUuidRepresentations()

function RepresentationRow({
  label,
  value,
  copyLabel,
  copiedLabel,
}: RepresentationRowProps) {
  return (
    <div className="flex flex-col gap-2 rounded-md border bg-muted/20 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <ToolCopyButton
          value={value}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
          variant="ghost"
        />
      </div>
      <code
        className="block overflow-x-auto rounded bg-background px-2.5 py-2 text-left font-mono text-sm whitespace-nowrap [unicode-bidi:isolate]"
        dir="ltr"
        translate="no"
      >
        {value}
      </code>
    </div>
  )
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-end text-sm font-medium">{value}</dd>
    </div>
  )
}

function UuidNilGeneratorClient({ messages }: UuidNilGeneratorClientProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.46fr)]">
      <ToolPanelCard>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <CardTitle>{messages.valueTitle}</CardTitle>
              <CardDescription>{messages.valueDescription}</CardDescription>
            </div>
            <Badge variant="secondary">{messages.stableValue}</Badge>
          </div>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <div className="rounded-md border bg-muted/20 p-4">
            <div className="mb-2 text-sm font-medium">
              {messages.canonicalLabel}
            </div>
            <code
              className="block overflow-x-auto text-left font-mono text-lg font-semibold whitespace-nowrap [unicode-bidi:isolate] sm:text-2xl"
              dir="ltr"
              translate="no"
            >
              {REPRESENTATIONS.canonical}
            </code>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <RepresentationRow
              label={messages.rawHexLabel}
              value={REPRESENTATIONS.rawHex}
              copyLabel={messages.copyHexLabel}
              copiedLabel={messages.copiedLabel}
            />
            <RepresentationRow
              label={messages.urnLabel}
              value={REPRESENTATIONS.urn}
              copyLabel={messages.copyUrnLabel}
              copiedLabel={messages.copiedLabel}
            />
          </div>
        </ToolPanelCardContent>
        <ToolPanelCardFooter className="border-t">
          <ToolCopyButton
            value={REPRESENTATIONS.canonical}
            copyLabel={messages.copyUuidLabel}
            copiedLabel={messages.copiedLabel}
          />
        </ToolPanelCardFooter>
      </ToolPanelCard>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.detailsTitle}</CardTitle>
          <CardDescription>{messages.detailsDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="flex flex-col gap-4">
            <DetailRow
              label={messages.allBitsLabel}
              value={messages.allBitsValue}
            />
            <Separator />
            <DetailRow
              label={messages.versionLabel}
              value={messages.versionValue}
            />
            <Separator />
            <DetailRow
              label={messages.variantLabel}
              value={messages.variantValue}
            />
            <Separator />
            <DetailRow
              label={messages.stableLabel}
              value={messages.stableValue}
            />
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

export default UuidNilGeneratorClient
