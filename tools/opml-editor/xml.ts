export type OpmlDocument = { xml: XMLDocument; root: Element; body: Element }
type Row = { node: Element; depth: number }

function children(parent: Element, name: string) {
  return Array.from(parent.children).filter(
    (child) =>
      child.localName === name && child.namespaceURI === parent.namespaceURI
  )
}

function createChild(parent: Element, name: string) {
  const child = parent.ownerDocument.createElementNS(parent.namespaceURI, name)
  return parent.appendChild(child)
}

export function parseOpml(source: string): OpmlDocument {
  const xml = new DOMParser().parseFromString(source, "application/xml")
  const root = xml.documentElement
  const body = children(root, "body")[0]
  if (root.localName !== "opml" || xml.doctype || !body)
    throw new Error("invalid")
  return { xml, root, body }
}

export function newOutline() {
  return parseOpml('<opml version="2.0"><head/><body/></opml>')
}

export function documentTitle({ root }: OpmlDocument) {
  const head = children(root, "head")[0]
  return head ? (children(head, "title")[0]?.textContent ?? "") : ""
}

export function setDocumentTitle({ root, body }: OpmlDocument, value: string) {
  const head =
    children(root, "head")[0] ||
    root.insertBefore(
      root.ownerDocument.createElementNS(root.namespaceURI, "head"),
      body
    )
  const title = children(head, "title")[0] || createChild(head, "title")
  title.textContent = value
}

export function isFeed(node: Element) {
  return node.hasAttribute("xmlUrl")
}

export function outlineName(node: Element) {
  return node.getAttribute("text") || node.getAttribute("title") || ""
}

export function setOutlineName(node: Element, name: string) {
  node.setAttribute("text", name)
  if (node.hasAttribute("title")) node.setAttribute("title", name)
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
  const stack = children(body, "outline")
    .reverse()
    .map((node) => ({ node, depth: 0 }))
  while (stack.length) {
    const row = stack.pop()!
    rows.push(row)
    for (const node of children(row.node, "outline").reverse()) {
      stack.push({ node, depth: row.depth + 1 })
    }
  }
  return rows
}

export function outlineMoves(node: Element, body: Element) {
  const parent = node.parentElement!
  const siblings = children(parent, "outline")
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
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    new XMLSerializer().serializeToString(xml) +
    "\n"
  )
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
