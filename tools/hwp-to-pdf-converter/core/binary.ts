import * as CFB from "cfb"
import { inflateSync } from "fflate"
import { resource } from "./resources"
import type { Resource } from "./resources"

function records(bytes: Uint8Array) {
  const data = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const items: { tag: number; bytes: Uint8Array }[] = []
  let offset = 0
  while (offset < bytes.length) {
    if (offset + 4 > bytes.length) throw new Error("invalid")
    const header = data.getUint32(offset, true)
    offset += 4
    let size = header >>> 20
    if (size === 0xfff) {
      if (offset + 4 > bytes.length) throw new Error("invalid")
      size = data.getUint32(offset, true)
      offset += 4
    }
    if (offset + size > bytes.length) throw new Error("invalid")
    items.push({
      tag: header & 0x3ff,
      bytes: bytes.subarray(offset, offset + size),
    })
    offset += size
  }
  return items
}

export function binaryResources(bytes: Uint8Array): Resource[] {
  const container = CFB.read(bytes, { type: "array" })
  const read = (path: string, compressed = false) => {
    const entry = CFB.find(container, `/${path}`)
    if (!entry?.content?.length) throw new Error("invalid")
    const value = new Uint8Array(entry.content)
    return compressed ? inflateSync(value) : value
  }
  const header = read("FileHeader")
  const compressed = Boolean(header[36]! & 1)
  const info = records(read("DocInfo", compressed))
  const properties = info.find((item) => item.tag === 16)?.bytes
  if (!properties || properties.length < 2) throw new Error("invalid")
  const count = properties[0]! | (properties[1]! << 8)
  if (!count) throw new Error("invalid")
  const entries = info.filter((value) => value.tag === 18)
  for (let index = 0; index < count; index++) {
    const body = records(read(`BodyText/Section${index}`, compressed))
    if (!body.length) throw new Error("invalid")
    for (const item of body) {
      // HWP 5 SHAPE_COMPONENT_PICTURE stores its one-based BinData
      // reference at byte 71. Zero is an intentionally unassigned picture.
      if (item.tag !== 85) continue
      if (item.bytes.length < 73) throw new Error("unsupported")
      const id = item.bytes[71]! | (item.bytes[72]! << 8)
      if (id > entries.length) throw new Error("unsupported")
    }
  }
  const images: Resource[] = []
  for (const item of entries) {
    const value = item.bytes
    if (value.length < 6) throw new Error("unsupported")
    const view = new DataView(value.buffer, value.byteOffset, value.byteLength)
    const attributes = view.getUint16(0, true)
    // HWP 5 BinData: linked resources and embedded OLE are outside this
    // converter's scope. Never let the renderer silently omit them.
    if ((attributes & 15) !== 1) throw new Error("unsupported")
    const id = view.getUint16(2, true).toString(16).padStart(4, "0")
    const size = view.getUint16(4, true) * 2
    if (!size || 6 + size > value.length) throw new Error("unsupported")
    const extension = new TextDecoder("utf-16le", { fatal: true }).decode(
      value.subarray(6, 6 + size)
    )
    const mode = (attributes >> 4) & 3
    const image = read(
      `BinData/BIN${id}.${extension}`,
      mode === 1 || (mode === 0 && compressed)
    )
    images.push(resource(image, extension))
  }
  return images
}
