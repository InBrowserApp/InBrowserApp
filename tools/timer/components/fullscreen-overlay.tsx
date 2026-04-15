import { Button } from "@workspace/ui/components/ui/button"
import { Minimize2, Pause, Play, RefreshCcw } from "@workspace/ui/icons"

type FullscreenOverlayProps = Readonly<{
  formattedRemaining: string
  running: boolean
  runLabel: string
  resetLabel: string
  exitLabel: string
  canReset: boolean
  onToggleRun: () => void
  onReset: () => void
  onExit: () => void
}>

function FullscreenOverlay({
  formattedRemaining,
  running,
  runLabel,
  resetLabel,
  exitLabel,
  canReset,
  onToggleRun,
  onReset,
  onExit,
}: FullscreenOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background px-6 pt-[calc(32px+env(safe-area-inset-top))] pb-[calc(32px+env(safe-area-inset-bottom))]"
      data-testid="fullscreen-overlay"
    >
      <p
        className="font-mono text-[clamp(3.5rem,14vw,9rem)] font-semibold tracking-tight tabular-nums"
        data-testid="fullscreen-display"
      >
        {formattedRemaining}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
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
          {resetLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          data-testid="exit-fullscreen"
          onClick={onExit}
        >
          <Minimize2 data-icon="inline-start" />
          {exitLabel}
        </Button>
      </div>
    </div>
  )
}

export { FullscreenOverlay }
