const BARCODE_FORMATS = [
  "CODE128",
  "CODE128A",
  "CODE128B",
  "CODE128C",
  "EAN13",
  "EAN8",
  "EAN5",
  "EAN2",
  "UPC",
  "UPCE",
  "CODE39",
  "ITF",
  "ITF14",
  "MSI",
  "MSI10",
  "MSI11",
  "MSI1010",
  "MSI1110",
  "pharmacode",
  "codabar",
  "CODE93",
] as const

const TEXT_ALIGNMENTS = ["left", "center", "right"] as const
const TEXT_POSITIONS = ["top", "bottom"] as const

type BarcodeFormat = (typeof BARCODE_FORMATS)[number]
type BarcodeTextAlign = (typeof TEXT_ALIGNMENTS)[number]
type BarcodeTextPosition = (typeof TEXT_POSITIONS)[number]

type BarcodeGeneratorOptions = Readonly<{
  text: string
  format: BarcodeFormat
  width: number
  height: number
  margin: number
  displayValue: boolean
  textAlign: BarcodeTextAlign
  textPosition: BarcodeTextPosition
  fontSize: number
  lineColor: string
  background: string
}>

type StoredBarcodeGeneratorOptions =
  | Partial<BarcodeGeneratorOptions>
  | null
  | undefined

const DEFAULT_BARCODE_GENERATOR_OPTIONS: BarcodeGeneratorOptions = {
  text: "0123456789",
  format: "CODE128",
  width: 2,
  height: 100,
  margin: 10,
  displayValue: true,
  textAlign: "center",
  textPosition: "bottom",
  fontSize: 20,
  lineColor: "#000000",
  background: "#ffffff",
}

function clampInteger(
  value: unknown,
  min: number,
  max: number,
  fallback: number
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback
  }

  return Math.min(max, Math.max(min, Math.round(value)))
}

function normalizeColor(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback
  }

  return /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : fallback
}

function normalizeTextAlign(value: unknown): BarcodeTextAlign {
  return TEXT_ALIGNMENTS.includes(value as BarcodeTextAlign)
    ? (value as BarcodeTextAlign)
    : DEFAULT_BARCODE_GENERATOR_OPTIONS.textAlign
}

function normalizeTextPosition(value: unknown): BarcodeTextPosition {
  return TEXT_POSITIONS.includes(value as BarcodeTextPosition)
    ? (value as BarcodeTextPosition)
    : DEFAULT_BARCODE_GENERATOR_OPTIONS.textPosition
}

function normalizeBarcodeFormat(value: unknown): BarcodeFormat {
  return BARCODE_FORMATS.includes(value as BarcodeFormat)
    ? (value as BarcodeFormat)
    : DEFAULT_BARCODE_GENERATOR_OPTIONS.format
}

function normalizeBarcodeGeneratorOptions(
  options?: StoredBarcodeGeneratorOptions
): BarcodeGeneratorOptions {
  return {
    text:
      typeof options?.text === "string"
        ? options.text
        : DEFAULT_BARCODE_GENERATOR_OPTIONS.text,
    format: normalizeBarcodeFormat(options?.format),
    width: clampInteger(
      options?.width,
      1,
      8,
      DEFAULT_BARCODE_GENERATOR_OPTIONS.width
    ),
    height: clampInteger(
      options?.height,
      20,
      300,
      DEFAULT_BARCODE_GENERATOR_OPTIONS.height
    ),
    margin: clampInteger(
      options?.margin,
      0,
      30,
      DEFAULT_BARCODE_GENERATOR_OPTIONS.margin
    ),
    displayValue:
      typeof options?.displayValue === "boolean"
        ? options.displayValue
        : DEFAULT_BARCODE_GENERATOR_OPTIONS.displayValue,
    textAlign: normalizeTextAlign(options?.textAlign),
    textPosition: normalizeTextPosition(options?.textPosition),
    fontSize: clampInteger(
      options?.fontSize,
      8,
      48,
      DEFAULT_BARCODE_GENERATOR_OPTIONS.fontSize
    ),
    lineColor: normalizeColor(
      options?.lineColor,
      DEFAULT_BARCODE_GENERATOR_OPTIONS.lineColor
    ),
    background: normalizeColor(
      options?.background,
      DEFAULT_BARCODE_GENERATOR_OPTIONS.background
    ),
  }
}

function parseStoredBarcodeGeneratorOptions(raw: string | null) {
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as StoredBarcodeGeneratorOptions
    return normalizeBarcodeGeneratorOptions(parsed)
  } catch {
    return null
  }
}

function getRenderableBarcodeText(text: string) {
  return text === "" ? " " : text
}

function toJsBarcodeOptions(options: BarcodeGeneratorOptions) {
  return {
    background: options.background,
    displayValue: options.displayValue,
    fontSize: options.fontSize,
    format: options.format,
    height: options.height,
    lineColor: options.lineColor,
    margin: options.margin,
    textAlign: options.textAlign,
    textPosition: options.textPosition,
    width: options.width,
  } as const
}

export {
  BARCODE_FORMATS,
  DEFAULT_BARCODE_GENERATOR_OPTIONS,
  getRenderableBarcodeText,
  normalizeBarcodeGeneratorOptions,
  parseStoredBarcodeGeneratorOptions,
  toJsBarcodeOptions,
}
export type {
  BarcodeFormat,
  BarcodeGeneratorOptions,
  BarcodeTextAlign,
  BarcodeTextPosition,
}
