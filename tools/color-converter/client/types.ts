import type { ToolMeta } from "@workspace/tool-sdk"

interface ColorConverterMessagesCatalog {
  optionsTitle: string
  resultsTitle: string
  previewTitle: string
  enableAlphaLabel: string
  invalidColorMessage: string
  copyValueLabel: string
  copiedLabel: string
  keywordLabel: string
  hexInfo: string
  rgbInfo: string
  hslInfo: string
  hsvInfo: string
  hwbInfo: string
  labInfo: string
  lchInfo: string
  cmykInfo: string
  keywordInfo: string
}

type ColorConverterMessages = ColorConverterMessagesCatalog & {
  meta: ToolMeta
}

export type { ColorConverterMessages, ColorConverterMessagesCatalog }
