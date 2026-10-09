import type { Failure } from "../types"

export function decodeSource(bytes: Uint8Array) {
  const encoding =
    bytes[0] === 0xff && bytes[1] === 0xfe
      ? "utf-16le"
      : bytes[0] === 0xfe && bytes[1] === 0xff
        ? "utf-16be"
        : "utf-8"
  let source: string
  try {
    source = new TextDecoder(encoding, { fatal: true }).decode(bytes)
  } catch (error) {
    if (error instanceof RangeError) throw error
    throw new Error("ENCODING")
  }
  // oxlint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000e-\u001f]/.test(source)) throw new Error("ENCODING")
  return source
}

export function failure(error: unknown): Failure {
  if (
    error instanceof RangeError ||
    (error instanceof Error &&
      /memory|allocation|out of resources/i.test(error.message))
  )
    return "resourceLimit"
  return error instanceof Error && error.message === "ENCODING"
    ? "encoding"
    : "invalid"
}
