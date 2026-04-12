import type { AsciiArtMetrics } from "./core/ascii-art"

type AsciiArtGeneratorLocalizedCatalog = Readonly<{
  inputTitle: string
  inputDescription: string
  inputPlaceholder: string
  loadSample: string
  clearText: string
  optionsTitle: string
  optionsDescription: string
  fontLabel: string
  alignLabel: string
  widthLabel: string
  widthHint: string
  leftAlign: string
  centerAlign: string
  rightAlign: string
  metricsTitle: string
  metricsDescription: string
  fontMetric: string
  alignMetric: string
  widthMetric: string
  linesMetric: string
  widestLineMetric: string
  charactersMetric: string
  outputTitle: string
  outputDescription: string
  outputEmptyTitle: string
  outputEmptyDescription: string
  renderingLabel: string
  renderErrorTitle: string
  copyLabel: string
  copiedLabel: string
  downloadLabel: string
}>

type AsciiArtGeneratorClientMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  AsciiArtGeneratorLocalizedCatalog

type AsciiArtOutputState =
  | Readonly<{
      state: "empty"
      metrics: AsciiArtMetrics
    }>
  | Readonly<{
      state: "rendering"
      metrics: AsciiArtMetrics
    }>
  | Readonly<{
      state: "ready"
      output: string
      metrics: AsciiArtMetrics
    }>
  | Readonly<{
      state: "error"
      message: string
      metrics: AsciiArtMetrics
    }>

type AsciiArtGeneratorClientProps = Readonly<{
  messages: AsciiArtGeneratorClientMessages
}>

export type {
  AsciiArtGeneratorClientProps,
  AsciiArtGeneratorLocalizedCatalog,
  AsciiArtOutputState,
}
