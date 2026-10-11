import { openEmail } from "@workspace/email"
import { safeNames } from "./names"

export async function convert(file: File, signal: AbortSignal) {
  const email = await openEmail(file, signal, { attachmentBytes: "all" })
  signal.throwIfAborted()
  if (
    email.notices.some((notice) =>
      ["partial", "attachmentError"].includes(notice)
    )
  )
    throw new Error("incomplete")
  const names = safeNames(
    email.attachments.map((item) => {
      const extension =
        item.type === "application/vnd.ms-outlook" ? ".msg" : ".eml"
      return item.kind === "nested" &&
        !item.name.toLowerCase().endsWith(extension)
        ? `${item.name || "message"}${extension}`
        : item.name
    })
  )
  const attachments = email.attachments.map((item, index) => {
    if (/^message\/external-body$/i.test(item.type))
      throw new Error("unsupported")
    if (!item.bytes) throw new Error("incomplete")
    return {
      name: item.name,
      filename: names[index]!,
      kind: item.kind,
      file: new Blob([item.bytes], { type: "application/octet-stream" }),
    }
  })
  signal.throwIfAborted()
  return { subject: email.subject, from: email.from, attachments }
}
