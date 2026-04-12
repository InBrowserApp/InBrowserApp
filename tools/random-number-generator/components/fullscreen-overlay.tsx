import { Button } from "@workspace/ui/components/ui/button"
import { RefreshCcw } from "@workspace/ui/icons"

import type { RandomNumberGeneratorMessages } from "../types"

type FullscreenOverlayProps = Readonly<{
  messages: RandomNumberGeneratorMessages
  formattedNumbers: string[]
  canRoll: boolean
  isRolling: boolean
  onToggleRolling: () => void
  onClose: () => void
}>

function FullscreenOverlay({
  messages,
  formattedNumbers,
  canRoll,
  isRolling,
  onToggleRolling,
  onClose,
}: FullscreenOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-background/98 p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
      onKeyDown={(event) => {
        if (
          event.target === event.currentTarget &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault()
          onClose()
        }
      }}
    >
      <div className="mx-auto flex min-h-full max-w-6xl flex-col items-center justify-center gap-8">
        {formattedNumbers.length === 1 ? (
          <div className="text-center text-7xl font-semibold tracking-tight sm:text-[9rem]">
            {formattedNumbers[0]}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {formattedNumbers.map((value, index) => (
              <span
                key={`${value}-${index}`}
                className="inline-flex min-h-20 min-w-20 items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-3xl font-semibold shadow-xs sm:text-6xl"
              >
                {value}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2">
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

          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            {messages.exitFullscreenLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { FullscreenOverlay }
