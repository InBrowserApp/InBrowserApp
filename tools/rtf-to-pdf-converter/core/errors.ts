type Failure =
  | "invalid"
  | "unsupported"
  | "protected"
  | "resource"
  | "engineUnavailable"

export class ConversionError extends Error {
  constructor(readonly code: Failure) {
    super(code)
  }
}

export function failure(reason: unknown): ConversionError {
  if (reason instanceof ConversionError) return reason
  const message = reason instanceof Error ? reason.message : String(reason)
  return new ConversionError(
    /memory|allocat|array buffer|array length|out of bounds/i.test(message)
      ? "resource"
      : "invalid"
  )
}
