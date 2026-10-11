const codes = [
  "invalid",
  "unsupported",
  "encoding",
  "includes",
  "warnings",
  "resource",
  "engineUnavailable",
] as const

export function failure(reason: unknown) {
  const message = reason instanceof Error ? reason.message : String(reason)
  return (
    codes.find((code) => code.toLowerCase() === message.toLowerCase()) ??
    (/memory|allocat|array length|array buffer|^resourceLimit$/i.test(message)
      ? "resource"
      : "invalid")
  )
}
