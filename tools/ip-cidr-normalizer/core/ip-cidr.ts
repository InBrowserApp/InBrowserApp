type NormalizeIpCidrResult =
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "invalid" }>
  | Readonly<{ status: "success"; normalized: string }>

type Ipv4Segments = readonly [number, number, number, number]

type ParsedIpAddress =
  | Readonly<{ family: 4; segments: Ipv4Segments }>
  | Readonly<{ family: 6; segments: readonly number[] }>

type ParsedIpOrCidr = Readonly<{
  address: ParsedIpAddress
  prefix: number | null
}>

const IPV4_SEGMENT_COUNT = 4
const IPV6_SEGMENT_COUNT = 8

function isValidIpOrCidr(value: string) {
  return parseIpOrCidr(value.trim()) !== null
}

function normalizeIpCidr(input: string): NormalizeIpCidrResult {
  const value = input.trim()

  if (value.length === 0) {
    return { status: "empty" }
  }

  const parsed = parseIpOrCidr(value)

  if (parsed === null) {
    return { status: "invalid" }
  }

  if (parsed.prefix === null) {
    return {
      status: "success",
      normalized: stringifyAddress(parsed.address),
    }
  }

  return {
    status: "success",
    normalized: `${normalizeNetwork(parsed.address, parsed.prefix)}/${parsed.prefix}`,
  }
}

function parseIpOrCidr(value: string): ParsedIpOrCidr | null {
  const separatorIndex = value.indexOf("/")

  if (separatorIndex === -1) {
    const address = parseIpAddress(value)
    return address === null ? null : { address, prefix: null }
  }

  if (separatorIndex === 0 || separatorIndex !== value.lastIndexOf("/")) {
    return null
  }

  const address = parseIpAddress(value.slice(0, separatorIndex))
  const prefixText = value.slice(separatorIndex + 1)

  if (address === null || !/^\d+$/.test(prefixText)) {
    return null
  }

  const prefix = Number(prefixText)
  const maxPrefix = address.family === 4 ? 32 : 128

  if (!Number.isInteger(prefix) || prefix < 0 || prefix > maxPrefix) {
    return null
  }

  return { address, prefix }
}

function parseIpAddress(value: string): ParsedIpAddress | null {
  const ipv4 = parseIpv4(value)

  if (ipv4 !== null) {
    return { family: 4, segments: ipv4 }
  }

  const ipv6 = parseIpv6(value)

  if (ipv6 !== null) {
    return { family: 6, segments: ipv6 }
  }

  return null
}

function parseIpv4(value: string): Ipv4Segments | null {
  const parts = value.split(".")

  if (parts.length !== IPV4_SEGMENT_COUNT) {
    return null
  }

  const segments: number[] = []

  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) {
      return null
    }

    const segment = Number(part)

    if (segment < 0 || segment > 255) {
      return null
    }

    segments.push(segment)
  }

  return [segments[0]!, segments[1]!, segments[2]!, segments[3]!]
}

function parseIpv6(value: string): readonly number[] | null {
  if (value.length === 0 || value.includes("%")) {
    return null
  }

  const doubleColonIndex = value.indexOf("::")

  if (
    doubleColonIndex !== -1 &&
    value.indexOf("::", doubleColonIndex + 1) !== -1
  ) {
    return null
  }

  if (doubleColonIndex === -1) {
    const segments = parseIpv6Sequence(value.split(":"), true)
    return segments !== null && segments.length === IPV6_SEGMENT_COUNT
      ? segments
      : null
  }

  const left = value.slice(0, doubleColonIndex)
  const right = value.slice(doubleColonIndex + 2)
  const leftSegments =
    left.length === 0
      ? []
      : parseIpv6Sequence(left.split(":"), right.length === 0)
  const rightSegments =
    right.length === 0 ? [] : parseIpv6Sequence(right.split(":"), true)

  if (leftSegments === null || rightSegments === null) {
    return null
  }

  const filledSegmentCount = leftSegments.length + rightSegments.length

  if (filledSegmentCount >= IPV6_SEGMENT_COUNT) {
    return null
  }

  return [
    ...leftSegments,
    ...Array.from({ length: IPV6_SEGMENT_COUNT - filledSegmentCount }, () => 0),
    ...rightSegments,
  ]
}

