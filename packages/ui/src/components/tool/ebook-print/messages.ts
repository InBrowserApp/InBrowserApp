import type english from "./messages/en.json"

type ArchiveMessages = Partial<
  Record<"ambiguous" | "noBook" | "encoding", string>
>

export type Messages = typeof english & ArchiveMessages

export type BookPrintFormat = "epub" | "fb2"
export type FormatCopy = Pick<
  Messages,
  "open" | "replace" | "drop" | "unsupported" | "invalid" | "protected"
> &
  ArchiveMessages
