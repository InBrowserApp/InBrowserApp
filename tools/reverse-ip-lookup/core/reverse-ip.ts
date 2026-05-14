import { isIPv4, isIPv6 } from "is-ip"

import type {
  DnsJsonResponse,
  DohServer,
  FetchLike,
  ReverseInputState,
  ReverseLookupResult,
  ReverseLookupTarget,
  ReversePtrAnswer,
} from "./types"

const PTR_RECORD_TYPE = 12

const BUILTIN_DOH_SERVERS = [
  {
    label: "Cloudflare",
    url: "https://cloudflare-dns.com/dns-query",
  },
  {
    label: "Google",
    url: "https://dns.google/resolve",
  },
  {
    label: "AliDNS",
    url: "https://dns.alidns.com/resolve",
  },
] as const satisfies readonly DohServer[]

const DNS_RCODE_LABELS = new Map<number, string>([
  [0, "NOERROR"],
  [1, "FORMERR"],
  [2, "SERVFAIL"],
  [3, "NXDOMAIN"],
  [4, "NOTIMP"],
  [5, "REFUSED"],
])

function normalizeIpInput(input: string) {
  const trimmed = input.trim()

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed.slice(1, -1).trim()
  }

  return trimmed
}

function parseReverseIpInput(input: string): ReverseInputState {
  const normalized = normalizeIpInput(input)

  if (normalized.length === 0) {
    return { status: "empty", input }
  }

  if (isIPv4(normalized)) {
    return {
      status: "valid",
      target: {
        input,
        ip: normalized,
        version: "ipv4",
        reverseDomain: toIpv4ReverseDomain(normalized),
      },
    }
  }

  if (isIPv6(normalized)) {
    return {
      status: "valid",
      target: {
        input,
        ip: normalized.toLowerCase(),
        version: "ipv6",
        reverseDomain: toIpv6ReverseDomain(normalized),
      },
    }
  }

  return { status: "invalid", input }
}

function createReverseLookupTarget(input: string) {
  const result = parseReverseIpInput(input)

  if (result.status !== "valid") {
    throw new Error("Enter a valid IPv4 or IPv6 address.")
  }

  return result.target
}

function toIpv4ReverseDomain(ip: string) {
  return `${ip.split(".").reverse().join(".")}.in-addr.arpa`
}

function toIpv6ReverseDomain(ip: string) {
  const expanded = expandIpv6Hextets(normalizeIpv4EmbeddedIpv6(ip))
  const nibbles = expanded.join("").split("").reverse()

  return `${nibbles.join(".")}.ip6.arpa`
}

function normalizeIpv4EmbeddedIpv6(ip: string) {
  const normalized = ip.toLowerCase()

  if (!normalized.includes(".")) {
    return normalized
  }

  const lastColon = normalized.lastIndexOf(":")
  const ipv4Part = normalized.slice(lastColon + 1)

  if (lastColon === -1 || !isIPv4(ipv4Part)) {
    throw new Error("Invalid IPv4-embedded IPv6 address.")
  }

  const octets = ipv4Part.split(".").map(Number)
  const high = ((octets[0]! << 8) | octets[1]!).toString(16)
  const low = ((octets[2]! << 8) | octets[3]!).toString(16)

  return `${normalized.slice(0, lastColon)}:${high}:${low}`
}

function expandIpv6Hextets(ip: string) {
  const parts = ip.split("::")

  if (parts.length > 2) {
    throw new Error("Invalid IPv6 address.")
  }

  if (parts.length === 1) {
    const hextets = parts[0]!.split(":")

    if (hextets.length !== 8) {
      throw new Error("Invalid IPv6 address.")
    }

    return hextets.map(formatHextet)
  }

  const left = parts[0] ? parts[0].split(":") : []
  const right = parts[1] ? parts[1].split(":") : []
  const missing = 8 - left.length - right.length

  if (missing < 1) {
    throw new Error("Invalid IPv6 address.")
  }

  return [
    ...left.map(formatHextet),
    ...Array.from({ length: missing }, () => "0000"),
    ...right.map(formatHextet),
  ]
}

function formatHextet(value: string) {
  const parsed = Number.parseInt(value, 16)

  if (!/^[\da-f]{1,4}$/i.test(value) || !Number.isFinite(parsed)) {
    throw new Error("Invalid IPv6 address.")
  }

  return parsed.toString(16).padStart(4, "0")
}

function buildDohQueryUrl(serverUrl: string, target: ReverseLookupTarget) {
  const url = new URL(serverUrl)

  url.search = new URLSearchParams({
    name: target.reverseDomain,
    type: "PTR",
  }).toString()

  return url.toString()
}

async function lookupReverseIp(
  input: string,
  resolverUrl: string,
  fetchImpl: FetchLike = fetch
): Promise<ReverseLookupResult> {
  const target = createReverseLookupTarget(input)
  const response = await fetchImpl(buildDohQueryUrl(resolverUrl, target), {
    method: "GET",
    headers: {
      Accept: "application/dns-json",
    },
  })

  if (!response.ok) {
    throw new Error(
      `DNS-over-HTTPS request failed with HTTP ${response.status}.`
    )
  }

  const dnsResponse = (await response.json()) as DnsJsonResponse

  return {
    target,
    resolverUrl,
    response: dnsResponse,
    rcode: getDnsRcodeLabel(dnsResponse.Status),
    answers: extractPtrAnswers(dnsResponse),
  }
}

function extractPtrAnswers(
  response: DnsJsonResponse
): readonly ReversePtrAnswer[] {
  return (response.Answer ?? [])
    .filter((answer) => answer.type === PTR_RECORD_TYPE)
    .map((answer) => ({
      hostname: answer.data.replace(/\.$/, ""),
      rawHostname: answer.data,
      ttl: answer.TTL,
    }))
}

function getDnsRcodeLabel(status: number) {
  return DNS_RCODE_LABELS.get(status) ?? `RCODE ${status}`
}

export {
  BUILTIN_DOH_SERVERS,
  buildDohQueryUrl,
  createReverseLookupTarget,
  expandIpv6Hextets,
  extractPtrAnswers,
  getDnsRcodeLabel,
  lookupReverseIp,
  normalizeIpInput,
  parseReverseIpInput,
  toIpv4ReverseDomain,
  toIpv6ReverseDomain,
}
