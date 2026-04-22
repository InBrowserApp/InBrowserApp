import type {
  PlaceholderBackgroundType,
  PlaceholderOptions,
  PlaceholderScale,
} from "../core/placeholder-image"

type PlaceholderImageGeneratorMessages = Readonly<{
  autoFontSizeHint: string
  backgroundColorLabel: string
  backgroundDescription: string
  backgroundTitle: string
  currentSizeLabel: string
  customTextLabel: string
  dimensionsDescription: string
  dimensionsTitle: string
  downloadDescription: string
  downloadLabel: string
  exportError: string
  fontSizeLabel: string
  gradientAngleLabel: string
  gradientColor1Label: string
  gradientColor2Label: string
  heightLabel: string
  linearGradientLabel: string
  meta: {
    description: string
    name: string
  }
  optionsDescription: string
  optionsTitle: string
  presetLabel: string
  previewDescription: string
  previewTitle: string
  qualityDescription: string
  qualityLabel: string
  radialGradientLabel: string
  scaleLabel: string
  solidBackgroundLabel: string
  textColorLabel: string
  textDescription: string
  textTitle: string
  widthLabel: string
}>

type PlaceholderBackgroundChoice = Readonly<{
  label: string
  value: PlaceholderBackgroundType
}>

type PlaceholderOptionHandlers = Readonly<{
  onOptionChange: <TKey extends keyof PlaceholderOptions>(
    key: TKey,
    value: PlaceholderOptions[TKey]
  ) => void
  onScaleChange: (value: PlaceholderScale) => void
  onQualityChange: (value: number) => void
  onPresetSelect: (width: number, height: number) => void
}>

export type {
  PlaceholderBackgroundChoice,
  PlaceholderImageGeneratorMessages,
  PlaceholderOptionHandlers,
}
