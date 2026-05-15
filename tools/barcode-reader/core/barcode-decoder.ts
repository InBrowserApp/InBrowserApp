import { BrowserMultiFormatReader } from "@zxing/browser"
import {
  BarcodeFormat,
  ChecksumException,
  DecodeHintType,
  FormatException,
  NotFoundException,
} from "@zxing/library"

type BarcodeScanResult = Readonly<{
  format: string
  text: string
}>

type ZxingResult = Readonly<{
  getBarcodeFormat: () => BarcodeFormat
  getText: () => string
}>

const SUPPORTED_IMAGE_ACCEPT = "image/*"
const BARCODE_DECODER_ERRORS = {
  decodeFailed: "BARCODE_DECODE_FAILED",
  invalidFileType: "BARCODE_INVALID_FILE_TYPE",
} as const

const SUPPORTED_BARCODE_FORMATS: readonly BarcodeFormat[] = [
  BarcodeFormat.QR_CODE,
  BarcodeFormat.DATA_MATRIX,
  BarcodeFormat.PDF_417,
  BarcodeFormat.AZTEC,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_93,
  BarcodeFormat.CODABAR,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.ITF,
]

const IGNORABLE_DECODE_ERROR_NAMES = new Set([
  "ChecksumException",
  "FormatException",
  "NotFoundException",
])

function isSupportedImageFile(file: File) {
  return file.type.startsWith("image/")
}

function createDecoderError(code: string) {
  return new Error(code)
}

function createBarcodeReader() {
  const hints = new Map<DecodeHintType, unknown>([
    [DecodeHintType.POSSIBLE_FORMATS, [...SUPPORTED_BARCODE_FORMATS]],
  ])

  return new BrowserMultiFormatReader(hints, {
    delayBetweenScanAttempts: 150,
  })
}

function getBarcodeFormatName(format: BarcodeFormat) {
  return BarcodeFormat[format] ?? String(format)
}

function formatBarcodeFormat(format: string) {
  return format.replace(/_/g, " ")
}

function toBarcodeResult(result: ZxingResult): BarcodeScanResult {
  return {
    format: getBarcodeFormatName(result.getBarcodeFormat()),
    text: result.getText(),
  }
}

function isNamedDecodeError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof error.name === "string" &&
    IGNORABLE_DECODE_ERROR_NAMES.has(error.name)
  )
}

function isIgnorableDecodeError(error: unknown) {
  return (
    error instanceof NotFoundException ||
    error instanceof ChecksumException ||
    error instanceof FormatException ||
    isNamedDecodeError(error)
  )
}

async function decodeBarcodeFromImageFile(file: File) {
  if (!isSupportedImageFile(file)) {
    throw createDecoderError(BARCODE_DECODER_ERRORS.invalidFileType)
  }

  const reader = createBarcodeReader()
  const url = URL.createObjectURL(file)

  try {
    return toBarcodeResult(await reader.decodeFromImageUrl(url))
  } catch (error) {
    if (isIgnorableDecodeError(error)) {
      return null
    }

    throw createDecoderError(BARCODE_DECODER_ERRORS.decodeFailed)
  } finally {
    URL.revokeObjectURL(url)
  }
}

export {
  BARCODE_DECODER_ERRORS,
  SUPPORTED_BARCODE_FORMATS,
  SUPPORTED_IMAGE_ACCEPT,
  createBarcodeReader,
  decodeBarcodeFromImageFile,
  formatBarcodeFormat,
  isIgnorableDecodeError,
  isSupportedImageFile,
  toBarcodeResult,
}
export type { BarcodeScanResult, ZxingResult }
