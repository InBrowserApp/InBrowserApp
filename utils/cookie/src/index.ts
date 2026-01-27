export type CookiePair = {
  name: string
  value: string
}

export type ParsedCookieHeader = {
  type: 'cookie'
  cookies: CookiePair[]
  invalid: string[]
}

export type SetCookieEntry = {
  name: string
  value: string
  attributes: Record<string, string | true>
}

export type ParsedSetCookieHeaders = {
  type: 'set-cookie'
  cookies: SetCookieEntry[]
  invalid: string[]
}

const COOKIE_HEADER_PREFIX = /^cookie\s*:/i
const SET_COOKIE_HEADER_PREFIX = /^set-cookie\s*:/i

function splitHeaderLines(value: string): string[] {
  return value
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function stripPrefix(value: string, pattern: RegExp): string {
  return value.replace(pattern, '').trim()
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

export function parseCookieHeader(value: string): ParsedCookieHeader {
  const cookies: CookiePair[] = []
  const invalid: string[] = []
  const lines = splitHeaderLines(value)

  for (const line of lines) {
    const content = stripPrefix(line, COOKIE_HEADER_PREFIX)
    if (!content) continue

    for (const segment of content.split(';')) {
      const trimmed = segment.trim()
      if (!trimmed) continue

      const equalIndex = trimmed.indexOf('=')
      if (equalIndex <= 0) {
        invalid.push(trimmed)
        continue
      }

      const name = trimmed.slice(0, equalIndex).trim()
      const rawValue = trimmed.slice(equalIndex + 1).trim()
      cookies.push({ name, value: unquote(rawValue) })
    }
  }

  return { type: 'cookie', cookies, invalid }
}

export function parseSetCookieHeaders(value: string): ParsedSetCookieHeaders {
  const cookies: SetCookieEntry[] = []
  const invalid: string[] = []
  const lines = splitHeaderLines(value)

  if (lines.length === 0) {
    return { type: 'set-cookie', cookies, invalid }
  }

  const setCookieLines = lines.filter((line) => SET_COOKIE_HEADER_PREFIX.test(line))
  const targetLines = setCookieLines.length > 0 ? setCookieLines : lines

  for (const line of targetLines) {
    const content = stripPrefix(line, SET_COOKIE_HEADER_PREFIX)
    if (!content) continue

    const parts = content.split(';')
    const nameValue = parts.shift()
    if (!nameValue) continue

    const trimmed = nameValue.trim()

    const equalIndex = trimmed.indexOf('=')
    if (equalIndex <= 0) {
      invalid.push(trimmed)
      continue
    }

    const name = trimmed.slice(0, equalIndex).trim()
    const rawValue = trimmed.slice(equalIndex + 1).trim()
    const attributes: Record<string, string | true> = {}

    for (const part of parts) {
      const attr = part.trim()
      if (!attr) continue

      const attrIndex = attr.indexOf('=')
      if (attrIndex === -1) {
        const key = normalizeAttributeKey(attr)
        attributes[key] = true
        continue
      }

      const key = normalizeAttributeKey(attr.slice(0, attrIndex))
      if (!key) {
        invalid.push(attr)
        continue
      }

      const rawAttrValue = attr.slice(attrIndex + 1).trim()
      attributes[key] = unquote(rawAttrValue)
    }

    cookies.push({ name, value: unquote(rawValue), attributes })
  }

  return { type: 'set-cookie', cookies, invalid }
}
