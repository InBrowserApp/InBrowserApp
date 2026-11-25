import { KepubError } from "./types"

const xhtml = "http://www.w3.org/1999/xhtml"
const atomicImages = "img,picture"
const paragraphStart = "p,ol,ul,table,h1,h2,h3,h4,h5,h6"
const unchanged = "script,style,pre,audio,video,textarea,select"

export function parseXml(source: string, code: "damaged" | "incomplete") {
  const doc = new DOMParser().parseFromString(source, "application/xml")
  if (doc.querySelector("parsererror")) throw new KepubError(code)
  return doc
}

export function addKoboMarkup(doc: Document, epub3: boolean) {
  const head = doc.getElementsByTagNameNS(xhtml, "head")[0]
  const body = doc.getElementsByTagNameNS(xhtml, "body")[0]
  if (!head || !body) throw new KepubError("incomplete")
  if (
    Array.from(body.querySelectorAll(".koboSpan[id]")).some(({ id }) =>
      /^kobo\.\d+\.\d+$/.test(id)
    )
  )
    throw new KepubError("alreadyKepub")

  for (const meta of head.getElementsByTagNameNS(xhtml, "meta")) {
    if (meta.hasAttribute("charset")) meta.setAttribute("charset", "UTF-8")
    const contentType = meta.getAttribute("content")
    if (
      contentType &&
      meta.getAttribute("http-equiv")?.toLowerCase() === "content-type"
    ) {
      meta.setAttribute(
        "content",
        contentType.replace(/\bcharset\s*=\s*[^;\s]+/i, "charset=UTF-8")
      )
    }
  }

  const used = new Set(
    Array.from(doc.querySelectorAll("[id]"), (node) => node.id)
  )
  let paragraph = 0
  let segment = 0
  let newParagraph = true

  function span() {
    if (newParagraph) {
      paragraph++
      segment = 0
      newParagraph = false
    }
    let id: string
    do {
      id = `kobo.${paragraph}.${++segment}`
    } while (used.has(id))
    const span = doc.createElementNS(xhtml, "span")
    span.setAttribute("class", "koboSpan")
    span.id = id
    return span
  }

  function visit(parent: Element) {
    for (const child of Array.from(parent.childNodes)) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as Element
        if (element.namespaceURI !== xhtml || element.matches(unchanged))
          continue
        if (element.matches(atomicImages)) {
          newParagraph = true
          const marker = span()
          element.replaceWith(marker)
          marker.append(element)
        } else {
          if (element.matches(paragraphStart)) newParagraph = true
          visit(element)
        }
      } else if (
        (child.nodeType === Node.TEXT_NODE ||
          child.nodeType === Node.CDATA_SECTION_NODE) &&
        child.nodeValue?.trim()
      ) {
        const fragment = doc.createDocumentFragment()
        const text = child.nodeValue
        // Keep the original characters and spacing while marking each sentence.
        const ends = /[.!?]["'“”’…]?[ \t\r\n]+|[。！？]+[”’」』】]*/gu
        let start = 0
        for (const match of text.matchAll(ends)) {
          const end = match.index + match[0].length
          const marker = span()
          marker.textContent = text.slice(start, end)
          fragment.append(marker)
          start = end
        }
        if (start < text.length) {
          const marker = span()
          marker.textContent = text.slice(start)
          fragment.append(marker)
        }
        child.replaceWith(fragment)
      }
    }
  }

  visit(body)
  if (
    !doc.getElementById("book-columns") &&
    !doc.getElementById("book-inner")
  ) {
    const columns = doc.createElementNS(xhtml, "div")
    columns.id = "book-columns"
    const inner = doc.createElementNS(xhtml, "div")
    inner.id = "book-inner"
    while (body.firstChild) inner.append(body.firstChild)
    columns.append(inner)
    body.append(columns)
  }
  if (!doc.getElementById("kobostylehacks")) {
    const style = doc.createElementNS(xhtml, "style")
    if (epub3) style.id = "kobostylehacks"
    style.setAttribute("type", "text/css")
    style.textContent = "div#book-inner { margin-top: 0; margin-bottom: 0; }"
    head.append(style)
  }
}
