import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Button } from "@workspace/ui/components/ui/button"
import { Flag, Pause, Play, RefreshCcw } from "@workspace/ui/icons"

import type { StopwatchMessages } from "../types"

type StopwatchCardProps = Readonly<{
  messages: StopwatchMessages
  formattedElapsed: string
  running: boolean
  hasElapsed: boolean
  canLap: boolean
  canReset: boolean
  onToggleRun: () => void
  onLap: () => void
  onReset: () => void
}>

function StopwatchCard({
  messages,
  formattedElapsed,
  running,
  hasElapsed,
  canLap,
  canReset,
  onToggleRun,
  onLap,
  onReset,
}: StopwatchCardProps) {
  const runLabel = running
    ? messages.pauseLabel
    : hasElapsed
      ? messages.resumeLabel
      : messages.startLabel

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.meta.name}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="items-center justify-center gap-4 px-6 py-10 text-center">
        <p
          className="font-mono text-[clamp(3rem,10vw,5.75rem)] font-semibold tracking-tight tabular-nums"
          data-testid="elapsed-time"
        >
          {formattedElapsed}
        </p>
        <p className="text-sm text-muted-foreground">
          {running ? messages.statusRunningLabel : messages.statusPausedLabel}
        </p>
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="flex flex-wrap items-center justify-center gap-3 border-t">
        <Button type="button" size="sm" onClick={onToggleRun}>
          {running ? (
            <Pause data-icon="inline-start" />
          ) : (
            <Play data-icon="inline-start" />
          )}
          {runLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onLap}
          disabled={!canLap}
        >
          <Flag data-icon="inline-start" />
          {messages.lapLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onReset}
          disabled={!canReset}
        >
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { StopwatchCard }
