import { unzipSync } from "fflate"
import { officeLoadOptions } from "@workspace/document-reader"
import { extension, isDelimited } from "../formats"

export function assertSpreadsheet(data: ArrayBuffer, name: string) {
  const bytes = new Uint8Array(data)
  if (!bytes.length) throw new Error("INVALID")
  const ext = extension(name)
  if (isDelimited(name) || ext === "prn") return
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
    const entries = new Set<string>()
    let expanded = 0
    const limits = officeLoadOptions.resourceLimits
    unzipSync(bytes, {
      filter(entry) {
        entries.add(entry.name)
        expanded += entry.originalSize
        if (
          entries.size > limits.maxArchiveEntries ||
          entry.originalSize > limits.maxArchiveEntryBytes ||
          expanded > limits.maxTotalInflatedBytes
        )
          throw new Error("TOO_LARGE")
        return false
      },
    })
    if (
      entries.has("xl/workbook.bin") ||
      entries.has("xl/workbook.xml") ||
      entries.has("content.xml") ||
      entries.has("uof.xml") ||
      entries.has("Index/Document.iwa")
    )
      return
    throw new Error("INVALID")
  }
  const cfb = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1].every(
    (v, i) => bytes[i] === v
  )
  if (cfb || (bytes[0] === 0x09 && bytes[1]! <= 8)) return
  if (
    (bytes[0] === 0 && bytes[1] === 0) ||
    (bytes[0] === 0xff && bytes[1] === 0 && bytes[2] === 2 && bytes[3] === 0)
  )
    return
  if (
    ext === "dbf" &&
    [
      2, 3, 4, 5, 0x30, 0x31, 0x32, 0x43, 0x63, 0x83, 0x8b, 0x8c, 0xcb, 0xf5,
    ].includes(bytes[0]!)
  )
    return
  const prefix = new TextDecoder().decode(bytes.subarray(0, 4096)).trimStart()
  if (
    (ext === "dif" && /^TABLE\r?\n/.test(prefix)) ||
    (ext === "slk" && prefix.startsWith("ID;")) ||
    (ext === "eth" && prefix.startsWith("socialcalc:version:"))
  )
    return
  if (
    (ext === "fods" || ext === "uos") &&
    prefix.startsWith("<") &&
    /(?:office:document|uof:UOF|uof\.org|oasis:names:tc:opendocument)/.test(
      prefix
    )
  )
    return
  throw new Error("INVALID")
}
