const codes = [
  "invalid",
  "unsupported",
  "encoding",
  "resource",
  "engineUnavailable",
  "incomplete",
  "nested",
  "structure",
  "email",
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
    codes.find((value) => value === message) ??
    (/memory|allocat|array length|array buffer|^resourceLimit$/i.test(message)
      ? "resource"
      : page !== undefined
        ? "unsupported"
        : "invalid")
  return { code, page }
}
