import { MESSAGE_CATALOG_A } from "./message-catalog-a"
import { MESSAGE_CATALOG_B } from "./message-catalog-b"

const LEGACY_MESSAGE_CATALOG = {
  ...MESSAGE_CATALOG_A,
  ...MESSAGE_CATALOG_B,
} as const

type LegacyMessages = Readonly<{
  options: string
  format: string
  range: string
  "format-named": string
  "format-decimal": string
  "format-hex": string
  "range-minimal": string
  "range-non-ascii": string
  "range-all-special": string
  "plain-text": string
  "plain-text-placeholder": string
  "encoded-text": string
  "encoded-text-placeholder": string
}>

type HtmlEntityMessages = Readonly<{
  optionsLabel: string
  formatLabel: string
  rangeLabel: string
  formatNamedLabel: string
  formatDecimalLabel: string
  formatHexLabel: string
  rangeMinimalLabel: string
  rangeNonAsciiLabel: string
  rangeAllSpecialLabel: string
  plainTextLabel: string
  plainTextPlaceholder: string
  encodedTextLabel: string
  encodedTextPlaceholder: string
  copyPlainTextLabel: string
  copyEncodedTextLabel: string
  copiedLabel: string
  resetLabel: string
}>

function toMessages(catalog: LegacyMessages): HtmlEntityMessages {
  return {
    optionsLabel: catalog.options,
    formatLabel: catalog.format,
    rangeLabel: catalog.range,
    formatNamedLabel: catalog["format-named"],
    formatDecimalLabel: catalog["format-decimal"],
    formatHexLabel: catalog["format-hex"],
    rangeMinimalLabel: catalog["range-minimal"],
    rangeNonAsciiLabel: catalog["range-non-ascii"],
    rangeAllSpecialLabel: catalog["range-all-special"],
    plainTextLabel: catalog["plain-text"],
    plainTextPlaceholder: catalog["plain-text-placeholder"],
    encodedTextLabel: catalog["encoded-text"],
    encodedTextPlaceholder: catalog["encoded-text-placeholder"],
    copyPlainTextLabel: "Copy plain text",
    copyEncodedTextLabel: "Copy encoded text",
    copiedLabel: "Copied",
    resetLabel: "Reset example",
  }
}

function getHtmlEntityMessages(language: string) {
  const catalog =
    LEGACY_MESSAGE_CATALOG[language as keyof typeof LEGACY_MESSAGE_CATALOG] ??
    LEGACY_MESSAGE_CATALOG.en

  return toMessages(catalog)
}

export { getHtmlEntityMessages }
export type { HtmlEntityMessages }
