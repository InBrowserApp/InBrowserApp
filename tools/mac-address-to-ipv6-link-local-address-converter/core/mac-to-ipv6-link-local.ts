type MacToIpv6LinkLocalResult =
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "invalid" }>
  | Readonly<{ status: "success"; ipv6: string }>

const HEX_PAIR_RE = /^[\da-f]{2}$/i
const DEFAULT_EMPTY_RESULT = { status: "empty" } as const
const DEFAULT_INVALID_RESULT = { status: "invalid" } as const

function convertMacToIpv6LinkLocal(
  macValue: string,
  networkInterfaceValue = ""
): MacToIpv6LinkLocalResult {
  const macBytes = parseMacAddress(macValue)

  if (macValue.trim().length === 0) {
    return DEFAULT_EMPTY_RESULT
  }

  if (macBytes === null) {
    return DEFAULT_INVALID_RESULT
  }

  const interfaceIdBytes = [
    macBytes[0]! ^ 0x02,
    macBytes[1]!,
    macBytes[2]!,
    0xff,
    0xfe,
    macBytes[3]!,
    macBytes[4]!,
    macBytes[5]!,
  ]

  return {
    status: "success",
    ipv6: `${formatIpv6Address(interfaceIdBytes)}${formatZoneIndex(
      networkInterfaceValue
    )}`,
  }
}

function parseMacAddress(value: string) {
  const input = value.trim()
  if (input.length === 0) {
    return null
  }

  const normalizedInput = normalizeMacAddress(input)
  if (normalizedInput === null) {
    return null
  }

  return normalizedInput.map((part) => Number.parseInt(part, 16))
}

function normalizeMacAddress(value: string) {
  if (value.includes(".")) {
    const parts = value.split(".")
    if (
      parts.length !== 3 ||
      parts.some((part) => part.length !== 4 || !/^[\da-f]{4}$/i.test(part))
    ) {
      return null
    }

    return parts.flatMap((part) => [
      part.slice(0, 2).toLowerCase(),
      part.slice(2, 4).toLowerCase(),
    ])
  }

  const normalizedValue = value.replaceAll("-", ":").toLowerCase()
  if (normalizedValue.includes(":")) {
    const parts = normalizedValue.split(":")
    if (parts.length !== 6 || parts.some((part) => !HEX_PAIR_RE.test(part))) {
      return null
    }

    return parts
  }

  if (
    normalizedValue.length !== 12 ||
    !/^[\da-f]{12}$/i.test(normalizedValue)
  ) {
    return null
  }

  return normalizedValue.match(/.{2}/g)
}

function formatIpv6Address(interfaceIdBytes: readonly number[]) {
  return `fe80::${toHextets(interfaceIdBytes)
    .map((hextet) => hextet.toString(16))
    .join(":")}`
}

function toHextets(bytes: readonly number[]) {
  const hex = bytes.map((byte) => byte.toString(16).padStart(2, "0"))

  return [
    Number.parseInt(`${hex[0]}${hex[1]}`, 16),
    Number.parseInt(`${hex[2]}${hex[3]}`, 16),
    Number.parseInt(`${hex[4]}${hex[5]}`, 16),
    Number.parseInt(`${hex[6]}${hex[7]}`, 16),
  ]
}

function formatZoneIndex(value: string) {
  const trimmedValue = value.trim()
  return trimmedValue.length === 0 ? "" : `%${trimmedValue}`
}

export { convertMacToIpv6LinkLocal }
