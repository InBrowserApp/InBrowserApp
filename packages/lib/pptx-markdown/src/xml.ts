import { SaxesParser } from "saxes"

const base = "http://schemas.openxmlformats.org/"
const strict = "http://purl.oclc.org/ooxml/"
export const P = `${base}presentationml/2006/main`
export const A = `${base}drawingml/2006/main`
export const R = `${base}officeDocument/2006/relationships`
export const REL = `${base}package/2006/relationships`
const MC = `${base}markup-compatibility/2006`
const known = new Set([
  P,
  A,
  R,
  `${base}officeDocument/2006/math`,
  `${base}drawingml/2006/chart`,
  "http://schemas.microsoft.com/office/drawing/2010/main",
])

function namespace(uri: string): string {
  if (uri === `${strict}presentationml/main`) return P
  if (uri === `${strict}drawingml/main`) return A
  if (uri === `${strict}officeDocument/relationships`) return R
  if (uri === `${strict}officeDocument/math`)
    return `${base}officeDocument/2006/math`
  return uri
}

export type Element = {
  name: string
  uri: string
  attributes: Map<string, string>
  namespaces: Record<string, string>
  children: Element[]
  text: string
}
export function attr(
  node: Element | undefined,
  name: string,
  uri = ""
): string | undefined {
  return node?.attributes.get(`${uri}|${name}`)
}
export function is(node: Element, name: string, uri = A): boolean {
  return node.name === name && node.uri === uri
}
// Process one compatible branch, so fallback representations are never doubled.
export function children(node?: Element): Element[] {
  return (node?.children ?? []).flatMap((child) => {
    if (!is(child, "AlternateContent", MC)) return [child]
    const choice =
      child.children.find(
        (item) =>
          is(item, "Choice", MC) &&
          (attr(item, "Requires") ?? "")
            .split(/\s+/)
            .every((prefix) =>
              known.has(namespace(item.namespaces[prefix] ?? ""))
            )
      ) ?? child.children.find((item) => is(item, "Fallback", MC))
    if (!choice) throw new Error("invalid")
    return children(choice)
  })
}
export function child(
  node: Element | undefined,
  name: string,
  uri = A
): Element | undefined {
  return children(node).find((item) => is(item, name, uri))
}
export function descendants(
  node: Element | undefined,
  name: string,
  uri = A
): Element[] {
  const result: Element[] = []
  const pending = [...children(node)].reverse()
  while (pending.length) {
    const next = pending.pop()!
    if (is(next, name, uri)) result.push(next)
    pending.push(...children(next).reverse())
  }
  return result
}

export function parseXml(bytes: Uint8Array): Element {
  const utf16 =
    (bytes[0] === 0xff && bytes[1] === 0xfe) ||
    (bytes[0] === 0x3c && bytes[1] === 0)
  const utf16be =
    (bytes[0] === 0xfe && bytes[1] === 0xff) ||
    (bytes[0] === 0 && bytes[1] === 0x3c)
  const text = new TextDecoder(
    utf16 ? "utf-16le" : utf16be ? "utf-16be" : "utf-8",
    { fatal: true }
  ).decode(bytes)
  let root: Element | undefined
  const stack: Element[] = []
  const parser = new SaxesParser({ xmlns: true })
  parser.on("doctype", () => {
    throw new Error("invalid")
  })
  parser.on("opentag", (tag) => {
    const node: Element = {
      name: tag.local,
      uri: namespace(tag.uri),
      text: "",
      children: [],
      namespaces: { ...stack.at(-1)?.namespaces, ...tag.ns },
      attributes: new Map(
        Object.values(tag.attributes).map((value) => [
          `${namespace(value.uri)}|${value.local}`,
          value.value,
        ])
      ),
    }
    if (stack.length) stack.at(-1)!.children.push(node)
    else root = node
    stack.push(node)
  })
  const append = (value: string) => {
    if (stack.length) stack.at(-1)!.text += value
  }
  parser.on("text", append)
  parser.on("cdata", append)
  parser.on("closetag", () => {
    stack.pop()
  })
  parser.write(text).close()
  if (!root) throw new Error("invalid")
  return root
}
