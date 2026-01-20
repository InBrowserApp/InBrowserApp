import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { BarcodeFormat, BrowserMultiFormatReader } from '@zxing/browser'
import { ChecksumException, FormatException, NotFoundException } from '@zxing/library'
import {
  createBarcodeReader,
  isIgnorableDecodeError,
  readBarcodeFromFile,
  toBarcodeResult,
} from './barcode-reader'

const originalCreateObjectURL = (URL as { createObjectURL?: typeof URL.createObjectURL })
  .createObjectURL
const originalRevokeObjectURL = (URL as { revokeObjectURL?: typeof URL.revokeObjectURL })
  .revokeObjectURL

const setupObjectUrlMocks = () => {
  if (originalCreateObjectURL) {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:barcode-reader')
  } else {
    Object.defineProperty(URL, 'createObjectURL', {
      value: vi.fn(() => 'blob:barcode-reader'),
      writable: true,
    })
  }

  if (originalRevokeObjectURL) {
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
  } else {
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: vi.fn(() => undefined),
      writable: true,
    })
  }
}

const teardownObjectUrlMocks = () => {
  vi.restoreAllMocks()

  if (!originalCreateObjectURL) {
    delete (URL as { createObjectURL?: unknown }).createObjectURL
  }

  if (!originalRevokeObjectURL) {
    delete (URL as { revokeObjectURL?: unknown }).revokeObjectURL
  }
}

beforeEach(setupObjectUrlMocks)
afterEach(teardownObjectUrlMocks)

describe('barcode reader helpers', () => {
  it('creates a barcode reader instance', () => {
    const reader = createBarcodeReader()
    expect(reader).toBeInstanceOf(BrowserMultiFormatReader)
  })

  it('formats a decoding result', () => {
    const result = toBarcodeResult({
      getText: () => 'Hello',
      getBarcodeFormat: () => BarcodeFormat.QR_CODE,
    })

    expect(result).toEqual({ text: 'Hello', format: 'QR_CODE' })
  })

  it('falls back to numeric format labels when unknown', () => {
    const result = toBarcodeResult({
      getText: () => 'Hello',
      getBarcodeFormat: () => 999 as BarcodeFormat,
    })

    expect(result).toEqual({ text: 'Hello', format: '999' })
  })

  it('detects ignorable decode errors', () => {
    expect(isIgnorableDecodeError(new NotFoundException())).toBe(true)
    expect(isIgnorableDecodeError(new ChecksumException())).toBe(true)
    expect(isIgnorableDecodeError(new FormatException())).toBe(true)
    expect(isIgnorableDecodeError({ name: 'NotFoundException' })).toBe(true)
    expect(isIgnorableDecodeError(new Error('boom'))).toBe(false)
    expect(isIgnorableDecodeError('nope')).toBe(false)
    expect(isIgnorableDecodeError(null)).toBe(false)
  })

  it('reads a barcode from a file', async () => {
    const decodeSpy = vi
      .spyOn(BrowserMultiFormatReader.prototype, 'decodeFromImageUrl')
      .mockResolvedValue({
        getText: () => 'file-result',
        getBarcodeFormat: () => BarcodeFormat.CODE_128,
      } as unknown as Awaited<ReturnType<BrowserMultiFormatReader['decodeFromImageUrl']>>)

    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    const result = await readBarcodeFromFile(file)

    expect(decodeSpy).toHaveBeenCalledWith('blob:barcode-reader')
    expect(result).toEqual({ text: 'file-result', format: 'CODE_128' })
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:barcode-reader')
  })

  it('returns null for ignorable decode failures', async () => {
    vi.spyOn(BrowserMultiFormatReader.prototype, 'decodeFromImageUrl').mockRejectedValue(
      new NotFoundException(),
    )

    const file = new File(['data'], 'missing.png', { type: 'image/png' })
    const result = await readBarcodeFromFile(file)

    expect(result).toBeNull()
  })

  it('throws for non-ignorable decode failures', async () => {
    vi.spyOn(BrowserMultiFormatReader.prototype, 'decodeFromImageUrl').mockRejectedValue(
      new Error('decode-failed'),
    )

    const file = new File(['data'], 'broken.png', { type: 'image/png' })
    await expect(readBarcodeFromFile(file)).rejects.toThrow('decode-failed')
  })
})
