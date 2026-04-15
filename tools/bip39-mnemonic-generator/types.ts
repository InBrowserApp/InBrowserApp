import type { Bip39Tab, Bip39WordCount, Bip39WordlistName } from "./core/bip39"

type Bip39WordlistOption = Readonly<{
  label: string
  value: Bip39WordlistName
}>

type Bip39MnemonicGeneratorMessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  modeLabel: string
  generateTabLabel: string
  validateTabLabel: string
  convertTabLabel: string
  wordlistLabel: string
  wordCountLabel: string
  validationMnemonicLabel: string
  entropyInputLabel: string
  conversionMnemonicLabel: string
  entropyBitsLabel: string
  resultsTitle: string
  resultsDescription: string
  generatedMnemonicLabel: string
  generatedEntropyLabel: string
  validationEmptyLabel: string
  validationWordCountLabel: string
  validationEntropyLabel: string
  validationValidLabel: string
  validationInvalidLabel: string
  validationValidMessage: string
  validationInvalidMessage: string
  entropyToMnemonicLabel: string
  entropyToMnemonicPlaceholder: string
  mnemonicToEntropyLabel: string
  mnemonicToEntropyPlaceholder: string
  entropyInvalidMessage: string
  mnemonicInvalidMessage: string
  generatedPlaceholder: string
  copyLabel: string
  copiedLabel: string
  downloadLabel: string
  regenerateLabel: string
}>

type Bip39MnemonicGeneratorMessages = Bip39MnemonicGeneratorMessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

type ValidationState = "empty" | "valid" | "invalid"

type Bip39OptionsCardProps = Readonly<{
  activeTab: Bip39Tab
  conversionMnemonic: string
  conversionMnemonicId: string
  entropyInput: string
  entropyInputId: string
  messages: Bip39MnemonicGeneratorMessagesCatalog
  strengthBits: number
  validationMnemonic: string
  validationMnemonicId: string
  wordCount: Bip39WordCount
  wordlist: Bip39WordlistName
  wordlistOptions: readonly Bip39WordlistOption[]
  onActiveTabChange: (value: Bip39Tab) => void
  onConversionMnemonicChange: (value: string) => void
  onEntropyInputChange: (value: string) => void
  onValidationMnemonicChange: (value: string) => void
  onWordCountChange: (value: string) => void
  onWordlistChange: (value: string) => void
}>

type Bip39ResultsCardProps = Readonly<{
  activeTab: Bip39Tab
  downloadUrl: string | null
  generatedEntropy: string
  generatedMnemonic: string
  messages: Bip39MnemonicGeneratorMessagesCatalog
  strengthBits: number
  validationEntropy: string
  validationState: ValidationState
  validationWordCount: number
  wordCount: Bip39WordCount
  entropyHasError: boolean
  entropyMnemonic: string
  mnemonicEntropy: string
  mnemonicHasError: boolean
  onRegenerate: () => void
}>

export type {
  Bip39MnemonicGeneratorMessages,
  Bip39MnemonicGeneratorMessagesCatalog,
  Bip39OptionsCardProps,
  Bip39ResultsCardProps,
  Bip39WordlistOption,
}
