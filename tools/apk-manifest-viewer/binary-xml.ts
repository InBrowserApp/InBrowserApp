// Android's ResXMLTree and ResStringPool layouts in AOSP ResourceTypes.h.
const noString = 0xffffffff
const xmlns = "http://www.w3.org/2000/xmlns/"
const utf8 = new TextDecoder("utf-8", { fatal: true })
const utf16 = new TextDecoder("utf-16le", { fatal: true })

type Chunk = { type: number; start: number; data: number; end: number }

function invalid(): never {
  throw new Error("Invalid Android binary XML")
}

function chunk(view: DataView, start: number, limit: number): Chunk {
  if (start + 8 > limit) return invalid()
  const type = view.getUint16(start, true)
  const headerSize = view.getUint16(start + 2, true)
  const size = view.getUint32(start + 4, true)
  if (headerSize < 8 || size < headerSize || start + size > limit)
    return invalid()
  return { type, start, data: start + headerSize, end: start + size }
}

function stringPool(view: DataView, bytes: Uint8Array, pool: Chunk) {
  const { start, data, end } = pool
  if (data < start + 28) return invalid()
  const count = view.getUint32(start + 8, true)
  const isUtf8 = Boolean(view.getUint32(start + 16, true) & 0x100)
  const strings = start + view.getUint32(start + 20, true)
  const styleOffset = view.getUint32(start + 24, true)
  const limit = styleOffset ? start + styleOffset : end
  if (data + count * 4 > strings || strings > limit || limit > end)
    return invalid()
  const cache = new Map<number, string>()
  return (index: number) => {
    if (index >= count) return invalid()
    const saved = cache.get(index)
    if (saved !== undefined) return saved
    let at = strings + view.getUint32(data + index * 4, true)
    function length() {
      const unit = isUtf8 ? 1 : 2
      if (at + unit > limit) return invalid()
      const first = isUtf8 ? view.getUint8(at) : view.getUint16(at, true)
      at += unit
      const high = isUtf8 ? 0x80 : 0x8000
      if ((first & high) === 0) return first
      if (at + unit > limit) return invalid()
      const next = isUtf8 ? view.getUint8(at) : view.getUint16(at, true)
      at += unit
      return (first & (high - 1)) * (isUtf8 ? 0x100 : 0x10000) + next
    }
    let size = length()
    if (isUtf8) size = length()
    else size *= 2
    if (at + size + (isUtf8 ? 1 : 2) > limit) return invalid()
    const decoded = (isUtf8 ? utf8 : utf16).decode(
      bytes.subarray(at, at + size)
    )
    cache.set(index, decoded)
    return decoded
  }
}

function typedValue(
  view: DataView,
  offset: number,
  lookup: (index: number) => string
) {
  const type = view.getUint8(offset + 3)
  const value = view.getUint32(offset + 4, true)
  const hex = value.toString(16).padStart(8, "0")
  switch (type) {
    case 0x00:
      return value ? "@empty" : "@null"
    case 0x01:
    case 0x07:
      return `@0x${hex}`
    case 0x02:
    case 0x08:
      return `?0x${hex}`
    case 0x03:
      return lookup(value)
    case 0x04:
      return String(view.getFloat32(offset + 4, true))
    case 0x05:
    case 0x06: {
      const scale = [1, 128, 32768, 8388608][(value >>> 4) & 3]!
      const amount = (value >> 8) / scale
      const unit = value & 15
      return type === 0x05
        ? `${amount}${["px", "dp", "sp", "pt", "in", "mm"][unit] ?? ""}`
        : `${amount * 100}${unit === 1 ? "%p" : "%"}`
    }
    case 0x10:
      return String(value | 0)
    case 0x12:
      return value ? "true" : "false"
    default:
      return type >= 0x1c && type <= 0x1f ? `#${hex}` : `0x${hex}`
  }
}

export function decodeBinaryXml(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const root = chunk(view, 0, bytes.length)
  if (root.type !== 0x03) return invalid()
  const document = globalThis.document.implementation.createDocument(null, null)
  const stack: Element[] = []
  const namespaces: { prefix: string; uri: string }[] = []
  let declarations: typeof namespaces = []
  let lookup: (index: number) => string = invalid
  function ref(offset: number) {
    const index = view.getUint32(offset, true)
    return index === noString ? null : lookup(index)
  }
  function namespaceIndex(uri: string | null, prefix?: string) {
    for (let index = namespaces.length - 1; index >= 0; index--) {
      const pair = namespaces[index]!
      if (
        pair.uri === uri &&
        (prefix === undefined || pair.prefix === prefix)
      ) {
        return index
      }
    }
    return -1
  }
  function name(uri: string | null, local: string | null) {
    if (!local) return invalid()
    const prefix = namespaces[namespaceIndex(uri)]?.prefix
    return prefix ? `${prefix}:${local}` : local
  }

  for (let start = root.data; start < root.end;) {
    const node = chunk(view, start, root.end)
    const at = node.data
    start = node.end
    if (node.type === 0x01) {
      lookup = stringPool(view, bytes, node)
      continue
    }
    if (node.type === 0x0100 || node.type === 0x0101) {
      if (at + 8 > node.end) return invalid()
      const pair = { prefix: ref(at) ?? "", uri: ref(at + 4) ?? "" }
      if (node.type === 0x0100) {
        namespaces.push(pair)
        declarations.push(pair)
      } else {
        const index = namespaceIndex(pair.uri, pair.prefix)
        if (index >= 0) namespaces.splice(index, 1)
      }
      continue
    }
    if (node.type === 0x0102) {
      if (at + 20 > node.end) return invalid()
      const ns = ref(at)
      const element = document.createElementNS(ns, name(ns, ref(at + 4)))
      for (const { prefix, uri } of declarations) {
        element.setAttributeNS(xmlns, prefix ? `xmlns:${prefix}` : "xmlns", uri)
      }
      declarations = []
      const attrOffset = view.getUint16(at + 8, true)
      const attrSize = view.getUint16(at + 10, true)
      const count = view.getUint16(at + 12, true)
      if (
        attrOffset < 20 ||
        attrSize < 20 ||
        at + attrOffset + count * attrSize > node.end
      )
        return invalid()
      for (let i = 0; i < count; i++) {
        const offset = at + attrOffset + i * attrSize
        const attributeNs = ref(offset)
        const attributeName = name(attributeNs, ref(offset + 4))
        const value = ref(offset + 8) ?? typedValue(view, offset + 12, lookup)
        element.setAttributeNS(attributeNs, attributeName, value)
      }
      const parent = stack.at(-1) ?? document
      parent.append(element)
      stack.push(element)
    } else if (node.type === 0x0103) {
      if (at + 8 > node.end) return invalid()
      const element = stack.pop()
      if (
        element?.localName !== ref(at + 4) ||
        element.namespaceURI !== ref(at)
      )
        return invalid()
    } else if (node.type === 0x0104) {
      if (at + 12 > node.end) return invalid()
      const parent = stack.at(-1)
      if (!parent) return invalid()
      parent.append(document.createTextNode(ref(at) ?? ""))
    }
  }
  if (stack.length || !document.documentElement) return invalid()
  return document
}
