const ascii = new TextEncoder()

function chunkHeader(type: string, size: number) {
  const header = new Uint8Array(8)
  header.set(ascii.encode(type))
  new DataView(header.buffer).setUint32(4, size, true)
  return header
}

function setUint24(bytes: Uint8Array, offset: number, value: number) {
  bytes[offset] = value & 0xff
  bytes[offset + 1] = (value >>> 8) & 0xff
  bytes[offset + 2] = (value >>> 16) & 0xff
}

export function webpAnimationBlob(
  bytes: Uint8Array<ArrayBuffer>,
  width: number,
  height: number,
  durations: readonly number[],
  plays: number
) {
  // libwebp emits a still VP8L image when every rendered frame is identical.
  // Wrap it in an animation so the requested loop count and timing survive.
  if (String.fromCharCode(...bytes.subarray(12, 16)) !== "VP8L") {
    return new Blob([bytes], { type: "image/webp" })
  }

  const image = bytes.subarray(12) // VP8L chunk, including its padding.
  const canvas = new Uint8Array(10)
  canvas[0] = 0x02 | ((bytes[24]! & 0x10) === 0 ? 0 : 0x10)
  setUint24(canvas, 4, width - 1)
  setUint24(canvas, 7, height - 1)

  const loop = new Uint8Array(6)
  new DataView(loop.buffer).setUint16(4, plays, true)
  const frameSize = 16 + image.length
  const riffSize = 4 + 18 + 14 + durations.length * (8 + frameSize)
  const parts: BlobPart[] = [
    chunkHeader("RIFF", riffSize),
    ascii.encode("WEBP"),
    chunkHeader("VP8X", canvas.length),
    canvas,
    chunkHeader("ANIM", loop.length),
    loop,
  ]

  for (const duration of durations) {
    const frame = new Uint8Array(16)
    setUint24(frame, 6, width - 1)
    setUint24(frame, 9, height - 1)
    setUint24(frame, 12, duration)
    frame[15] = 0x02 // Replace the underlying frame without blending.
    parts.push(chunkHeader("ANMF", frameSize), frame, image)
  }

  return new Blob(parts, { type: "image/webp" })
}
