export type OpmlDocument = {
  xml: XMLDocument
  root: Element
  head: Element
  body: Element
}
type Row = { node: Element; depth: number }

const parserErrorNamespaces = [
  "http://www.w3.org/1999/xhtml",
  "http://www.mozilla.org/newlayout/xml/parsererror.xml",
]

function xmlText(value: string) {
  return value.replace(
    // oxlint-disable-next-line no-control-regex -- XML 1.0 permits only these characters.
    /[^\u0009\u000a\u000d\u0020-\ud7ff\ue000-\ufffd\u{10000}-\u{10ffff}]/gu,
    ""
  )
}

function children(parent: Element, name: string) {
  return Array.from(parent.children).filter(
    (child) =>
      child.localName === name && child.namespaceURI === parent.namespaceURI
  )
}

export function outlineChildren(parent: Element) {
  return children(parent, "outline")
}

function createChild(parent: Element, name: string) {
  const child = parent.ownerDocument.createElementNS(parent.namespaceURI, name)
  return parent.appendChild(child)
}

export function parseOpml(source: string): OpmlDocument {
  const xml = new DOMParser().parseFromString(source, "application/xml")
  const root = xml.documentElement
  const parserFailed = parserErrorNamespaces.some(
    (namespace) =>
      xml.getElementsByTagNameNS(namespace, "parsererror").length > 0
  )
  if (root.localName !== "opml" || xml.doctype || parserFailed)
    throw new Error("invalid")
  const bodies = children(root, "body")
  const heads = children(root, "head")
  if (bodies.length !== 1 || heads.length > 1) throw new Error("invalid")
  const body = bodies[0]!
  const head =
    heads[0] ||
    root.insertBefore(xml.createElementNS(root.namespaceURI, "head"), body)
  if (!root.hasAttribute("version")) root.setAttribute("version", "2.0")
  return { xml, root, head, body }
}

export function newOutline() {
  return parseOpml('<opml version="2.0"><head/><body/></opml>')
}

export function documentTitle({ head }: OpmlDocument) {
  return children(head, "title")[0]?.textContent ?? ""
}

export function setDocumentTitle({ head }: OpmlDocument, value: string) {
  const title = children(head, "title")[0] || createChild(head, "title")
  title.textContent = xmlText(value)
}

export function isFeed(node: Element) {
  return (
    node.hasAttribute("xmlUrl") ||
    /^(rss|atom)$/i.test(node.getAttribute("type") ?? "")
  )
}

export function validFeedAddress(node: Element) {
  const address = node.getAttribute("xmlUrl")?.trim() ?? ""
  return /^https?:\/\//i.test(address) && URL.canParse(address)
}

export function outlineName(node: Element) {
  return node.getAttribute("text") ?? node.getAttribute("title") ?? ""
}

export function setOutlineName(node: Element, name: string) {
  node.setAttribute("text", xmlText(name))
}

export function setOutlineAddress(
  node: Element,
  attribute: "xmlUrl" | "htmlUrl",
  value: string
) {
  const text = xmlText(value).trim()
  if (attribute === "htmlUrl" && !text) node.removeAttribute(attribute)
  else node.setAttribute(attribute, text)
}

export function addOutline(
  { body }: OpmlDocument,
  selected: Element | null,
  name: string,
  feed: boolean
) {
  const parent = selected
    ? isFeed(selected)
      ? selected.parentElement!
      : selected
    : body
  const node = createChild(parent, "outline")
  node.setAttribute("text", name)
  if (feed) {
    node.setAttribute("type", "rss")
    node.setAttribute("xmlUrl", "")
  }
  return node
}

export function outlineRows({ body }: OpmlDocument) {
  const rows: Row[] = []
  const stack = outlineChildren(body)
    .reverse()
    .map((node) => ({ node, depth: 0 }))
  while (stack.length) {
    const row = stack.pop()!
    rows.push(row)
    for (const node of outlineChildren(row.node).reverse()) {
      stack.push({ node, depth: row.depth + 1 })
    }
  }
  return rows
}

export function outlineMoves(node: Element, body: Element) {
  const parent = node.parentElement!
  const siblings = outlineChildren(parent)
  const index = siblings.indexOf(node)
  const previous = siblings[index - 1]
  const next = siblings[index + 1]
  return {
    moveUp: previous && (() => previous.before(node)),
    moveDown: next && (() => next.after(node)),
    indent:
      previous && !isFeed(previous) ? () => previous.append(node) : undefined,
    outdent: parent !== body ? () => parent.after(node) : undefined,
  }
}

export function serializeOpml({ xml }: OpmlDocument) {
  const serializer = new XMLSerializer()
  const content = Array.from(xml.childNodes, (node) =>
    serializer.serializeToString(node)
  ).join("\n")
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + content + "\n"
}

export async function readOpmlFile(file: Blob) {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const [first, second] = bytes
  const prefix = new TextDecoder().decode(bytes.subarray(0, 256))
  const declared = /^<\?xml[^>]*\bencoding\s*=\s*["']([^"']+)["']/i.exec(
    prefix
  )?.[1]
  const encoding =
    (first === 0xff && second === 0xfe) || (first === 0x3c && second === 0)
      ? "utf-16le"
      : (first === 0xfe && second === 0xff) || (first === 0 && second === 0x3c)
        ? "utf-16be"
        : declared || "utf-8"
  return parseOpml(new TextDecoder(encoding, { fatal: true }).decode(bytes))
}
