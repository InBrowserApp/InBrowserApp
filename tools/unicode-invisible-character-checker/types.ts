type UnicodeInvisibleLocalizedCatalog = Readonly<{
  inputTitle: string
  inputDescription: string
  inputPlaceholder: string
  loadSample: string
  clearText: string
  filtersTitle: string
  filtersDescription: string
  selectAll: string
  resetFilters: string
  zeroWidthLabel: string
  bidiControlLabel: string
  spaceLikeLabel: string
  formatLabel: string
  emptyStateTitle: string
  emptyStateDescription: string
  resultsTitle: string
  resultsDescription: string
  findingsCountLabel: string
  cleanLengthLabel: string
  activeFiltersLabel: string
  noIssuesLabel: string
  cleanedTitle: string
  annotatedTitle: string
  copyLabel: string
  copiedLabel: string
  downloadCleaned: string
  downloadAnnotated: string
  findingsTableTitle: string
  indexLabel: string
  lineLabel: string
  columnLabel: string
  codeLabel: string
  nameLabel: string
  categoryLabel: string
  previewLabel: string
}>

type UnicodeInvisibleMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  UnicodeInvisibleLocalizedCatalog

export type { UnicodeInvisibleLocalizedCatalog, UnicodeInvisibleMessages }
