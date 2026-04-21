/* v8 ignore file -- type-only definitions */
type NumberBaseConverterMessagesCatalog = Readonly<{
  standardBasesTitle: string
  standardBasesDescription: string
  extendedBasesTitle: string
  extendedBasesDescription: string
  customBaseCardTitle: string
  customBaseDescription: string
  customBaseHelp: string
  binaryLabel: string
  binaryPlaceholder: string
  octalLabel: string
  octalPlaceholder: string
  decimalLabel: string
  decimalPlaceholder: string
  hexLabel: string
  hexPlaceholder: string
  base32Label: string
  base32Placeholder: string
  base36Label: string
  base36Placeholder: string
  base62Label: string
  base62Placeholder: string
  base64Label: string
  base64Placeholder: string
  customBaseLabel: string
  customPlaceholder: string
  copyValueLabel: string
  copiedLabel: string
  resetLabel: string
  invalidInputDescription: string
}>

type NumberBaseConverterMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  NumberBaseConverterMessagesCatalog

export type { NumberBaseConverterMessages, NumberBaseConverterMessagesCatalog }
