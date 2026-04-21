type FetchLike = typeof fetch

type IpInfo = Readonly<{
  hostname: string | null
  isp: string | null
  organization: string | null
  asn: number | null
  asnOrganization: string | null
  country: string | null
  timezone: string | null
  latitude: number | null
  longitude: number | null
}>

type PartialIpInfo = Partial<{
  [Key in keyof IpInfo]: IpInfo[Key] | undefined
}>

type MutableIpInfo = {
  -readonly [Key in keyof IpInfo]?: IpInfo[Key] | undefined
}

type IpInfoProvider = Readonly<{
  lookup: (
    fetchImpl: FetchLike,
    ip: string,
    signal: AbortSignal
  ) => Promise<PartialIpInfo>
}>

const EMPTY_IP_INFO: IpInfo = {
  hostname: null,
  isp: null,
  organization: null,
  asn: null,
  asnOrganization: null,
  country: null,
  timezone: null,
  latitude: null,
  longitude: null,
}

const IP_INFO_PROVIDERS: readonly IpInfoProvider[] = [
  {
    lookup: async (fetchImpl, ip, signal) => {
      const response = await fetchImpl(
        `https://get.geojs.io/v1/ip/geo/${ip}.json`,
        { signal }
      )
      const data = await response.json()

      return {
        asn: toOptionalNumber(data.asn),
        asnOrganization: toOptionalString(data.organization_name),
        country: toOptionalString(data.country),
        latitude: toOptionalNumber(data.latitude),
        longitude: toOptionalNumber(data.longitude),
        organization: toOptionalString(data.organization),
        timezone: toOptionalString(data.timezone),
      }
    },
  },
  {
    lookup: async (fetchImpl, ip, signal) => {
      const response = await fetchImpl(`https://api.ip.sb/geoip/${ip}`, {
        signal,
      })
      const data = await response.json()

      return {
        asn: toOptionalNumber(data.asn),
        asnOrganization: toOptionalString(data.asn_organization),
        country: toOptionalString(data.country),
        isp: toOptionalString(data.isp),
        latitude: toOptionalNumber(data.latitude),
        longitude: toOptionalNumber(data.longitude),
        organization: toOptionalString(data.organization),
        timezone: toOptionalString(data.timezone),
      }
    },
  },
  {
    lookup: async (fetchImpl, ip, signal) => {
      const response = await fetchImpl(
        `https://get.geojs.io/v1/dns/ptr/${ip}.json`,
        { signal }
      )
      const data = await response.json()
      const hostname = toOptionalString(data.ptr)

      if (!hostname || hostname === "Failed to get PTR record") {
        throw new Error("Failed to get PTR record")
      }

      return { hostname }
    },
  },
]

function toOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed === "" ? undefined : trimmed
}

function toOptionalNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== "string") {
    return undefined
  }

  const trimmed = value.trim()

  if (trimmed === "") {
    return undefined
  }

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

function mergeIpInfoParts(parts: readonly PartialIpInfo[]): IpInfo {
  const merged: MutableIpInfo = {}
  const mergedRecord = merged as Record<
    keyof IpInfo,
    IpInfo[keyof IpInfo] | undefined
  >

  for (const part of parts) {
    for (const key of Object.keys(EMPTY_IP_INFO) as Array<keyof IpInfo>) {
      const value = part[key]

      if (mergedRecord[key] === undefined && value !== undefined) {
        mergedRecord[key] = value
      }
    }
  }

  return {
    hostname: merged.hostname ?? null,
    isp: merged.isp ?? null,
    organization: merged.organization ?? null,
    asn: merged.asn ?? null,
    asnOrganization: merged.asnOrganization ?? null,
    country: merged.country ?? null,
    timezone: merged.timezone ?? null,
    latitude: merged.latitude ?? null,
    longitude: merged.longitude ?? null,
  }
}

async function lookupIpInfo(ip: string, fetchImpl: FetchLike = fetch) {
  const controller = new AbortController()
  const results = await Promise.allSettled(
    IP_INFO_PROVIDERS.map((provider) =>
      provider.lookup(fetchImpl, ip, controller.signal)
    )
  )

  controller.abort()

  return mergeIpInfoParts(
    results
      .filter(
        (result): result is PromiseFulfilledResult<PartialIpInfo> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value)
  )
}

function formatIpCoordinates(info: Pick<IpInfo, "latitude" | "longitude">) {
  if (info.latitude === null || info.longitude === null) {
    return null
  }

  return `${info.longitude} / ${info.latitude}`
}

function buildGoogleMapsUrl(info: Pick<IpInfo, "latitude" | "longitude">) {
  if (info.latitude === null || info.longitude === null) {
    return undefined
  }

  return `https://www.google.com/maps/search/?api=1&query=${info.latitude},${info.longitude}`
}

export {
  buildGoogleMapsUrl,
  EMPTY_IP_INFO,
  formatIpCoordinates,
  lookupIpInfo,
  mergeIpInfoParts,
}
export type { IpInfo }
