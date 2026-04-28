import type { ToolMeta } from "@workspace/tool-sdk"

type NumberBaseConverterMessagesCatalog = Readonly<{
  converterTitle: string
  converterDescription: string
  commonBasesTitle: string
  commonBasesDescription: string
  extendedBasesTitle: string
  extendedBasesDescription: string
  customBaseTitle: string
  customBaseDescription: string
  customBaseValueLabel: string
  binaryLabel: string
  binaryPlaceholder: string
  octalLabel: string
  octalPlaceholder: string
  decimalLabel: string
  decimalPlaceholder: string
  hexadecimalLabel: string
  hexadecimalPlaceholder: string
  base32Label: string
  base32Placeholder: string
  base36Label: string
  base36Placeholder: string
  base62Label: string
  base62Placeholder: string
  base64Label: string
  base64Placeholder: string
  customLabel: string
  customPlaceholder: string
  invalidValueMessage: string
  standardAlphabetHint: string
  base64AlphabetHint: string
  copyValueLabel: string
  copiedLabel: string
  loadSampleLabel: string
  clearAllLabel: string
}>

type NumberBaseConverterMessages = NumberBaseConverterMessagesCatalog &
  Readonly<{
    meta: ToolMeta
  }>

export type { NumberBaseConverterMessages, NumberBaseConverterMessagesCatalog }
