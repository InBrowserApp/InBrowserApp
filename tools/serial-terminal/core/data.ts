export type DataFormat = "text" | "hex"
const lineEndings = { none: "", lf: "\n", cr: "\r", crlf: "\r\n" }
export type LineEnding = keyof typeof lineEndings

export type Entry = {
  id: number
  time: Date
  direction: "RX" | "TX"
  text: string
  bytes: Uint8Array
}

export function encodeSend(
  input: string,
  format: DataFormat,
  ending: LineEnding
): Uint8Array | null {
  if (format === "text")
    return new TextEncoder().encode(input + lineEndings[ending])

  const hex = input.replace(/\s/g, "")
  if (!/^(?:[0-9a-f]{2})+$/i.test(hex)) return null
  return Uint8Array.from({ length: hex.length / 2 }, (_, index) =>
    Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16)
  )
}

export function entryData(entry: Entry, format: DataFormat) {
  if (format === "text") return entry.text
  return Array.from(entry.bytes, (byte) => byte.toString(16).padStart(2, "0"))
    .join(" ")
    .toUpperCase()
}

export function formatLog(entries: readonly Entry[], format: DataFormat) {
  return entries
    .map(
      (entry) =>
        `${entry.time.toISOString()} ${entry.direction} ${entryData(entry, format)}`
    )
    .join("\n")
}
