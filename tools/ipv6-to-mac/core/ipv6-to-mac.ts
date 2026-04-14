type Ipv6ToMacResult =
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "invalid" }>
  | Readonly<{ status: "not-convertible" }>
  | Readonly<{ status: "success"; mac: string }>

const HEX_RE = /^[\da-f]{1,4}$/i
const DEFAULT_EMPTY_RESULT = { status: "empty" } as const
const DEFAULT_INVALID_RESULT = { status: "invalid" } as const
const DEFAULT_NOT_CONVERTIBLE_RESULT = {
  status: "not-convertible",
} as const

function convertIpv6ToMac(value: string): Ipv6ToMacResult {
  const input = value.trim()

  if (input.length === 0) {
    return DEFAULT_EMPTY_RESULT
  }

  const hextets = expandIpv6(input)
  if (hextets === null) {
    return DEFAULT_INVALID_RESULT
  }

  const interfaceIdBytes = hextets
    .slice(4)
    .flatMap((hextet) => splitHextetIntoBytes(hextet))

  if (interfaceIdBytes[3] !== 0xff || interfaceIdBytes[4] !== 0xfe) {
    return DEFAULT_NOT_CONVERTIBLE_RESULT
  }

  const macBytes = [
    interfaceIdBytes[0]! ^ 0x02,
    interfaceIdBytes[1]!,
    interfaceIdBytes[2]!,
    interfaceIdBytes[5]!,
    interfaceIdBytes[6]!,
    interfaceIdBytes[7]!,
  ]

  return {
    status: "success",
    mac: formatMacAddress(macBytes),
  }
}

function expandIpv6(input: string) {
  const normalizedInput = stripZoneIndex(input.trim())
  if (normalizedInput.length === 0) {
    return null
  }

  const segments = normalizedInput.split("::")
  if (segments.length > 2) {
    return null
  }

  const head = normalizeIpv6Segments(segments[0] ?? "")
  if (head === null) {
    return null
  }

  if (segments.length === 1) {
    return head.length === 8 ? head : null
  }

  const tail = normalizeIpv6Segments(segments[1] ?? "")
  if (tail === null) {
    return null
  }

  const missingSegmentCount = 8 - (head.length + tail.length)
  if (missingSegmentCount < 1) {
    return null
  }

  return [
    ...head,
    ...Array.from({ length: missingSegmentCount }, () => "0000"),
    ...tail,
  ]
}

function normalizeIpv6Segments(segmentText: string) {
  if (segmentText.length === 0) {
    return []
  }

  const parts = segmentText.split(":")
  if (parts.some((part) => part.length === 0)) {
    return null
  }

  const normalizedSegments: string[] = []

  for (const [index, part] of parts.entries()) {
    if (part.includes(".")) {
      if (index !== parts.length - 1) {
        return null
      }

      const ipv4Segments = expandEmbeddedIpv4(part)
      if (ipv4Segments === null) {
        return null
      }

      normalizedSegments.push(...ipv4Segments)
      continue
    }

    if (!HEX_RE.test(part)) {
      return null
    }

    normalizedSegments.push(part.padStart(4, "0").toLowerCase())
  }

  return normalizedSegments
}

function expandEmbeddedIpv4(part: string) {
  const octets = part.split(".").map((value) => Number(value))
  if (
    octets.length !== 4 ||
    octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)
  ) {
    return null
  }

  return [
    ((octets[0]! << 8) | octets[1]!).toString(16).padStart(4, "0"),
    ((octets[2]! << 8) | octets[3]!).toString(16).padStart(4, "0"),
  ]
}

function splitHextetIntoBytes(hextet: string) {
  return [
    Number.parseInt(hextet.slice(0, 2), 16),
    Number.parseInt(hextet.slice(2, 4), 16),
  ]
}

function formatMacAddress(bytes: readonly number[]) {
  return bytes
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(":")
    .toUpperCase()
}

function stripZoneIndex(value: string) {
  const zoneIndex = value.indexOf("%")
  return zoneIndex === -1 ? value : value.slice(0, zoneIndex)
}

export { convertIpv6ToMac }
