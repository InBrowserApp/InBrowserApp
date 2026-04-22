import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import type { ResultsCardProps } from "../types"

type ResultFieldProps = Readonly<{
  label: string
  value: string
  copyLabel: string
  copiedLabel: string
}>

function ResultField({
  label,
  value,
  copyLabel,
  copiedLabel,
}: ResultFieldProps) {
  return (
    <div className="grid gap-2 border-t pt-4 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <ToolCopyButton
          value={value}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
          variant="ghost"
        />
      </div>
      <code className="block overflow-x-auto rounded-lg bg-muted/40 px-3 py-2 font-mono text-sm text-foreground">
        {value || "—"}
      </code>
    </div>
  )
}

function ResultsCard({ messages, result }: ResultsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsLabel}</CardTitle>
        <CardDescription>
          {messages.endLabel} − {messages.startLabel}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <ResultField
          label={messages.signedDurationLabel}
          value={result?.signedDuration ?? ""}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
        />
        <ResultField
          label={messages.absoluteDurationLabel}
          value={result?.absoluteDuration ?? ""}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
        />
        <ResultField
          label={messages.iso8601DurationLabel}
          value={result?.isoDuration ?? ""}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
        />
        <ResultField
          label={messages.totalMillisecondsLabel}
          value={result?.totalMilliseconds ?? ""}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
        />
        <ResultField
          label={messages.totalSecondsLabel}
          value={result?.totalSeconds ?? ""}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
        />
        <ResultField
          label={messages.totalMinutesLabel}
          value={result?.totalMinutes ?? ""}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
        />
        <ResultField
          label={messages.totalHoursLabel}
          value={result?.totalHours ?? ""}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
        />
        <ResultField
          label={messages.totalDaysLabel}
          value={result?.totalDays ?? ""}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
        />
      </CardContent>
    </Card>
  )
}

export { ResultsCard }
