import { useId } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { CardDescription, CardHeader } from "@workspace/ui/components/ui/card"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { RefreshCcw, TriangleAlert } from "@workspace/ui/icons"

import type { Ipv6UlaPrefix } from "../core/ipv6-ula"
import type { Ipv6UlaMessages } from "../types"

type PrefixCardProps = Readonly<{
  messages: Ipv6UlaMessages
  prefix: Ipv6UlaPrefix | null
  isLoading: boolean
  hasError: boolean
  onRegenerate: () => void
}>

function PrefixCard({
  messages,
  prefix,
  isLoading,
  hasError,
  onRegenerate,
}: PrefixCardProps) {
  const outputId = useId()
  const sitePrefix = prefix?.sitePrefix ?? ""

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <h2
          data-slot="card-title"
          className="font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm"
        >
          {messages.generatorTitle}
        </h2>
        <CardDescription>{messages.generatorDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        {hasError ? (
          <Alert variant="destructive" aria-live="assertive">
            <TriangleAlert />
            <AlertTitle>{messages.errorTitle}</AlertTitle>
            <AlertDescription>
              {messages.cryptoUnavailableMessage}
            </AlertDescription>
          </Alert>
        ) : null}

        <Field>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FieldLabel htmlFor={outputId}>
              {messages.sitePrefixLabel}
            </FieldLabel>
            <Badge variant="secondary">RFC 4193 · /48</Badge>
          </div>
          <output
            id={outputId}
            aria-busy={isLoading}
            aria-live="polite"
            className="block min-h-18 rounded-xl border bg-background px-4 py-5 text-left font-mono text-2xl leading-tight font-semibold tracking-tight break-all text-foreground tabular-nums [unicode-bidi:isolate] sm:text-3xl"
            dir="ltr"
            translate="no"
          >
            {sitePrefix}
          </output>
          {isLoading ? (
            <p className="text-sm text-muted-foreground" role="status">
              {messages.generatingLabel}
            </p>
          ) : null}
        </Field>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex-wrap justify-between gap-3 border-t">
        <ToolCopyButton
          value={sitePrefix}
          copyLabel={messages.copySitePrefixLabel}
          copiedLabel={messages.copiedLabel}
          variant="ghost"
          disabled={sitePrefix.length === 0}
        />

        <Button type="button" variant="ghost" size="sm" onClick={onRegenerate}>
          <RefreshCcw data-icon="inline-start" />
          {messages.regenerateLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { PrefixCard }
