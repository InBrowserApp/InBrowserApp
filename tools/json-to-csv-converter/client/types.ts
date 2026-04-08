import type { JsonToCsvOptions } from "../core/convert-json-to-csv"

export type JsonToCsvConverterMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  importFromFileLabel: string
  jsonLabel: string
  jsonDescription: string
  jsonPlaceholder: string
  csvLabel: string
  csvDescription: string
  csvEmptyDescription: string
  invalidJsonLabel: string
  downloadCsvLabel: string
  copyCsvLabel: string
  copiedLabel: string
  optionsLabel: string
  optionsDescription: string
  delimiterLabel: string
  quoteCharLabel: string
  includeHeaderRowLabel: string
  escapeFormulaeLabel: string
}>

export type JsonToCsvOptionsStorageValue = Partial<JsonToCsvOptions>
