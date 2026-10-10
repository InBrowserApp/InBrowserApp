type Failure = "invalid" | "unsupported" | "signature" | "resource"
export class ConversionError extends Error {
  constructor(
    readonly code: Failure,
    readonly document?: number,
    readonly page?: number
  ) {
    super(code)
  }
}

export function failure(reason: unknown): ConversionError {
  if (reason instanceof ConversionError) return reason
  const message = reason instanceof Error ? reason.message : String(reason)
  return new ConversionError(
    /memory|allocat|array buffer|array length|canvas pixel/i.test(message)
      ? "resource"
      : "invalid"
  )
}
