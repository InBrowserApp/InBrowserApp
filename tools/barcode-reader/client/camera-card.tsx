import type * as React from "react"

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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Camera,
  CameraOff,
  LoaderCircle,
  Play,
  Square,
  TriangleAlert,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { BarcodeReaderMessages, CameraStatus } from "./types"

type CameraCardProps = Readonly<{
  errorMessage: string
  messages: BarcodeReaderMessages
  onStartCamera: () => void
  onStopCamera: () => void
  status: CameraStatus
  videoRef: React.RefObject<HTMLVideoElement | null>
}>

function CameraStatusAlert({
  errorMessage,
  messages,
  status,
}: Pick<CameraCardProps, "errorMessage" | "messages" | "status">) {
  if (status === "unsupported") {
    return (
      <Alert>
        <CameraOff />
        <AlertTitle>{messages.cameraUnsupportedTitle}</AlertTitle>
        <AlertDescription>
          {messages.cameraUnsupportedDescription}
        </AlertDescription>
      </Alert>
    )
  }

  if (status === "permission-denied") {
    return (
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertTitle>{messages.cameraPermissionTitle}</AlertTitle>
        <AlertDescription>
          {errorMessage || messages.cameraPermissionDescription}
        </AlertDescription>
      </Alert>
    )
  }

  if (status === "error") {
    return (
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertTitle>{messages.cameraErrorTitle}</AlertTitle>
        <AlertDescription>
          {errorMessage || messages.cameraErrorDescription}
        </AlertDescription>
      </Alert>
    )
  }

  return null
}

function CameraCard({
  errorMessage,
  messages,
  onStartCamera,
  onStopCamera,
  status,
  videoRef,
}: CameraCardProps) {
  const isStarting = status === "starting"
  const isScanning = status === "scanning"
  const canStart =
    status === "idle" || status === "permission-denied" || status === "error"

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.cameraTitle}</CardTitle>
        <CardDescription>{messages.cameraDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted">
          <video
            ref={videoRef}
            aria-label={messages.cameraTitle}
            autoPlay
            className={cn(
              "h-full w-full bg-black object-cover transition-opacity",
              isScanning ? "opacity-100" : "opacity-0"
            )}
            muted
            playsInline
          />

          {isScanning ? (
            <div className="pointer-events-none absolute inset-4 rounded-xl border border-primary/80">
              <div className="absolute inset-x-8 top-1/2 h-px bg-primary shadow-[0_0_16px_var(--primary)]" />
              <div className="absolute top-0 left-0 size-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 size-8 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 size-8 border-b-2 border-l-2 border-primary" />
              <div className="absolute right-0 bottom-0 size-8 border-r-2 border-b-2 border-primary" />
            </div>
          ) : (
            <Empty className="absolute inset-0 border-0 bg-transparent">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  {isStarting ? <Spinner /> : <Camera />}
                </EmptyMedia>
                <EmptyTitle>
                  {isStarting
                    ? messages.startingCameraLabel
                    : messages.cameraIdleTitle}
                </EmptyTitle>
                <EmptyDescription>
                  {isStarting
                    ? messages.cameraScanningDescription
                    : messages.cameraIdleDescription}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>

        {isScanning ? (
          <Alert>
            <Camera />
            <AlertTitle>{messages.cameraScanningTitle}</AlertTitle>
            <AlertDescription>
              {messages.cameraScanningDescription}
            </AlertDescription>
          </Alert>
        ) : null}

        <CameraStatusAlert
          errorMessage={errorMessage}
          messages={messages}
          status={status}
        />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-end gap-3 border-t">
        {isScanning ? (
          <Button onClick={onStopCamera} type="button" variant="outline">
            <Square data-icon="inline-start" />
            {messages.stopCameraLabel}
          </Button>
        ) : (
          <Button
            disabled={!canStart || isStarting}
            onClick={onStartCamera}
            type="button"
          >
            {isStarting ? (
              <LoaderCircle data-icon="inline-start" className="animate-spin" />
            ) : (
              <Play data-icon="inline-start" />
            )}
            {isStarting
              ? messages.startingCameraLabel
              : messages.startCameraLabel}
          </Button>
        )}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { CameraCard }
