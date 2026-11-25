import type { Failure } from "./types"

export function failure(reason: unknown): Failure {
  if (reason instanceof Error) {
    if (
      ["emptyFile", "protected", "unsupported", "resourceLimit"].includes(
        reason.message
      )
    )
      return reason.message as Failure
    if (
      /memory|allocation|array buffer|invalid (?:array|string) length/i.test(
        reason.message
      )
    )
      return "resourceLimit"
  }
  return "invalid"
}
