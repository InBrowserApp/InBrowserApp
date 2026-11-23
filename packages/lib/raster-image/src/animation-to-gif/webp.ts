import { readChunkType } from "../png-chunks"
import type { Animation, Frame } from "./types"

function uint24(view: DataView, offset: number) {
  return view.getUint16(offset, true) + view.getUint8(offset + 2) * 65536
}

function write24(bytes: Uint8Array, offset: number, value: number) {
  bytes.set([value & 255, (value >>> 8) & 255, value >>> 16], offset)
}

function webpFrame(
  chunks: Uint8Array<ArrayBuffer>,
  width: number,
  height: number,
  profile: Uint8Array<ArrayBuffer> | undefined
) {
  const view = new DataView(chunks.buffer, chunks.byteOffset, chunks.length)
  const first = readChunkType(view, 0)
  // Lossy alpha and ICC profiles need an extended still container.
  const extended = first === "ALPH" || Boolean(profile)
  const header = new Uint8Array(extended ? 30 : 12)
  header.set([82, 73, 70, 70], 0) // RIFF
  header.set([87, 69, 66, 80], 8) // WEBP
  const headerView = new DataView(header.buffer)
  headerView.setUint32(
    4,
    header.length - 8 + (profile?.length ?? 0) + chunks.length,
    true
  )
  if (extended) {
    header.set([86, 80, 56, 88], 12) // VP8X
    headerView.setUint32(16, 10, true)
    const alpha =
      first === "ALPH" || (first === "VP8L" && Boolean(chunks[12]! & 16))
    header[20] = (profile ? 32 : 0) | (alpha ? 16 : 0)
    write24(header, 24, width - 1)
    write24(header, 27, height - 1)
  }
  return new Blob(profile ? [header, profile, chunks] : [header, chunks], {
    type: "image/webp",
  })
}

export function readAnimatedWebp(buffer: ArrayBuffer): Animation {
  const bytes = new Uint8Array(buffer)
  const view = new DataView(buffer)
  if (
    bytes.length < 30 ||
    readChunkType(view, 0) !== "RIFF" ||
    readChunkType(view, 8) !== "WEBP"
  ) {
    throw new Error("invalid")
  }
  const end = view.getUint32(4, true) + 8
  if (
    end > bytes.length ||
    end < 30 ||
    readChunkType(view, 12) !== "VP8X" ||
    view.getUint32(16, true) !== 10 ||
    !(bytes[20]! & 2)
  ) {
    throw new Error("invalid")
  }

  const width = uint24(view, 24) + 1
  const height = uint24(view, 27) + 1
  const frames: Frame[] = []
  let plays: number | undefined
  let profile: Uint8Array<ArrayBuffer> | undefined
  let offset = 30

  while (offset + 8 <= end) {
    const type = readChunkType(view, offset)
    const size = view.getUint32(offset + 4, true)
    const start = offset + 8
    const next = start + size + (size % 2)
    if (next > end) throw new Error("invalid")
    if (type === "ICCP") profile = bytes.subarray(offset, next)
    if (type === "ANIM") {
      if (size !== 6 || plays !== undefined) throw new Error("invalid")
      plays = view.getUint16(start + 4, true)
    }
    if (type === "ANMF") {
      if (size < 24 || plays === undefined) throw new Error("invalid")
      const x = uint24(view, start) * 2
      const y = uint24(view, start + 3) * 2
      const frameWidth = uint24(view, start + 6) + 1
      const frameHeight = uint24(view, start + 9) + 1
      const flags = view.getUint8(start + 15)
      if (x + frameWidth > width || y + frameHeight > height || flags > 3) {
        throw new Error("invalid")
      }
      const frameBytes = bytes.subarray(start + 16, start + size)
      frames.push({
        x,
        y,
        width: frameWidth,
        height: frameHeight,
        delay: uint24(view, start + 12),
        blend: !(flags & 2),
        dispose: flags & 1 ? "background" : "keep",
        image: () => webpFrame(frameBytes, frameWidth, frameHeight, profile),
      })
    }
    offset = next
  }

  if (!frames.length || plays === undefined || offset !== end) {
    throw new Error("invalid")
  }
  return { width, height, plays, frames }
}
