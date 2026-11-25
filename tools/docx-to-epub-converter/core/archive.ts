import { assertOfficeArchive } from "@workspace/document-reader"
import { unzipSync } from "fflate"

const core = "docProps/core.xml"
const styles = "word/styles.xml"

function xml(bytes: Uint8Array | undefined) {
  if (!bytes?.length) return null
  const encoding =
    bytes[0] === 0xff || (bytes[0] === 0x3c && bytes[1] === 0)
      ? "utf-16le"
      : bytes[0] === 0xfe || (bytes[0] === 0 && bytes[1] === 0x3c)
        ? "utf-16be"
        : "utf-8"
  const text = new TextDecoder(encoding).decode(bytes)
  if (/<!DOCTYPE|<!ENTITY/i.test(text)) return null
  const doc = new DOMParser().parseFromString(text, "application/xml")
  return doc.querySelector("parsererror") ? null : doc
}

export function readArchive(data: ArrayBuffer) {
  const bytes = new Uint8Array(data)
  if (
    [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1].every(
      (byte, index) => bytes[index] === byte
    )
  )
    throw new Error("protected")
  assertOfficeArchive(data, "docx")
  const entries = new Set<string>()
  const properties = unzipSync(bytes, {
    filter: ({ name }) => {
      entries.add(name)
      return name === core || name === styles
    },
  })
  const metadata = xml(properties[core])
  const value = (name: string) =>
    metadata
      ?.getElementsByTagNameNS("http://purl.org/dc/elements/1.1/", name)[0]
      ?.textContent?.trim() || ""
  const defaults = xml(properties[styles])
    ?.getElementsByTagNameNS("*", "docDefaults")[0]
    ?.getElementsByTagNameNS("*", "lang")[0]
  return {
    entries,
    title: value("title"),
    author: value("creator"),
    description: value("description"),
    language:
      value("language") ||
      defaults?.getAttributeNS(defaults.namespaceURI, "val") ||
      undefined,
  }
}
