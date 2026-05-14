import type { FetchLike, IpInfo, IpInfoProvider, PartialIpInfo } from "./types"

const EMPTY_IP_INFO: IpInfo = {
  hostname: null,
  isp: null,
  organization: null,
  asn: null,
  asnOrganization: null,
  country: null,
  countryCode: null,
  region: null,
  city: null,
  postalCode: null,
  timezone: null,
  latitude: null,
  longitude: null,
}

const IP_INFO_PROVIDERS: readonly IpInfoProvider[] = [
  {
    lookup: async (fetchImpl, ip) => {
      const data = await readJson(
        await fetchImpl(`https://get.geojs.io/v1/ip/geo/${ip}.json`)
      )

      return {
        asn: toOptionalNumber(data.asn),
        asnOrganization: toOptionalString(data.organization_name),
        city: toOptionalString(data.city),
        country: toOptionalString(data.country),
        countryCode: toOptionalString(data.country_code),
        latitude: toOptionalNumber(data.latitude),
        longitude: toOptionalNumber(data.longitude),
        organization: toOptionalString(data.organization),
        region: toOptionalString(data.region),
        timezone: toOptionalString(data.timezone),
      }
    },
  },
  {
    lookup: async (fetchImpl, ip) => {
      const data = await readJson(
        await fetchImpl(`https://api.ip.sb/geoip/${ip}`)
      )

      return {
        asn: toOptionalNumber(data.asn),
        asnOrganization: toOptionalString(data.asn_organization),
        city: toOptionalString(data.city),
        country: toOptionalString(data.country),
        countryCode: toOptionalString(data.country_code),
        isp: toOptionalString(data.isp),
        latitude: toOptionalNumber(data.latitude),
        longitude: toOptionalNumber(data.longitude),
        organization: toOptionalString(data.organization),
        postalCode: toOptionalString(data.postal_code),
        region: toOptionalString(data.region),
        timezone: toOptionalString(data.timezone),
      }
    },
  },
  {
    lookup: async (fetchImpl, ip) => {
      const data = await readJson(
        await fetchImpl(`https://get.geojs.io/v1/dns/ptr/${ip}.json`)
      )
      const hostname = toOptionalString(data.ptr)

      if (!hostname || hostname === "Failed to get PTR record") {
        throw new Error("Failed to get PTR record")
      }

      return { hostname }
    },
  },
]

async function lookupIpMetadata(ip: string, fetchImpl: FetchLike = fetch) {
  const results = await Promise.allSettled(
    IP_INFO_PROVIDERS.map((provider) => provider.lookup(fetchImpl, ip))
  )

  return mergeIpInfoParts(
    results
      .filter(
        (result): result is PromiseFulfilledResult<PartialIpInfo> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value)
  )
}

async function readJson(response: Response) {
  if (!response.ok) {
    throw new Error(`IP metadata request failed with HTTP ${response.status}.`)
  }

  return (await response.json()) as Record<string, unknown>
}

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
  const merged: Record<string, IpInfo[keyof IpInfo] | undefined> = {}

  for (const part of parts) {
    for (const key of Object.keys(EMPTY_IP_INFO) as Array<keyof IpInfo>) {
      const value = part[key]

      if (merged[key] === undefined && value !== undefined) {
        merged[key] = value
      }
    }
  }

  const typedMerged = merged as PartialIpInfo

  return {
    hostname: typedMerged.hostname ?? null,
    isp: typedMerged.isp ?? null,
    organization: typedMerged.organization ?? null,
    asn: typedMerged.asn ?? null,
    asnOrganization: typedMerged.asnOrganization ?? null,
    country: typedMerged.country ?? null,
    countryCode: typedMerged.countryCode ?? null,
    region: typedMerged.region ?? null,
    city: typedMerged.city ?? null,
    postalCode: typedMerged.postalCode ?? null,
    timezone: typedMerged.timezone ?? null,
    latitude: typedMerged.latitude ?? null,
    longitude: typedMerged.longitude ?? null,
  }
}

function formatIpCoordinates(info: Pick<IpInfo, "latitude" | "longitude">) {
  if (info.latitude === null || info.longitude === null) {
    return null
  }

  return `${info.latitude}, ${info.longitude}`
}

function buildMapUrl(info: Pick<IpInfo, "latitude" | "longitude">) {
  if (info.latitude === null || info.longitude === null) {
    return undefined
  }

  return `https://www.google.com/maps/search/?api=1&query=${info.latitude},${info.longitude}`
}

export {
  EMPTY_IP_INFO,
  buildMapUrl,
  formatIpCoordinates,
  lookupIpMetadata,
  mergeIpInfoParts,
}
