import type { ToolMeta } from "@workspace/tool-sdk"

type CameraMode = "photo" | "video"
type CameraOutputKind = CameraMode

type CameraMessagesCatalog = Readonly<{
  viewfinderTitle: string
  viewfinderDescription: string
  startCameraLabel: string
  stopCameraLabel: string
  retryPermissionLabel: string
  preparingCamera: string
  cameraIdleTitle: string
  cameraIdleDescription: string
  cameraActiveLabel: string
  cameraNotSupportedTitle: string
  cameraNotSupportedDescription: string
  cameraPermissionDeniedTitle: string
  cameraPermissionDeniedDescription: string
  cameraErrorTitle: string
  cameraErrorDescription: string
  cameraNotReady: string
  photoMode: string
  videoMode: string
  capturePhotoLabel: string
  startRecordingLabel: string
  stopRecordingLabel: string
  recordingStatusLabel: string
  videoNotSupported: string
  recordingFailed: string
  switchCameraLabel: string
  torchLabel: string
  torchOnLabel: string
  torchOffLabel: string
  micOnLabel: string
  micOffLabel: string
  zoomLabel: string
  outputTitle: string
  outputDescription: string
  emptyOutputTitle: string
  emptyOutputDescription: string
  photoOutputLabel: string
  videoOutputLabel: string
  formatLabel: string
  fileSizeLabel: string
  downloadLabel: string
  clearLabel: string
  formatUnknown: string
  photoName: string
  videoName: string
}>

type CameraMessages = CameraMessagesCatalog & {
  meta: ToolMeta
}

type CameraOutput = Readonly<{
  blob: Blob
  fileName: string
  kind: CameraOutputKind
  mimeType: string
}>

export type {
  CameraMessages,
  CameraMessagesCatalog,
  CameraMode,
  CameraOutput,
  CameraOutputKind,
}
