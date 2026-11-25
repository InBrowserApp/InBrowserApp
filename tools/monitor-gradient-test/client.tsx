import { useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Maximize2, Minimize2 } from "@workspace/ui/icons"
import { useFullscreenDialog } from "@workspace/ui/lib/use-fullscreen-dialog"

import { Pattern, patterns } from "./pattern"

import type English from "./messages/en.json"
import type { PatternName } from "./pattern"

export default function MonitorGradientTest({
  language,
  messages,
}: {
  language: string
  messages: typeof English
}) {
  const [selected, setSelected] = useState<PatternName>("grayscale")
  const fullscreen = useFullscreenDialog()
  const number = new Intl.NumberFormat(language, { useGrouping: false })
  const hint = messages[`${selected}Hint`]

  const patternButtons = (
    <div
      role="group"
      aria-label={messages.patterns}
      className="flex flex-wrap gap-2"
    >
      {patterns.map((pattern) => (
        <Button
          key={pattern}
          type="button"
          variant={selected === pattern ? "default" : "outline"}
          aria-pressed={selected === pattern}
          className="h-auto min-h-10 whitespace-normal"
          onClick={() => setSelected(pattern)}
        >
          {messages[pattern]}
        </Button>
      ))}
    </div>
  )

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {patternButtons}
        <Button
          type="button"
          variant="outline"
          className="min-h-10"
          onClick={(event) => fullscreen.open(event.currentTarget)}
        >
          <Maximize2 aria-hidden="true" />
          {messages.fullscreen}
        </Button>
      </div>
      <div className="h-72 overflow-hidden rounded-xl border sm:h-96">
        <Pattern selected={selected} messages={messages} number={number} />
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {hint}
      </p>

      <dialog
        ref={fullscreen.dialog}
        aria-label={messages.fullscreenLabel}
        className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none overflow-hidden border-0 p-0"
        onCancel={fullscreen.cancel}
      >
        <div
          ref={fullscreen.surface}
          className="flex size-full flex-col gap-3 overflow-auto bg-background p-4 text-foreground"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            {patternButtons}
            <Button
              type="button"
              variant="outline"
              className="min-h-10"
              onClick={fullscreen.close}
            >
              <Minimize2 aria-hidden="true" />
              {messages.exit}
            </Button>
          </div>
          <div className="min-h-48 flex-1 overflow-hidden rounded-lg border">
            <Pattern selected={selected} messages={messages} number={number} />
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {hint}
          </p>
        </div>
      </dialog>
    </section>
  )
}
