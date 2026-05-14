import { resolveDomainAddresses } from "./dns"
import { normalizeIpAddress, parseLookupInput } from "./input"
import { lookupIpMetadata } from "./metadata"

import type { FetchLike, LookupResult } from "./types"

async function lookupIpInfoTarget(
  input: string,
  resolverUrl: string,
  fetchImpl: FetchLike = fetch
): Promise<LookupResult> {
  const parsed = parseLookupInput(input)

  if (parsed.status !== "valid") {
    throw new Error("Enter a valid IP address, domain, or URL.")
  }

  const records =
    parsed.target.kind === "domain"
      ? await resolveDomainAddresses(
          parsed.target.normalized,
          resolverUrl,
          fetchImpl
        )
      : []
  const addresses =
    parsed.target.kind === "ip"
      ? [parsed.target.address]
      : records.map((record) => record.value)

  return {
    target: parsed.target,
    resolverUrl,
    records,
    addresses: await Promise.all(
      addresses.map(async (address) => ({
        address,
        version: normalizeIpAddress(address)!.version,
        info: await lookupIpMetadata(address, fetchImpl),
      }))
    ),
  }
}

export {
  BUILTIN_DOH_SERVERS,
  buildDohQueryUrl,
  dedupeAddressRecords,
  extractAddressRecords,
  resolveDomainAddresses,
} from "./dns"
export {
  isValidDomainName,
  normalizeIpAddress,
  parseLookupInput,
} from "./input"
export {
  EMPTY_IP_INFO,
  buildMapUrl,
  formatIpCoordinates,
  lookupIpMetadata,
  mergeIpInfoParts,
} from "./metadata"
export { lookupIpInfoTarget }
export type {
  AddressResult,
  DomainAddressRecord,
  LookupInputState,
  LookupResult,
} from "./types"
