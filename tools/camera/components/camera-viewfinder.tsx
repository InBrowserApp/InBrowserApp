import type { RefObject } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Slider } from "@workspace/ui/components/ui/slider"
import {
  Flashlight,
  FlashlightOff,
  Mic,
  MicOff,
  RefreshCcw,
} from "@workspace/ui/icons"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"

import type { CameraMessages, CameraMode, CameraOutputKind } from "../types"
import { CameraBottomBar } from "./camera-bottom-bar"
import { CameraStatusOverlay } from "./camera-status-overlay"

type CameraViewfinderProps = Readonly<{
  messages: CameraMessages
  videoRef: RefObject<HTMLVideoElement | null>
  mode: CameraMode
  supportState: "checking" | "supported" | "unsupported"
  hasStarted: boolean
  isPreparing: boolean
  isRecording: boolean
  permissionDenied: boolean
  errorMessage: string
  formattedDuration: string
  recorderSupported: boolean
  micEnabled: boolean
  torchSupported: boolean
  torchEnabled: boolean
  zoomSupported: boolean
  zoomValue: number
  zoomMin: number
  zoomMax: number
  zoomStep: number
  outputKind: CameraOutputKind | null
  outputUrl: string
  isMirrored: boolean
  onStartCamera: () => void
  onStopCamera: () => void
  onModeChange: (mode: CameraMode) => void
  onShutter: () => void
  onSwitchCamera: () => void
  onToggleTorch: () => void
  onToggleMic: () => void
  onZoomChange: (value: number) => void
  onOpenOutput: () => void
}>

function CameraViewfinder({
  messages,
  videoRef,
  mode,
  supportState,
  hasStarted,
  isPreparing,
  isRecording,
  permissionDenied,
  errorMessage,
  formattedDuration,
  recorderSupported,
  micEnabled,
  torchSupported,
  torchEnabled,
  zoomSupported,
  zoomValue,
  zoomMin,
  zoomMax,
  zoomStep,
  outputKind,
  outputUrl,
  isMirrored,
  onStartCamera,
  onStopCamera,
  onModeChange,
  onShutter,
  onSwitchCamera,
  onToggleTorch,
  onToggleMic,
  onZoomChange,
  onOpenOutput,
}: CameraViewfinderProps) {
  const canUseCamera = supportState === "supported"
  const canSwitchMode = !isPreparing && !isRecording
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.viewfinderTitle}</CardTitle>
        <CardDescription>{messages.viewfinderDescription}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="gap-4 p-4">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-5xl overflow-hidden rounded-2xl bg-neutral-950 shadow-2xl ring-1 ring-foreground/10 sm:aspect-video sm:rounded-3xl">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            data-testid="camera-preview"
            className={
              isMirrored
                ? "h-full w-full scale-x-[-1] object-cover"
                : "h-full w-full object-cover"
            }
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-linear-to-b from-black/70 to-transparent p-3">
            <div className="pointer-events-auto flex items-center gap-2">
              {torchSupported ? (
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  aria-label={
                    torchEnabled
                      ? messages.torchOffLabel
                      : messages.torchOnLabel
                  }
                  onClick={onToggleTorch}
                >
                  {torchEnabled ? <FlashlightOff /> : <Flashlight />}
                </Button>
              ) : null}

              {mode === "video" ? (
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  aria-label={
                    micEnabled ? messages.micOnLabel : messages.micOffLabel
                  }
                  onClick={onToggleMic}
                  disabled={!hasStarted || isRecording}
                >
                  {micEnabled ? <Mic /> : <MicOff />}
                </Button>
              ) : null}
            </div>

            {isRecording ? (
              <Badge className="text-destructive-foreground pointer-events-auto gap-2 bg-destructive">
                <span className="size-2 rounded-full bg-current" />
                {messages.recordingStatusLabel} {formattedDuration}
              </Badge>
            ) : hasStarted ? (
              <Badge className="pointer-events-auto" variant="secondary">
                {messages.cameraActiveLabel}
              </Badge>
            ) : null}

            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              aria-label={messages.switchCameraLabel}
              disabled={!canSwitchMode || !canUseCamera}
              onClick={onSwitchCamera}
              className="pointer-events-auto"
            >
              <RefreshCcw />
            </Button>
          </div>

          <CameraStatusOverlay
            messages={messages}
            supportState={supportState}
            hasStarted={hasStarted}
            isPreparing={isPreparing}
            permissionDenied={permissionDenied}
            errorMessage={errorMessage}
            onStartCamera={onStartCamera}
          />

          {zoomSupported ? (
            <div className="absolute inset-x-4 bottom-28 flex items-center gap-3 rounded-full bg-black/55 px-3 py-2 text-white shadow-lg">
              <span className="text-xs font-medium">{messages.zoomLabel}</span>
              <Slider
                aria-label={messages.zoomLabel}
                value={[zoomValue]}
                min={zoomMin}
                max={zoomMax}
                step={zoomStep}
                disabled={isPreparing}
                onValueChange={(value) => {
                  onZoomChange(value[0] ?? zoomValue)
                }}
              />
              <span className="min-w-10 text-right text-xs font-medium">
                {zoomValue.toFixed(1)}x
              </span>
            </div>
          ) : null}

          {outputUrl ? (
            <button
              type="button"
              aria-label={messages.outputTitle}
              onClick={onOpenOutput}
              className="absolute bottom-24 left-4 size-16 overflow-hidden rounded-xl border-2 border-white/70 bg-black shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {outputKind === "photo" ? (
                <img
                  src={outputUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={outputUrl}
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ) : null}

          <CameraBottomBar
            messages={messages}
            mode={mode}
            supportState={supportState}
            hasStarted={hasStarted}
            isPreparing={isPreparing}
            isRecording={isRecording}
            permissionDenied={permissionDenied}
            recorderSupported={recorderSupported}
            onModeChange={onModeChange}
            onShutter={onShutter}
            onStopCamera={onStopCamera}
          />
        </div>
      </ToolPanelCardContent>

      {!recorderSupported ? (
        <ToolPanelCardFooter className="border-t text-sm text-muted-foreground">
          {messages.videoNotSupported}
        </ToolPanelCardFooter>
      ) : null}
    </ToolPanelCard>
  )
}

export { CameraViewfinder }
