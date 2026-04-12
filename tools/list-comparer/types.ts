import type { ListResultKey } from "./core/compare-lists"

type ListComparerLocalizedCatalog = Readonly<{
  inputTitle: string
  inputDescription: string
  listALabel: string
  listBLabel: string
  listStatsLabel: string
  listAPlaceholder: string
  listBPlaceholder: string
  swapLists: string
  loadSample: string
  clearLists: string
  optionsTitle: string
  optionsDescription: string
  delimiterLabel: string
  customDelimiterLabel: string
  trimItemsLabel: string
  ignoreCaseLabel: string
  omitEmptyItemsLabel: string
  sortResultsLabel: string
  delimiterNewlineLabel: string
  delimiterCommaLabel: string
  delimiterTabLabel: string
  delimiterCustomLabel: string
  summaryTitle: string
  summaryDescription: string
  sharedLabel: string
  leftOnlyLabel: string
  rightOnlyLabel: string
  allUniqueLabel: string
  leftDuplicatesLabel: string
  rightDuplicatesLabel: string
  resultsTitle: string
  resultsDescription: string
  activeCountLabel: string
  resultModeLabel: string
  emptyStateTitle: string
  emptyStateDescription: string
  noItemsLabel: string
  copyLabel: string
  copiedLabel: string
  downloadLabel: string
}>

type ListComparerMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  ListComparerLocalizedCatalog

type ResultOption = Readonly<{
  key: ListResultKey
  label: string
  count: number
  output: string
  downloadName: string
}>

export type { ListComparerLocalizedCatalog, ListComparerMessages, ResultOption }
