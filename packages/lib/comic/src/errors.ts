import { failureCode } from "./pages"

export type Failure = {
  code:
    | "empty"
    | "damaged"
    | "encrypted"
    | "resourceLimit"
    | "engineUnavailable"
    | "unsupportedPage"
    | "encryptedPage"
    | "damagedPage"
  page?: number
  name?: string
}

export class ConversionError extends Error {
  constructor(readonly detail: Failure) {
    super(detail.code)
  }
}

export function conversionFailure(reason: unknown): Failure {
  return reason instanceof ConversionError
    ? reason.detail
    : { code: failureCode(reason) }
}

export function failureMessage(
  reason: unknown,
  messages: Record<Failure["code"] | "pageFailure", string>
) {
  const { code, page, name } = conversionFailure(reason)
  const location = page
    ? messages.pageFailure
        .replace("{page}", String(page))
        .replace("{name}", () => name ?? "") + " — "
    : ""
  return location + messages[code]
}
