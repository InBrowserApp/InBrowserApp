const ULA_GLOBAL_ID_BYTES = 5
const ULA_GLOBAL_ID_BITS = 40
const ULA_SUBNET_ID_BITS = 16
const ULA_INTERFACE_ID_BITS = 64
const ULA_SUBNET_COUNT = 2 ** ULA_SUBNET_ID_BITS
const SUBNET_ID_PATTERN = /^[0-9a-f]{1,4}$/iu
const BYTE_HEX = Array.from({ length: 256 }, (_, value) =>
  value.toString(16).padStart(2, "0")
)

type RandomSource = Pick<Crypto, "getRandomValues">

type Ipv6UlaPrefix = Readonly<{
  networkHextets: readonly [number, number, number]
  globalId: string
  sitePrefix: string
  firstSubnet: string
  lastSubnet: string
}>

type Ipv6UlaSubnet = Readonly<{
  subnetId: string
  prefix: string
}>

function normalizeSubnetId(input: string): string | null {
  const value = input.trim()

  if (!SUBNET_ID_PATTERN.test(value)) {
    return null
  }

  return value.toLowerCase().padStart(4, "0")
}

function formatPrefix(hextets: readonly number[], prefixLength: 48 | 64) {
  const significantHextets = [...hextets]

  while (significantHextets.at(-1) === 0) {
    significantHextets.pop()
  }

  return `${significantHextets.map((hextet) => hextet.toString(16)).join(":")}::/${prefixLength}`
}

function createIpv6UlaPrefix(bytes: Uint8Array): Ipv6UlaPrefix {
  if (bytes.length !== ULA_GLOBAL_ID_BYTES) {
    throw new Error("An IPv6 ULA Global ID requires exactly 5 bytes.")
  }

  const globalId = Array.from(bytes, (byte) => BYTE_HEX[byte]!).join("")
  const networkHextets = [
    0xfd00 | bytes[0]!,
    (bytes[1]! << 8) | bytes[2]!,
    (bytes[3]! << 8) | bytes[4]!,
  ] as const

  return {
    networkHextets,
    globalId,
    sitePrefix: formatPrefix(networkHextets, 48),
    firstSubnet: formatPrefix([...networkHextets, 0], 64),
    lastSubnet: formatPrefix([...networkHextets, 0xffff], 64),
  }
}

function generateIpv6UlaPrefix(
  randomSource: RandomSource | undefined = globalThis.crypto
): Ipv6UlaPrefix {
  if (typeof randomSource?.getRandomValues !== "function") {
    throw new Error("IPv6 ULA generation requires crypto.getRandomValues().")
  }

  const bytes = new Uint8Array(ULA_GLOBAL_ID_BYTES)
  randomSource.getRandomValues(bytes)

  return createIpv6UlaPrefix(bytes)
}

function deriveIpv6UlaSubnet(
  prefix: Ipv6UlaPrefix,
  input: string
): Ipv6UlaSubnet | null {
  const subnetId = normalizeSubnetId(input)

  if (subnetId === null) {
    return null
  }

  return {
    subnetId,
    prefix: formatPrefix(
      [...prefix.networkHextets, Number.parseInt(subnetId, 16)],
      64
    ),
  }
}

export {
  ULA_GLOBAL_ID_BITS,
  ULA_INTERFACE_ID_BITS,
  ULA_SUBNET_COUNT,
  ULA_SUBNET_ID_BITS,
  createIpv6UlaPrefix,
  deriveIpv6UlaSubnet,
  generateIpv6UlaPrefix,
  normalizeSubnetId,
}

export type { Ipv6UlaPrefix, Ipv6UlaSubnet, RandomSource }
