const XHTML = "http://www.w3.org/1999/xhtml"
export const OPF = "http://www.idpf.org/2007/opf"
export const DC = "http://purl.org/dc/elements/1.1/"
export const EPUB = "http://www.idpf.org/2007/ops"

// XML 1.0 cannot represent these control characters, even as entities.
export function xmlText(text: string) {
  return text.replace(
    // oxlint-disable-next-line no-control-regex -- XML 1.0 forbids these characters.
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g,
    ""
  )
}
export function element(
  doc: Document,
  name: string,
  attributes: Record<string, string> = {},
  text?: string
) {
  const node = doc.createElementNS(doc.documentElement.namespaceURI, name)
  for (const [key, value] of Object.entries(attributes))
    node.setAttribute(key, xmlText(value))
  if (text !== undefined) node.textContent = xmlText(text)
  return node
}
export function xhtml(title: string, language: string) {
  const doc = document.implementation.createDocument(XHTML, "html")
  doc.documentElement.setAttribute("lang", language)
  doc.documentElement.setAttributeNS(
    "http://www.w3.org/XML/1998/namespace",
    "xml:lang",
    language
  )
  const head = element(doc, "head")
  head.append(
    element(doc, "title", {}, title),
    element(doc, "link", {
      rel: "stylesheet",
      type: "text/css",
      href: "style.css",
    })
  )
  const body = element(doc, "body", { dir: "auto" })
  doc.documentElement.append(head, body)
  return { doc, body }
}
export function serialize(doc: Document) {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    new XMLSerializer().serializeToString(doc)
  )
}
