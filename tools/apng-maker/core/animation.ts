import { crc32 } from "@workspace/raster-image/png-chunks"
import { zlibSync } from "fflate"

const PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
const ascii = new TextEncoder()

function chunk(type: string, data: Uint8Array) {
  const bytes = new Uint8Array(data.length + 12)
  const view = new DataView(bytes.buffer)
  view.setUint32(0, data.length)
  bytes.set(ascii.encode(type), 4)
  bytes.set(data, 8)
  view.setUint32(bytes.length - 4, crc32(bytes.subarray(4, bytes.length - 4)))
  return bytes
}

function compressFrame(rgba: Uint8ClampedArray, width: number, height: number) {
  const stride = width * 4
  const filtered = new Uint8Array((stride + 1) * height)
  for (let row = 0; row < height; row++) {
    const source = row * stride
    const target = row * (stride + 1)
    // PNG Sub filter stores each byte relative to the previous pixel's byte.
    filtered[target] = 1
    filtered.set(rgba.subarray(source, source + 4), target + 1)
    for (let byte = 4; byte < stride; byte++) {
      filtered[target + byte + 1] =
        rgba[source + byte]! - rgba[source + byte - 4]!
    }
  }
  return zlibSync(filtered)
}

export function createApngEncoder(
  width: number,
  height: number,
  frameCount: number,
  plays: number
) {
  const header = new Uint8Array(13)
  const headerView = new DataView(header.buffer)
  headerView.setUint32(0, width)
  headerView.setUint32(4, height)
  header[8] = 8
  header[9] = 6 // RGBA

  const animation = new Uint8Array(8)
  const animationView = new DataView(animation.buffer)
  animationView.setUint32(0, frameCount)
  animationView.setUint32(4, plays)

  const parts: BlobPart[] = [
    PNG_SIGNATURE,
    chunk("IHDR", header),
    chunk("acTL", animation),
  ]
  let sequence = 0

  return {
    addFrame(rgba: Uint8ClampedArray, duration: number) {
      const control = new Uint8Array(26)
      const view = new DataView(control.buffer)
      view.setUint32(0, sequence++)
      view.setUint32(4, width)
      view.setUint32(8, height)
      // The editor accepts 10 ms increments, giving up to 655.35 s per frame.
      view.setUint16(20, duration / 10)
      view.setUint16(22, 100)
      // Offset, disposal, and blend are zero: replace the full canvas.
      parts.push(chunk("fcTL", control))

      const compressed = compressFrame(rgba, width, height)
      if (sequence === 1) {
        parts.push(chunk("IDAT", compressed))
      } else {
        const frame = new Uint8Array(compressed.length + 4)
        new DataView(frame.buffer).setUint32(0, sequence++)
        frame.set(compressed, 4)
        parts.push(chunk("fdAT", frame))
      }
    },
    finish() {
      parts.push(chunk("IEND", new Uint8Array()))
      return new Blob(parts, { type: "image/png" })
    },
  }
}
