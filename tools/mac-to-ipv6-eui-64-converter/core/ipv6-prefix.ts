type PrefixResult =
  | { status: "empty" | "invalid" }
  | { status: "valid"; network: readonly string[] }

function parseIpv6Prefix(value: string): PrefixResult {
  const prefix = value.trim()
  if (prefix === "") {
    return { status: "empty" }
  }

  const input = /^([\da-f:.]+)(?:\/64)?$/i.exec(prefix)?.[1]
  if (!input) {
    return { status: "invalid" }
  }

  let address: string
  try {
    address = formatIpv6(input)
  } catch {
    return { status: "invalid" }
  }

  // Four zero host hextets force the canonical form to end in "::".
  if (!address.endsWith("::")) {
    return { status: "invalid" }
  }

  const network = address.slice(0, -2).split(":").filter(Boolean)
  if (network.length > 4) {
    return { status: "invalid" }
  }

  while (network.length < 4) {
    network.push("0")
  }
  return { status: "valid", network }
}

function combineIpv6Address(network: readonly string[], interfaceId: string) {
  return formatIpv6(`${network.join(":")}:${interfaceId}`)
}

function formatIpv6(address: string) {
  return new URL(`http://[${address}]/`).hostname.slice(1, -1)
}

export { combineIpv6Address, parseIpv6Prefix }
