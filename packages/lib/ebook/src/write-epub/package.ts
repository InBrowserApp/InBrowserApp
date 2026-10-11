import type { BookSnapshot } from "../types"
import { DC, OPF, element, serialize, xmlText } from "./xml"

export type PublicationItem = {
  id: string
  href: string
  media: string
  properties?: string
  linear?: boolean
}
export function packageDocument(
  book: BookSnapshot,
  language: string,
  items: PublicationItem[]
) {
  const doc = document.implementation.createDocument(OPF, "package")
  doc.documentElement.setAttribute("version", "3.0")
  doc.documentElement.setAttribute("unique-identifier", "book-id")
  const metadata = element(doc, "metadata")
  const identifier = doc.createElementNS(DC, "dc:identifier")
  identifier.id = "book-id"
  identifier.textContent = `urn:uuid:${crypto.randomUUID()}`
  metadata.append(identifier)
  for (const [name, value] of [
    ["title", book.title],
    ["creator", book.author],
    ["language", language],
    ["description", book.description],
  ]) {
    if (!value) continue
    const node = doc.createElementNS(DC, `dc:${name}`)
    node.textContent = xmlText(value)
    metadata.append(node)
  }
  metadata.append(
    element(
      doc,
      "meta",
      { property: "dcterms:modified" },
      new Date().toISOString().replace(/\.\d{3}Z$/, "Z")
    )
  )
  const manifest = element(doc, "manifest")
  const spine = element(doc, "spine")
  for (const item of items) {
    manifest.append(
      element(doc, "item", {
        id: item.id,
        href: item.href,
        "media-type": item.media,
        ...(item.properties ? { properties: item.properties } : {}),
      })
    )
    if (item.linear !== undefined)
      spine.append(
        element(doc, "itemref", {
          idref: item.id,
          ...(item.linear ? {} : { linear: "no" }),
        })
      )
  }
  doc.documentElement.append(metadata, manifest, spine)
  return serialize(doc)
}
