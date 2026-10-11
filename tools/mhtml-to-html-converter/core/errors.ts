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

export function failure(reason: unknown) {
  const message = reason instanceof Error ? reason.message : String(reason)
  return (
    codes.find((code) => code === message) ??
    (/memory|allocat|array length|array buffer|^resourceLimit$/i.test(message)
      ? "resource"
      : "invalid")
  )
}
