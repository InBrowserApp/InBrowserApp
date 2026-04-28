import type { TextDiffCompareOptions } from "./core/text-diff"

type TextDiffViewMode = "side-by-side" | "unified"

type TextDiffLocalizedCatalog = Readonly<{
  inputTitle: string
  inputDescription: string
  originalLabel: string
  modifiedLabel: string
  originalPlaceholder: string
  modifiedPlaceholder: string
  textStatsLabel: string
  importOriginalLabel: string
  importModifiedLabel: string
  swapTextsLabel: string
  loadSampleLabel: string
  clearTextsLabel: string
  optionsTitle: string
  optionsDescription: string
  viewModeLabel: string
  sideBySideLabel: string
  unifiedLabel: string
  hideUnchangedLabel: string
  ignoreCaseLabel: string
  ignoreWhitespaceLabel: string
  summaryTitle: string
  summaryDescription: string
  unchangedLabel: string
  changedLabel: string
  addedLabel: string
  removedLabel: string
  resultsTitle: string
  resultsDescription: string
  copyDiffLabel: string
  copiedLabel: string
  downloadDiffLabel: string
  emptyStateTitle: string
  emptyStateDescription: string
  noChangesTitle: string
  noChangesDescription: string
  originalLegendLabel: string
  modifiedLegendLabel: string
}>

type TextDiffMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  TextDiffLocalizedCatalog

type TextDiffSettings = Readonly<{
  compareOptions: TextDiffCompareOptions
  viewMode: TextDiffViewMode
  hideUnchanged: boolean
}>

export type {
  TextDiffLocalizedCatalog,
  TextDiffMessages,
  TextDiffSettings,
  TextDiffViewMode,
}
