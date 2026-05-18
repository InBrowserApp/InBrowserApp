type RgbaColor = Readonly<{
  a: number
  b: number
  g: number
  r: number
}>

type GifFrameDimensions = Readonly<{
  height: number
  left: number
  top: number
  width: number
}>

type GifFrame = Readonly<{
  delay: number
  dims: GifFrameDimensions
  disposalType?: number
  patch: Uint8ClampedArray
}>

type ComposedGifFrames = Readonly<{
  delays: number[]
  frameData: Uint8ClampedArray[]
}>

const GIF_HEADER_BYTES = new Uint8Array([0x47, 0x49, 0x46])
const DEFAULT_FRAME_DELAY = 100
const MIN_FRAME_DELAY = 10

function isGifBytes(bytes: Uint8Array) {
  return (
    bytes.length >= GIF_HEADER_BYTES.length &&
    bytes[0] === GIF_HEADER_BYTES[0] &&
    bytes[1] === GIF_HEADER_BYTES[1] &&
    bytes[2] === GIF_HEADER_BYTES[2]
  )
}

function readGifBackgroundColor(bytes: Uint8Array): RgbaColor | null {
  if (bytes.length < 13) {
    return null
  }

  const packed = bytes[10]!
  const hasGlobalColorTable = (packed & 0x80) !== 0

  if (!hasGlobalColorTable) {
    return null
  }

  const globalColorTableSize = 1 << ((packed & 0x07) + 1)
  const backgroundIndex = bytes[11]!

  if (backgroundIndex >= globalColorTableSize) {
    return null
  }

  const tableStart = 13
  const tableSize = globalColorTableSize * 3

  if (tableStart + tableSize > bytes.length) {
    return null
  }

  const colorOffset = tableStart + backgroundIndex * 3

  return {
    a: 255,
    b: bytes[colorOffset + 2]!,
    g: bytes[colorOffset + 1]!,
    r: bytes[colorOffset]!,
  }
}

function resolveGifBackgroundColor(bytes: Uint8Array): RgbaColor {
  return readGifBackgroundColor(bytes) ?? { a: 0, b: 0, g: 0, r: 0 }
}

function readGifLoopCount(bytes: Uint8Array): number | null {
  const readByte = (index: number) => bytes[index]!

  for (let index = 0; index + 19 <= bytes.length; index += 1) {
    if (
      readByte(index) !== 0x21 ||
      readByte(index + 1) !== 0xff ||
      readByte(index + 2) !== 0x0b
    ) {
      continue
    }

    const identifier = String.fromCharCode(
      readByte(index + 3),
      readByte(index + 4),
      readByte(index + 5),
      readByte(index + 6),
      readByte(index + 7),
      readByte(index + 8),
      readByte(index + 9),
      readByte(index + 10),
      readByte(index + 11),
      readByte(index + 12),
      readByte(index + 13)
    )

    if (identifier !== "NETSCAPE2.0" && identifier !== "ANIMEXTS1.0") {
      continue
    }

    if (readByte(index + 14) < 3 || readByte(index + 15) !== 0x01) {
      continue
    }

    return readByte(index + 16) | (readByte(index + 17) << 8)
  }

  return null
}

function normalizeDelay(delay: number, speed: number) {
  const baseDelay =
    Number.isFinite(delay) && delay > 0 ? delay : DEFAULT_FRAME_DELAY
  const adjustedDelay = baseDelay / speed

  return Math.max(MIN_FRAME_DELAY, Math.round(adjustedDelay))
}

function fillCanvas(canvas: Uint8ClampedArray, color: RgbaColor) {
  if (color.a === 0 && color.r === 0 && color.g === 0 && color.b === 0) {
    return
  }

  for (let index = 0; index < canvas.length; index += 4) {
    canvas[index] = color.r
    canvas[index + 1] = color.g
    canvas[index + 2] = color.b
    canvas[index + 3] = color.a
  }
}

function clearRect(
  canvas: Uint8ClampedArray,
  canvasWidth: number,
  dims: GifFrameDimensions,
  color: RgbaColor
) {
  for (let y = 0; y < dims.height; y += 1) {
    for (let x = 0; x < dims.width; x += 1) {
      const canvasX = x + dims.left
      const canvasY = y + dims.top

      if (canvasX < 0 || canvasY < 0 || canvasX >= canvasWidth) {
        continue
      }

      const index = (canvasY * canvasWidth + canvasX) * 4

      if (index < 0 || index + 3 >= canvas.length) {
        continue
      }

      canvas[index] = color.r
      canvas[index + 1] = color.g
      canvas[index + 2] = color.b
      canvas[index + 3] = color.a
    }
  }
}

function drawPatch(
  canvas: Uint8ClampedArray,
  canvasWidth: number,
  patch: Uint8ClampedArray,
  dims: GifFrameDimensions
) {
  if (patch.length < dims.width * dims.height * 4) {
    throw new Error("INVALID_FRAME")
  }

  for (let y = 0; y < dims.height; y += 1) {
    for (let x = 0; x < dims.width; x += 1) {
      const patchIndex = (y * dims.width + x) * 4
      const alpha = patch[patchIndex + 3]!

      if (alpha === 0) {
        continue
      }

      const canvasX = x + dims.left
      const canvasY = y + dims.top

      if (canvasX < 0 || canvasY < 0 || canvasX >= canvasWidth) {
        continue
      }

      const canvasIndex = (canvasY * canvasWidth + canvasX) * 4

      if (canvasIndex < 0 || canvasIndex + 3 >= canvas.length) {
        continue
      }

      canvas[canvasIndex] = patch[patchIndex]!
      canvas[canvasIndex + 1] = patch[patchIndex + 1]!
      canvas[canvasIndex + 2] = patch[patchIndex + 2]!
      canvas[canvasIndex + 3] = alpha
    }
  }
}

function composeGifFrames(
  frames: readonly GifFrame[],
  width: number,
  height: number,
  speed: number,
  backgroundColor: RgbaColor
): ComposedGifFrames {
  const canvas = new Uint8ClampedArray(width * height * 4)
  const frameData: Uint8ClampedArray[] = []
  const delays: number[] = []

  fillCanvas(canvas, backgroundColor)

  let previousDisposal = 0
  let previousDims: GifFrameDimensions | null = null
  let previousRestore: Uint8ClampedArray | null = null

  for (const frame of frames) {
    if (!frame.patch || !frame.dims) {
      throw new Error("INVALID_FRAME")
    }

    if (previousDisposal === 2 && previousDims) {
      clearRect(canvas, width, previousDims, backgroundColor)
    } else if (previousDisposal === 3 && previousRestore) {
      canvas.set(previousRestore)
    }

    const disposal =
      typeof frame.disposalType === "number" ? frame.disposalType : 0
    const restoreSnapshot = disposal === 3 ? canvas.slice() : null

    drawPatch(canvas, width, frame.patch, frame.dims)
    frameData.push(canvas.slice())
    delays.push(normalizeDelay(frame.delay, speed))

    previousDisposal = disposal
    previousDims = frame.dims
    previousRestore = restoreSnapshot
  }

  return { delays, frameData }
}

export {
  composeGifFrames,
  drawPatch,
  fillCanvas,
  isGifBytes,
  normalizeDelay,
  readGifBackgroundColor,
  readGifLoopCount,
  resolveGifBackgroundColor,
}
export type { GifFrame, RgbaColor }
