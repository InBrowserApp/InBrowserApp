const codes = [
  "invalid",
  "unsupported",
  "protected",
  "resource",
  "engineUnavailable",
] as const
type Failure = (typeof codes)[number]

export function failure(reason: unknown): { code: Failure; page?: number } {
  const message = reason instanceof Error ? reason.message : String(reason)
  const code =
    codes.find((value) => value === message) ??
    (/memory|allocat|array length|array buffer/i.test(message)
      ? "resource"
      : "invalid")
  const page =
    reason instanceof Error &&
    "page" in reason &&
    typeof reason.page === "number"
      ? reason.page
      : undefined
  return { code, page }
}
