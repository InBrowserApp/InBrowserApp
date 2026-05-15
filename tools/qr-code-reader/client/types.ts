import type { ToolMeta } from "@workspace/tool-sdk"
import type { QRCodeContentKind } from "../core/content-type"

type QRCodeReaderMessages = Readonly<{
  meta: ToolMeta
  sourceTitle: string
  sourceDescription: string
  uploadModeLabel: string
  cameraModeLabel: string
  uploadTitle: string
  uploadDescription: string
  chooseImageLabel: string
  uploadHint: string
  supportedFormatsLabel: string
  selectedImageLabel: string
  changeImageLabel: string
  removeImageLabel: string
  decodingImageLabel: string
  cameraTitle: string
  cameraDescription: string
  startCameraLabel: string
  startingCameraLabel: string
  stopCameraLabel: string
  cameraIdleTitle: string
  cameraIdleDescription: string
  cameraScanningTitle: string
  cameraScanningDescription: string
  cameraUnsupportedTitle: string
  cameraUnsupportedDescription: string
  cameraPermissionTitle: string
  cameraPermissionDescription: string
  cameraErrorTitle: string
  cameraErrorDescription: string
  resultTitle: string
  resultDescription: string
  emptyResultTitle: string
  emptyResultDescription: string
  decodedContentLabel: string
  contentTypeLabel: string
  copyResultLabel: string
  copiedResultLabel: string
  openResultLabel: string
  sourceImageLabel: string
  sourceCameraLabel: string
  dimensionsLabel: string
  contentTypeText: string
  contentTypeUrl: string
  contentTypeEmail: string
  contentTypePhone: string
  contentTypeSms: string
  contentTypeWifi: string
  contentTypeVcard: string
  contentTypeCalendar: string
  contentTypeLocation: string
  errorTitle: string
  invalidFileTypeError: string
  imageLoadError: string
  canvasUnavailableError: string
  canvasReadError: string
  noQrFoundError: string
  cameraFrameError: string
}>

type QRScanSource = "image" | "camera"
type ScanMode = "upload" | "camera"

type QRScanResult = Readonly<{
  data: string
  height: number
  source: QRScanSource
  width: number
}>

type CameraStatus =
  | "idle"
  | "starting"
  | "scanning"
  | "unsupported"
  | "permission-denied"
  | "error"

type ContentTypeLabelMap = Readonly<Record<QRCodeContentKind, string>>

export type {
  CameraStatus,
  ContentTypeLabelMap,
  QRCodeReaderMessages,
  QRScanResult,
  ScanMode,
}
