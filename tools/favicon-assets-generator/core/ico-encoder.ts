const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] as const
const FILE_HEADER_SIZE = 6
const IMAGE_HEADER_SIZE = 16
const MAX_DIMENSION_BYTE = 256

type IcoImageInput = Readonly<{
  pngBytes: Uint8Array
}>

function assertPngSignature(pngBytes: Uint8Array): void {
  if (pngBytes.byteLength < 24) {
    throw new Error("ICO_PNG_TOO_SMALL")
  }

  for (let index = 0; index < PNG_SIGNATURE.length; index += 1) {
    if (pngBytes[index] !== PNG_SIGNATURE[index]) {
      throw new Error("ICO_PNG_INVALID_SIGNATURE")
    }
  }
}

function readPngDimensions(pngBytes: Uint8Array): {
  width: number
  height: number
} {
  assertPngSignature(pngBytes)

  const view = new DataView(
    pngBytes.buffer,
    pngBytes.byteOffset,
    pngBytes.byteLength
  )
  const width = view.getUint32(16, false)
  const height = view.getUint32(20, false)

  if (width === 0 || height === 0) {
    throw new Error("ICO_PNG_ZERO_DIMENSION")
  }

  return { width, height }
}

function writeUint16LE(target: Uint8Array, offset: number, value: number) {
  target[offset] = value & 0xff
  target[offset + 1] = (value >>> 8) & 0xff
}

function writeUint32LE(target: Uint8Array, offset: number, value: number) {
  target[offset] = value & 0xff
  target[offset + 1] = (value >>> 8) & 0xff
  target[offset + 2] = (value >>> 16) & 0xff
  target[offset + 3] = (value >>> 24) & 0xff
}

function encodeIco(images: readonly IcoImageInput[]): Uint8Array {
  if (images.length === 0) {
    throw new Error("ICO_NO_IMAGES")
  }

  const headerSize = FILE_HEADER_SIZE + IMAGE_HEADER_SIZE * images.length
  const totalPngBytes = images.reduce(
    (sum, image) => sum + image.pngBytes.byteLength,
    0
  )
  const totalSize = headerSize + totalPngBytes
  const output = new Uint8Array(totalSize)

  output[0] = 0
  output[1] = 0
  output[2] = 1
  output[3] = 0
  writeUint16LE(output, 4, images.length)

  let imageOffset = headerSize

  for (let index = 0; index < images.length; index += 1) {
    const image = images[index]!
    const dimensions = readPngDimensions(image.pngBytes)
    const entryOffset = FILE_HEADER_SIZE + IMAGE_HEADER_SIZE * index

    output[entryOffset] =
      dimensions.width >= MAX_DIMENSION_BYTE ? 0 : dimensions.width
    output[entryOffset + 1] =
      dimensions.height >= MAX_DIMENSION_BYTE ? 0 : dimensions.height
    output[entryOffset + 2] = 0
    output[entryOffset + 3] = 0
    writeUint16LE(output, entryOffset + 4, 1)
    writeUint16LE(output, entryOffset + 6, 32)
    writeUint32LE(output, entryOffset + 8, image.pngBytes.byteLength)
    writeUint32LE(output, entryOffset + 12, imageOffset)

    output.set(image.pngBytes, imageOffset)
    imageOffset += image.pngBytes.byteLength
  }

  return output
}

export type { IcoImageInput }
export { encodeIco, readPngDimensions }
