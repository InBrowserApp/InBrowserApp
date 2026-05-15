import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Pause, Play, Square, TriangleAlert, Video } from "@workspace/ui/icons"

import type {
  AlertMessages,
  RecorderError,
  RecorderMessages,
  RecorderStatus,
  SupportStatus,
} from "../types"

type RecorderCardProps = Readonly<{
  alerts: AlertMessages
  messages: RecorderMessages
  status: RecorderStatus
  supportStatus: SupportStatus
  error: RecorderError | null
  formattedDuration: string
  isPreparing: boolean
  isPaused: boolean
  isRecording: boolean
  isSupported: boolean
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
}>

function RecorderCard({
  alerts,
  messages,
  status,
  supportStatus,
  error,
  formattedDuration,
  isPreparing,
  isPaused,
  isRecording,
  isSupported,
  onStart,
  onPause,
  onResume,
  onStop,
}: RecorderCardProps) {
  const alert = getAlert(alerts, supportStatus, error)
  const statusLabel = getStatusLabel(messages, status, supportStatus)

  return (
    <Card aria-labelledby="screen-recorder-controls-title">
      <CardHeader>
        <CardTitle id="screen-recorder-controls-title">
          {messages.title}
        </CardTitle>
        <CardDescription>{messages.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {alert ? (
          <Alert variant={alert.variant}>
            <TriangleAlert />
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-3 rounded-lg bg-muted/50 p-3 sm:grid-cols-2">
          <StatusMetric label={messages.statusLabel} value={statusLabel} />
          <StatusMetric
            label={messages.durationLabel}
            value={formattedDuration}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isRecording ? (
            <Button
              type="button"
              variant="destructive"
              disabled={!isSupported || isPreparing}
              onClick={onStart}
            >
              {isPreparing ? (
                <Spinner data-icon="inline-start" aria-hidden="true" />
              ) : (
                <Video data-icon="inline-start" />
              )}
              {getStartLabel(messages, error, isPreparing)}
            </Button>
          ) : isPaused ? (
            <Button type="button" onClick={onResume}>
              <Play data-icon="inline-start" />
              {messages.resumeLabel}
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={onPause}>
              <Pause data-icon="inline-start" />
              {messages.pauseLabel}
            </Button>
          )}

          {isRecording ? (
            <Button type="button" variant="destructive" onClick={onStop}>
              <Square data-icon="inline-start" />
              {messages.stopLabel}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function StatusMetric({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge variant="outline" aria-live="polite">
        {value}
      </Badge>
    </div>
  )
}

function getAlert(
  alerts: AlertMessages,
  supportStatus: SupportStatus,
  error: RecorderError | null
) {
  if (supportStatus === "unsupported") {
    return {
      title: alerts.unsupportedTitle,
      description: alerts.unsupportedDescription,
      variant: "default" as const,
    }
  }

  if (error === "screen-permission") {
    return {
      title: alerts.screenPermissionTitle,
      description: alerts.screenPermissionDescription,
      variant: "destructive" as const,
    }
  }

  if (error === "microphone-permission") {
    return {
      title: alerts.microphonePermissionTitle,
      description: alerts.microphonePermissionDescription,
      variant: "destructive" as const,
    }
  }

  if (error === "microphone-unsupported") {
    return {
      title: alerts.microphoneUnsupportedTitle,
      description: alerts.genericErrorDescription,
      variant: "destructive" as const,
    }
  }

  if (error === "generic") {
    return {
      title: alerts.genericErrorTitle,
      description: alerts.genericErrorDescription,
      variant: "destructive" as const,
    }
  }

  return null
}

function getStatusLabel(
  messages: RecorderMessages,
  status: RecorderStatus,
  supportStatus: SupportStatus
) {
  if (supportStatus === "checking") return messages.statusChecking
  if (status === "recording") return messages.statusRecording
  if (status === "paused") return messages.statusPaused
  return messages.statusReady
}

function getStartLabel(
  messages: RecorderMessages,
  error: RecorderError | null,
  isPreparing: boolean
) {
  if (isPreparing) return messages.preparingLabel
  if (error === "screen-permission" || error === "microphone-permission") {
    return messages.retryLabel
  }

  return messages.startLabel
}

export { RecorderCard }
