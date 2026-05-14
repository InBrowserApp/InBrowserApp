import { normalizeIpAddress } from "./input"

import type {
  AddressRecordQuery,
  DnsJsonResponse,
  DomainAddressRecord,
  FetchLike,
} from "./types"

const ADDRESS_RECORD_QUERIES = [
  { label: "A", code: 1 },
  { label: "AAAA", code: 28 },
] as const satisfies readonly AddressRecordQuery[]

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
] as const

function buildDohQueryUrl(
  resolverUrl: string,
  hostname: string,
  query: AddressRecordQuery
) {
  const url = new URL(resolverUrl)

  url.search = new URLSearchParams({
    name: hostname,
    type: query.label,
  }).toString()

  return url.toString()
}

async function resolveDomainAddresses(
  hostname: string,
  resolverUrl: string,
  fetchImpl: FetchLike = fetch
) {
  const responses = await Promise.allSettled(
    ADDRESS_RECORD_QUERIES.map(async (query) => ({
      query: query as AddressRecordQuery,
      response: await fetchDnsJson(resolverUrl, hostname, query, fetchImpl),
    }))
  )
  const successfulResponses = responses.filter(isFulfilledAddressResponse)

  if (successfulResponses.length === 0) {
    throw new Error("All DNS address queries failed.")
  }

  return dedupeAddressRecords(
    successfulResponses.flatMap(({ value }) =>
      extractAddressRecords(value.response, value.query)
    )
  )
}

function isFulfilledAddressResponse(
  response: PromiseSettledResult<{
    query: AddressRecordQuery
    response: DnsJsonResponse
  }>
): response is PromiseFulfilledResult<{
  query: AddressRecordQuery
  response: DnsJsonResponse
}> {
  return response.status === "fulfilled"
}

async function fetchDnsJson(
  resolverUrl: string,
  hostname: string,
  query: AddressRecordQuery,
  fetchImpl: FetchLike
): Promise<DnsJsonResponse> {
  const response = await fetchImpl(
    buildDohQueryUrl(resolverUrl, hostname, query),
    {
      method: "GET",
      headers: {
        Accept: "application/dns-json",
      },
    }
  )

  if (!response.ok) {
    throw new Error(
      `DNS-over-HTTPS request failed with HTTP ${response.status}.`
    )
  }

  return (await response.json()) as DnsJsonResponse
}

function extractAddressRecords(
  response: DnsJsonResponse,
  query: AddressRecordQuery
): readonly DomainAddressRecord[] {
  return (response.Answer ?? [])
    .filter((answer) => answer.type === query.code)
    .flatMap((answer) => {
      const normalized = normalizeIpAddress(answer.data)

      return normalized
        ? [
            {
              type: query.label,
              value: normalized.address,
              ttl: typeof answer.TTL === "number" ? answer.TTL : null,
            },
          ]
        : []
    })
}

function dedupeAddressRecords(records: readonly DomainAddressRecord[]) {
  const seen = new Set<string>()
  const uniqueRecords: DomainAddressRecord[] = []

  for (const record of records) {
    if (!seen.has(record.value)) {
      seen.add(record.value)
      uniqueRecords.push(record)
    }
  }

  return uniqueRecords
}

export {
  BUILTIN_DOH_SERVERS,
  buildDohQueryUrl,
  dedupeAddressRecords,
  extractAddressRecords,
  resolveDomainAddresses,
}
