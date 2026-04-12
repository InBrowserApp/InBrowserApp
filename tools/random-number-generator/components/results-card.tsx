import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Download, RefreshCcw } from "@workspace/ui/icons"

import type { RandomNumberGeneratorMessages } from "../types"

type ResultsCardProps = Readonly<{
  messages: RandomNumberGeneratorMessages
  formattedNumbers: string[]
  outputText: string
  canRoll: boolean
  isRolling: boolean
  downloadUrl: string | null
  onToggleRolling: () => void
  onOpenFullscreen: () => void
}>

function ResultsCard({
  messages,
  formattedNumbers,
  outputText,
  canRoll,
  isRolling,
  downloadUrl,
  onToggleRolling,
  onOpenFullscreen,
}: ResultsCardProps) {
  const hasResults = formattedNumbers.length > 0

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
      </CardHeader>
      <ToolPanelCardContent>
        <button
          type="button"
          className="flex min-h-52 w-full flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-4 py-6 text-center transition-colors hover:border-primary/40 hover:bg-muted/40 disabled:cursor-default disabled:hover:border-border disabled:hover:bg-muted/20"
          disabled={!hasResults}
          onClick={onOpenFullscreen}
        >
          {formattedNumbers.length === 1 ? (
            <div className="text-5xl font-semibold tracking-tight sm:text-7xl">
              {formattedNumbers[0]}
            </div>
          ) : formattedNumbers.length > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {formattedNumbers.map((value, index) => (
                <span
                  key={`${value}-${index}`}
                  className="inline-flex min-h-14 min-w-14 items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-2xl font-semibold shadow-xs sm:text-4xl"
                >
                  {value}
                </span>
              ))}
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
          disabled={!canRoll && !isRolling}
          onClick={onToggleRolling}
        >
          <RefreshCcw
            data-icon="inline-start"
            className={isRolling ? "animate-spin" : undefined}
          />
          {isRolling ? messages.stopRandomLabel : messages.startRandomLabel}
        </Button>

        <ToolCopyButton
          value={outputText}
          copyLabel={messages.copyResultLabel}
          copiedLabel={messages.copiedLabel}
          variant="ghost"
        />

        {downloadUrl ? (
          <Button asChild type="button" variant="ghost" size="sm">
            <a href={downloadUrl} download="random-numbers.txt">
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
          disabled={!hasResults}
          onClick={onOpenFullscreen}
        >
          {messages.enterFullscreenLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { ResultsCard }
