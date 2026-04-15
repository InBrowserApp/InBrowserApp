import type { ReactNode } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Pause, Play, TriangleAlert } from "@workspace/ui/icons"

import type { MorseCodeConverterMessagesCatalog, ResultStatus } from "../types"

type ResultCardProps = Readonly<{
  errorMessage: string | null
  isPlaying: boolean
  messages: MorseCodeConverterMessagesCatalog
  morseOutput: string
  status: ResultStatus
  textOutput: string
  onPlay: () => void
  onStop: () => void
}>

function ResultPanel({
  actions,
  copiedLabel,
  copyLabel,
  copyValue,
  label,
  value,
}: Readonly<{
  actions?: ReactNode
  copiedLabel: string
  copyLabel: string
  copyValue: string
  label: string
  value: string
}>) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <div className="flex items-center gap-2">
          {actions}
          <ToolCopyButton
            value={copyValue}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
            variant="ghost"
          />
        </div>
      </div>
      <Textarea
        readOnly
        rows={4}
        value={value}
        className="mt-3 min-h-24 resize-none font-mono text-sm"
      />
    </div>
  )
}

function ResultCard({
  errorMessage,
  isPlaying,
  messages,
  morseOutput,
  status,
  textOutput,
  onPlay,
  onStop,
}: ResultCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
        {status === "valid" ? (
          <CardAction>
            <Badge variant="secondary">{messages.validLabel}</Badge>
          </CardAction>
        ) : null}
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {status === "idle" ? (
          <p className="text-sm text-muted-foreground">
            {messages.resultDescription}
          </p>
        ) : null}

        {status === "invalid" && errorMessage ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.invalidLabel}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {status === "valid" ? (
          <div className="grid gap-4">
            <ResultPanel
              label={messages.textLabel}
              value={textOutput}
              copyValue={textOutput}
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
            />
            <ResultPanel
              label={messages.morseCodeLabel}
              value={morseOutput}
              copyValue={morseOutput}
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
              actions={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={isPlaying ? messages.stop : messages.play}
                  onClick={isPlaying ? onStop : onPlay}
                >
                  {isPlaying ? <Pause /> : <Play />}
                </Button>
              }
            />
          </div>
        ) : null}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { ResultCard }
