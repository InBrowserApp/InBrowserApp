import type { RegexFlag, RegexResultView } from "./core/regex-tester-replacer"

type RegexTesterReplacerLocalizedCatalog = Readonly<{
  sourceTitle: string
  sourceDescription: string
  sourceTextLabel: string
  sourceTextPlaceholder: string
  loadSample: string
  clearText: string
  patternTitle: string
  patternDescription: string
  patternLabel: string
  patternPlaceholder: string
  replacementLabel: string
  replacementPlaceholder: string
  replacementHint: string
  flagsLabel: string
  flagsHint: string
  globalFlagLabel: string
  ignoreCaseFlagLabel: string
  multilineFlagLabel: string
  dotAllFlagLabel: string
  unicodeFlagLabel: string
  stickyFlagLabel: string
  invalidPatternLabel: string
  summaryTitle: string
  summaryDescription: string
  summaryEmpty: string
  matchesCountLabel: string
  groupsCountLabel: string
  zeroLengthCountLabel: string
  resultsTitle: string
  resultsDescription: string
  resultViewLabel: string
  previewTabLabel: string
  matchesTabLabel: string
  replaceTabLabel: string
  previewEmpty: string
  previewTruncatedLabel: string
  matchesEmpty: string
  matchesTruncatedLabel: string
  matchIndexLabel: string
  matchRangeLabel: string
  matchEmptyLabel: string
  capturedGroupsLabel: string
  namedGroupsLabel: string
  replaceOutputEmpty: string
  copyLabel: string
  copiedLabel: string
  downloadLabel: string
}>

type RegexTesterReplacerMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  RegexTesterReplacerLocalizedCatalog

type RegexFlagOption = Readonly<{
  key: RegexFlag
  label: string
}>

type RegexViewOption = Readonly<{
  key: RegexResultView
  label: string
}>

type RegexExportState = Readonly<{
  downloadName: string
  downloadUrl: string | null
  value: string
}>

export type {
  RegexExportState,
  RegexFlagOption,
  RegexTesterReplacerLocalizedCatalog,
  RegexTesterReplacerMessages,
  RegexViewOption,
}
