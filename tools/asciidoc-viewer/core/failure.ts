import type { Failure } from "../types"

export function failure(reason: unknown): Failure {
  if (
    reason instanceof RangeError ||
    (reason instanceof Error &&
      /memory|allocation|out of resources/i.test(reason.message))
  )
    return "resourceLimit"
  return reason instanceof Error && reason.message === "ENCODING"
    ? "encoding"
    : "invalid"
}
