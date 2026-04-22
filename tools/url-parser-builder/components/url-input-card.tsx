import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { RefreshCcw } from "@workspace/ui/icons"

import { listExampleUrls, type UrlExampleKey } from "../core/url"
import type { UrlParserBuilderMessages } from "../types"

type UrlInputCardProps = Readonly<{
  activeExample: UrlExampleKey | null
  rawInput: string
  invalid: boolean
  messages: UrlParserBuilderMessages
  onInputChange: (value: string) => void
  onReset: () => void
  onSelectExample: (key: UrlExampleKey) => void
}>

const EXAMPLE_ORDER = Object.keys(listExampleUrls()) as UrlExampleKey[]

function UrlInputCard({
  activeExample,
  rawInput,
  invalid,
  messages,
  onInputChange,
  onReset,
  onSelectExample,
}: UrlInputCardProps) {
  return (
    <ToolPanelCard className="overflow-hidden border border-primary/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.92))]">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardTitle>{messages.rawUrlLabel}</CardTitle>
            <CardDescription>{messages.rawUrlDescription}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_ORDER.map((key) => (
              <Button
                key={key}
                type="button"
                size="sm"
                variant={activeExample === key ? "default" : "outline"}
                onClick={() => {
                  onSelectExample(key)
                }}
              >
                {getPresetLabel(key, messages)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <ToolPanelCardContent className="gap-4">
        <Textarea
          name="raw-url"
          rows={10}
          autoComplete="off"
          spellCheck={false}
          aria-label={messages.rawUrlLabel}
          aria-invalid={invalid}
          value={rawInput}
          placeholder={messages.rawUrlPlaceholder}
          className="min-h-72 resize-y font-mono text-sm"
          onChange={(event) => {
            onInputChange(event.target.value)
          }}
        />
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="justify-between gap-3 border-t">
        <ToolCopyButton
          value={rawInput}
          copyLabel={messages.copyUrlLabel}
          copiedLabel={messages.copiedLabel}
          variant="ghost"
        />
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

function getPresetLabel(
  key: UrlExampleKey,
  messages: UrlParserBuilderMessages
) {
  switch (key) {
    case "api":
      return messages.presetApiLabel
    case "auth":
      return messages.presetAuthLabel
    case "campaign":
      return messages.presetCampaignLabel
  }
}

export { UrlInputCard }
