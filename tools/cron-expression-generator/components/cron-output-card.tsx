import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Clock3 } from "@workspace/ui/icons"

import { summarizeCronForm } from "./format"

import type { CronFormState } from "../core/cron"
import type { CronExpressionGeneratorMessages } from "../types"

type CronOutputCardProps = Readonly<{
  expression: string
  messages: CronExpressionGeneratorMessages
  state: CronFormState
}>

function CronOutputCard({ expression, messages, state }: CronOutputCardProps) {
  const summaries = summarizeCronForm(messages, state)

  return (
    <>
      <CardHeader className="border-b">
        <CardTitle>{messages.output.title}</CardTitle>
        <CardDescription>{messages.output.description}</CardDescription>
        <CardAction>
          <ToolCopyButton
            value={expression}
            copyLabel={messages.actions.copy}
            copiedLabel={messages.actions.copied}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            {messages.output.expressionLabel}
          </p>
          <code className="block min-h-12 rounded-lg bg-muted px-3 py-3 font-mono text-lg break-all text-foreground tabular-nums">
            {expression}
          </code>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">{messages.output.summaryLabel}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {summaries.map((summary) => (
              <div
                key={summary.fieldName}
                className="flex min-w-0 items-center justify-between gap-3 rounded-lg border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {summary.label}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {summary.summary}
                  </p>
                </div>
                <Badge variant="outline" className="font-mono">
                  {summary.expression}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Alert>
          <Clock3 />
          <AlertTitle>{messages.output.noteTitle}</AlertTitle>
          <AlertDescription>{messages.output.noteDescription}</AlertDescription>
        </Alert>
      </CardContent>
    </>
  )
}

export { CronOutputCard }
