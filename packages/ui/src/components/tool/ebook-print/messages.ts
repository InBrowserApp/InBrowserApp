import type english from "./messages/en.json"

export const openingErrorCodes = [
  "protected",
  "unsupportedLayout",
  "unsupportedVariant",
  "ambiguous",
  "noBook",
  "encoding",
] as const

type OpeningMessages = Partial<
  Record<(typeof openingErrorCodes)[number], string>
>

export type Messages = typeof english & OpeningMessages

export type FormatCopy = Pick<
  Messages,
  "open" | "replace" | "drop" | "unsupported" | "invalid" | "protected"
> &
  OpeningMessages
