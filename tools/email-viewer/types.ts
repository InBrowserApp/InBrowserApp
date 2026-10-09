import type messages from "./messages/en.json"
export type Messages = typeof messages
export type Notice =
  | "partial"
  | "invalidDate"
  | "utcDate"
  | "signed"
  | "attachmentError"
  | "rtfOnly"
export type Failure =
  | "invalid"
  | "emptyFile"
  | "resourceLimit"
  | "protected"
  | "unsupported"
export type Attachment = {
  name: string
  type: string
  size: number | null
  kind: "inline" | "attachment" | "nested"
  cid?: string
  bytes?: Uint8Array<ArrayBuffer>
}
export type Email = {
  format: "EML" | "EMLX" | "MSG"
  subject: string
  from: string
  to: string
  cc: string
  bcc: string
  date: string
  html: string
  text: string
  attachments: Attachment[]
  notices: Notice[]
}
export type Result = { email: Email } | { error: Failure }
