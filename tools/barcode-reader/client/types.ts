import type { ToolMeta } from "@workspace/tool-sdk"
import type { BarcodeContentKind } from "../core/content-type"
import type { BarcodeScanResult } from "../core/barcode-decoder"

type BarcodeReaderMessages = Readonly<{
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
  formatLabel: string
  contentTypeLabel: string
  copyResultLabel: string
  copiedResultLabel: string
  openResultLabel: string
  sourceImageLabel: string
  sourceCameraLabel: string
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
  decodeImageError: string
  noBarcodeFoundError: string
  cameraFrameError: string
}>

type BarcodeScanSource = "image" | "camera"
type ScanMode = "upload" | "camera"

type BarcodeReaderResult = BarcodeScanResult &
  Readonly<{
    source: BarcodeScanSource
  }>

type CameraStatus =
  | "idle"
  | "starting"
  | "scanning"
  | "unsupported"
  | "permission-denied"
  | "error"

type ContentTypeLabelMap = Readonly<Record<BarcodeContentKind, string>>

export type {
  BarcodeReaderMessages,
  BarcodeReaderResult,
  CameraStatus,
  ContentTypeLabelMap,
  ScanMode,
}
