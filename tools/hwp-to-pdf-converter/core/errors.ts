const codes = [
  "invalid",
  "unsupported",
  "protected",
  "distribution",
  "legacy",
  "resource",
  "engineUnavailable",
  "browserUnsupported",
  "failed",
] as const
export type Failure = (typeof codes)[number]
export function failure(reason: unknown): { code: Failure; page?: number } {
  const message = reason instanceof Error ? reason.message : String(reason)
  const code =
    codes.find((value) => value === message) ??
    (/memory|allocat|out of bounds|stack|capacity|budget|limit exceeded|too large/i.test(
      message
    )
      ? "resource"
      : /password|encrypt|DRM|비밀번호|암호화|보안 문서/i.test(message)
        ? "protected"
        : "invalid")
  const page =
    reason instanceof Error &&
    "page" in reason &&
    typeof reason.page === "number"
      ? reason.page
      : undefined
  return { code, page }
}
