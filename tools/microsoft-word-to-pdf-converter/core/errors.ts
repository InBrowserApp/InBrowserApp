import { isDocumentLimitError } from "@workspace/document-reader"

type Failure = "invalid" | "unsupported" | "protected" | "resource"
export class ConversionError extends Error {
  constructor(
    readonly code: Failure,
    readonly page?: number
  ) {
    super(code)
  }
}

export function failure(reason: unknown): ConversionError {
  if (reason instanceof ConversionError) return reason
  const code = reason instanceof Error && "code" in reason ? reason.code : ""
  const message = reason instanceof Error ? reason.message : String(reason)
  if (
    code === "encrypted" ||
    code === "invalid-password" ||
    code === "unsupported-encryption"
  )
    return new ConversionError("protected")
  return new ConversionError(
    isDocumentLimitError(reason) ||
      /memory|allocat|array buffer|array length|canvas pixel/i.test(message)
      ? "resource"
      : "invalid"
  )
}
