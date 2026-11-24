import { useId, useState } from "react"
import type { CID } from "multiformats/cid"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { compareCid } from "./core/cid"
import type EnglishMessages from "./messages/en.json"

export function ResultPanel({
  messages,
  result,
  command,
  busy,
}: {
  messages: typeof EnglishMessages
  result: CID | null
  command: string
  busy: boolean
}) {
  const id = useId()
  const [expected, setExpected] = useState("")
  const cid = result?.toString()
  const comparison =
    result && expected.trim() ? compareCid(expected, result) : null
  const copy = { copyLabel: messages.copy, copiedLabel: messages.copied }
  return (
    <ToolPanelCard>
      <CardHeader>
        <CardTitle>{messages.result}</CardTitle>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <div aria-live="polite" className="min-w-0">
          {cid ? (
            <div className="flex min-w-0 flex-wrap items-start gap-2">
              <code
                dir="ltr"
                className="min-w-0 flex-1 rounded-lg bg-muted p-2.5 text-sm wrap-anywhere"
              >
                {cid}
              </code>
              <ToolCopyButton
                value={cid}
                ariaLabel={`${messages.copy}: ${messages.result}`}
                {...copy}
              />
            </div>
          ) : (
            <p className="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
              {busy ? messages.calculating : messages.resultEmpty}
            </p>
          )}
        </div>
        <Field>
          <FieldLabel htmlFor={id}>{messages.compare}</FieldLabel>
          <Input
            id={id}
            dir="ltr"
            placeholder="bafy…"
            className="font-mono"
            autoComplete="off"
            spellCheck={false}
            value={expected}
            onChange={(event) => setExpected(event.target.value)}
            aria-describedby={comparison ? `${id}-comparison` : undefined}
          />
          {comparison && (
            <p id={`${id}-comparison`} aria-live="polite" className="text-sm">
              {messages[comparison]}
            </p>
          )}
        </Field>
        {command && (
          <div className="grid gap-2 border-t pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">{messages.command}</p>
              <ToolCopyButton
                value={command}
                ariaLabel={`${messages.copy}: ${messages.command}`}
                {...copy}
              />
            </div>
            <code
              dir="ltr"
              className="rounded-lg bg-muted p-2.5 text-xs wrap-anywhere"
            >
              {command}
            </code>
          </div>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
