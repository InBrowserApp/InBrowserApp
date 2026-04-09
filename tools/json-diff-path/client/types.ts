import type { JsonDiffOperation } from "../core/json-diff"

export type ResultMode = "paths" | "patch"

export type JsonDiffPathMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  toolbarLabel: string
  swapLabel: string
  formatJsonLabel: string
  useSampleLabel: string
  clearLabel: string
  compareNowLabel: string
  largeCompareHint: string
  originalJsonLabel: string
  originalJsonDescription: string
  originalJsonPlaceholder: string
  modifiedJsonLabel: string
  modifiedJsonDescription: string
  modifiedJsonPlaceholder: string
  invalidOriginalJsonLabel: string
  invalidModifiedJsonLabel: string
  resultLabel: string
  resultDescription: string
  filtersLabel: string
  addLabel: string
  removeLabel: string
  replaceLabel: string
  resultModeLabel: string
  pathsTabLabel: string
  patchTabLabel: string
  showingChangesLabel: string
  noChangesLabel: string
  resultEmptyDescription: string
  copyResultLabel: string
  copiedLabel: string
  downloadJsonLabel: string
}>

export type OperationOption = Readonly<{
  label: string
  value: JsonDiffOperation
}>
