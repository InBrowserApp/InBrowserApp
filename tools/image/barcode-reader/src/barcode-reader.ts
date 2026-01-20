import { BarcodeFormat, BrowserMultiFormatReader } from '@zxing/browser'
import { ChecksumException, FormatException, NotFoundException } from '@zxing/library'

export type BarcodeScanResult = {
  text: string
  format: string
}

const supportedFormats: BarcodeFormat[] = [
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

const decodeErrorNames = new Set(['NotFoundException', 'ChecksumException', 'FormatException'])

type ZxingResult = {
  getText: () => string
  getBarcodeFormat: () => BarcodeFormat
}

export function createBarcodeReader() {
  const reader = new BrowserMultiFormatReader(undefined, { delayBetweenScanAttempts: 150 })
  reader.possibleFormats = supportedFormats
  return reader
}

export function toBarcodeResult(result: ZxingResult): BarcodeScanResult {
  const format = result.getBarcodeFormat()
  const label = BarcodeFormat[format] ?? String(format)

  return {
    text: result.getText(),
    format: label,
  }
}

export function isIgnorableDecodeError(error: unknown): boolean {
  if (!error) return false

  if (
    error instanceof NotFoundException ||
    error instanceof ChecksumException ||
    error instanceof FormatException
  ) {
    return true
  }

  if (typeof error === 'object' && 'name' in error) {
    const name = (error as { name?: string }).name
    return !!name && decodeErrorNames.has(name)
  }

  return false
}

export async function readBarcodeFromFile(file: File): Promise<BarcodeScanResult | null> {
  const reader = createBarcodeReader()
  const url = URL.createObjectURL(file)

  try {
    const result = await reader.decodeFromImageUrl(url)
    return toBarcodeResult(result)
  } catch (error) {
    if (isIgnorableDecodeError(error)) return null
    throw error
  } finally {
    URL.revokeObjectURL(url)
  }
}
