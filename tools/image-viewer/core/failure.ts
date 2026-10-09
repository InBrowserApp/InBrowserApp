import type { Failure } from "../types"

export function failureOf(reason: unknown): Failure {
  const message = reason instanceof Error ? reason.message : String(reason)
  if (
    reason instanceof RangeError ||
    /out of memory|memory access out of bounds|memory.?allocation|memory.?exhausted|memory.?limit|cache.?resources.?exhausted|unable to allocate|unable to extend|array buffer allocation|Aborted\(OOM\)|ResourceLimit/i.test(
      message
    )
  )
    return "resourceLimit"
  if (["emptyFile", "unsupported", "sequence", "engineError"].includes(message))
    return message as Failure
  return "invalid"
}
