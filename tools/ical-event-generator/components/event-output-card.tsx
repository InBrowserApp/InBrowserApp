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
import { Download, TriangleAlert } from "@workspace/ui/icons"

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

function renderIcsLine(line: string) {
  const colonIndex = line.indexOf(":")

  if (colonIndex <= 0 || line.startsWith(" ")) {
    return <span className="text-muted-foreground">{line || " "}</span>
  }

  const propertyName = line.slice(0, colonIndex)
  const propertyValue = line.slice(colonIndex + 1)

  return (
    <>
      <span className="text-primary">{propertyName}</span>
      <span className="text-muted-foreground">:</span>
      <span className="text-foreground">{propertyValue || " "}</span>
    </>
  )
}

function EventOutputCard({
  messages,
  output,
  downloadUrl,
  formState,
}: EventOutputCardProps) {
  const downloadReady = output.state === "ready" && downloadUrl
  const outputLines =
    output.state === "ready" ? output.icsContent.split(/\r?\n/) : []
  const summaryItems = [
    {
      label: messages.schedule.outputModeLabel,
      value: getOutputModeLabel(messages, formState),
      shouldTranslate: true,
    },
    {
      label: messages.schedule.timeZoneLabel,
      value: formState.timeZone,
      shouldTranslate: false,
    },
    {
      label: messages.details.uidLabel,
      value: formState.uid,
      shouldTranslate: false,
    },
  ] as const

  return (
    <>
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <CardTitle>{messages.output.title}</CardTitle>
            <CardDescription>{messages.output.description}</CardDescription>
            <p
              className="truncate font-mono text-xs text-muted-foreground"
              translate="no"
            >
              {output.fileName}
            </p>
          </div>

          <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-3">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="min-w-0 rounded-lg border bg-muted/20 px-3 py-2"
              >
                <p className="text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p
                  className="mt-1 truncate text-xs font-semibold"
                  title={item.value}
                  translate={item.shouldTranslate ? undefined : "no"}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <ToolPanelCardContent className="gap-4 p-3 sm:p-4">
        <div className="overflow-hidden rounded-xl border bg-background">
          {output.state === "error" ? (
            <div className="grid min-h-[18rem] place-items-center p-4 sm:min-h-[24rem]">
              <Alert variant="destructive" className="max-w-md">
                <TriangleAlert />
                <AlertTitle>{messages.output.title}</AlertTitle>
                <AlertDescription>
                  {getValidationMessage(messages, output.errorKey)}
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <>
              <textarea
                readOnly
                aria-hidden="true"
                hidden
                name="ical-output"
                tabIndex={-1}
                value={output.icsContent}
              />
              <div
                role="region"
                aria-label={messages.output.title}
                className="max-h-[32rem] min-h-[18rem] overflow-auto sm:min-h-[24rem]"
                translate="no"
              >
                <pre className="min-w-max p-3 font-mono text-xs leading-5">
                  <code>
                    {outputLines.map((line, index) => {
                      return (
                        <span key={`${index}:${line}`} className="block">
                          {renderIcsLine(line)}
                        </span>
                      )
                    })}
                  </code>
                </pre>
              </div>
            </>
          )}
        </div>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-end gap-3 border-t">
        <div className="flex w-full flex-wrap justify-end gap-3 sm:w-auto">
          <ToolCopyButton
            value={output.state === "ready" ? output.icsContent : ""}
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
        </div>
      </ToolPanelCardFooter>
    </>
  )
}

export { EventOutputCard }
