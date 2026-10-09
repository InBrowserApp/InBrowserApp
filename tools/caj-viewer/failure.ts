import type { Messages } from "./types"

export function failureMessage(error: unknown, m: Messages): string {
  if (!(error instanceof Error)) return m.invalid
  if (error.message === "REFERENCE_ONLY") return m.descriptor
  if (error.message === "MISSING_PAGES") return m.missingPages
  if (error.message === "ENGINE_UNAVAILABLE") return m.engineUnavailable
  const code = "code" in error ? error.code : ""
  if (code === "UNSUPPORTED_FORMAT") return m.unsupported
  if (code === "ENCRYPTED_PDF") return m.protected
  if (
    String(code).includes("LIMIT_EXCEEDED") ||
    error instanceof RangeError ||
    /out of memory|allocation|memory access out of bounds/i.test(error.message)
  )
    return m.resource
  if (code === "HNC8")
    return /font|native text/i.test(error.message)
      ? m.fontsRequired
      : m.unsupported
  return m.invalid
}
