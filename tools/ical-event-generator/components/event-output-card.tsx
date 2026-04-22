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
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, TriangleAlert } from "@workspace/ui/icons"

import type {
  BuildIcalEventResult,
  ValidationErrorKey,
} from "../core/ical-event"
import type { IcalEventGeneratorMessages } from "../types"

type EventOutputCardProps = Readonly<{
  messages: IcalEventGeneratorMessages
  output: BuildIcalEventResult
  downloadUrl: string | null
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

function EventOutputCard({
  messages,
  output,
  downloadUrl,
}: EventOutputCardProps) {
  const downloadReady = output.state === "ready" && downloadUrl

  return (
    <>
      <CardHeader className="border-b">
        <CardTitle>{messages.output.title}</CardTitle>
        <CardDescription>{messages.output.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {output.state === "error" ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.output.title}</AlertTitle>
            <AlertDescription>
              {getValidationMessage(messages, output.errorKey)}
            </AlertDescription>
          </Alert>
        ) : null}

        <Textarea
          readOnly
          value={output.icsContent}
          aria-label={messages.output.title}
          className="min-h-[26rem] resize-y font-mono text-xs leading-5"
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-between gap-3 border-t">
        <ToolCopyButton
          value={output.icsContent}
          copyLabel={messages.actions.copy}
          copiedLabel={messages.actions.copied}
          variant="ghost"
          disabled={output.state !== "ready"}
        />

        {downloadReady ? (
          <Button type="button" variant="ghost" size="sm" asChild>
            <a href={downloadUrl} download={output.fileName}>
              <Download data-icon="inline-start" />
              {messages.actions.download}
            </a>
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="sm" disabled>
            <Download data-icon="inline-start" />
            {messages.actions.download}
          </Button>
        )}
      </ToolPanelCardFooter>
    </>
  )
}

export { EventOutputCard }
