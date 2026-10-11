import { readableText } from "@workspace/web-document"
import { readingDocument, readingPreview } from "@workspace/ebook/document"
import type { BookSnapshot } from "@workspace/ebook"
import type { Messages } from "../types"

export function ebookDocument(book: BookSnapshot, m: Messages) {
  const { doc, notes } = readingDocument(book, m)
  const notice = doc.createElement("aside")
  for (const note of notes) {
    const p = doc.createElement("p")
    p.textContent = note
    notice.append(p)
  }
  doc.body.append(notice)
  const exported = "<!doctype html>" + doc.documentElement.outerHTML
  notice.remove()
  const nav = doc.querySelector("nav")!
  nav.remove()
  const text = `${readableText(doc.body)}\n\n${m.plainNotice}\n${notes.join("\n")}\n`
  doc.body.insertBefore(nav, doc.querySelector("header")!.nextSibling)
  return {
    preview: readingPreview(doc),
    file: new Blob([exported], { type: "text/html;charset=utf-8" }),
    text,
    textFile: new Blob([text], { type: "text/plain;charset=utf-8" }),
    notes,
  }
}
