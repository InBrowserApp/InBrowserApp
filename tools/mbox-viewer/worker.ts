import { failure } from "@workspace/email"
import { indexMbox, readMboxMessage } from "@workspace/email/mbox"
import type { MailSummary } from "@workspace/email/mbox"
import type { Email, Failure } from "@workspace/email"

export type Request = { file: File } | { id: number }
export type Reply =
  | { messages: MailSummary[] }
  | { error: Failure }
  | { id: number; email: Email }
  | { id: number; error: Failure }

let archive: { file: File; entries: Awaited<ReturnType<typeof indexMbox>> }

self.onmessage = async ({ data }: MessageEvent<Request>) => {
  let reply: Reply
  if ("file" in data) {
    try {
      const entries = await indexMbox(data.file)
      archive = { file: data.file, entries }
      reply = {
        messages: entries.map(({ subject, from, to, date }) => ({
          subject,
          from,
          to,
          date,
        })),
      }
    } catch (error) {
      reply = { error: failure(error) }
    }
  } else {
    try {
      const email = await readMboxMessage(
        archive.file,
        archive.entries[data.id]!
      )
      reply = { id: data.id, email }
    } catch (error) {
      reply = { id: data.id, error: failure(error) }
    }
  }
  self.postMessage(reply)
}
