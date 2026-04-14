import type {
  BarcodeFormat,
  BarcodeGeneratorOptions,
  BarcodeTextAlign,
  BarcodeTextPosition,
} from "../core/barcode-options"

type BarcodeGeneratorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  options: string
  optionsDescription: string
  preview: string
  download: string
  text: string
  textPlaceholder: string
  format: string
  barWidth: string
  barHeight: string
  margin: string
  displayValue: string
  textAlign: string
  textPosition: string
  fontSize: string
  lineColor: string
  background: string
  left: string
  center: string
  right: string
  top: string
  bottom: string
}>

type BarcodeOptionChoice<TValue extends string> = Readonly<{
  label: string
  value: TValue
}>

type BarcodeOptionHandlers = Readonly<{
  onBooleanChange: <TKey extends keyof BarcodeGeneratorOptions>(
    key: TKey,
    value: BarcodeGeneratorOptions[TKey]
  ) => void
  onColorChange: (key: "lineColor" | "background", value: string) => void
  onFormatChange: (value: BarcodeFormat) => void
  onNumberChange: (
    key: "width" | "height" | "margin" | "fontSize",
    value: number
  ) => void
  onTextAlignChange: (value: BarcodeTextAlign) => void
  onTextChange: (value: string) => void
  onTextPositionChange: (value: BarcodeTextPosition) => void
}>

export type {
  BarcodeGeneratorMessages,
  BarcodeOptionChoice,
  BarcodeOptionHandlers,
}
