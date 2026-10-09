import { parseMime } from "./mime"
import type { Email } from "./types"

export async function parseEmail(
  buffer: ArrayBuffer,
  name: string
): Promise<Email> {
  const bytes = new Uint8Array(buffer)
  if (!bytes.length) throw new Error("emptyFile")
  const compound = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1].every(
    (byte, index) => bytes[index] === byte
  )
  if (compound) {
    const { parseMsg } = await import("./msg")
    return parseMsg(buffer)
  }
  if (/\.msg$/i.test(name)) throw new Error("invalid")
  return parseMime(
    bytes,
    /^\d+\r?\n/.test(new TextDecoder().decode(bytes.subarray(0, 32))) ||
      /\.emlx$/i.test(name)
      ? "EMLX"
      : "EML"
  )
}
