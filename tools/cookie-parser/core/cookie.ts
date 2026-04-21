type CookiePair = Readonly<{
  name: string
  value: string
}>

type ParsedCookieHeader = Readonly<{
  type: "cookie"
  cookies: CookiePair[]
  invalid: string[]
}>

type SetCookieEntry = Readonly<{
  name: string
  value: string
  attributes: Record<string, string | true>
}>

type ParsedSetCookieHeaders = Readonly<{
  type: "set-cookie"
  cookies: SetCookieEntry[]
  invalid: string[]
}>

type ParsedCookieData = ParsedCookieHeader | ParsedSetCookieHeaders

type HeaderType = ParsedCookieData["type"]

const COOKIE_HEADER_PREFIX = /^cookie\s*:/i
const SET_COOKIE_HEADER_PREFIX = /^set-cookie\s*:/i

function splitHeaderLines(value: string): string[] {
  return value
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function stripPrefix(value: string, pattern: RegExp): string {
  return value.replace(pattern, "").trim()
}

function unquote(value: string): string {
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1)
  }

  return value
}

function normalizeAttributeKey(value: string): string {
  return value.trim().toLowerCase()
}

function parseCookieHeader(value: string): ParsedCookieHeader {
  const cookies: CookiePair[] = []
  const invalid: string[] = []
  const lines = splitHeaderLines(value)
  const cookieLines = lines.filter((line) => COOKIE_HEADER_PREFIX.test(line))
  const targetLines = cookieLines.length > 0 ? cookieLines : lines

  for (const line of targetLines) {
    const content = stripPrefix(line, COOKIE_HEADER_PREFIX)

    if (!content) {
      continue
    }

    for (const segment of content.split(";")) {
      const trimmed = segment.trim()

      if (!trimmed) {
        continue
      }

      const equalIndex = trimmed.indexOf("=")

      if (equalIndex <= 0) {
        invalid.push(trimmed)
        continue
      }

      const name = trimmed.slice(0, equalIndex).trim()
      const rawValue = trimmed.slice(equalIndex + 1).trim()

      cookies.push({ name, value: unquote(rawValue) })
    }
  }

  return { type: "cookie", cookies, invalid }
}

function parseSetCookieHeaders(value: string): ParsedSetCookieHeaders {
  const cookies: SetCookieEntry[] = []
  const invalid: string[] = []
  const lines = splitHeaderLines(value)

  if (lines.length === 0) {
    return { type: "set-cookie", cookies, invalid }
  }

  const setCookieLines = lines.filter((line) =>
    SET_COOKIE_HEADER_PREFIX.test(line)
  )
  const targetLines = setCookieLines.length > 0 ? setCookieLines : lines

  for (const line of targetLines) {
    const content = stripPrefix(line, SET_COOKIE_HEADER_PREFIX)

    if (!content) {
      continue
    }

    const parts = content.split(";")
    const nameValue = parts.shift()

    if (!nameValue) {
      continue
    }

    const trimmed = nameValue.trim()
    const equalIndex = trimmed.indexOf("=")

    if (equalIndex <= 0) {
      invalid.push(trimmed)
      continue
    }

    const name = trimmed.slice(0, equalIndex).trim()
    const rawValue = trimmed.slice(equalIndex + 1).trim()
    const attributes: Record<string, string | true> = {}

    for (const part of parts) {
      const attribute = part.trim()

      if (!attribute) {
        continue
      }

      const attributeIndex = attribute.indexOf("=")

      if (attributeIndex === -1) {
        attributes[normalizeAttributeKey(attribute)] = true
        continue
      }

      const key = normalizeAttributeKey(attribute.slice(0, attributeIndex))

      if (!key) {
        invalid.push(attribute)
        continue
      }

      const rawAttributeValue = attribute.slice(attributeIndex + 1).trim()
      attributes[key] = unquote(rawAttributeValue)
    }

    cookies.push({ name, value: unquote(rawValue), attributes })
  }

  return { type: "set-cookie", cookies, invalid }
}

function parseCookieData(type: HeaderType, value: string): ParsedCookieData {
  return type === "cookie"
    ? parseCookieHeader(value)
    : parseSetCookieHeaders(value)
}

function formatParsedCookieData(value: ParsedCookieData): string {
  return JSON.stringify(value, null, 2)
}

function getDownloadFileName(type: HeaderType): string {
  return type === "cookie" ? "cookies.json" : "set-cookie.json"
}

export {
  formatParsedCookieData,
  getDownloadFileName,
  parseCookieData,
  parseCookieHeader,
  parseSetCookieHeaders,
}
export type {
  CookiePair,
  HeaderType,
  ParsedCookieData,
  ParsedCookieHeader,
  ParsedSetCookieHeaders,
  SetCookieEntry,
}
