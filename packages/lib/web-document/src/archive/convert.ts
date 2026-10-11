// This public entry uses parse5, not native DOMParser. It has no Node builtins
// and runs inside a disposable browser worker without a browsing context.
import { parse, convert } from "mhtml-to-html"
import { parse as parseHTML, serialize } from "parse5"
import type { DefaultTreeAdapterMap } from "parse5"
import { inspectEnvelope } from "./envelope"
import type { ConvertedArchive, Failure } from "./types"

const embedded = new Set(["iframe", "frame", "object", "embed"])

function cleanTree(source: string, onNested: () => void) {
  const tree = parseHTML(source)
  const queue: DefaultTreeAdapterMap["parentNode"][] = [tree]
  for (let index = 0; index < queue.length; index++) {
    const parent = queue[index]!
    parent.childNodes = parent.childNodes.filter((node) => {
      if (!("tagName" in node)) return true
      if (embedded.has(node.tagName)) {
        onNested()
        return false
      }
      // Converter adds a canonical link even to complete captures. It is
      // metadata, not a missing resource; remove it before resource diagnosis.
      if (
        node.tagName === "link" &&
        node.attrs.some(
          (attr) =>
            attr.name === "rel" &&
            /(?:^|\s)(?:canonical|alternate)(?:\s|$)/i.test(attr.value)
        )
      )
        return false
      queue.push(node)
      if (node.tagName === "template")
        queue.push((node as DefaultTreeAdapterMap["template"]).content)
      return true
    })
  }
  return serialize(tree)
}

export async function convertArchive(
  bytes: Uint8Array
): Promise<ConvertedArchive> {
  const archiveNotes = { ...inspectEnvelope(bytes), nested: false }
  const archive = parse(bytes)
  const start = archive.headers["content-type"]?.match(
    /\bstart\s*=\s*(?:"([^"]+)"|([^;\s]+))/i
  )
  if (start) archive.index = start[1] || start[2]!
  const root = archive.resources[archive.index]
  if (!root || !/^text\/html\b/i.test(root.contentType))
    throw new Error("invalid")
  const resources = new Set(Object.values(archive.resources))
  archiveNotes.nested = [...resources].some(
    (resource) =>
      resource !== root && /^text\/html\b/i.test(resource.contentType)
  )
  const nested = () => {
    archiveNotes.nested = true
  }
  root.data = cleanTree(root.data, nested)
  const location =
    archive.headers["snapshot-content-location"] ||
    archive.headers["content-location"] ||
    (/^(?:https?|file):/i.test(root.id) ? root.id : "")
  const result = await convert(archive, {
    enableScripts: false,
    fetchMissingResources: false,
    fetch: async () => {
      throw new Error("Network disabled")
    },
  })
  return { source: cleanTree(result.data, nested), location, archiveNotes }
}

export function failure(reason: unknown): Failure {
  if (
    reason instanceof RangeError ||
    (reason instanceof Error &&
      /memory|allocation|out of resources/i.test(reason.message))
  )
    return "resourceLimit"
  if (
    reason instanceof Error &&
    ["structure", "email", "invalid"].includes(reason.message)
  )
    return reason.message as Failure
  return "invalid"
}
