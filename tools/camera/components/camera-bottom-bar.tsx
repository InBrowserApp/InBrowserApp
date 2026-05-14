import { Button } from "@workspace/ui/components/ui/button"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Camera, CameraOff, Video } from "@workspace/ui/icons"

import type { CameraMessages, CameraMode } from "../types"
import type { SupportState } from "../browser-camera"

type CameraBottomBarProps = Readonly<{
  messages: CameraMessages
  mode: CameraMode
  supportState: SupportState
  hasStarted: boolean
  isPreparing: boolean
  isRecording: boolean
  permissionDenied: boolean
  recorderSupported: boolean
  onModeChange: (mode: CameraMode) => void
  onShutter: () => void
  onStopCamera: () => void
}>

function CameraBottomBar({
  messages,
  mode,
  supportState,
  hasStarted,
  isPreparing,
  isRecording,
  permissionDenied,
  recorderSupported,
  onModeChange,
  onShutter,
  onStopCamera,
}: CameraBottomBarProps) {
  const canUseCamera = supportState === "supported"
  const canSwitchMode = !isPreparing && !isRecording
  const shutterDisabled =
    !canUseCamera || isPreparing || permissionDenied || !hasStarted
  const shutterLabel =
    mode === "video"
      ? isRecording
        ? messages.stopRecordingLabel
        : messages.startRecordingLabel
      : messages.capturePhotoLabel

  return (
    <div className="absolute inset-x-0 bottom-0 grid grid-cols-[1fr_auto_1fr] items-center gap-3 bg-linear-to-t from-black/80 to-transparent p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <ToggleGroup
        type="single"
        value={mode}
        size="sm"
        variant="outline"
        onValueChange={(value) => {
          if (value) onModeChange(value as CameraMode)
        }}
        className="justify-self-start bg-background/95"
      >
        <ToggleGroupItem value="photo" disabled={!canSwitchMode}>
          <Camera data-icon="inline-start" />
          {messages.photoMode}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="video"
          disabled={!canSwitchMode || !recorderSupported}
        >
          <Video data-icon="inline-start" />
          {messages.videoMode}
        </ToggleGroupItem>
      </ToggleGroup>

      <button
        type="button"
        aria-label={shutterLabel}
        disabled={shutterDisabled}
        onClick={onShutter}
        className="inline-flex size-20 items-center justify-center rounded-full border-4 border-white/90 bg-transparent p-0 shadow-xl transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span
          className={
            isRecording
              ? "size-10 rounded-xl bg-destructive transition-all"
              : "size-14 rounded-full bg-white transition-all"
          }
        />
      </button>

      <div className="justify-self-end">
        <Button
          type="button"
          size="icon-sm"
          variant="secondary"
          aria-label={hasStarted ? messages.stopCameraLabel : shutterLabel}
          disabled={!hasStarted || isRecording}
          onClick={onStopCamera}
        >
          <CameraOff />
        </Button>
      </div>
    </div>
  )
}

export { CameraBottomBar }
