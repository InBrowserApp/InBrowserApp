import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getFileExtension, loadImageElement, loadImageSource } from './load-image'

const imageState = {
  naturalWidth: 640,
  naturalHeight: 480,
  width: 640,
  height: 480,
}

const originalCreateObjectURL = URL.createObjectURL
const originalRevokeObjectURL = URL.revokeObjectURL
const createObjectURLMock = vi.fn<(file: File) => string>()
const revokeObjectURLMock = vi.fn<(value: string) => void>()

class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  naturalWidth = imageState.naturalWidth
  naturalHeight = imageState.naturalHeight
  width = imageState.width
  height = imageState.height

  set src(value: string) {
    queueMicrotask(() => {
      if (value.includes('invalid')) {
        this.onerror?.()
        return
      }

      this.naturalWidth = imageState.naturalWidth
      this.naturalHeight = imageState.naturalHeight
      this.width = imageState.width
      this.height = imageState.height
      this.onload?.()
    })
  }
}

beforeEach(() => {
  imageState.naturalWidth = 640
  imageState.naturalHeight = 480
  imageState.width = 640
  imageState.height = 480
  createObjectURLMock.mockReset()
  revokeObjectURLMock.mockReset()
  createObjectURLMock.mockImplementation((file) =>
    file.name.includes('invalid') ? 'blob:invalid-image' : `blob:${file.name}`,
  )

  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    writable: true,
    value: createObjectURLMock,
  })
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    writable: true,
    value: revokeObjectURLMock,
  })
  vi.stubGlobal('Image', MockImage)
})

afterEach(() => {
  vi.unstubAllGlobals()
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    writable: true,
    value: originalCreateObjectURL,
  })
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    writable: true,
    value: originalRevokeObjectURL,
  })
})

describe('load-image utilities', () => {
  it('loads image elements and revokes the temporary object url', async () => {
    const file = new File(['image'], 'photo.png', { type: 'image/png' })
    const image = await loadImageElement(file)

    expect(image.naturalWidth).toBe(640)
    expect(image.naturalHeight).toBe(480)
    expect(createObjectURLMock).toHaveBeenCalledWith(file)
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:photo.png')
  })

  it('rejects invalid image files and still revokes the object url', async () => {
    const file = new File(['bad'], 'invalid.png', { type: 'image/png' })

    await expect(loadImageElement(file)).rejects.toThrow('INVALID_IMAGE')
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:invalid-image')
  })

  it('loads image source metadata and detects alpha support', async () => {
    imageState.naturalWidth = 1200
    imageState.naturalHeight = 900
    imageState.width = 1200
    imageState.height = 900

    const pngFile = new File(['image'], 'poster.PNG', { type: 'image/png' })
    const pngSource = await loadImageSource(pngFile)
    expect(pngSource).toEqual({
      file: pngFile,
      width: 1200,
      height: 900,
      mimeType: 'image/png',
      extension: 'png',
      hasAlpha: true,
    })

    const jpegFile = new File(['image'], 'cover.jpeg', { type: 'image/jpeg' })
    const jpegSource = await loadImageSource(jpegFile)
    expect(jpegSource.hasAlpha).toBe(false)
    expect(jpegSource.extension).toBe('jpeg')
  })

  it('falls back to element dimensions and a default mime type when metadata is missing', async () => {
    imageState.naturalWidth = 0
    imageState.naturalHeight = 0
    imageState.width = 320
    imageState.height = 240

    const file = new File(['image'], 'untitled', { type: '' })
    const source = await loadImageSource(file)

    expect(source).toEqual({
      file,
      width: 320,
      height: 240,
      mimeType: 'image/png',
      extension: 'png',
      hasAlpha: false,
    })
  })

  it('falls back to 1x1 when both natural and rendered dimensions are unavailable', async () => {
    imageState.naturalWidth = 0
    imageState.naturalHeight = 0
    imageState.width = 0
    imageState.height = 0

    const file = new File(['image'], 'empty.png', { type: 'image/png' })
    const source = await loadImageSource(file)

    expect(source.width).toBe(1)
    expect(source.height).toBe(1)
  })

  it('extracts file extensions and falls back to png when missing', () => {
    expect(getFileExtension('avatar.WebP')).toBe('webp')
    expect(getFileExtension('no-extension')).toBe('png')
  })
})
