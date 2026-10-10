import { assertOfficeArchive } from "@workspace/document-reader"
import { unzipSync } from "fflate"
import { ConversionError } from "./errors"

const relationshipNamespaces = new Set([
  "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
  "http://purl.oclc.org/ooxml/officeDocument/relationships",
])
const presentationNamespaces = new Set([
  "http://schemas.openxmlformats.org/presentationml/2006/main",
  "http://purl.oclc.org/ooxml/presentationml/main",
])

function path(name: string) {
  const parts: string[] = []
  for (const part of name.replace(/\\/g, "/").split("/")) {
    if (part === "..") {
      if (!parts.length) throw new ConversionError("invalid")
      parts.pop()
    } else if (part && part !== ".") parts.push(part)
  }
  return parts.join("/")
}

function xml(bytes: Uint8Array) {
  const encoding =
    bytes[0] === 0xff || (bytes[0] === 0x3c && bytes[1] === 0)
      ? "utf-16le"
      : bytes[0] === 0xfe || (bytes[0] === 0 && bytes[1] === 0x3c)
        ? "utf-16be"
        : "utf-8"
  const text = new TextDecoder(encoding, { fatal: true }).decode(bytes)
  if (/<!DOCTYPE|<!ENTITY/i.test(text)) throw new ConversionError("invalid")
  const document = new DOMParser().parseFromString(text, "application/xml")
  if (
    !document.documentElement ||
    document.getElementsByTagName("parsererror").length
  )
    throw new ConversionError("invalid")
  return document
}

// The renderer drops drawings whose relationship or part is missing. Check the
// package first so those documents cannot become successful, incomplete PDFs.
export function inspectArchive(data: ArrayBuffer) {
  const bytes = new Uint8Array(data)
  if (
    [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1].every(
      (byte, index) => bytes[index] === byte
    )
  )
    throw new ConversionError("protected")
  assertOfficeArchive(data, "pptx")
  const names = new Set<string>()
  const files = unzipSync(bytes, {
    filter(entry) {
      const name = path(entry.name)
      if (entry.name.replace(/\/$/, "") !== name || names.has(name))
        throw new ConversionError("invalid")
      names.add(name)
      return /\.(xml|rels)$/i.test(name)
    },
  })
  const documents = new Map(
    Object.entries(files).map(([name, value]) => [path(name), xml(value)])
  )
  const references = new Map<string, Set<string>>()
  for (const [name, document] of documents) {
    if (!name.endsWith(".rels")) continue
    const owner =
      name === "_rels/.rels"
        ? ""
        : name.replace(/(^|\/)_rels\//, "$1").replace(/\.rels$/, "")
    const ids = new Set<string>()
    references.set(owner, ids)
    for (const relation of Array.from(document.documentElement.children)) {
      const id = relation.getAttribute("Id")
      const target = relation.getAttribute("Target")
      const type = relation.getAttribute("Type")
      if (!id || !target || !type || ids.has(id))
        throw new ConversionError("invalid")
      ids.add(id)
      // Hyperlinks are intentionally not carried into the image PDF.
      if (type.endsWith("/hyperlink")) continue
      if (relation.getAttribute("TargetMode") === "External")
        throw new ConversionError("unsupported")
      const decoded = decodeURIComponent(target.split("#")[0]!)
      if (/^[a-z][a-z\d+.-]*:/i.test(decoded))
        throw new ConversionError("unsupported")
      const directory = owner.slice(0, owner.lastIndexOf("/") + 1)
      const resolved = path(
        decoded.startsWith("/") ? decoded : directory + decoded
      )
      if (!names.has(resolved)) throw new ConversionError("unsupported")
    }
  }
  for (const [name, document] of documents) {
    if (!name.startsWith("ppt/") || !name.endsWith(".xml")) continue
    const root = document.documentElement
    if (
      (name === "ppt/presentation.xml" &&
        (root.localName !== "presentation" ||
          !presentationNamespaces.has(root.namespaceURI ?? ""))) ||
      (/^ppt\/slides\/[^/]+\.xml$/.test(name) &&
        (root.localName !== "sld" ||
          !presentationNamespaces.has(root.namespaceURI ?? "")))
    )
      throw new ConversionError("invalid")
    for (const element of Array.from(document.getElementsByTagName("*"))) {
      const drawing =
        element.namespaceURI ===
          "http://schemas.openxmlformats.org/drawingml/2006/main" ||
        element.namespaceURI === "http://purl.oclc.org/ooxml/drawingml/main"
      if (
        drawing &&
        ["off", "chOff", "ext", "chExt", "xfrm"].includes(element.localName)
      ) {
        for (const name of ["x", "y", "cx", "cy", "rot"]) {
          const value = element.getAttribute(name)
          if (value !== null && !/^[+-]?\d+$/.test(value.trim()))
            throw new ConversionError("invalid")
        }
      }
      // A media clip without a poster would become a generic placeholder.
      if (drawing && ["videoFile", "audioFile"].includes(element.localName)) {
        let picture = element.parentElement
        while (picture && picture.localName !== "pic")
          picture = picture.parentElement
        if (
          !picture ||
          !Array.from(picture.getElementsByTagNameNS("*", "blip")).some(
            (image) =>
              Array.from(image.attributes).some(
                (attribute) =>
                  relationshipNamespaces.has(attribute.namespaceURI ?? "") &&
                  attribute.localName === "embed" &&
                  attribute.value
              )
          )
        )
          throw new ConversionError("unsupported")
      }
      if (presentationNamespaces.has(element.namespaceURI ?? "")) {
        if (["oleObj", "control", "contentPart"].includes(element.localName))
          throw new ConversionError("unsupported")
      }
      for (const attribute of Array.from(element.attributes)) {
        if (
          relationshipNamespaces.has(attribute.namespaceURI ?? "") &&
          ["id", "embed", "link"].includes(attribute.localName) &&
          attribute.value &&
          !references.get(name)?.has(attribute.value)
        )
          throw new ConversionError("unsupported")
      }
    }
  }
}
