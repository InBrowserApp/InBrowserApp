import { readableText } from "@workspace/web-document"
import type { snapshotBook } from "@workspace/ebook"
import type { Messages } from "../types"

const policy =
  "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'"
const style = `html{color-scheme:light dark}body{font:18px/1.75 system-ui,sans-serif;max-width:76ch;margin:0 auto;padding:24px;overflow-wrap:anywhere}img{max-width:100%;height:auto}table{display:block;overflow:auto;border-collapse:collapse}td,th{border:1px solid #8888;padding:.4em}pre{white-space:pre-wrap;tab-size:4}a{color:LinkText}section{margin-block:2.5em}blockquote{border-inline-start:3px solid #8888;margin-inline:0;padding-inline:1em}h1,h2,h3{line-height:1.3}aside{font-size:.85em;opacity:.8}nav ul{padding-inline-start:1.5em}`

export function ebookDocument(
  book: Awaited<ReturnType<typeof snapshotBook>>,
  m: Messages
) {
  const doc = document.implementation.createHTMLDocument(book.title)
  const csp = doc.createElement("meta")
  csp.httpEquiv = "Content-Security-Policy"
  csp.content = policy
  const charset = doc.createElement("meta")
  charset.setAttribute("charset", "utf-8")
  const theme = doc.createElement("style")
  theme.textContent = style
  doc.head.prepend(csp, charset)
  doc.head.append(theme)
  const header = doc.createElement("header")
  const title = doc.createElement("h1")
  title.textContent = book.title
  header.append(title)
  if (book.author) {
    const author = doc.createElement("p")
    author.textContent = book.author
    header.append(author)
  }
  doc.body.dir = "auto"
  doc.body.append(header)
  const nav = doc.createElement("nav")
  nav.setAttribute("aria-label", m.contents)
  const heading = doc.createElement("h2")
  heading.textContent = m.contents
  const list = doc.createElement("ul")
  nav.append(heading, list)
  doc.body.append(nav)
  let supporting = false
  for (const chapter of book.chapters) {
    const item = doc.createElement("li")
    const link = doc.createElement("a")
    link.setAttribute("href", `#${chapter.id}`)
    link.textContent = chapter.title
    item.append(link)
    list.append(item)
    if (chapter.supporting && !supporting) {
      const heading = doc.createElement("h2")
      heading.textContent = m.supportingSections
      doc.body.append(heading)
      supporting = true
    }
    const section = doc.createElement("section")
    section.id = chapter.id
    section.innerHTML = chapter.html
    if (!section.querySelector("h1,h2,h3,h4,h5,h6")) {
      const heading = doc.createElement("h2")
      heading.textContent = chapter.title
      section.prepend(heading)
    }
    doc.body.append(section)
  }
  if (
    book.cover &&
    !Array.from(doc.querySelectorAll("img"), (image) =>
      image.getAttribute("src")
    ).includes(book.cover)
  ) {
    const cover = doc.createElement("img")
    cover.setAttribute("src", book.cover)
    cover.alt = book.title
    header.append(cover)
  }
  const notes = [m.styleNotice, m.safePreview]
  if (book.missing) notes.push(m.missingResources)
  if (book.unresolved) notes.push(m.unresolvedLinks)
  // Direct links are safe destinations created from the sanitized chapters.
  // The reading frame instead uses the shared parent-owned navigation handlers.
  const notice = doc.createElement("aside")
  for (const note of notes) {
    const p = doc.createElement("p")
    p.textContent = note
    notice.append(p)
  }
  doc.body.append(notice)
  const exported = "<!doctype html>" + doc.documentElement.outerHTML
  notice.remove()
  nav.remove()
  const text = `${readableText(doc.body)}\n\n${m.plainNotice}\n${notes.join("\n")}\n`
  doc.body.insertBefore(nav, header.nextSibling)
  for (const link of doc.querySelectorAll("a[href]")) {
    link.setAttribute("data-web-link", link.getAttribute("href")!)
    link.removeAttribute("href")
    link.setAttribute("role", "link")
    link.setAttribute("tabindex", "0")
  }
  return {
    preview: {
      html: "<!doctype html>" + doc.documentElement.outerHTML,
      title: book.title,
    },
    file: new Blob([exported], { type: "text/html;charset=utf-8" }),
    text,
    textFile: new Blob([text], { type: "text/plain;charset=utf-8" }),
    notes,
  }
}
