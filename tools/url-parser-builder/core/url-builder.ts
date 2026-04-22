import type {
  UrlBuildResult,
  UrlBuilderDraft,
  UrlParseResult,
  UrlQueryEntry,
} from "../types"

function decodePart(value: string) {
  if (value.length === 0) {
    return ""
  }

  return decodeURIComponent(value)
}

function sanitizeProtocol(protocol: string) {
  return protocol.trim().replace(/:$/, "").toLowerCase()
}

function sanitizePathname(pathname: string) {
  const trimmed = pathname.trim()

  if (trimmed.length === 0) {
    return "/"
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

function compactQueryEntries(entries: readonly UrlQueryEntry[]) {
  return entries.filter(
    (entry) => entry.key.length > 0 || entry.value.length > 0
  )
}

function isValidPort(port: string) {
  const trimmed = port.trim()

  if (trimmed.length === 0) {
    return true
  }

  if (!/^\d+$/.test(trimmed)) {
    return false
  }

  const portNumber = Number(trimmed)

  return portNumber >= 1 && portNumber <= 65535
}

function parseUrlToDraft(urlString: string): UrlParseResult {
  const trimmed = urlString.trim()

  if (trimmed.length === 0) {
    return { ok: false, error: "invalid-url" }
  }

  try {
    const url = new URL(trimmed)

    return {
      ok: true,
      draft: {
        protocol: sanitizeProtocol(url.protocol),
        username: decodePart(url.username),
        password: decodePart(url.password),
        hostname: url.hostname,
        port: url.port,
        pathname: decodePart(url.pathname),
        fragment: decodePart(url.hash.replace(/^#/, "")),
        queryEntries: [...url.searchParams.entries()].map(([key, value]) => ({
          key,
          value,
        })),
      },
    }
  } catch {
    return { ok: false, error: "invalid-url" }
  }
}

function buildUrlFromDraft(draft: UrlBuilderDraft): UrlBuildResult {
  const protocol = sanitizeProtocol(draft.protocol)
  const hostname = draft.hostname.trim()
  const port = draft.port.trim()

  if (protocol.length === 0) {
    return { ok: false, error: "missing-protocol" }
  }

  if (hostname.length === 0) {
    return { ok: false, error: "missing-hostname" }
  }

  if (!isValidPort(port)) {
    return { ok: false, error: "invalid-port" }
  }

  try {
    const url = new URL(`${protocol}://${hostname}`)

    url.username = draft.username
    url.password = draft.password
    url.port = port
    url.pathname = sanitizePathname(draft.pathname)
    url.hash = draft.fragment
    url.search = ""

    for (const entry of compactQueryEntries(draft.queryEntries)) {
      url.searchParams.append(entry.key, entry.value)
    }

    return { ok: true, url: url.toString() }
  } catch {
    return { ok: false, error: "invalid-url" }
  }
}

function getHostDisplay(draft: UrlBuilderDraft) {
  const hostname = draft.hostname.trim()
  const port = draft.port.trim()

  if (hostname.length === 0) {
    return "—"
  }

  return port.length > 0 ? `${hostname}:${port}` : hostname
}

function getOriginDisplay(draft: UrlBuilderDraft) {
  const protocol = sanitizeProtocol(draft.protocol)
  const host = getHostDisplay(draft)

  if (protocol.length === 0 || host === "—") {
    return "—"
  }

  return `${protocol}://${host}`
}

function countPathSegments(pathname: string) {
  return sanitizePathname(pathname).split("/").filter(Boolean).length
}

function countQueryEntries(entries: readonly UrlQueryEntry[]) {
  return compactQueryEntries(entries).length
}

export {
  buildUrlFromDraft,
  compactQueryEntries,
  countPathSegments,
  countQueryEntries,
  getHostDisplay,
  getOriginDisplay,
  parseUrlToDraft,
  sanitizePathname,
  sanitizeProtocol,
}
