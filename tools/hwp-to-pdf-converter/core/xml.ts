import { unzipSync } from "fflate"
import { SaxesParser } from "saxes"
import type { SaxesTagNS } from "saxes"
import { resource } from "./resources"
import type { Resource } from "./resources"

const opf = "http://www.idpf.org/2007/opf/"
function xml(bytes: Uint8Array, visit: (node: SaxesTagNS) => void) {
  const parser = new SaxesParser({ xmlns: true })
  parser.on("doctype", () => {
    throw new Error("invalid")
  })
  parser.on("opentag", visit)
  parser.write(new TextDecoder("utf-8", { fatal: true }).decode(bytes)).close()
}

export function xmlResources(bytes: Uint8Array): Resource[] {
  const files = unzipSync(bytes)
  const manifest = files["Contents/content.hpf"]
  if (!manifest) throw new Error("invalid")
  const items = new Map<string, { path: string; mime: string }>()
  const spine: string[] = []
  xml(manifest, (node) => {
    if (node.uri !== opf) return
    const attr = (key: string) => node.attributes[key]?.value ?? ""
    if (node.local === "itemref") spine.push(attr("idref"))
    if (node.local !== "item") return
    const href = attr("href")
    const id = attr("id")
    if (
      !id ||
      items.has(id) ||
      !href ||
      /[\\:#?]|(?:^|\/)\.\.(?:\/|$)/.test(href)
    )
      throw new Error("unsupported")
    const path = files[href] ? href : `Contents/${href}`
    if (!files[path]?.length || attr("isEmbeded") === "0")
      throw new Error("unsupported")
    items.set(id, { path, mime: attr("media-type") })
  })
  if (!spine.length || spine.some((id) => !items.has(id)))
    throw new Error("invalid")
  const images: Resource[] = []
  for (const { path, mime } of items.values()) {
    const content = files[path]!
    if (mime.startsWith("image/") || path.startsWith("BinData/")) {
      images.push(resource(content, path.split(".").pop()!))
    } else if (path.endsWith(".xml")) {
      xml(content, (node) => {
        for (const attribute of Object.values(node.attributes)) {
          if (
            attribute.local === "binaryItemIDRef" &&
            attribute.value &&
            attribute.value !== "0" &&
            !items.has(attribute.value)
          )
            throw new Error("unsupported")
        }
      })
    }
  }
  return images
}
