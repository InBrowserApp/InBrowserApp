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

  it('removes JPEG comment segments', () => {
    const jpeg = Uint8Array.from([0xff, 0xd8, 0xff, 0xfe, 0x00, 0x04, 0xde, 0xad, 0xff, 0xd9])

    const result = stripImageMetadata(jpeg)

    expect(result.format).toBe('jpeg')
    expect(result.removedBytes).toBe(6)
    expect(Array.from(result.cleaned)).toEqual([0xff, 0xd8, 0xff, 0xd9])
  })

  it('keeps malformed JPEG payloads without throwing', () => {
    const malformed = [
      Uint8Array.from([0xff, 0xd8, 0x00, 0x11]),
      Uint8Array.from([0xff, 0xd8, 0xff]),
      Uint8Array.from([0xff, 0xd8, 0xff, 0xd9]),
      Uint8Array.from([0xff, 0xd8, 0xff, 0xe2, 0x00]),
      Uint8Array.from([0xff, 0xd8, 0xff, 0xe2, 0x00, 0x01, 0x99]),
      Uint8Array.from([0xff, 0xd8, 0xff, 0xe2, 0x00, 0x10, 0x99]),
    ]

    for (const jpeg of malformed) {
      const result = stripImageMetadata(jpeg)
      expect(result.format).toBe('jpeg')
      expect(result.cleaned).toEqual(jpeg)
    }
  })

  it('keeps trailing JPEG marker bytes after valid segments', () => {
    const jpeg = Uint8Array.from([0xff, 0xd8, 0xff, 0xe1, 0x00, 0x02, 0xff])

    const result = stripImageMetadata(jpeg)

    expect(result.format).toBe('jpeg')
    expect(Array.from(result.cleaned)).toEqual([0xff, 0xd8, 0xff])
    expect(result.removedBytes).toBe(4)
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

  it('keeps truncated PNG chunks after the signature', () => {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
    const truncatedChunk = [0x00, 0x00, 0x00, 0x20, 0x49, 0x48, 0x44, 0x52, 0xff]
    const png = Uint8Array.from([...signature, ...truncatedChunk])

    const result = stripImageMetadata(png)

    expect(result.format).toBe('png')
    expect(result.cleaned).toEqual(png)
    expect(result.removedBytes).toBe(0)
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
      (result.cleaned[4] ?? 0) |
      ((result.cleaned[5] ?? 0) << 8) |
      ((result.cleaned[6] ?? 0) << 16) |
      ((result.cleaned[7] ?? 0) << 24)
    expect(riffSize).toBe(result.cleaned.length - 8)
  })

  it('keeps truncated WebP chunks after the header', () => {
    const truncatedVp8 = [0x56, 0x50, 0x38, 0x20, 0x10, 0x00, 0x00, 0x00, 0xaa]
    const totalSize = 12 + truncatedVp8.length
    const webp = Uint8Array.from([...makeWebpHeader(totalSize), ...truncatedVp8])

    const result = stripImageMetadata(webp)

    expect(result.format).toBe('webp')
    expect(result.cleaned).toEqual(webp)
    expect(result.removedBytes).toBe(0)
  })

  it('throws on unsupported formats', () => {
    const data = Uint8Array.from([0x00, 0x01, 0x02])
    expect(() => stripImageMetadata(data)).toThrow('Unsupported image format')
  })
})
