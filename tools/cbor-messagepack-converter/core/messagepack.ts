import { decode, ExtData, ExtensionCodec } from "@msgpack/msgpack"

const utf8 = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true })

// The library's permissive text decoder can replace invalid UTF-8 and strip a
// leading BOM. Record string/bin values in wire order, then use rawStrings to
// keep their distinction and original text while the library decodes values.
function readRawValues(bytes: Uint8Array): (string | null)[] {
  const values: (string | null)[] = []
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let position = 0
  function take(length: number) {
    const start = position
    if (length > bytes.length - position)
      throw new Error("Truncated MessagePack input.")
    position += length
    return start
  }
  function size(width: number) {
    const start = take(width)
    if (width === 1) return view.getUint8(start)
    if (width === 2) return view.getUint16(start)
    return view.getUint32(start)
  }
  function text(length: number, key: boolean) {
    const start = take(length)
    const value = utf8.decode(bytes.subarray(start, start + length))
    if (!key) values.push(value)
  }
  function children(count: number, map: boolean, depth: number) {
    for (let index = 0; index < count; index++) {
      if (map) visit(true, depth + 1)
      visit(false, depth + 1)
    }
  }
  function visit(key: boolean, depth: number) {
    if (depth > 100) throw new Error("Nesting exceeds 100 levels.")
    const head = bytes[take(1)]!
    if (head <= 0x7f || head >= 0xe0) return
    if (head >= 0xa0 && head <= 0xbf) {
      text(head & 0x1f, key)
      return
    }
    if (head >= 0x90 && head <= 0x9f) {
      children(head & 0x0f, false, depth)
      return
    }
    if (head >= 0x80 && head <= 0x8f) {
      children(head & 0x0f, true, depth)
      return
    }
    switch (head) {
      case 0xc0:
      case 0xc2:
      case 0xc3:
        return
      case 0xc1:
        throw new Error("Unrecognized MessagePack type byte: 0xc1.")
      case 0xc4:
      case 0xc5:
      case 0xc6:
        take(size(1 << (head - 0xc4)))
        values.push(null)
        return
      case 0xc7:
      case 0xc8:
      case 0xc9:
        take(size(1 << (head - 0xc7)) + 1)
        return
      case 0xca:
      case 0xcb:
        take(head === 0xca ? 4 : 8)
        return
      case 0xcc:
      case 0xcd:
      case 0xce:
      case 0xcf:
      case 0xd0:
      case 0xd1:
      case 0xd2:
      case 0xd3:
        take(1 << ((head - 0xcc) & 3))
        return
      case 0xd4:
      case 0xd5:
      case 0xd6:
      case 0xd7:
      case 0xd8:
        take((1 << (head - 0xd4)) + 1)
        return
      case 0xd9:
      case 0xda:
      case 0xdb:
        text(size(1 << (head - 0xd9)), key)
        return
      case 0xdc:
      case 0xdd:
        children(size(head === 0xdc ? 2 : 4), false, depth)
        return
      case 0xde:
      case 0xdf:
        children(size(head === 0xde ? 2 : 4), true, depth)
    }
  }
  visit(false, 0)
  if (position !== bytes.length) throw new Error("Trailing MessagePack data.")
  return values
}

export function decodeMessagePack(bytes: Uint8Array): unknown {
  const rawValues = readRawValues(bytes)
  const keys: string[] = []
  const value = decode(bytes, {
    useBigInt64: true,
    rawStrings: true,
    // Alias every text key before the decoder's __proto__ check and object
    // assignment. This preserves prototype-named keys and detects duplicates.
    keyDecoder: {
      canBeCached: () => true,
      decode: (data, start, length) => {
        keys.push(utf8.decode(data.subarray(start, start + length)))
        return `key${keys.length - 1}`
      },
    },
    mapKeyConverter: (key) => {
      if (typeof key !== "string")
        throw new Error("MessagePack maps require string keys.")
      return key
    },
    extensionCodec: {
      tryToEncode: ExtensionCodec.defaultCodec.tryToEncode.bind(
        ExtensionCodec.defaultCodec
      ),
      decode: (data, type) => new ExtData(type, data),
    },
  })
  let rawIndex = 0
  function restore(item: unknown): unknown {
    if (item instanceof Uint8Array) {
      const raw = rawValues[rawIndex++]
      return raw === null ? item : raw
    }
    if (Array.isArray(item)) return item.map(restore)
    if (
      item !== null &&
      typeof item === "object" &&
      !(item instanceof ExtData)
    ) {
      const entries = Object.entries(item).map(
        ([key, child]) => [keys[Number(key.slice(3))]!, restore(child)] as const
      )
      if (new Set(entries.map(([key]) => key)).size !== entries.length)
        throw new Error("Duplicate map keys.")
      return Object.fromEntries(entries)
    }
    return item
  }
  return restore(value)
}
