import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import type { ResultsCardProps } from "../client/types"

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

function ResultsCard({ messages, title, result }: ResultsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <ResultField
          label={messages.dateTimeLabel}
          value={result?.dateTime ?? ""}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
        />
        <ResultField
          label={messages.iso8601Label}
          value={result?.iso8601 ?? ""}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
        />
        <ResultField
          label={messages.unixMillisecondsLabel}
          value={result?.unixMilliseconds ?? ""}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
        />
        <ResultField
          label={messages.unixSecondsLabel}
          value={result?.unixSeconds ?? ""}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
        />
      </CardContent>
    </Card>
  )
}

export { ResultsCard }
