/* v8 ignore file */

type CrcChecksumCalculatorMessages = Readonly<{
  inputLabel: string
  plainTextLabel: string
  plainTextDescription: string
  importFromFileLabel: string
  selectedFileDescription: string
  switchToTextLabel: string
  checksumResultLabel: string
  checksumResultDescription: string
  resultFilterLabel: string
  allResultsLabel: string
  crc8ResultsLabel: string
  crc16ResultsLabel: string
  crc32ResultsLabel: string
  crc64ResultsLabel: string
  otherResultsLabel: string
  bitWidthLabel: string
  checksumValueLabel: string
  resultCountLabel: string
  emptyInputTitle: string
  emptyInputDescription: string
  copyResultLabel: string
  copyVisibleResultsLabel: string
  copiedLabel: string
  calculationError: string
}>

type CrcChecksumCalculatorPageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  CrcChecksumCalculatorMessages

export type { CrcChecksumCalculatorMessages, CrcChecksumCalculatorPageMessages }
