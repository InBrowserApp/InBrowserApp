import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Download, Maximize2, RefreshCcw } from "@workspace/ui/icons"

import type { PasswordMode, RandomPasswordGeneratorMessages } from "../types"

type ResultsCardProps = Readonly<{
  messages: RandomPasswordGeneratorMessages
  mode: PasswordMode
  result: string
  downloadUrl: string | null
  onRegenerate: () => void
  onOpenFullscreen: () => void
}>

function getModeLabel(
  mode: PasswordMode,
  messages: RandomPasswordGeneratorMessages
) {
  switch (mode) {
    case "random":
      return messages.randomTabLabel
    case "words":
      return messages.wordsTabLabel
    case "separator":
      return messages.separatorTabLabel
    case "pin":
      return messages.pinTabLabel
  }
}

function ResultsCard({
  messages,
  mode,
  result,
  downloadUrl,
  onRegenerate,
  onOpenFullscreen,
}: ResultsCardProps) {
  const hasResult = result.length > 0

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.resultsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <button
          type="button"
          aria-label={messages.resultsTitle}
          className="group/result flex min-h-56 w-full flex-1 items-center justify-center rounded-2xl border border-dashed border-border bg-linear-to-br from-muted/10 via-background to-muted/25 px-5 py-6 text-center transition-colors hover:border-primary/40 hover:from-muted/20 hover:to-primary/5 disabled:cursor-default"
          disabled={!hasResult}
          onClick={onOpenFullscreen}
        >
          {hasResult ? (
            <div className="w-full space-y-3">
              <div className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                {getModeLabel(mode, messages)}
              </div>
              <div
                data-slot="password-result-value"
                className="font-mono text-2xl font-semibold tracking-tight break-all sm:text-4xl"
              >
                {result}
              </div>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">
              {messages.resultsPlaceholder}
            </span>
          )}
        </button>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap items-center gap-2 border-t">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={onRegenerate}
        >
          <RefreshCcw data-icon="inline-start" />
          {messages.generateLabel}
        </Button>

        <ToolCopyButton
          value={result}
          copyLabel={messages.copyResultLabel}
          copiedLabel={messages.copiedLabel}
          variant="ghost"
        />

        {downloadUrl ? (
          <Button asChild type="button" variant="ghost" size="sm">
            <a href={downloadUrl} download="random-password.txt">
              <Download data-icon="inline-start" />
              {messages.downloadLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.downloadLabel}
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!hasResult}
          onClick={onOpenFullscreen}
        >
          <Maximize2 data-icon="inline-start" />
          {messages.enterFullscreenLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { ResultsCard }
