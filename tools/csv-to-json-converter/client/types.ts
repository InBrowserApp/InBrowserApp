import type { CsvToJsonOptions } from "../core/convert-csv-to-json"

export type CsvToJsonConverterMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  importFromFileLabel: string
  csvLabel: string
  csvDescription: string
  csvPlaceholder: string
  jsonLabel: string
  jsonDescription: string
  downloadJsonLabel: string
  jsonEmptyDescription: string
  invalidCsvLabel: string
  optionsLabel: string
  optionsDescription: string
  noHeaderLabel: string
  headersLabel: string
  headersPlaceholder: string
  delimiterLabel: string
  quoteLabel: string
  trimLabel: string
  checkTypeLabel: string
  skipEmptyLinesLabel: string
  skipEmptyLinesNoneLabel: string
  skipEmptyLinesTrueLabel: string
  skipEmptyLinesGreedyLabel: string
  escapeCharLabel: string
  newlineLabel: string
  previewLabel: string
  commentsLabel: string
  commentsPlaceholder: string
  fastModeLabel: string
  skipFirstNLinesLabel: string
  delimitersToGuessLabel: string
  delimitersToGuessPlaceholder: string
  includeColumnsLabel: string
  ignoreColumnsLabel: string
  regexPlaceholder: string
  indentSizeLabel: string
  indentSizeDescription: string
  copyJsonLabel: string
  copiedLabel: string
}>

export type CsvToJsonOptionsStorageValue = Partial<CsvToJsonOptions>
