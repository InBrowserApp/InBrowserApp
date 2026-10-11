import { rasterImage } from "./images"
import { ConversionError } from "./errors"

type Record = {
  type: number
  instance: number
  container: boolean
  bytes: Uint8Array
  end: number
}
function invalid(): never {
  throw new ConversionError("invalid")
}
function uint(bytes: Uint8Array, offset: number) {
  if (offset + 4 > bytes.length) invalid()
  return new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getUint32(
    0,
    true
  )
}
function record(bytes: Uint8Array, offset: number): Record {
  const header = uint(bytes, offset)
  const end = offset + 8 + uint(bytes, offset + 4)
  if (end > bytes.length) invalid()
  return {
    type: header >>> 16,
    instance: (header & 0xffff) >>> 4,
    container: (header & 15) === 15,
    bytes: bytes.subarray(offset + 8, end),
    end,
  }
}
function children(bytes: Uint8Array) {
  const result: Record[] = []
  for (let offset = 0; offset < bytes.length; ) {
    const next = record(bytes, offset)
    result.push(next)
    offset = next.end
  }
  return result
}
function descend(records: Record[]) {
  const result: Record[] = []
  const pending = [...records]
  while (pending.length) {
    const next = pending.pop()!
    result.push(next)
    if (next.container) pending.push(...children(next.bytes))
  }
  return result
}

// Follow the current persist directory, not deleted slides from earlier saves.
// MS-PPT 2.3.3–2.3.5, 2.4.14; MS-ODRAW 2.2.32 and 2.3.23.5.
export function inspect(
  document: Uint8Array,
  current: Uint8Array,
  pictures: Uint8Array
) {
  const offsets = new Map<number, number>()
  const seen = new Set<number>()
  let editOffset = uint(current, 16)
  let documentId: number | undefined
  while (true) {
    if (seen.has(editOffset)) invalid()
    seen.add(editOffset)
    const edit = record(document, editOffset)
    if (edit.type !== 4085) invalid()
    documentId ??= uint(edit.bytes, 16)
    const directory = record(document, uint(edit.bytes, 12))
    if (directory.type !== 6002) throw new ConversionError("unsupported")
    for (let offset = 0; offset < directory.bytes.length; ) {
      const header = uint(directory.bytes, offset)
      const start = header & 0xfffff
      const count = header >>> 20
      offset += 4
      for (let index = 0; index < count; index++, offset += 4) {
        const location = uint(directory.bytes, offset)
        if (!offsets.has(start + index)) offsets.set(start + index, location)
      }
    }
    editOffset = uint(edit.bytes, 8)
    if (!editOffset) break
  }
  const persisted = (id: number) => {
    const offset = offsets.get(id)
    if (offset === undefined) invalid()
    return record(document, offset)
  }
  const root = persisted(documentId)
  if (root.type !== 1000 || !root.container) invalid()
  const live = [root]
  let pages = 0
  for (const list of children(root.bytes)) {
    if (list.type !== 4080 || list.instance > 1) continue
    for (const entry of children(list.bytes)) {
      if (entry.type !== 1011) continue
      live.push(persisted(uint(entry.bytes, 0)))
      if (list.instance === 0) pages++
    }
  }
  if (!pages) invalid()
  const records = descend(live)
  const store = records.find((entry) => entry.type === 0xf001)
  const blips = store ? children(store.bytes) : []
  const required = new Set<number>()
  for (const entry of records) {
    if (![0xf00b, 0xf121, 0xf122].includes(entry.type)) continue
    for (let index = 0; index < entry.instance; index++) {
      const offset = index * 6
      const property = uint(entry.bytes, offset) & 0xffff
      const value = uint(entry.bytes, offset + 2)
      if ((property & 0xc000) === 0x4000 && value) required.add(value)
    }
  }
  const images: Blob[] = []
  for (const index of required) {
    const entry = blips[index - 1]
    if (!entry || entry.type !== 0xf007 || entry.bytes.length < 36)
      throw new ConversionError("unsupported")
    const embedded = 36 + entry.bytes[33]!
    const size = uint(entry.bytes, 20)
    const image =
      embedded < entry.bytes.length
        ? record(entry.bytes, embedded)
        : record(pictures, uint(entry.bytes, 28))
    if (
      ![
        0xf01a, 0xf01b, 0xf01c, 0xf01d, 0xf01e, 0xf01f, 0xf029, 0xf02a,
      ].includes(image.type) ||
      image.bytes.length < 17 ||
      size !== image.bytes.length + 8
    )
      throw new ConversionError("unsupported")
    const raster = rasterImage(image.type, image.bytes)
    if (raster) images.push(raster)
  }
  return { pages, images }
}
