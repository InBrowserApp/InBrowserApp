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

function renderIcsLine(line: string) {
  const colonIndex = line.indexOf(":")

  if (colonIndex <= 0 || line.startsWith(" ")) {
    return <span className="text-slate-300">{line || " "}</span>
  }

  const propertyName = line.slice(0, colonIndex)
  const propertyValue = line.slice(colonIndex + 1)

  return (
    <>
      <span className="text-sky-300">{propertyName}</span>
      <span className="text-slate-500">:</span>
      <span className="text-emerald-100">{propertyValue || " "}</span>
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
      <CardHeader className="relative overflow-hidden border-b bg-linear-to-br from-primary/10 via-background to-sky-500/10">
        <div className="absolute -top-20 right-6 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border bg-background/80 text-primary shadow-xs backdrop-blur">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <CardTitle>{messages.output.title}</CardTitle>
              <CardDescription>{messages.output.description}</CardDescription>
              <p className="truncate text-xs font-medium" translate="no">
                {output.fileName}
              </p>
            </div>
          </div>

          <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-3">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="min-w-0 rounded-xl border bg-background/75 px-3 py-2 shadow-xs backdrop-blur"
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
      <ToolPanelCardContent className="gap-4 p-4 sm:p-5">
        <div className="overflow-hidden rounded-[1.35rem] border bg-slate-950 shadow-sm">
          <div className="flex min-w-0 items-center gap-3 border-b border-white/10 bg-white/5 px-4 py-3">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-rose-400" />
              <span className="size-2.5 rounded-full bg-amber-300" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
            </div>
            <p
              className="min-w-0 flex-1 truncate font-mono text-xs text-slate-300"
              translate="no"
            >
              {output.fileName}
            </p>
          </div>

          {output.state === "error" ? (
            <div className="grid min-h-[24rem] place-items-center bg-background p-4">
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
                className="max-h-[36rem] min-h-[24rem] overflow-auto"
                translate="no"
              >
                <pre className="min-w-max p-4 font-mono text-xs leading-5">
                  <code>
                    {outputLines.map((line, index) => {
                      const lineNumber = index + 1

                      return (
                        <span
                          key={`${lineNumber}:${line}`}
                          className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4"
                        >
                          <span
                            className="text-right text-slate-600 select-none"
                            aria-hidden="true"
                          >
                            {lineNumber}
                          </span>
                          <span>{renderIcsLine(line)}</span>
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
      <ToolPanelCardFooter className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20">
        <p className="min-w-0 truncate text-xs text-muted-foreground">
          {messages.output.description}
        </p>

        <div className="flex shrink-0 flex-wrap gap-3">
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
