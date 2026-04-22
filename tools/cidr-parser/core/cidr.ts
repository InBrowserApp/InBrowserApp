import {
  IPV4_BITS,
  bitSizeForFamily,
  createAddressFromValue,
  parseIpAddress,
  stringifyIpAddress,
  type ParsedIpAddress,
} from "./ip-address"

type ParsedCidr = Readonly<{
  address: ParsedIpAddress
  prefix: number
}>

type CidrDetails = Readonly<{
  family: 4 | 6
  prefix: number
  hostBits: number
  inputAddress: string
  canonicalCidr: string
  networkAddress: string
  rangeStart: string
  rangeEnd: string
  firstUsable: string
  lastUsable: string
  broadcastAddress: string | null
  netmask: string | null
  wildcardMask: string | null
  addressCount: bigint
  usableAddressCount: bigint
  startInteger: string
  endInteger: string
}>

type ParseCidrResult =
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "invalid" }>
  | Readonly<{ status: "success"; details: CidrDetails }>

function parseCidr(input: string): ParseCidrResult {
  const value = input.trim()

  if (value.length === 0) {
    return { status: "empty" }
  }

  const parsed = parseCidrInput(value)

  if (parsed === null) {
    return { status: "invalid" }
  }

  return {
    status: "success",
    details: buildDetails(parsed),
  }
}

function parseCidrInput(value: string): ParsedCidr | null {
  const separatorIndex = value.indexOf("/")

  if (separatorIndex <= 0 || separatorIndex !== value.lastIndexOf("/")) {
    return null
  }

  const address = parseIpAddress(value.slice(0, separatorIndex))
  const prefixText = value.slice(separatorIndex + 1)

  if (address === null || !/^\d+$/.test(prefixText)) {
    return null
  }

  const prefix = Number(prefixText)
  const maxPrefix = bitSizeForFamily(address.family)

  if (!Number.isInteger(prefix) || prefix < 0 || prefix > maxPrefix) {
    return null
  }

  return { address, prefix }
}

function buildDetails(parsed: ParsedCidr): CidrDetails {
  const { address, prefix } = parsed
  const totalBits = bitSizeForFamily(address.family)
  const hostBits = totalBits - prefix
  const maxValue = (1n << BigInt(totalBits)) - 1n
  const hostMask = hostBits === 0 ? 0n : (1n << BigInt(hostBits)) - 1n
  const networkValue = address.value & (maxValue ^ hostMask)
  const endValue = networkValue | hostMask
  const networkAddress = stringifyIpAddress(
    createAddressFromValue(networkValue, address.family)
  )
  const rangeEnd = stringifyIpAddress(
    createAddressFromValue(endValue, address.family)
  )
  const canonicalCidr = `${networkAddress}/${prefix}`
  const addressCount = endValue - networkValue + 1n
  const usableBounds = resolveUsableBounds(
    address.family,
    prefix,
    networkValue,
    endValue
  )

  return {
    family: address.family,
    prefix,
    hostBits,
    inputAddress: stringifyIpAddress(address),
    canonicalCidr,
    networkAddress,
    rangeStart: networkAddress,
    rangeEnd,
    firstUsable: stringifyIpAddress(
      createAddressFromValue(usableBounds.firstValue, address.family)
    ),
    lastUsable: stringifyIpAddress(
      createAddressFromValue(usableBounds.lastValue, address.family)
    ),
    broadcastAddress:
      address.family === 4
        ? stringifyIpAddress(createAddressFromValue(endValue, 4))
        : null,
    netmask: address.family === 4 ? formatIpv4Mask(prefix) : null,
    wildcardMask:
      address.family === 4 ? formatIpv4Mask(IPV4_BITS - prefix, true) : null,
    addressCount,
    usableAddressCount: usableBounds.count,
    startInteger: networkValue.toString(),
    endInteger: endValue.toString(),
  }
}

function resolveUsableBounds(
  family: 4 | 6,
  prefix: number,
  networkValue: bigint,
  endValue: bigint
) {
  if (family === 6 || prefix >= 31) {
    return {
      firstValue: networkValue,
      lastValue: endValue,
      count: endValue - networkValue + 1n,
    }
  }

  return {
    firstValue: networkValue + 1n,
    lastValue: endValue - 1n,
    count: endValue - networkValue - 1n,
  }
}

function formatIpv4Mask(prefix: number, invert = false) {
  const maxValue = (1n << BigInt(IPV4_BITS)) - 1n
  const normalizedPrefix = invert ? IPV4_BITS - prefix : prefix
  const maskValue =
    normalizedPrefix === 0
      ? 0n
      : (((1n << BigInt(normalizedPrefix)) - 1n) <<
          BigInt(IPV4_BITS - normalizedPrefix)) &
        maxValue

  const value = invert ? maxValue ^ maskValue : maskValue

  return stringifyIpAddress(createAddressFromValue(value, 4))
}

export { parseCidr }
export type { CidrDetails, ParseCidrResult }
