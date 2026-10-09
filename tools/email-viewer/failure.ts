import type { Failure } from "./types"

export function failure(reason: unknown): Failure {
  // Invalid offsets in a damaged binary message are not memory exhaustion.
  if (
    reason instanceof Error &&
    /(?:offset|outside|out of).*bounds/i.test(reason.message)
  )
    return "invalid"
  if (
    reason instanceof RangeError ||
    (reason instanceof Error &&
      /memory|allocation|call stack/i.test(reason.message))
  )
    return "resourceLimit"
  if (
    reason instanceof Error &&
    ["emptyFile", "protected", "unsupported", "resourceLimit"].includes(
      reason.message
    )
  )
    return reason.message as Failure
  return "invalid"
}
