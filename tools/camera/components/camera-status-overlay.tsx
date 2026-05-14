import { Button } from "@workspace/ui/components/ui/button"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Camera } from "@workspace/ui/icons"

import type { CameraMessages } from "../types"
import type { SupportState } from "../browser-camera"

type CameraStatusOverlayProps = Readonly<{
  messages: CameraMessages
  supportState: SupportState
  hasStarted: boolean
  isPreparing: boolean
  permissionDenied: boolean
  errorMessage: string
  onStartCamera: () => void
}>

function CameraStatusOverlay({
  messages,
  supportState,
  hasStarted,
  isPreparing,
  permissionDenied,
  errorMessage,
  onStartCamera,
}: CameraStatusOverlayProps) {
  if (supportState === "supported" && hasStarted && !isPreparing) {
    if (!permissionDenied && !errorMessage) return null
  }

  const title =
    supportState === "unsupported"
      ? messages.cameraNotSupportedTitle
      : permissionDenied
        ? messages.cameraPermissionDeniedTitle
        : errorMessage
          ? messages.cameraErrorTitle
          : hasStarted || isPreparing
            ? messages.preparingCamera
            : messages.cameraIdleTitle
  const description =
    supportState === "unsupported"
      ? messages.cameraNotSupportedDescription
      : permissionDenied
        ? messages.cameraPermissionDeniedDescription
        : errorMessage || messages.cameraIdleDescription
  const buttonLabel = permissionDenied
    ? messages.retryPermissionLabel
    : messages.startCameraLabel

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 p-6 text-center text-white">
      <div className="flex flex-col items-center gap-2" aria-live="polite">
        {isPreparing ? <Spinner /> : <Camera />}
        <p className="font-heading text-lg font-medium">{title}</p>
        <p className="max-w-xs text-sm text-white/80">{description}</p>
      </div>
      {supportState === "supported" && !isPreparing ? (
        <Button type="button" onClick={onStartCamera}>
          <Camera data-icon="inline-start" />
          {buttonLabel}
        </Button>
      ) : null}
    </div>
  )
}

export { CameraStatusOverlay }