function parseIpv6Sequence(
  parts: readonly string[],
  allowIpv4AtEnd: boolean
): number[] | null {
  const segments: number[] = []

  for (const [index, part] of parts.entries()) {
    if (part.length === 0) {
      return null
    }

    if (part.includes(".")) {
      if (!allowIpv4AtEnd || index !== parts.length - 1) {
        return null
      }

      const ipv4 = parseIpv4(part)

      if (ipv4 === null) {
        return null
      }

      segments.push((ipv4[0] << 8) | ipv4[1], (ipv4[2] << 8) | ipv4[3])
      continue
    }

    if (!/^[0-9a-fA-F]{1,4}$/.test(part)) {
      return null
    }

    segments.push(Number.parseInt(part, 16))
  }

  return segments
}

function normalizeNetwork(address: ParsedIpAddress, prefix: number) {
  const bits = address.family === 4 ? 32 : 128
  const value = segmentsToBigInt(
    address.segments,
    address.family === 4 ? 8 : 16
  )
  const hostBits = BigInt(bits - prefix)
  const mask = prefix === 0 ? 0n : ((1n << BigInt(prefix)) - 1n) << hostBits
  const normalizedValue = value & mask

  if (address.family === 4) {
    return stringifyAddress({
      family: 4,
      segments: toIpv4Segments(
        bigIntToSegments(normalizedValue, IPV4_SEGMENT_COUNT, 8)
      ),
    })
  }

  return stringifyAddress({
    family: 6,
    segments: bigIntToSegments(normalizedValue, IPV6_SEGMENT_COUNT, 16),
  })
}

function stringifyAddress(address: ParsedIpAddress) {
  return address.family === 4
    ? address.segments.join(".")
    : stringifyIpv6(address.segments)
}

function segmentsToBigInt(segments: readonly number[], segmentBits: number) {
  return segments.reduce(
    (result, segment) => (result << BigInt(segmentBits)) | BigInt(segment),
    0n
  )
}

function bigIntToSegments(
  value: bigint,
  segmentCount: number,
  segmentBits: number
) {
  return Array.from({ length: segmentCount }, (_, index) => {
    const shift = BigInt(segmentBits * (segmentCount - index - 1))
    const mask = (1n << BigInt(segmentBits)) - 1n

    return Number((value >> shift) & mask)
  })
}

function toIpv4Segments(segments: readonly number[]): Ipv4Segments {
  return [segments[0]!, segments[1]!, segments[2]!, segments[3]!]
}

function stringifyIpv6(segments: readonly number[]) {
  const parts = segments.map((segment) => segment.toString(16))
  const { start, length } = findLongestZeroRun(segments)

  if (length < 2) {
    return parts.join(":")
  }

  const before = parts.slice(0, start).join(":")
  const after = parts.slice(start + length).join(":")

  if (before.length === 0 && after.length === 0) {
    return "::"
  }

  if (before.length === 0) {
    return `::${after}`
  }

  if (after.length === 0) {
    return `${before}::`
  }

  return `${before}::${after}`
}

function findLongestZeroRun(segments: readonly number[]) {
  let bestStart = -1
  let bestLength = 0
  let currentStart = -1
  let currentLength = 0

  for (const [index, segment] of [...segments, -1].entries()) {
    if (segment === 0) {
      if (currentStart === -1) {
        currentStart = index
      }

      currentLength += 1
      continue
    }

    if (currentLength > bestLength && currentLength > 1) {
      bestStart = currentStart
      bestLength = currentLength
    }

    currentStart = -1
    currentLength = 0
  }

  return { start: bestStart, length: bestLength }
}

export { isValidIpOrCidr, normalizeIpCidr }
