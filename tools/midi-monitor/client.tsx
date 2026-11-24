import { useEffect, useRef } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Piano } from "@workspace/ui/icons"

import { MessageLog } from "./message-log"
import { PianoView } from "./piano-view"
import { useMidiInput } from "./use-midi-input"
import { useMidiLog } from "./use-midi-log"

import type english from "./messages/en.json"

export default function MidiMonitor({
  language,
  messages,
}: {
  language: string
  messages: typeof english
}) {
  const log = useMidiLog()
  const { supported, enabled, enabling, inputs, input, error, enable, select } =
    useMidiInput(log.receive, log.switchInput)

  const inputControl = useRef<HTMLSelectElement>(null)
  const missingInputs = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (enabled) (inputControl.current ?? missingInputs.current)?.focus()
  }, [enabled])

  return (
    <section className="space-y-4">
      <div className="space-y-3 rounded-xl border bg-card p-4">
        {!enabled && (
          <Button
            type="button"
            disabled={!supported || enabling}
            onClick={() => void enable()}
          >
            <Piano aria-hidden="true" />
            {enabling ? messages.enabling : messages.enable}
          </Button>
        )}
        {supported === false && (
          <p className="text-sm text-muted-foreground">
            {messages.unsupported}
          </p>
        )}
        {enabled &&
          (inputs.length ? (
            <label className="flex flex-wrap items-center gap-2 text-sm font-medium">
              {messages.input}
              <select
                ref={inputControl}
                value={input?.id ?? ""}
                onChange={(event) => select(event.target.value)}
                className="h-9 max-w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-2 focus-visible:outline-ring"
              >
                <option value="" disabled>
                  {messages.chooseInput}
                </option>
                {inputs.map((port) => (
                  <option key={port.id} value={port.id}>
                    {port.name || messages.unnamed}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p
              ref={missingInputs}
              role="status"
              tabIndex={-1}
              className="text-sm text-muted-foreground"
            >
              {messages.noInputs}
            </p>
          ))}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {messages[error]}
          </p>
        )}
      </div>
      <PianoView notes={log.notes} messages={messages} />
      <MessageLog
        language={language}
        messages={messages}
        entries={log.entries}
        pulses={log.pulses}
        emptyHint={
          input
            ? messages.emptyLog
            : enabled
              ? messages.chooseInput
              : messages.enableHint
        }
        clear={log.clear}
      />
    </section>
  )
}
