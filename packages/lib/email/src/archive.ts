import type { Email, Failure } from "./types"

export type MailSummary = {
  subject: string
  from: string
  to: string
  cc?: string
  bcc?: string
  date: string
  folder?: number
}

export type ArchiveRequest = { file: File } | { id: number }
export type ArchiveMessage = { id: number } & (
  | { email: Email }
  | { error: Failure }
)
export type ArchiveReply =
  | { messages: MailSummary[]; folders?: string[] }
  | { error: Failure }
  | ArchiveMessage
