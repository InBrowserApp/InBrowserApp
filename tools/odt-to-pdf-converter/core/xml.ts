import { SaxesParser } from "saxes"
import type { SaxesTagNS } from "saxes"
import { ConversionError } from "./errors"

export const ns = {
  office: "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
  manifest: "urn:oasis:names:tc:opendocument:xmlns:manifest:1.0",
  draw: "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0",
  text: "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
  style: "urn:oasis:names:tc:opendocument:xmlns:style:1.0",
  xlink: "http://www.w3.org/1999/xlink",
  svg: "http://www.w3.org/2000/svg",
}

export const attribute = (tag: SaxesTagNS, uri: string, local: string) =>
  Object.values(tag.attributes).find(
    (item) => item.uri === uri && item.local === local
  )?.value

export function readXml(
  bytes: Uint8Array,
  open: (tag: SaxesTagNS) => void,
  close?: (tag: SaxesTagNS) => void,
  text?: (value: string) => void
) {
  const encoding =
    bytes[0] === 0xff && bytes[1] === 0xfe
      ? "utf-16le"
      : bytes[0] === 0xfe && bytes[1] === 0xff
        ? "utf-16be"
        : "utf-8"
  const parser = new SaxesParser({ xmlns: true })
  parser.on("doctype", () => {
    throw new ConversionError("unsupported")
  })
  parser.on("opentag", open)
  if (close) parser.on("closetag", close)
  if (text) {
    parser.on("text", text)
    parser.on("cdata", text)
  }
  parser.write(new TextDecoder(encoding, { fatal: true }).decode(bytes)).close()
}

export function packagePath(reference: string, base = "content.xml") {
  // Resolve package IRIs without allowing a reference to leave the archive.
  if (!reference || /[\\:#?]|^\//.test(reference))
    throw new ConversionError("unsupported")
  const segments = base.split("/").slice(0, -1)
  for (const encoded of reference.split("/")) {
    const part = decodeURIComponent(encoded)
    // oxlint-disable-next-line no-control-regex -- Reject control bytes in paths.
    if (/[\\/:?#\u0000-\u001f]/.test(part))
      throw new ConversionError("unsupported")
    if (!part || part === ".") continue
    if (part === "..") {
      if (!segments.length) throw new ConversionError("unsupported")
      segments.pop()
    } else segments.push(part)
  }
  if (!segments.length) throw new ConversionError("unsupported")
  return segments.join("/")
}
