import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { BadgeCheck, TriangleAlert } from "@workspace/ui/icons"

import type {
  ResultStatus,
  RomanNumeralConverterMessagesCatalog,
} from "../types"

type ResultCardProps = Readonly<{
  arabicOutput: string
  errorMessage: string | null
  messages: RomanNumeralConverterMessagesCatalog
  romanOutput: string
  status: ResultStatus
}>

function ResultValue({
  copyValue,
  copiedLabel,
  copyLabel,
  label,
  value,
}: Readonly<{
  copiedLabel: string
  copyLabel: string
  copyValue?: string
  label: string
  value: string
}>) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        {copyValue ? (
          <ToolCopyButton
            value={copyValue}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
            variant="ghost"
          />
        ) : null}
      </div>
      <p className="mt-3 font-mono text-lg break-all">{value}</p>
    </div>
  )
}

function ResultCard({
  arabicOutput,
  errorMessage,
  messages,
  romanOutput,
  status,
}: ResultCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {status === "idle" ? (
          <p className="text-sm text-muted-foreground">{messages.emptyState}</p>
        ) : null}

        {status === "valid" ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{messages.validLabel}</Badge>
              <Badge variant="outline">{messages.rangeHint}</Badge>
            </div>

            <Alert>
              <BadgeCheck />
              <AlertTitle>{messages.validLabel}</AlertTitle>
              <AlertDescription>{messages.notationHint}</AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <ResultValue
                label={messages.arabicNumber}
                value={arabicOutput}
                copyValue={arabicOutput}
                copyLabel={messages.copyLabel}
                copiedLabel={messages.copiedLabel}
              />
              <ResultValue
                label={messages.romanNumeral}
                value={romanOutput}
                copyValue={romanOutput}
                copyLabel={messages.copyLabel}
                copiedLabel={messages.copiedLabel}
              />
            </div>
          </>
        ) : null}

        {status === "invalid" && errorMessage ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="destructive">{messages.invalidLabel}</Badge>
              <Badge variant="outline">{messages.rangeHint}</Badge>
            </div>

            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>{messages.invalidLabel}</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </>
        ) : null}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { ResultCard }
