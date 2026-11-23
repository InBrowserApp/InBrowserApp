import { parseMacInput } from "./parse"

function macToModifiedEui64(value: string): string | null {
  // Both separator styles can appear in the existing link-local converter.
  const mac = parseMacInput(value.replaceAll("-", ":"))
  if (mac?.bits !== 48) {
    return null
  }

  const { hex } = mac
  const firstByte = (Number.parseInt(hex.slice(0, 2), 16) ^ 0x02)
    .toString(16)
    .padStart(2, "0")

  return [
    firstByte + hex.slice(2, 4),
    hex.slice(4, 6) + "ff",
    "fe" + hex.slice(6, 8),
    hex.slice(8, 12),
  ]
    .map((hextet) => Number.parseInt(hextet, 16).toString(16))
    .join(":")
}

export { macToModifiedEui64 }
