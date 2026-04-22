import type { ToolMeta } from "@workspace/tool-sdk"

import type {
  BlendMode,
  ColorSpace,
  GradientType,
  RadialShape,
  RadialSize,
} from "./core/gradient"
import type { GradientPresetId } from "./core/presets"

type CssGradientGeneratorMessagesCatalog = Readonly<{
  previewTitle: string
  previewHint: string
  randomizeLayer: string
  randomizeAll: string
  presetsTitle: string
  presetsSubtitle: string
  layersTitle: string
  layersSubtitle: string
  addLayer: string
  minLayerHint: string
  layerLabel: string
  duplicateLayer: string
  moveUp: string
  moveDown: string
  deleteLayer: string
  settingsTitle: string
  settingsSubtitle: string
  gradientType: string
  angle: string
  centerX: string
  centerY: string
  colorSpaceLabel: string
  blendMode: string
  shapeLabel: string
  sizeLabel: string
  stopsTitle: string
  trackHint: string
  stopColor: string
  stopPosition: string
  addStop: string
  deleteStop: string
  minStopsHint: string
  outputTitle: string
  outputSubtitle: string
  outputFormat: string
  copyCss: string
  downloadCss: string
  copyBackgroundImage: string
  copyBackground: string
  copyBlendMode: string
  exportTitle: string
  exportSubtitle: string
  exportWidth: string
  exportHeight: string
  downloadPng: string
  downloadJpg: string
  downloadWebp: string
  downloadSvg: string
  pngUnsupported: string
  jsonTitle: string
  jsonSubtitle: string
  copyJson: string
  downloadJson: string
  jsonPlaceholder: string
  loadJson: string
  invalidJson: string
  copiedLabel: string
  preset: Readonly<Record<GradientPresetId, string>>
  type: Readonly<Record<GradientType, string>>
  colorSpace: Readonly<Record<ColorSpace, string>>
  shape: Readonly<Record<RadialShape, string>>
  size: Readonly<Record<RadialSize, string>>
  format: Readonly<Record<"hex" | "rgba", string>>
  blend: Readonly<Record<BlendMode, string>>
}>

type CssGradientGeneratorMessages = CssGradientGeneratorMessagesCatalog &
  Readonly<{
    meta: ToolMeta
  }>

export type {
  CssGradientGeneratorMessages,
  CssGradientGeneratorMessagesCatalog,
}
