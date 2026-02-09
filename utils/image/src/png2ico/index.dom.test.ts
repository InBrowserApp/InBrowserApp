import { describe, expect, it, vi } from 'vitest'
import { type BinaryLike, type IConvertInputItem, PngIcoConverter } from './index'

class MockDimensionsConverter extends PngIcoConverter {
  naturalWidth = 16
  naturalHeight = 16

  override async loadImageAsync(_png: Blob) {
    return {
      naturalWidth: this.naturalWidth,
      naturalHeight: this.naturalHeight,
    } as HTMLImageElement
  }

  toBlobPublic(input: BinaryLike, type?: string) {
    return this.toBlob(input, type)
  }

  to2BytesPublic(n: number) {
    return this.to2Bytes(n)
  }

  to4BytesPublic(n: number) {
    return this.to4Bytes(n)
  }

  sumInputLenPublic(inputs: IConvertInputItem[]) {
    return this.sumInputLen(inputs)
  }
}

class LoadImageProbe extends PngIcoConverter {
  load(blob: Blob) {
    return this.loadImageAsync(blob)
  }
}

describe('PngIcoConverter', () => {
  it('converts array buffer and blob inputs into ICO bytes', async () => {
    const converter = new MockDimensionsConverter()
    converter.naturalWidth = 32
    converter.naturalHeight = 48

    const firstInput = Uint8Array.from([1, 2, 3]).buffer
    const secondInput = new Blob([Uint8Array.from([9, 8, 7, 6])], { type: 'image/png' })

    const bytes = await converter.convertAsync([{ png: firstInput, bpp: 32 }, { png: secondInput }])

    expect(Array.from(bytes.slice(0, 6))).toEqual([0, 0, 1, 0, 2, 0])

    const firstHeader = Array.from(bytes.slice(6, 22))
    expect(firstHeader.slice(0, 2)).toEqual([32, 48])
    expect(firstHeader.slice(6, 8)).toEqual([32, 0])
    expect(firstHeader.slice(8, 12)).toEqual([3, 0, 0, 0])
    expect(firstHeader.slice(12, 16)).toEqual([38, 0, 0, 0])

    const secondHeader = Array.from(bytes.slice(22, 38))
    expect(secondHeader.slice(8, 12)).toEqual([4, 0, 0, 0])
    expect(secondHeader.slice(12, 16)).toEqual([41, 0, 0, 0])

    expect(Array.from(bytes.slice(38, 41))).toEqual([1, 2, 3])
    expect(Array.from(bytes.slice(41, 45))).toEqual([9, 8, 7, 6])
  })

  it('throws when inputs exceed the ICO file limit', async () => {
    const converter = new PngIcoConverter()
    const largeInput = new Array(65537).fill({ png: new ArrayBuffer(0) } as IConvertInputItem)

    await expect(converter.convertAsync(largeInput)).rejects.toThrow('TOO_MANY_FILES')
  })

  it('rejects oversize images unless ignoreSize is set', async () => {
    const converter = new MockDimensionsConverter()
    const png = Uint8Array.from([0xaa, 0xbb]).buffer

    converter.naturalWidth = 300
    converter.naturalHeight = 32
    await expect(converter.convertAsync([{ png }])).rejects.toThrow('INVALID_SIZE')

    converter.naturalWidth = 300
    converter.naturalHeight = 400
    const withIgnoredSize = await converter.convertAsync([{ png, ignoreSize: 1 }])

    expect(withIgnoredSize[6]).toBe(0)
    expect(withIgnoredSize[7]).toBe(0)
  })

  it('creates blobs and helper bytes using protected utilities', async () => {
    const converter = new MockDimensionsConverter()

    const inputBlob = new Blob([Uint8Array.from([1, 2])], { type: 'image/png' })
    const sameBlob = converter.toBlobPublic(inputBlob)
    expect(sameBlob).toBe(inputBlob)

    const fromBuffer = converter.toBlobPublic(Uint8Array.from([3, 4]).buffer, 'application/custom')
    expect(fromBuffer.type).toBe('application/custom')

    expect(converter.to2BytesPublic(513)).toEqual([1, 2])
    expect(converter.to4BytesPublic(0x01020304)).toEqual([4, 3, 2, 1])

    const total = converter.sumInputLenPublic([
      { png: Uint8Array.from([1]).buffer },
      { png: new Blob([Uint8Array.from([2, 3, 4])]) },
    ])
    expect(total).toBe(4)

    const blob = await converter.convertToBlobAsync(
      [{ png: Uint8Array.from([5, 6]).buffer }],
      'image/ico',
    )
    expect(blob.type).toBe('image/ico')
    expect((await blob.arrayBuffer()).byteLength).toBeGreaterThan(0)
  })

  it('loads images and rejects invalid image data', async () => {
    const originalImage = globalThis.Image
    const originalCreateObjectURL = URL.createObjectURL
    const probe = new LoadImageProbe()

    try {
      const createObjectURL = vi.fn(() => 'blob:png')
      URL.createObjectURL = createObjectURL

      class SuccessImage {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        naturalWidth = 24
        naturalHeight = 24
        set src(_value: string) {
          this.onload?.()
        }
      }

      Object.defineProperty(globalThis, 'Image', {
        configurable: true,
        value: SuccessImage,
      })

      await expect(probe.load(new Blob([Uint8Array.from([1])]))).resolves.toMatchObject({
        naturalWidth: 24,
        naturalHeight: 24,
      })
      expect(createObjectURL).toHaveBeenCalled()

      class ErrorImage {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        set src(_value: string) {
          this.onerror?.()
        }
      }

      Object.defineProperty(globalThis, 'Image', {
        configurable: true,
        value: ErrorImage,
      })

      await expect(probe.load(new Blob([Uint8Array.from([1])]))).rejects.toBe('INVALID_IMAGE')
    } finally {
      Object.defineProperty(globalThis, 'Image', {
        configurable: true,
        value: originalImage,
      })
      URL.createObjectURL = originalCreateObjectURL
    }
  })
})
