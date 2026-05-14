import { isIPv4, isIPv6 } from "is-ip"

import type { LookupInputState } from "./types"

function parseLookupInput(input: string): LookupInputState {
  const trimmed = input.trim()

  if (trimmed.length === 0) {
    return { status: "empty", input }
  }

  const directIp = normalizeIpAddress(trimmed)

  if (directIp) {
    return {
      status: "valid",
      target: {
        kind: "ip",
        input: trimmed,
        normalized: directIp.address,
        address: directIp.address,
        version: directIp.version,
      },
    }
  }

  const hostname = extractHostname(trimmed)
  const hostIp = hostname ? normalizeIpAddress(hostname) : null

  if (hostIp) {
    return {
      status: "valid",
      target: {
        kind: "ip",
        input: trimmed,
        normalized: hostIp.address,
        address: hostIp.address,
        version: hostIp.version,
      },
    }
  }

  if (!hostname || !isValidDomainName(hostname)) {
    return { status: "invalid", input }
  }

  return {
    status: "valid",
    target: {
      kind: "domain",
      input: trimmed,
      normalized: hostname,
    },
  }
}

function normalizeIpAddress(value: string) {
  const unwrapped = stripBracketedHost(value)

  if (isIPv4(unwrapped)) {
    return { address: unwrapped, version: "ipv4" as const }
  }

  if (isIPv6(unwrapped)) {
    return {
      address: unwrapped.toLowerCase(),
      version: "ipv6" as const,
    }
  }

  return null
}

function stripBracketedHost(value: string) {
  const trimmed = value.trim()

  if (!trimmed.startsWith("[")) {
    return trimmed
  }

  const closingIndex = trimmed.indexOf("]")
  const rest = closingIndex === -1 ? "" : trimmed.slice(closingIndex + 1)

  if (closingIndex > 0 && (rest === "" || /^:\d+$/.test(rest))) {
    return trimmed.slice(1, closingIndex)
  }

  return trimmed
}

function extractHostname(value: string) {
  const url = parseUrl(value)

  if (!url) {
    return null
  }

  return stripBracketedHost(url.hostname).replace(/\.$/, "").toLowerCase()
}

function parseUrl(value: string) {
  try {
    const hasScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(value)
    return new URL(hasScheme ? value : `https://${value}`)
  } catch {
    return null
  }
}

function isValidDomainName(value: string) {
  const labels = value.split(".")

  return (
    value.length <= 253 &&
    labels.length > 1 &&
    labels.every(
      (label) =>
        /^[a-z0-9-]{1,63}$/i.test(label) &&
        !label.startsWith("-") &&
        !label.endsWith("-")
    )
  )
}

export { isValidDomainName, normalizeIpAddress, parseLookupInput }
