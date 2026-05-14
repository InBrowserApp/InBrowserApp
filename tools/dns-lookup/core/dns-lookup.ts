import {
  DNS_RECORD_TYPE_OPTIONS,
  DNS_RECORD_TYPES,
  getRecordTypeName,
  type DnsRecordType,
} from "./record-types"

type DnsQueryOptions = Readonly<{
  dnssec?: boolean
  checkingDisabled?: boolean
  signal?: AbortSignal
}>

type DnsJsonQuestion = Readonly<{
  name: string
  type: number
}>

type DnsJsonAnswer = Readonly<{
  name: string
  type: number
  TTL: number
  data: string
}>

type DnsJsonResponse = Readonly<{
  Status: number
  TC: boolean
  RD: boolean
  RA: boolean
  AD: boolean
  CD: boolean
  Question: readonly DnsJsonQuestion[]
  Answer?: readonly DnsJsonAnswer[]
  Additional?: readonly DnsJsonAnswer[]
  Comment?: string
  edns_client_subnet?: string
}>

type DnsLookupResult = Readonly<{
  recordType: DnsRecordType
  response: DnsJsonResponse
}>

type FetchLike = (
  input: string,
  init?: RequestInit
) => Promise<Pick<Response, "json" | "ok" | "status">>

type DohServer = Readonly<{
  id: "cloudflare" | "google" | "alidns"
  label: string
  url: string
}>

const DEFAULT_RECORD_TYPES = [
  "A",
  "AAAA",
] as const satisfies readonly DnsRecordType[]

const DOH_SERVERS = [
  {
    id: "cloudflare",
    label: "Cloudflare",
    url: "https://cloudflare-dns.com/dns-query",
  },
  {
    id: "google",
    label: "Google",
    url: "https://dns.google/resolve",
  },
  {
    id: "alidns",
    label: "AliDNS",
    url: "https://dns.alidns.com/resolve",
  },
] as const satisfies readonly DohServer[]

const DNS_RESPONSE_CODES: Record<
  number,
  Readonly<{ name: string; description: string }>
> = {
  0: { name: "NoError", description: "No error" },
  1: { name: "FormErr", description: "Format error" },
  2: { name: "ServFail", description: "Server failure" },
  3: { name: "NXDomain", description: "Non-existent domain" },
  4: { name: "NotImp", description: "Not implemented" },
  5: { name: "Refused", description: "Query refused" },
  6: { name: "YXDomain", description: "Name exists when it should not" },
  7: { name: "YXRRSet", description: "RR set exists when it should not" },
  8: { name: "NXRRSet", description: "RR set does not exist" },
  9: { name: "NotAuth", description: "Server not authoritative" },
  10: { name: "NotZone", description: "Name not contained in zone" },
  16: { name: "BADVERS", description: "Bad OPT version" },
  17: { name: "BADKEY", description: "Key not recognized" },
  18: { name: "BADTIME", description: "Signature out of time window" },
  19: { name: "BADMODE", description: "Bad TKEY mode" },
  20: { name: "BADNAME", description: "Duplicate key name" },
  21: { name: "BADALG", description: "Algorithm not supported" },
  22: { name: "BADTRUNC", description: "Bad truncation" },
  23: { name: "BADCOOKIE", description: "Bad or missing server cookie" },
} as const

function normalizeDnsName(value: string) {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    throw new Error("Enter a domain name.")
  }

  const candidate = trimmed.includes("://") ? trimmed : `https://${trimmed}`
  let hostname = ""

  try {
    hostname = new URL(candidate).hostname.toLowerCase().replace(/\.$/, "")
  } catch {
    throw new Error("Enter a valid domain name.")
  }

  if (hostname.length === 0 || hostname.length > 253) {
    throw new Error("Enter a valid domain name.")
  }

  const labels = hostname.split(".")

  if (
    labels.some(
      (label) =>
        label.length === 0 ||
        label.length > 63 ||
        label.startsWith("-") ||
        label.endsWith("-") ||
        !/^[a-z0-9-]+$/.test(label)
    )
  ) {
    throw new Error("Enter a valid domain name.")
  }

  return hostname
}

function getResponseCode(status: number) {
  return (
    DNS_RESPONSE_CODES[status] ?? {
      name: `RCODE ${status}`,
      description: "Unknown DNS response code",
    }
  )
}

function buildDohUrl(
  serverUrl: string,
  name: string,
  recordType: DnsRecordType,
  options: DnsQueryOptions = {}
) {
  const url = new URL(serverUrl)
  const params = new URLSearchParams({
    name,
    type: recordType,
  })

  if (options.dnssec) {
    params.set("do", "1")
  }

  if (options.checkingDisabled) {
    params.set("cd", "1")
  }

  url.search = params.toString()
  return url.toString()
}

async function queryDoh(
  serverUrl: string,
  name: string,
  recordType: DnsRecordType,
  options: DnsQueryOptions = {},
  fetcher: FetchLike = fetch
): Promise<DnsJsonResponse> {
  const response = await fetcher(
    buildDohUrl(serverUrl, name, recordType, options),
    {
      headers: {
        Accept: "application/dns-json",
      },
      method: "GET",
      signal: options.signal,
    }
  )

  if (!response.ok) {
    throw new Error(`DNS server returned HTTP ${response.status}.`)
  }

  return (await response.json()) as DnsJsonResponse
}

async function lookupDnsRecords(
  serverUrl: string,
  name: string,
  recordTypes: readonly DnsRecordType[],
  options: DnsQueryOptions = {},
  fetcher: FetchLike = fetch
): Promise<readonly DnsLookupResult[]> {
  const normalizedName = normalizeDnsName(name)

  if (recordTypes.length === 0) {
    throw new Error("Select at least one record type.")
  }

  const uniqueRecordTypes = DNS_RECORD_TYPES.filter((recordType) =>
    recordTypes.includes(recordType)
  )

  if (uniqueRecordTypes.length === 0) {
    throw new Error("Select at least one supported record type.")
  }

  return Promise.all(
    uniqueRecordTypes.map(async (recordType) => ({
      recordType,
      response: await queryDoh(
        serverUrl,
        normalizedName,
        recordType,
        options,
        fetcher
      ),
    }))
  )
}

export {
  DEFAULT_RECORD_TYPES,
  DNS_RECORD_TYPE_OPTIONS,
  DNS_RECORD_TYPES,
  DOH_SERVERS,
  buildDohUrl,
  getRecordTypeName,
  getResponseCode,
  lookupDnsRecords,
  normalizeDnsName,
  queryDoh,
}
export type {
  DnsJsonAnswer,
  DnsJsonResponse,
  DnsLookupResult,
  DnsRecordType,
  FetchLike,
}
