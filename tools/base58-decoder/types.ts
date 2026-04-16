import type { Base58AlphabetKey } from "./core/base58"

type Base58DecoderMessagesCatalog = Readonly<{
  optionsTitle: string
  alphabetLabel: string
  alphabetBitcoinLabel: string
  alphabetFlickrLabel: string
  alphabetRippleLabel: string
  inputTitle: string
  inputPlaceholder: string
  importFromFileLabel: string
  decodedOutputTitle: string
  decodedOutputEmptyDescription: string
  downloadFileLabel: string
  previewTruncatedLabel: string
  copyResultLabel: string
  copiedLabel: string
  resetLabel: string
  invalidBase58Title: string
  fileReadFailedTitle: string
}>

type Base58DecoderPageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  Base58DecoderMessagesCatalog

type Base58AlphabetOption = Readonly<{
  value: Base58AlphabetKey
  label: string
}>

export type {
  Base58AlphabetOption,
  Base58DecoderMessagesCatalog,
  Base58DecoderPageMessages,
}
