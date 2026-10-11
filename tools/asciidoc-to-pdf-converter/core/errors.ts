const codes = [
  "invalid",
  "unsupported",
  "encoding",
  "includes",
  "warnings",
  "resource",
  "engineUnavailable",
] as const
type Failure = (typeof codes)[number]

export function failure(reason: unknown): { code: Failure; page?: number } {
  const message = reason instanceof Error ? reason.message : String(reason)
  const page =
    reason instanceof Error &&
    "page" in reason &&
    typeof reason.page === "number"
      ? reason.page
      : undefined
  const code =
    codes.find((value) => value.toLowerCase() === message.toLowerCase()) ??
    (/memory|allocat|array length|array buffer|^resourceLimit$/i.test(message)
      ? "resource"
      : page !== undefined
        ? "unsupported"
        : "invalid")
  return { code, page }
}
