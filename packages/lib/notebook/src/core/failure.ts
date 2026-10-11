import type { Failure } from "../types"
export function failure(reason: unknown): Failure {
  if (
    reason instanceof RangeError ||
    (reason instanceof Error &&
      /memory|allocation|out of resources/i.test(reason.message))
  )
    return "resourceLimit"
  if (reason instanceof Error && reason.message === "ENCODING")
    return "encoding"
  return reason instanceof Error && reason.message === "VERSION"
    ? "version"
    : "invalid"
}
export function decode(bytes: Uint8Array) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes)
  } catch (reason) {
    if (reason instanceof TypeError) throw new Error("ENCODING")
    throw reason
  }
}
