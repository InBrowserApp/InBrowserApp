import { useMemo } from "react"

import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { cn } from "@workspace/ui/lib/utils"
import { Mic, TriangleAlert } from "@workspace/ui/icons"

import { formatRecordingDuration } from "../core/recorder"
import { RecorderButtons } from "./recorder-buttons"

import type { RecorderError, RecorderState } from "../client/use-audio-recorder"
import type { AudioRecorderMessages } from "../types"

type AudioRecorderControlCardProps = Readonly<{
  messages: AudioRecorderMessages
  isSupported: boolean
  recorderState: RecorderState
  isPreparing: boolean
  error: RecorderError | null
  elapsedMs: number
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
}>

function AudioRecorderControlCard({
  messages,
  isSupported,
  recorderState,
  isPreparing,
  error,
  elapsedMs,
  onStart,
  onPause,
  onResume,
  onStop,
}: AudioRecorderControlCardProps) {
  const statusLabel = useMemo(() => {
    if (recorderState === "recording") {
      return messages.statusRecording
    }

    if (recorderState === "paused") {
      return messages.statusPaused
    }

    return messages.statusIdle
  }, [
    messages.statusIdle,
    messages.statusPaused,
    messages.statusRecording,
    recorderState,
  ])
  const displayDuration = formatRecordingDuration(elapsedMs)
  const statusVariant = recorderState === "idle" ? "outline" : "secondary"

  return (
    <Card className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>{messages.controlTitle}</CardTitle>
        <CardDescription>{messages.controlDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 pt-4">
        <RecorderErrorAlerts
          messages={messages}
          isSupported={isSupported}
          error={error}
        />

        <div className="flex min-h-52 flex-col items-center justify-center gap-5 rounded-lg border bg-muted/30 p-5 text-center">
          <div
            className={cn(
              "flex size-20 items-center justify-center rounded-full",
              "border bg-background text-muted-foreground ring-8",
              "ring-muted transition-colors",
              recorderState === "recording" &&
                "border-destructive/30 text-destructive ring-destructive/10",
              recorderState === "paused" &&
                "border-primary/30 text-primary ring-primary/10"
            )}
            aria-hidden="true"
          >
            <Mic />
          </div>

          <div className="grid gap-2">
            <div
              className="font-mono text-5xl leading-none font-semibold tabular-nums"
              aria-live="polite"
            >
              {displayDuration}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">
                {messages.statusLabel}
              </span>
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>
          </div>

          <RecorderButtons
            messages={messages}
            isSupported={isSupported}
            recorderState={recorderState}
            isPreparing={isPreparing}
            error={error}
            onStart={onStart}
            onPause={onPause}
            onResume={onResume}
            onStop={onStop}
          />
        </div>

        <div className="grid gap-2 text-sm text-muted-foreground">
          <p>{messages.privacyNote}</p>
          <p>{messages.formatNote}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function RecorderErrorAlerts({
  messages,
  isSupported,
  error,
}: Readonly<{
  messages: AudioRecorderMessages
  isSupported: boolean
  error: RecorderError | null
}>) {
  return (
    <>
      {!isSupported ? (
        <RecorderAlert
          title={messages.unsupportedTitle}
          description={messages.unsupportedDescription}
        />
      ) : null}
      {error === "permission" ? (
        <RecorderAlert
          destructive
          title={messages.permissionDeniedTitle}
          description={messages.permissionDeniedDescription}
        />
      ) : null}
      {error === "failed" ? (
        <RecorderAlert
          destructive
          title={messages.recordingFailedTitle}
          description={messages.recordingFailedDescription}
        />
      ) : null}
    </>
  )
}

function RecorderAlert({
  title,
  description,
  destructive = false,
}: Readonly<{
  title: string
  description: string
  destructive?: boolean
}>) {
  return (
    <Alert variant={destructive ? "destructive" : "default"}>
      <TriangleAlert />
      <AlertDescription>
        <span className="font-medium">{title}</span>
        <span className="block">{description}</span>
      </AlertDescription>
    </Alert>
  )
}

export { AudioRecorderControlCard }
