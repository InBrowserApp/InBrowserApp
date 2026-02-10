import { afterEach, describe, expect, it, vi } from 'vitest'
import { getImageSize } from './index'

const originalImage = globalThis.Image
const originalCreateObjectURL = URL.createObjectURL
const originalRevokeObjectURL = URL.revokeObjectURL

afterEach(() => {
  Object.defineProperty(globalThis, 'Image', {
    configurable: true,
    value: originalImage,
  })
  URL.createObjectURL = originalCreateObjectURL
  URL.revokeObjectURL = originalRevokeObjectURL
})

describe('getImageSize', () => {
  it('resolves with image dimensions and revokes object URL', async () => {
    const createObjectURL = vi.fn(() => 'blob:image-size')
    const revokeObjectURL = vi.fn()
    const instances: { remove: ReturnType<typeof vi.fn> }[] = []

    class SuccessImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      width = 640
      height = 360
      private objectUrl = ''
      remove = vi.fn()

      constructor() {
        instances.push(this)
      }

      get src() {
        return this.objectUrl
      }

      set src(value: string) {
        this.objectUrl = value
        this.onload?.()
      }
    }

    URL.createObjectURL = createObjectURL
    URL.revokeObjectURL = revokeObjectURL
    Object.defineProperty(globalThis, 'Image', {
      configurable: true,
      value: SuccessImage,
    })

    const blob = new Blob([Uint8Array.from([1, 2, 3])], { type: 'image/png' })
    const result = await getImageSize(blob)

    expect(result).toEqual({ width: 640, height: 360 })
    expect(createObjectURL).toHaveBeenCalledWith(blob)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:image-size')
    expect(instances[0]?.remove).toHaveBeenCalled()
  })

  it('rejects when image loading fails', async () => {
    class FailingImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null

      set src(_value: string) {
        this.onerror?.()
      }

      remove() {
        return undefined
      }
    }

    URL.createObjectURL = vi.fn(() => 'blob:broken-image')
    URL.revokeObjectURL = vi.fn()
    Object.defineProperty(globalThis, 'Image', {
      configurable: true,
      value: FailingImage,
    })

    await expect(getImageSize(new Blob(['bad']))).rejects.toThrow('Failed to load image')
  })
})
