import { openBook } from "@workspace/ebook/epub"
import { snapshotBook } from "@workspace/ebook"
import { createReadingDocument } from "@workspace/ebook/document"
import type { Messages } from "./messages"

const printStyles = `
  @page { size: A4; margin: 16mm; }
  @media print {
    html { color-scheme: light; }
    body { max-width: none; margin: 0; padding: 0; color: #171717;
      font: 11pt/1.5 Georgia, serif; }
    header h1 { font-size: 23pt; }
    section { margin-block: 1.5em; }
    h1, h2, h3, h4, h5, h6 { break-after: avoid; }
    p { orphans: 2; widows: 2; }
    img { max-height: 145mm; object-fit: contain; break-inside: avoid; }
    table { display: table; width: 100%; table-layout: fixed; }
    tr { break-inside: avoid; }
    a { color: inherit; }
  }
`

export async function prepareBook(
  file: File,
  signal: AbortSignal,
  m: Messages,
  lang: string
) {
  signal.throwIfAborted()
  const book = await openBook(file, signal, true)
  try {
    const snapshot = await snapshotBook(book, signal, m)
    const doc = createReadingDocument(snapshot, m)
    doc.documentElement.lang = snapshot.language || lang
    for (const section of doc.body.querySelectorAll<HTMLElement>(
      ":scope > section"
    ))
      section.dir = "auto"
    for (const details of doc.querySelectorAll("details")) details.open = true
    for (const image of doc.querySelectorAll("img[loading]"))
      image.removeAttribute("loading")
    const style = doc.createElement("style")
    style.textContent = printStyles
    const paper = doc.createElement("style")
    paper.id = "paper-size"
    doc.head.append(style, paper)
    return {
      html: "<!doctype html>" + doc.documentElement.outerHTML,
      missing: snapshot.missing,
    }
  } finally {
    book.dispose()
  }
}
