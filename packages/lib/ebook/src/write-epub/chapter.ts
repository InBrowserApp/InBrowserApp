import { element, xmlText } from "./xml"
import { languageTag } from "../language"

const tags = new Set(
  "a abbr article aside b bdi bdo blockquote br caption cite code col colgroup dd del dfn div dl dt em figcaption figure footer h1 h2 h3 h4 h5 h6 header hr i img ins kbd li main mark ol p pre q rp rt ruby s samp section small span strong sub sup table tbody td tfoot th thead tr u ul var wbr".split(
    " "
  )
)
const attributes: Record<string, string[]> = {
  a: ["href"],
  img: ["src", "alt"],
  ol: ["start", "reversed", "type"],
  li: ["value"],
  td: ["colspan", "rowspan"],
  th: ["colspan", "rowspan", "scope"],
  col: ["span"],
  colgroup: ["span"],
}

/** Rebuild sanitized HTML as namespace-correct, portable EPUB XHTML. */
export function chapterContent(doc: Document, source: Element) {
  const fragment = doc.createDocumentFragment()
  function append(parent: Node, node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      parent.appendChild(doc.createTextNode(xmlText(node.textContent || "")))
      return
    }
    if (!(node instanceof Element)) return
    const tag = node.localName.toLowerCase()
    if (!tags.has(tag)) {
      // Obsolete MOBI formatting wrappers have no layout contract in this copy.
      if (node.id) parent.appendChild(element(doc, "span", { id: node.id }))
      for (const child of Array.from(node.childNodes)) append(parent, child)
      return
    }
    const output = element(doc, tag)
    for (const name of ["id", "title", ...(attributes[tag] || [])]) {
      const value = node.getAttribute(name)
      if (value !== null) output.setAttribute(name, xmlText(value))
    }
    const lang = languageTag(node.getAttribute("lang"))
    if (lang) output.setAttribute("lang", lang)
    const dir = node.getAttribute("dir")
    if (dir && ["ltr", "rtl", "auto"].includes(dir))
      output.setAttribute("dir", dir)
    if (tag === "img" && !output.hasAttribute("alt"))
      output.setAttribute("alt", "")
    parent.appendChild(output)
    for (const child of Array.from(node.childNodes)) append(output, child)
  }
  for (const node of Array.from(source.childNodes)) append(fragment, node)
  return fragment
}
