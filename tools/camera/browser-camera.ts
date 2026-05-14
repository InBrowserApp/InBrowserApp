import type { CameraMode } from "./types"

type SupportState = "checking" | "supported" | "unsupported"
type FacingMode = "user" | "environment"
type ExtendedCapabilities = MediaTrackCapabilities & {
  torch?: boolean
  zoom?: { min: number; max: number; step?: number }
}
type ExtendedConstraintSet = MediaTrackConstraintSet & {
  torch?: boolean
  zoom?: number
}
type ZoomState = Readonly<{
  supported: boolean
  value: number
  min: number
  max: number
  step: number
}>
type TrackControls = Readonly<{
  torchSupported: boolean
  torchEnabled: boolean
  zoom: ZoomState
}>

const defaultZoom: ZoomState = {
  supported: false,
  value: 1,
  min: 1,
  max: 1,
  step: 0.1,
}

function resolveMediaSupport(): SupportState {
  return typeof navigator.mediaDevices?.getUserMedia === "function"
    ? "supported"
    : "unsupported"
}

function resolveRecorderSupport() {
  return typeof MediaRecorder !== "undefined"
}

function buildCameraConstraints(
  facingMode: FacingMode,
  mode: CameraMode,
  includeAudio = mode === "video"
): MediaStreamConstraints {
  return {
    video: {
      facingMode: { ideal: facingMode },
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
    audio: includeAudio
      ? {
          echoCancellation: true,
          noiseSuppression: true,
        }
      : false,
  }
}

function resolveTrackControls(track: MediaStreamTrack | null): TrackControls {
  const capabilities = (track?.getCapabilities?.() ??
    {}) as ExtendedCapabilities
  const settings = track?.getSettings?.() as { zoom?: number } | undefined

  if (!capabilities.zoom) {
    return {
      torchSupported: Boolean(capabilities.torch),
      torchEnabled: false,
      zoom: defaultZoom,
    }
  }

  return {
    torchSupported: Boolean(capabilities.torch),
    torchEnabled: false,
    zoom: {
      supported: true,
      min: capabilities.zoom.min,
      max: capabilities.zoom.max,
      step: capabilities.zoom.step || 0.1,
      value: settings?.zoom ?? capabilities.zoom.min,
    },
  }
}

async function requestCameraStream(
  facingMode: FacingMode,
  mode: CameraMode,
  includeAudio = mode === "video"
) {
  return navigator.mediaDevices.getUserMedia(
    buildCameraConstraints(facingMode, mode, includeAudio)
  )
}

async function applyTorchConstraint(track: MediaStreamTrack, enabled: boolean) {
  await track.applyConstraints({
    advanced: [{ torch: enabled } as ExtendedConstraintSet],
  })
}

async function applyZoomConstraint(track: MediaStreamTrack, value: number) {
  await track.applyConstraints({
    advanced: [{ zoom: value } as ExtendedConstraintSet],
  })
}

async function captureVideoFrame(video: HTMLVideoElement, mirrored: boolean) {
  const canvas = document.createElement("canvas")
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const context = canvas.getContext("2d")

  if (!context) return null

  if (mirrored) {
    context.translate(canvas.width, 0)
    context.scale(-1, 1)
  }
  context.drawImage(video, 0, 0, canvas.width, canvas.height)

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), "image/jpeg", 0.92)
  })
}

function isPermissionError(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === "NotAllowedError" || error.name === "PermissionDeniedError")
  )
}

export {
  applyTorchConstraint,
  applyZoomConstraint,
  buildCameraConstraints,
  captureVideoFrame,
  defaultZoom,
  isPermissionError,
  requestCameraStream,
  resolveMediaSupport,
  resolveRecorderSupport,
  resolveTrackControls,
}

export type { FacingMode, SupportState, ZoomState }
