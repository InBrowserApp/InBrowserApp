const ABSOLUTE_URL_PATTERN = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//
const PROTOCOL_PATTERN = /^[a-zA-Z][a-zA-Z\d+.-]*$/

const URL_EXAMPLES = {
  api: "https://api.example.com:8443/v1/search?q=openai&limit=25#response",
  auth: "https://alexa:pa55word@example.com/dashboard?tab=security",
  campaign:
    "https://www.example.com/pricing?utm_source=newsletter&utm_medium=email&utm_campaign=spring-launch#plans",
} as const

type UrlExampleKey = keyof typeof URL_EXAMPLES

type UrlQueryParam = Readonly<{
  key: string
  value: string
}>

type UrlDraft<TQueryParam extends UrlQueryParam = UrlQueryParam> = Readonly<{
  protocol: string
  username: string
  password: string
  hostname: string
  port: string
  pathname: string
  hash: string
  queryParams: readonly TQueryParam[]
}>

type UrlParseErrorCode = "empty-input" | "relative-url" | "invalid-url"
type UrlBuildErrorCode =
  | "missing-protocol"
  | "invalid-protocol"
  | "missing-hostname"
  | "invalid-port"

type UrlParseResult =
  | Readonly<{
      ok: true
      normalizedUrl: string
      draft: UrlDraft
    }>
  | Readonly<{
      ok: false
      code: UrlParseErrorCode
    }>

type UrlBuildResult =
  | Readonly<{
      ok: true
      normalizedUrl: string
      url: URL
    }>
  | Readonly<{
      ok: false
      code: UrlBuildErrorCode
    }>

type UrlDiagnostics = Readonly<{
  origin: string
  authority: string
  protocol: string
  hash: string
  queryCount: number
  pathSegments: readonly string[]
}>

function getExampleUrl(key: UrlExampleKey) {
  return URL_EXAMPLES[key]
}

function listExampleUrls() {
  return URL_EXAMPLES
}

function parseUrlInput(input: string): UrlParseResult {
  const trimmed = input.trim()

  if (!trimmed) {
    return { ok: false, code: "empty-input" }
  }

  if (!ABSOLUTE_URL_PATTERN.test(trimmed)) {
    return { ok: false, code: "relative-url" }
  }

  try {
    const url = new URL(trimmed)

    return {
      ok: true,
      normalizedUrl: url.toString(),
      draft: urlToDraft(url),
    }
  } catch {
    return { ok: false, code: "invalid-url" }
  }
}

function buildUrlFromDraft<TQueryParam extends UrlQueryParam>(
  draft: UrlDraft<TQueryParam>
): UrlBuildResult {
  const protocol = sanitizeProtocol(draft.protocol)

  if (!protocol) {
    return { ok: false, code: "missing-protocol" }
  }

  if (!PROTOCOL_PATTERN.test(protocol)) {
    return { ok: false, code: "invalid-protocol" }
  }

  const hostname = draft.hostname.trim()

  if (!hostname) {
    return { ok: false, code: "missing-hostname" }
  }

  const port = draft.port.trim()

  if (port && !isValidPort(port)) {
    return { ok: false, code: "invalid-port" }
  }

  const url = new URL(`${protocol}://${hostname}`)
  url.username = draft.username.trim()
  url.password = draft.password.trim()
  url.port = port
  url.pathname = normalizePathname(draft.pathname)
  url.search = createQueryString(draft.queryParams)
  url.hash = normalizeHash(draft.hash)

  return {
    ok: true,
    normalizedUrl: url.toString(),
    url,
  }
}

function describeUrl(input: URL | string): UrlDiagnostics {
  const url = typeof input === "string" ? new URL(input) : input

  return {
    origin: url.origin,
    authority: formatAuthority(url),
    protocol: url.protocol.replace(/:$/, ""),
    hash: safeDecode(url.hash.replace(/^#/, "")),
    queryCount: Array.from(url.searchParams.entries()).length,
    pathSegments: splitPathSegments(url.pathname),
  }
}

function urlToDraft(url: URL): UrlDraft {
  return {
    protocol: url.protocol.replace(/:$/, ""),
    username: safeDecode(url.username),
    password: safeDecode(url.password),
    hostname: url.hostname,
    port: url.port,
    pathname: safeDecode(url.pathname),
    hash: safeDecode(url.hash.replace(/^#/, "")),
    queryParams: Array.from(url.searchParams.entries()).map(([key, value]) => ({
      key,
      value,
    })),
  }
}

function createQueryString(queryParams: readonly UrlQueryParam[]) {
  if (queryParams.length === 0) {
    return ""
  }

  const searchParams = new URLSearchParams()

  for (const { key, value } of queryParams) {
    searchParams.append(key, value)
  }

  return searchParams.toString()
}

function formatAuthority(url: URL) {
  const credentials = url.username
    ? `${safeDecode(url.username)}${url.password ? `:${safeDecode(url.password)}` : ""}@`
    : ""

  return `${credentials}${url.host}`
}

function normalizePathname(pathname: string) {
  const trimmed = pathname.trim()

  if (!trimmed) {
    return "/"
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

function normalizeHash(hash: string) {
  return hash.trim().replace(/^#/, "")
}

function sanitizeProtocol(protocol: string) {
  return protocol.trim().replace(/:$/, "").toLowerCase()
}

function splitPathSegments(pathname: string) {
  return pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => safeDecode(segment))
}

function safeDecode(value: string) {
  if (!value) {
    return ""
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function isValidPort(value: string) {
  if (!/^\d+$/.test(value)) {
    return false
  }

  const port = Number(value)
  return Number.isInteger(port) && port >= 1 && port <= 65535
}

export {
  buildUrlFromDraft,
  describeUrl,
  getExampleUrl,
  listExampleUrls,
  parseUrlInput,
}
export type {
  UrlBuildErrorCode,
  UrlDiagnostics,
  UrlDraft,
  UrlExampleKey,
  UrlParseErrorCode,
  UrlQueryParam,
}
