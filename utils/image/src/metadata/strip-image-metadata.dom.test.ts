import { describe, it, expect } from 'vitest'
import { stripImageMetadata } from './strip-image-metadata'

function makePngChunk(type: string, data: number[]): number[] {
  const length = data.length
  const lengthBytes = [
    (length >>> 24) & 0xff,
    (length >>> 16) & 0xff,
    (length >>> 8) & 0xff,
    length & 0xff,
  ]
  const typeBytes = Array.from(type).map((char) => char.charCodeAt(0))
  const crc = [0x00, 0x00, 0x00, 0x00]
  return [...lengthBytes, ...typeBytes, ...data, ...crc]
}

function makeWebpHeader(totalSize: number): number[] {
  const size = totalSize - 8
  return [
    0x52,
    0x49,
    0x46,
    0x46,
    size & 0xff,
    (size >> 8) & 0xff,
    (size >> 16) & 0xff,
    (size >> 24) & 0xff,
    0x57,
    0x45,
    0x42,
    0x50,
  ]
}

function makeWebpChunk(type: string, data: number[]): number[] {
  const size = data.length
  const sizeBytes = [size & 0xff, (size >> 8) & 0xff, (size >> 16) & 0xff, (size >> 24) & 0xff]
  const typeBytes = Array.from(type).map((char) => char.charCodeAt(0))
  const padded = size % 2 === 0 ? [] : [0x00]
  return [...typeBytes, ...sizeBytes, ...data, ...padded]
}

describe('stripImageMetadata', () => {
  it('removes JPEG metadata segments', () => {
    const jpeg = Uint8Array.from([
      0xff, 0xd8, 0xff, 0xe1, 0x00, 0x06, 0xde, 0xad, 0xbe, 0xef, 0xff, 0xe0, 0x00, 0x04, 0x00,
      0x00, 0xff, 0xda, 0x00, 0x04, 0x00, 0x00, 0x11, 0x22, 0x33, 0xff, 0xd9,
    ])

    const result = stripImageMetadata(jpeg)

    expect(result.format).toBe('jpeg')
    expect(result.removedBytes).toBe(8)
    expect(result.cleaned.length).toBe(jpeg.length - 8)
    expect(Array.from(result.cleaned.slice(0, 2))).toEqual([0xff, 0xd8])
  })

  it('removes PNG text chunks', () => {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
    const ihdr = makePngChunk(
      'IHDR',
      Array.from({ length: 13 }, () => 0x00),
    )
    const text = makePngChunk('tEXt', [0x01, 0x02, 0x03, 0x04])
    const iend = makePngChunk('IEND', [])
    const png = Uint8Array.from([...signature, ...ihdr, ...text, ...iend])

    const result = stripImageMetadata(png)

    expect(result.format).toBe('png')
    expect(result.removedBytes).toBe(text.length)
    expect(result.cleaned.length).toBe(png.length - text.length)
  })

  it('removes WebP metadata chunks and updates header size', () => {
    const exif = makeWebpChunk('EXIF', [0x01, 0x02, 0x03, 0x04])
    const vp8 = makeWebpChunk('VP8 ', [0x00, 0x00, 0x00, 0x00])
    const totalSize = 12 + exif.length + vp8.length
    const header = makeWebpHeader(totalSize)
    const webp = Uint8Array.from([...header, ...exif, ...vp8])

    const result = stripImageMetadata(webp)

    expect(result.format).toBe('webp')
    expect(result.removedBytes).toBe(exif.length)
    expect(result.cleaned.length).toBe(webp.length - exif.length)

    const riffSize =
      result.cleaned[4] |
      (result.cleaned[5] << 8) |
      (result.cleaned[6] << 16) |
      (result.cleaned[7] << 24)
    expect(riffSize).toBe(result.cleaned.length - 8)
  })

  it('throws on unsupported formats', () => {
    const data = Uint8Array.from([0x00, 0x01, 0x02])
    expect(() => stripImageMetadata(data)).toThrow('Unsupported image format')
  })
})
