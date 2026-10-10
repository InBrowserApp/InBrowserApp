import type { Failure } from "./types"

export function failure(reason: unknown): Failure {
  if (!(reason instanceof Error)) return "invalid"
  if (reason instanceof RangeError) return "resource"
  if (
    [
      "invalid",
      "protected",
      "resource",
      "engineUnavailable",
      "invalidRange",
    ].includes(reason.message)
  )
    return reason.message as Failure
  if (/memory|allocation|array buffer|resource.limit/i.test(reason.message))
    return "resource"
  if (/encrypt|password|protected/i.test(reason.message)) return "protected"
  if (/fetch|network|module|worker/i.test(reason.message))
    return "engineUnavailable"
  return "invalid"
}
