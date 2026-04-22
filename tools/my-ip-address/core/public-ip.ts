import { isIPv4, isIPv6 } from "is-ip"

type PublicIpVersion = "ipv4" | "ipv6"

type FetchLike = typeof fetch

type PublicIpProvider = Readonly<{
  ipv4?: (fetchImpl: FetchLike, signal: AbortSignal) => Promise<string>
  ipv6?: (fetchImpl: FetchLike, signal: AbortSignal) => Promise<string>
}>

type WebRtcCandidate = Readonly<{
  address: string
}>

const PUBLIC_IP_PROVIDERS: readonly PublicIpProvider[] = [
  {
    ipv4: async (fetchImpl, signal) => {
      const response = await fetchImpl("https://api-ipv4.ip.sb/geoip", {
        signal,
      })
      const data = await response.json()

      return validatePublicIp(data.ip, "ipv4")
    },
    ipv6: async (fetchImpl, signal) => {
      const response = await fetchImpl("https://api-ipv6.ip.sb/geoip", {
        signal,
      })
      const data = await response.json()

      return validatePublicIp(data.ip, "ipv6")
    },
  },
  {
    ipv4: async (fetchImpl, signal) => {
      const response = await fetchImpl("https://ipv4.geojs.io/v1/ip.json", {
        signal,
      })
      const data = await response.json()

      return validatePublicIp(data.ip, "ipv4")
    },
    ipv6: async (fetchImpl, signal) => {
      const response = await fetchImpl("https://ipv6.geojs.io/v1/ip.json", {
        signal,
      })
      const data = await response.json()

      return validatePublicIp(data.ip, "ipv6")
    },
  },
  {
    ipv4: async (fetchImpl, signal) => {
      const response = await fetchImpl("https://cloudflare.com/cdn-cgi/trace", {
        signal,
      })
      const trace = await response.text()

      return parseCloudflareTraceIp(trace, "ipv4")
    },
    ipv6: async (fetchImpl, signal) => {
      const response = await fetchImpl("https://cloudflare.com/cdn-cgi/trace", {
        signal,
      })
      const trace = await response.text()

      return parseCloudflareTraceIp(trace, "ipv6")
    },
  },
  {
    ipv4: async (fetchImpl, signal) => {
      const response = await fetchImpl("https://api.ipify.org?format=json", {
        signal,
      })
      const data = await response.json()

      return validatePublicIp(data.ip, "ipv4")
    },
    ipv6: async (fetchImpl, signal) => {
      const response = await fetchImpl("https://api64.ipify.org?format=json", {
        signal,
      })
      const data = await response.json()

      return validatePublicIp(data.ip, "ipv6")
    },
  },
]

function validatePublicIp(ip: unknown, version: PublicIpVersion) {
  if (typeof ip !== "string") {
    throw new Error(`Invalid ${version.toUpperCase()}: ${String(ip)}`)
  }

  const valid = version === "ipv4" ? isIPv4(ip) : isIPv6(ip)

  if (!valid) {
    throw new Error(`Invalid ${version.toUpperCase()}: ${ip}`)
  }

  return ip
}

function parseCloudflareTraceIp(trace: string, version: PublicIpVersion) {
  const ipLine = trace
    .split("\n")
    .find((line) => line.toLowerCase().startsWith("ip="))

  if (!ipLine) {
    throw new Error("Failed to parse Cloudflare trace response")
  }

  return validatePublicIp(ipLine.slice(3).trim(), version)
}

async function lookupPublicIp(
  version: PublicIpVersion,
  fetchImpl: FetchLike = fetch
) {
  const controller = new AbortController()
  const providers = PUBLIC_IP_PROVIDERS.map(
    (provider) => provider[version]
  ).filter(
    (provider): provider is NonNullable<PublicIpProvider[PublicIpVersion]> =>
      typeof provider === "function"
  )

  try {
    const result = await Promise.any(
      providers.map((provider) => provider(fetchImpl, controller.signal))
    )

    controller.abort()
    return result
  } catch (error) {
    controller.abort()
    throw error
  }
}

function dedupeIpAddresses(addresses: readonly string[]) {
  return [...new Set(addresses)]
}

async function discoverWebRtcAddresses(
  getIps: () => Promise<readonly WebRtcCandidate[]>
) {
  const candidates = await getIps()

  return dedupeIpAddresses(
    candidates
      .map((candidate) => candidate.address)
      .filter((address): address is string => typeof address === "string")
  )
}

export {
  dedupeIpAddresses,
  discoverWebRtcAddresses,
  lookupPublicIp,
  parseCloudflareTraceIp,
  validatePublicIp,
}
