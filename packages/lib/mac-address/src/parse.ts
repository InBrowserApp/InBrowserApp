import type { Assignment, ParsedMac } from "./types"

const HEX = /^[\da-f]+$/i
const OCTETS =
  /^(?:[\da-f]{2}[:-]){2}(?:[\da-f]{2}|[\da-f]{2}[:-][\da-f]|[\da-f]{2}[:-][\da-f]{2}[:-][\da-f]|[\da-f]{2}[:-][\da-f]{2}[:-][\da-f]{2}[:-][\da-f]{2})$/i
const DOTTED =
  /^[\da-f]{4}\.(?:[\da-f]{2,3}|[\da-f]{4}\.[\da-f]{1}|[\da-f]{4}\.[\da-f]{4})$/i
const PREFIX_BITS = [24, 28, 36]

function formatHex(hex: string) {
  return hex.match(/.{1,2}/g)!.join(":")
}

function compactHex(input: string) {
  if (HEX.test(input)) return input.toUpperCase()
  if (OCTETS.test(input) && !(input.includes(":") && input.includes("-"))) {
    return input.replace(/[:-]/g, "").toUpperCase()
  }
  if (DOTTED.test(input)) return input.replaceAll(".", "").toUpperCase()
  return null
}

function parseMacInput(input: string): ParsedMac | null {
  const [address, cidr, extra] = input.trim().split("/")
  if (!address || extra !== undefined) return null
  let hex = compactHex(address)
  if (!hex || ![6, 7, 9, 12].includes(hex.length)) return null

  let bits = hex.length * 4
  if (cidr !== undefined) {
    if (!/^(24|28|36)$/.test(cidr)) return null
    const prefixBits = Number(cidr)
    if (bits !== prefixBits && bits !== 48) return null
    bits = prefixBits
    hex = hex.slice(0, bits / 4)
  }

  if (PREFIX_BITS.includes(bits)) {
    return { hex, bits, formatted: formatHex(hex), kind: "prefix" }
  }

  const firstByte = Number.parseInt(hex.slice(0, 2), 16)
  const kind =
    hex === "FFFFFFFFFFFF"
      ? "broadcast"
      : hex === "000000000000"
        ? "zero"
        : firstByte & 1
          ? "multicast"
          : firstByte & 2
            ? "local"
            : "universal"
  return { hex, bits, formatted: formatHex(hex), kind }
}

function lookupMac(records: readonly Assignment[], input: string) {
  const parsed = parseMacInput(input)
  const matches: Assignment[] = []
  let longest = 0
  if (parsed && (parsed.kind === "universal" || parsed.kind === "prefix")) {
    for (const record of records) {
      if (
        record.registry !== "CID" &&
        record.organization !== "IEEE Registration Authority" &&
        parsed.hex.startsWith(record.assignment)
      ) {
        if (record.assignment.length > longest) {
          matches.length = 0
          longest = record.assignment.length
        }
        if (record.assignment.length === longest) matches.push(record)
      }
    }
  }
  return { parsed, match: matches[0] ?? null, matches }
}

function getBlockRange(record: Assignment) {
  const bits = record.assignment.length * 4
  const start = record.assignment.padEnd(12, "0")
  const end = record.assignment.padEnd(12, "F")
  return {
    prefix: `${formatHex(record.assignment)}/${bits}`,
    start: formatHex(start),
    end: formatHex(end),
    size: 2 ** (48 - bits),
    bits,
  }
}

export { getBlockRange, lookupMac, parseMacInput }
