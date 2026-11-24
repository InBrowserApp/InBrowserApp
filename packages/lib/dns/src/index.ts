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

type FetchLike = (
  input: string,
  init?: RequestInit
) => Promise<Pick<Response, "json" | "ok" | "status">>

type DohServer = Readonly<{
  id: "cloudflare" | "google" | "alidns"
  label: string
  url: string
}>

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

function buildDohUrl(
  serverUrl: string,
  name: string,
  recordType: string,
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
  recordType: string,
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

export { buildDohUrl, DOH_SERVERS, normalizeDnsName, queryDoh }
export type { DnsJsonAnswer, DnsJsonResponse, DnsQueryOptions, FetchLike }
