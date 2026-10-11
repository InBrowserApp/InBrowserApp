import { openEmail } from "@workspace/email"
import { emailDocument } from "@workspace/email/document"
import { exportWebDocument } from "@workspace/web-document/export"
import { readableText } from "./text"
import type { Messages } from "../types"

export async function convert(file: File, signal: AbortSignal, m: Messages) {
  const email = await openEmail(file, signal)
  signal.throwIfAborted()
  const source = emailDocument(email, m, { links: "direct" })
  const html = await exportWebDocument(source.html, signal, m.documentBody)
  signal.throwIfAborted()
  // Template parsing keeps even the already-sanitized images inert. The text
  // alternative is copied directly, without interpreting its markup as HTML.
  const root = document
    .createElement("template")
    .content.ownerDocument.createElement("html")
  root.innerHTML = source.html
  const article = root.querySelector("article")!
  const body = email.text || readableText(article)
  article.remove()
  const prefix = readableText(root.querySelector("body")!)
  const text = `${prefix}\n\n${m.plainNotice}\n\n${body}${body.endsWith("\n") ? "" : "\n"}`
  return {
    ...html,
    text,
    textFile: new Blob([text], { type: "text/plain;charset=utf-8" }),
  }
}
