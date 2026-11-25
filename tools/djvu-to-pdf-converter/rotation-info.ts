export type Rotation = 0 | 90 | 180 | 270

function tag(code: string) {
  return Array.from(code).reduce(
    (value, byte) => value * 256 + byte.charCodeAt(0),
    0
  )
}

const FORM = tag("FORM")
const DJVU = tag("DJVU")
const DJVM = tag("DJVM")
const INFO = tag("INFO")
const BM44 = tag("BM44")
const PM44 = tag("PM44")

// djvu-rs returns rotated pixels and boxes, but its WASM API omits the angle.
// Read only the INFO flags, in the FORM order used by its bundled decoder.
export function pageRotations(bytes: Uint8Array): Rotation[] {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)

  function* chunks(start: number, end: number) {
    for (let offset = start; offset + 8 <= end;) {
      const type = view.getUint32(offset)
      const length = view.getUint32(offset + 4)
      const data = offset + 8
      if (data + length > end) return
      yield { type, data, length }
      offset = data + length + (length % 2)
    }
  }

  function rotation(data: number, length: number): Rotation {
    for (const chunk of chunks(data + 4, data + length)) {
      if (chunk.type !== INFO) continue
      const flags = chunk.length >= 10 ? view.getUint8(chunk.data + 9) & 7 : 0
      switch (flags) {
        case 5:
          return 90
        case 2:
          return 180
        case 6:
          return 270
        default:
          return 0
      }
    }
    return 0
  }

  const [root] = chunks(4, view.byteLength)
  if (root?.type !== FORM || root.length < 4) return []
  const type = view.getUint32(root.data)
  if (type === DJVU) return [rotation(root.data, root.length)]
  if (type !== DJVM) return []
  const rotations: Rotation[] = []
  for (const chunk of chunks(root.data + 4, root.data + root.length)) {
    if (chunk.type !== FORM || chunk.length < 4) continue
    const form = view.getUint32(chunk.data)
    if (form === DJVU) rotations.push(rotation(chunk.data, chunk.length))
    else if (form === BM44 || form === PM44) rotations.push(0)
  }
  return rotations
}
