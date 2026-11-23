import { macToModifiedEui64 } from "@workspace/mac-address"

type MacToIpv6LinkLocalResult =
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "invalid" }>
  | Readonly<{ status: "success"; ipv6: string }>

function convertMacToIpv6LinkLocal(
  macValue: string,
  networkInterfaceValue = ""
): MacToIpv6LinkLocalResult {
  if (macValue.trim().length === 0) {
    return { status: "empty" }
  }

  const interfaceId = macToModifiedEui64(macValue)
  if (interfaceId === null) {
    return { status: "invalid" }
  }

  const networkInterface = networkInterfaceValue.trim()
  return {
    status: "success",
    ipv6: `fe80::${interfaceId}${networkInterface ? `%${networkInterface}` : ""}`,
  }
}

export { convertMacToIpv6LinkLocal }
