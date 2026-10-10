import { SaxesParser } from "saxes"

export type Element = {
  name?: string
  text?: string
  attributes: Record<string, string>
  elements: Element[]
}

const namespaces = new Map([
  ["urn:oasis:names:tc:opendocument:xmlns:office:1.0", "office"],
  ["urn:oasis:names:tc:opendocument:xmlns:table:1.0", "table"],
  ["urn:oasis:names:tc:opendocument:xmlns:text:1.0", "text"],
  ["urn:oasis:names:tc:opendocument:xmlns:style:1.0", "style"],
  ["urn:oasis:names:tc:opendocument:xmlns:manifest:1.0", "manifest"],
  [
    "urn:org:documentfoundation:names:experimental:calc:xmlns:calcext:1.0",
    "calcext",
  ],
])

export function parseXml(bytes: Uint8Array): Element {
  const encoding =
    bytes[0] === 255 && bytes[1] === 254
      ? "utf-16le"
      : bytes[0] === 254 && bytes[1] === 255
        ? "utf-16be"
        : "utf-8"
  const source = new TextDecoder(encoding, { fatal: true }).decode(bytes)
  const document: Element = { attributes: {}, elements: [] }
  const stack = [document]
  const qualified = (uri: string, local: string) =>
    `${namespaces.get(uri) ?? "unknown"}:${local}`
  const parser = new SaxesParser({ xmlns: true })
  parser.on("doctype", () => {
    throw new Error("unsupported")
  })
  parser.on("opentag", (tag) => {
    const node: Element = {
      name: qualified(tag.uri, tag.local),
      attributes: Object.fromEntries(
        Object.values(tag.attributes).map((attr) => [
          qualified(attr.uri, attr.local),
          attr.value,
        ])
      ),
      elements: [],
    }
    stack.at(-1)!.elements.push(node)
    stack.push(node)
  })
  parser.on("closetag", () => {
    stack.pop()
  })
  const text = (text: string) => {
    stack.at(-1)!.elements.push({ text, attributes: {}, elements: [] })
  }
  parser.on("text", text)
  parser.on("cdata", text)
  parser.write(source).close()
  return document
}

export const children = (node: Element, name: string) =>
  node.elements.filter((child) => child.name === name)
export const attribute = (node: Element, name: string) => node.attributes[name]

export function repeat(node: Element, name: string) {
  const value = Number(attribute(node, name) ?? 1)
  if (!Number.isSafeInteger(value) || value < 1) throw new Error("invalid")
  return value
}

export function paragraphs(node: Element): Element[] {
  return node.elements.flatMap((child) => {
    if (child.name === "text:p" || child.name === "text:h") return [child]
    return [
      "text:list",
      "text:list-item",
      "text:list-header",
      "text:section",
      "text:numbered-paragraph",
    ].includes(child.name ?? "")
      ? paragraphs(child)
      : []
  })
}

export function cellText(node: Element): string {
  function text(node: Element): string {
    if (node.text !== undefined) return node.text
    if (node.name === "text:s") return " ".repeat(repeat(node, "text:c"))
    if (node.name === "text:tab") return "\t"
    if (node.name === "text:line-break") return "\n"
    if (!node.name!.startsWith("text:")) return ""
    return node.elements.map(text).join("")
  }
  return paragraphs(node).map(text).join("\n")
}
