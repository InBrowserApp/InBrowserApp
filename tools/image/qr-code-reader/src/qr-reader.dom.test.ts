import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import jsQR from 'jsqr'
import type { QRCode } from 'jsqr'
import { readQRFromFile, readQRFromVideo } from './qr-reader'

vi.mock('jsqr', () => ({
  default: vi.fn(),
}))

const jsQRMock = vi.mocked(jsQR)

describe('qr-reader', () => {
  const originalImage = globalThis.Image
  const originalCreateObjectURL = globalThis.URL.createObjectURL
  const originalRevokeObjectURL = globalThis.URL.revokeObjectURL
  let getContextSpy: ReturnType<typeof vi.spyOn> | null = null
  const mockPoint = { x: 0, y: 0 }
  const mockQRCode: QRCode = {
    data: 'decoded',
    binaryData: [],
    chunks: [] as unknown as QRCode['chunks'],
    version: 1,
    location: {
      topRightCorner: mockPoint,
      topLeftCorner: mockPoint,
      bottomRightCorner: mockPoint,
      bottomLeftCorner: mockPoint,
      topRightFinderPattern: mockPoint,
      topLeftFinderPattern: mockPoint,
      bottomLeftFinderPattern: mockPoint,
    },
  }

  beforeEach(() => {
    jsQRMock.mockReset()
  })

  afterEach(() => {
    globalThis.Image = originalImage
    if (originalCreateObjectURL) {
      globalThis.URL.createObjectURL = originalCreateObjectURL
    }
    if (originalRevokeObjectURL) {
      globalThis.URL.revokeObjectURL = originalRevokeObjectURL
    }
    getContextSpy?.mockRestore()
    getContextSpy = null
  })

  it('returns null when video has no dimensions', () => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')

    expect(readQRFromVideo(video, canvas)).toBe(null)
  })

  it('reads QR data from a video frame', () => {
    const video = document.createElement('video')
    Object.defineProperty(video, 'videoWidth', { value: 120 })
    Object.defineProperty(video, 'videoHeight', { value: 80 })

    const canvas = document.createElement('canvas')
    getContextSpy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
      getImageData: () => ({
        data: new Uint8ClampedArray([1, 2, 3, 4]),
        width: 1,
        height: 1,
      }),
    } as unknown as CanvasRenderingContext2D)

    jsQRMock.mockReturnValue(mockQRCode)

    expect(readQRFromVideo(video, canvas)).toBe('decoded')
  })

  it('reads QR data from an image file', async () => {
    class ImmediateImage {
      onload: null | (() => void) = null
      onerror: null | (() => void) = null
      width = 100
      height = 80

      set src(_value: string) {
        this.onload?.()
      }
    }

    globalThis.Image = ImmediateImage as typeof Image

    const createObjectURL = vi.fn(() => 'blob:mock')
    const revokeObjectURL = vi.fn()
    Object.defineProperty(globalThis.URL, 'createObjectURL', {
      value: createObjectURL,
      writable: true,
    })
    Object.defineProperty(globalThis.URL, 'revokeObjectURL', {
      value: revokeObjectURL,
      writable: true,
    })

    getContextSpy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
      getImageData: () => ({
        data: new Uint8ClampedArray([1, 2, 3, 4]),
        width: 1,
        height: 1,
      }),
    } as unknown as CanvasRenderingContext2D)

    jsQRMock.mockReturnValue(mockQRCode)

    const file = new File(['data'], 'qr.png', { type: 'image/png' })
    await expect(readQRFromFile(file)).resolves.toBe('decoded')

    expect(createObjectURL).toHaveBeenCalledWith(file)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })
})
