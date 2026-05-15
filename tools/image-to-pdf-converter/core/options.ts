type PageSizePreset = "a3" | "a4" | "a5" | "b5" | "letter" | "legal" | "tabloid"

type PageOrientation = "auto" | "portrait" | "landscape"
type FitMode = "contain" | "cover"
type QualityPreset = "best" | "balanced" | "small"
type Rotation = 0 | 90 | 180 | 270

type ConverterOptions = Readonly<{
  pageSize: PageSizePreset
  pageOrientation: PageOrientation
  fitMode: FitMode
  marginMm: number
  qualityPreset: QualityPreset
}>

type PageDimensions = Readonly<{
  width: number
  height: number
}>

type ImagePlacement = Readonly<{
  x: number
  y: number
  width: number
  height: number
}>

type PdfGenerationProgress = Readonly<{
  completed: number
  total: number
}>

const PAGE_SIZE_PRESETS = [
  "a3",
  "a4",
  "a5",
  "b5",
  "letter",
  "legal",
  "tabloid",
] as const satisfies readonly PageSizePreset[]

const PAGE_ORIENTATIONS = [
  "auto",
  "portrait",
  "landscape",
] as const satisfies readonly PageOrientation[]

const FIT_MODES = ["contain", "cover"] as const satisfies readonly FitMode[]
const QUALITY_PRESETS = [
  "best",
  "balanced",
  "small",
] as const satisfies readonly QualityPreset[]

const DEFAULT_CONVERTER_OPTIONS: ConverterOptions = {
  pageSize: "a4",
  pageOrientation: "auto",
  fitMode: "contain",
  marginMm: 12,
  qualityPreset: "balanced",
}

const MIN_MARGIN_MM = 0
const MAX_MARGIN_MM = 40

function clampMarginMm(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_CONVERTER_OPTIONS.marginMm
  }

  return Math.min(MAX_MARGIN_MM, Math.max(MIN_MARGIN_MM, Math.round(value)))
}

function getJpegQuality(qualityPreset: QualityPreset) {
  if (qualityPreset === "best") {
    return 0.92
  }

  if (qualityPreset === "small") {
    return 0.68
  }

  return 0.82
}

function normalizeRotation(rotation: number): Rotation {
  const normalizedRotation = ((rotation % 360) + 360) % 360

  if (
    normalizedRotation === 90 ||
    normalizedRotation === 180 ||
    normalizedRotation === 270
  ) {
    return normalizedRotation
  }

  return 0
}

export {
  DEFAULT_CONVERTER_OPTIONS,
  FIT_MODES,
  MAX_MARGIN_MM,
  MIN_MARGIN_MM,
  PAGE_ORIENTATIONS,
  PAGE_SIZE_PRESETS,
  QUALITY_PRESETS,
  clampMarginMm,
  getJpegQuality,
  normalizeRotation,
}
export type {
  ConverterOptions,
  FitMode,
  ImagePlacement,
  PageDimensions,
  PageOrientation,
  PageSizePreset,
  PdfGenerationProgress,
  QualityPreset,
  Rotation,
}
