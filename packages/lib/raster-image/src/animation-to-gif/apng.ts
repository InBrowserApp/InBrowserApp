import { crc32, readChunkType } from "../png-chunks"
import type { Animation, Frame } from "./types"

const signature = Uint8Array.of(137, 80, 78, 71, 13, 10, 26, 10)
const sharedChunks = new Set([
  "PLTE",
  "tRNS",
  "cHRM",
  "gAMA",
  "iCCP",
  "sBIT",
  "sRGB",
  "cICP",
])

function chunk(type: string, bytes: Uint8Array) {
  const result = new Uint8Array(bytes.length + 12)
  const view = new DataView(result.buffer)
  view.setUint32(0, bytes.length)
  for (let index = 0; index < 4; index++) {
    result[index + 4] = type.charCodeAt(index)
  }
  result.set(bytes, 8)
  view.setUint32(bytes.length + 8, crc32(result.subarray(4, -4)))
  return result
}

function frameControl(data: DataView) {
  const width = data.getUint32(4)
  const height = data.getUint32(8)
  const x = data.getUint32(12)
  const y = data.getUint32(16)
  const delay = (data.getUint16(20) * 1000) / (data.getUint16(22) || 100)
  const dispose = (["keep", "background", "previous"] as const)[
    data.getUint8(24)
  ]
  const blend = data.getUint8(25)
  if (!width || !height || !dispose || blend > 1) throw new Error("invalid")
  return { width, height, x, y, delay, dispose, blend: blend === 1 }
}

export function readApng(buffer: ArrayBuffer): Animation {
  const bytes = new Uint8Array(buffer)
  const view = new DataView(buffer)
  if (!signature.every((byte, index) => bytes[index] === byte)) {
    throw new Error("invalid")
  }
  if (
    bytes.length < 33 ||
    view.getUint32(8) !== 13 ||
    readChunkType(view, 12) !== "IHDR"
  ) {
    throw new Error("invalid")
  }

  const header = bytes.subarray(16, 29)
  const width = view.getUint32(16)
  const height = view.getUint32(20)
  if (!width || !height) throw new Error("invalid")
  const globals: Uint8Array<ArrayBuffer>[] = []
  const frames: Frame[] = []
  let frame: ReturnType<typeof frameControl> | undefined
  let frameData: Uint8Array<ArrayBuffer>[] = []
  let frameCount = 0
  let plays = 0
  let sequence = 0
  let sawImageData = false

  function finishFrame() {
    if (!frame) return
    if (!frameData.length) throw new Error("invalid")

    const frameHeader = header.slice()
    const headerView = new DataView(frameHeader.buffer)
    headerView.setUint32(0, frame.width)
    headerView.setUint32(4, frame.height)
    const data = frameData
    frames.push({
      ...frame,
      image: () =>
        new Blob(
          [
            signature,
            chunk("IHDR", frameHeader),
            ...globals,
            ...data.map((part) => chunk("IDAT", part)),
            chunk("IEND", new Uint8Array()),
          ],
          { type: "image/png" }
        ),
    })
    frameData = []
  }

  let offset = 8
  while (offset + 12 <= bytes.length) {
    const size = view.getUint32(offset)
    const end = offset + 12 + size
    if (end > bytes.length) throw new Error("invalid")

    const type = readChunkType(view, offset + 4)
    const start = offset + 8
    const data = new DataView(buffer, start, size)
    const chunkBytes = bytes.subarray(offset, end)
    if (
      (["IHDR", "acTL", "fcTL", "IDAT", "fdAT", "IEND"].includes(type) ||
        sharedChunks.has(type)) &&
      crc32(chunkBytes.subarray(4, -4)) !== view.getUint32(end - 4)
    ) {
      throw new Error("invalid")
    }

    switch (type) {
      case "acTL":
        if (size !== 8 || frameCount || sawImageData) throw new Error("invalid")
        frameCount = data.getUint32(0)
        plays = data.getUint32(4)
        if (!frameCount) throw new Error("invalid")
        break
      case "fcTL":
        if (size !== 26 || !frameCount || data.getUint32(0) !== sequence++) {
          throw new Error("invalid")
        }
        finishFrame()
        frame = frameControl(data)
        if (
          frame.x + frame.width > width ||
          frame.y + frame.height > height ||
          (!sawImageData && (frame.width !== width || frame.height !== height))
        ) {
          throw new Error("invalid")
        }
        break
      case "IDAT":
        // When fcTL follows IDAT, the default PNG is a separate poster.
        if (frame) {
          if (frames.length || sequence !== 1) throw new Error("invalid")
          frameData.push(bytes.subarray(start, end - 4))
        }
        sawImageData = true
        break
      case "fdAT":
        if (
          size < 4 ||
          !sawImageData ||
          !frame ||
          data.getUint32(0) !== sequence++
        ) {
          throw new Error("invalid")
        }
        frameData.push(bytes.subarray(start + 4, end - 4))
        break
      case "IEND":
        if (size !== 0) throw new Error("invalid")
        finishFrame()
        if (!frameCount || frames.length !== frameCount || !sawImageData) {
          throw new Error("invalid")
        }
        return { width, height, plays, frames }
      default:
        if (!sawImageData && sharedChunks.has(type)) globals.push(chunkBytes)
    }
    offset = end
  }
  throw new Error("invalid")
}
