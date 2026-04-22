import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, FileText, TriangleAlert } from "@workspace/ui/icons"

import type {
  BuildIcalEventResult,
  ValidationErrorKey,
} from "../core/ical-event"
import type { IcalEventFormState } from "../core/form-state"
import type { IcalEventGeneratorMessages } from "../types"

type EventOutputCardProps = Readonly<{
  messages: IcalEventGeneratorMessages
  output: BuildIcalEventResult
  downloadUrl: string | null
  formState: IcalEventFormState
}>

function getValidationMessage(
  messages: IcalEventGeneratorMessages,
  errorKey: ValidationErrorKey
) {
  switch (errorKey) {
    case "invalid-start-date":
      return messages.output.validation.invalidStartDate
    case "invalid-end-date":
      return messages.output.validation.invalidEndDate
    case "invalid-start-time":
      return messages.output.validation.invalidStartTime
    case "invalid-end-time":
      return messages.output.validation.invalidEndTime
    case "end-before-start":
      return messages.output.validation.endBeforeStart
    case "invalid-until-date":
      return messages.output.validation.invalidUntilDate
    case "invalid-until-time":
      return messages.output.validation.invalidUntilTime
  }
}

function getOutputModeLabel(
  messages: IcalEventGeneratorMessages,
  formState: IcalEventFormState
) {
  return formState.outputMode === "utc"
    ? messages.schedule.outputUtcLabel
    : messages.schedule.outputTzidLabel
}

function EventOutputCard({
  messages,
  output,
  downloadUrl,
  formState,
}: EventOutputCardProps) {
  const downloadReady = output.state === "ready" && downloadUrl
  const summaryItems = [
    {
      label: messages.schedule.outputModeLabel,
      value: getOutputModeLabel(messages, formState),
    },
    {
      label: messages.schedule.timeZoneLabel,
      value: formState.timeZone,
    },
    {
      label: messages.details.uidLabel,
      value: formState.uid,
    },
  ] as const

  return (
    <>
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{messages.output.title}</CardTitle>
            <CardDescription>{messages.output.description}</CardDescription>
          </div>
          <Badge variant="secondary">
            {getOutputModeLabel(messages, formState)}
          </Badge>
        </div>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {summaryItems.map((item) => (
            <div key={item.label} className="rounded-xl border bg-muted/20 p-3">
              <p className="text-[0.7rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {item.label}
              </p>
              <p
                className="mt-2 truncate text-sm font-medium"
                title={item.value}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-linear-to-br from-muted/30 to-background p-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg border bg-background p-2 text-muted-foreground">
              <FileText className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{output.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {messages.output.description}
              </p>
            </div>
          </div>
        </div>

        {output.state === "error" ? (
          <>
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>{messages.output.title}</AlertTitle>
              <AlertDescription>
                {getValidationMessage(messages, output.errorKey)}
              </AlertDescription>
            </Alert>
            <div className="flex min-h-[24rem] flex-1 items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              {messages.output.description}
            </div>
          </>
        ) : (
          <Textarea
            readOnly
            spellCheck={false}
            value={output.icsContent}
            aria-label={messages.output.title}
            className="min-h-[24rem] resize-y rounded-xl font-mono text-xs leading-5"
          />
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-between gap-3 border-t">
        <ToolCopyButton
          value={output.icsContent}
          copyLabel={messages.actions.copy}
          copiedLabel={messages.actions.copied}
          variant="outline"
          disabled={output.state !== "ready"}
        />

        {downloadReady ? (
          <Button type="button" size="sm" asChild>
            <a href={downloadUrl} download={output.fileName}>
              <Download data-icon="inline-start" />
              {messages.actions.download}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.actions.download}
          </Button>
        )}
      </ToolPanelCardFooter>
    </>
  )
}

export { EventOutputCard }
