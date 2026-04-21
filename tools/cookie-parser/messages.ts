import { MESSAGE_CATALOG_A } from "./message-catalog-a"
import { MESSAGE_CATALOG_B } from "./message-catalog-b"

const MESSAGE_CATALOG = {
  ...MESSAGE_CATALOG_A,
  ...MESSAGE_CATALOG_B,
} as const

type CookieParserMessages = Readonly<{
  configurationLabel: string
  configurationDescription: string
  headerTypeLabel: string
  headerCookieLabel: string
  headerSetCookieLabel: string
  inputLabel: string
  inputDescription: string
  inputPlaceholder: string
  outputLabel: string
  outputDescription: string
  outputPlaceholder: string
  copyOutputLabel: string
  downloadJsonLabel: string
  copiedLabel: string
  resetExampleLabel: string
  noCookiesFoundLabel: string
  invalidSegmentsLabel: string
}>

function getCookieParserMessages(language: string): CookieParserMessages {
  return (
    MESSAGE_CATALOG[language as keyof typeof MESSAGE_CATALOG] ??
    MESSAGE_CATALOG.en
  )
}

export { getCookieParserMessages }
export type { CookieParserMessages }
