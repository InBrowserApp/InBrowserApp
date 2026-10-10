import { unzipSync } from "fflate"
import { attr, children, is, parseXml, REL } from "./xml"
import type { Element } from "./xml"

export type Relationship = { type: string; target: string; external: boolean }
export type Part = {
  path: string
  root: Element
  relationships: Map<string, Relationship>
}

export function resolvePath(source: string, target: string): string {
  if (
    /[\\?#]/.test(target) ||
    target.includes("\0") ||
    /^[a-z][a-z\d+.-]*:/i.test(target)
  )
    throw new Error("invalid")
  const path = target.startsWith("/") ? [] : source.split("/").slice(0, -1)
  for (const segment of target.split("/")) {
    const value = decodeURIComponent(segment)
    if (!value || value === ".") continue
    if (value === "..") {
      if (!path.length) throw new Error("invalid")
      path.pop()
    } else {
      if (/[\\/]/.test(value) || value.includes("\0"))
        throw new Error("invalid")
      path.push(value)
    }
  }
  return path.join("/")
}

export function openArchive(bytes: Uint8Array) {
  if (
    [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1].every(
      (byte, i) => bytes[i] === byte
    )
  )
    throw new Error("protected")
  // Media are never inflated, decoded, executed, or fetched for a text export.
  const files = unzipSync(bytes, {
    filter: ({ name }) => /\.(xml|rels)$/i.test(name),
  })
  const cache = new Map<string, Part>()
  function relationships(path: string): Map<string, Relationship> {
    const slash = path.lastIndexOf("/")
    const filename = `${path.slice(0, slash + 1)}_rels/${path.slice(slash + 1)}.rels`
    const bytes = files[filename]
    if (!bytes) return new Map()
    const root = parseXml(bytes)
    if (!is(root, "Relationships", REL)) throw new Error("invalid")
    const result = new Map<string, Relationship>()
    for (const item of children(root)) {
      if (!is(item, "Relationship", REL)) continue
      const id = attr(item, "Id"),
        target = attr(item, "Target"),
        type = attr(item, "Type")
      if (!id || !target || !type || result.has(id)) throw new Error("invalid")
      result.set(id, {
        target,
        type: type.split("/").at(-1)!,
        external: attr(item, "TargetMode") === "External",
      })
    }
    return result
  }
  function part(path: string): Part {
    const cached = cache.get(path)
    if (cached) return cached
    const bytes = files[path]
    if (!bytes) throw new Error("invalid")
    const result = {
      path,
      root: parseXml(bytes),
      relationships: relationships(path),
    }
    cache.set(path, result)
    return result
  }
  function related(
    source: Pick<Part, "path" | "relationships">,
    type: string
  ): Part | undefined {
    const matches = [...source.relationships.values()].filter(
      (item) => item.type === type
    )
    if (!matches.length) return
    if (matches.length !== 1 || matches[0]!.external) throw new Error("invalid")
    return part(resolvePath(source.path, matches[0]!.target))
  }
  const main = related(
    { path: "", relationships: relationships("") },
    "officeDocument"
  )
  if (!main) throw new Error("invalid")
  return { main, part, related }
}
export type Archive = ReturnType<typeof openArchive>
