type RomanNumeralConverterMessagesCatalog = Readonly<{
  converterTitle: string
  converterDescription: string
  arabicNumber: string
  arabicPlaceholder: string
  romanNumeral: string
  romanPlaceholder: string
  invalidRomanNumeral: string
  invalidArabicNumber: string
  outOfRangeArabicNumber: string
  resultTitle: string
  resultDescription: string
  emptyState: string
  validLabel: string
  invalidLabel: string
  rangeHint: string
  notationHint: string
  loadSample: string
  clearLabel: string
  copyLabel: string
  copiedLabel: string
}>

type RomanNumeralConverterMessages = RomanNumeralConverterMessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

type ResultStatus = "idle" | "valid" | "invalid"

export type {
  ResultStatus,
  RomanNumeralConverterMessages,
  RomanNumeralConverterMessagesCatalog,
}
