import type { Failure } from "./types"
const failures: Failure[] = [
  "invalid",
  "empty",
  "protected",
  "distribution",
  "legacy",
  "resourceLimit",
  "engineUnavailable",
  "browserUnsupported",
  "pageError",
]
export function failure(reason: unknown): Failure {
  const message = reason instanceof Error ? reason.message : String(reason)
  if (failures.includes(message as Failure)) return message as Failure
  if (
    /memory|allocat|out of bounds|stack|capacity|budget|limit exceeded|too large/i.test(
      message
    )
  )
    return "resourceLimit"
  if (/password|encrypt|DRM|비밀번호|암호화|보안 문서/i.test(message))
    return "protected"
  return "invalid"
}
