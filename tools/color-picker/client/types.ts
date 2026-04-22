import type { ToolMeta } from "@workspace/tool-sdk"

interface ColorPickerMessagesCatalog {
  screenTitle: string
  screenDescription: string
  screenButton: string
  screenUnsupported: string
  imageTitle: string
  imageDescription: string
  imageButton: string
  imageHint: string
  uploadHint: string
  imageError: string
  clearImage: string
  resultsTitle: string
  sourceLabel: string
  sourceScreen: string
  sourceImage: string
  sourceUnknown: string
  showAlpha: string
  hex: string
  rgb: string
  rgba: string
  hsl: string
  hsla: string
  hsv: string
  hsva: string
  cmyk: string
  alpha: string
  copyValue: string
  copiedValue: string
}

type ColorPickerMessages = ColorPickerMessagesCatalog & {
  meta: ToolMeta
}

export type { ColorPickerMessages, ColorPickerMessagesCatalog }
