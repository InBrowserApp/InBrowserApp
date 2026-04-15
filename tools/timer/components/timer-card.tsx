import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Maximize2,
  Pause,
  Play,
  RefreshCcw,
  TriangleAlert,
} from "@workspace/ui/icons"

import type { TimerMessages } from "../types"

type TimerCardProps = Readonly<{
  messages: TimerMessages
  formattedRemaining: string
  running: boolean
  runLabel: string
  canReset: boolean
  errorMessage: string
  onToggleRun: () => void
  onReset: () => void
  onEnterFullscreen: () => void
}>

function TimerCard({
  messages,
  formattedRemaining,
  running,
  runLabel,
  canReset,
  errorMessage,
  onToggleRun,
  onReset,
  onEnterFullscreen,
}: TimerCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.meta.name}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="items-center justify-center gap-6 px-6 py-10 text-center">
        <p
          className="font-mono text-[clamp(3rem,10vw,5.75rem)] font-semibold tracking-tight tabular-nums"
          data-testid="timer-display"
        >
          {formattedRemaining}
        </p>

        {errorMessage ? (
          <Alert variant="destructive" className="max-w-lg text-left">
            <TriangleAlert />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}
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
          disabled={!canReset}
          onClick={onReset}
        >
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          data-testid="enter-fullscreen"
          onClick={onEnterFullscreen}
        >
          <Maximize2 data-icon="inline-start" />
          {messages.fullscreenEnterLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { TimerCard }
