import { useId, useMemo, useState } from "react"

import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Empty, EmptyDescription } from "@workspace/ui/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Shield } from "@workspace/ui/icons"

import { createLegacySystemKey, normalizeSystemId } from "./core/system-key"

import type { LegacySystemKeyMessages } from "./types"

export default function LegacySystemKeyClient({
  messages,
}: {
  messages: LegacySystemKeyMessages
}) {
  const inputId = useId()
  const helpId = useId()
  const errorId = useId()
  const [input, setInput] = useState("")
  const systemId = normalizeSystemId(input)
  const invalid = input.trim().length > 0 && systemId === null
  const result = useMemo(() => {
    if (!systemId) return null
    const key = createLegacySystemKey(systemId)
    return {
      ...key,
      file: new Blob([key.bytes], { type: "application/octet-stream" }),
      hex: Array.from(key.bytes, (byte) =>
        byte.toString(16).padStart(2, "0").toUpperCase()
      ).join(" "),
    }
  }, [systemId])

  return (
    <div className="flex flex-col gap-6">
      <Alert>
        <Shield aria-hidden="true" />
        <AlertTitle>{messages.compatibilityTitle}</AlertTitle>
        <AlertDescription>{messages.compatibilityDescription}</AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <ToolPanelCard>
          <CardHeader className="border-b">
            <CardTitle>{messages.inputTitle}</CardTitle>
            <CardDescription>{messages.inputDescription}</CardDescription>
          </CardHeader>
          <ToolPanelCardContent>
            <FieldGroup>
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={inputId}>
                  {messages.systemIdLabel}
                </FieldLabel>
                <Input
                  id={inputId}
                  name="system-id"
                  value={input}
                  placeholder="1234…"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  dir="ltr"
                  aria-invalid={invalid}
                  aria-describedby={invalid ? `${helpId} ${errorId}` : helpId}
                  onChange={(event) => setInput(event.target.value)}
                />
                <FieldDescription id={helpId}>
                  {messages.systemIdHelp}
                </FieldDescription>
                {invalid ? (
                  <FieldError id={errorId} aria-live="polite">
                    {messages.invalidSystemId}
                  </FieldError>
                ) : null}
              </Field>
            </FieldGroup>
          </ToolPanelCardContent>
        </ToolPanelCard>

        <ToolPanelCard>
          <CardHeader className="border-b">
            <CardTitle>{messages.outputTitle}</CardTitle>
          </CardHeader>
          <ToolPanelCardContent className="gap-4" aria-live="polite">
            {result ? (
              <>
                <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">
                    {messages.normalizedIdLabel}
                  </dt>
                  <dd>
                    <code dir="ltr" translate="no">
                      {result.systemId}
                    </code>
                  </dd>
                  <dt className="text-muted-foreground">
                    {messages.filenameLabel}
                  </dt>
                  <dd className="min-w-0 break-all">
                    <code dir="ltr" translate="no">
                      {result.filename}
                    </code>
                  </dd>
                  <dt className="text-muted-foreground">
                    {messages.fileSizeLabel}
                  </dt>
                  <dd>{messages.fileSizeValue}</dd>
                </dl>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    {messages.hexPreviewLabel}
                  </p>
                  <pre
                    dir="ltr"
                    translate="no"
                    aria-label={messages.hexPreviewLabel}
                    className="rounded-md border bg-muted/50 p-3 font-mono text-xs leading-6 break-words whitespace-pre-wrap"
                  >
                    {result.hex}
                  </pre>
                </div>
              </>
            ) : (
              <Empty>
                <EmptyDescription>{messages.emptyState}</EmptyDescription>
              </Empty>
            )}
          </ToolPanelCardContent>
          <ToolPanelCardFooter className="justify-end border-t">
            {result ? (
              <DocumentDownload
                file={result.file}
                filename={result.filename}
                label={messages.downloadLabel}
              />
            ) : (
              <Button disabled>{messages.downloadLabel}</Button>
            )}
          </ToolPanelCardFooter>
        </ToolPanelCard>
      </div>
    </div>
  )
}
