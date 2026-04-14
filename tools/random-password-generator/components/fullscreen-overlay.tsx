import { Button } from "@workspace/ui/components/ui/button"
import { Minimize2, RefreshCcw } from "@workspace/ui/icons"

import type { RandomPasswordGeneratorMessages } from "../types"

type FullscreenOverlayProps = Readonly<{
  messages: RandomPasswordGeneratorMessages
  result: string
  onRegenerate: () => void
  onClose: () => void
}>

function FullscreenOverlay({
  messages,
  result,
  onRegenerate,
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
        <div className="max-w-full text-center font-mono text-4xl font-semibold tracking-tight break-all sm:text-6xl lg:text-7xl">
          {result}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onRegenerate}
          >
            <RefreshCcw data-icon="inline-start" />
            {messages.generateLabel}
          </Button>

          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            <Minimize2 data-icon="inline-start" />
            {messages.exitFullscreenLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { FullscreenOverlay }
